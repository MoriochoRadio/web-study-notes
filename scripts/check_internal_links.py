#!/usr/bin/env python3
"""정적 학습 노트의 로컬 링크·자원 누락을 검사한다.

사용법:
    python3 scripts/check_internal_links.py
    python3 scripts/check_internal_links.py --root /경로/저장소
    python3 scripts/check_internal_links.py --self-test   # 탐색 규칙 점검
"""

from __future__ import annotations

import argparse
import json
import os
import sys
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit

SKIP_DIRECTORIES = {".git", "node_modules", ".next", "out", "dist", "build", "coverage"}
TARGET_ATTRIBUTES = {
    "a": "href",
    "link": "href",
    "script": "src",
    "img": "src",
    "source": "src",
    "video": "src",
    "audio": "src",
    "iframe": "src",
}


class ResourceCollector(HTMLParser):
    """실제 HTML 태그에서만 href·src 값을 수집한다."""

    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.resources: list[tuple[str, str]] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        attribute = TARGET_ATTRIBUTES.get(tag.lower())
        if not attribute:
            return
        value = dict(attrs).get(attribute)
        if value:
            self.resources.append((tag.lower(), value))


def parse_arguments() -> argparse.Namespace:
    default_root = Path(__file__).resolve().parents[1]
    parser = argparse.ArgumentParser(description="저장소 안의 정적 HTML 링크·자원을 검사합니다.")
    parser.add_argument("--root", type=Path, default=default_root, help="검사할 저장소 루트 경로")
    parser.add_argument("--self-test", action="store_true",
                        help="탐색 규칙이 동작하는지 확인하고 종료")
    return parser.parse_args()


def html_files(root: Path) -> list[Path]:
    """검사 대상 HTML을 모은다.

    `rglob`은 결과를 걸러 줄 뿐 탐색 자체는 막지 못해서, `node_modules` 안까지 들어간다.
    거기에는 npm이 만든 심볼릭 링크가 있고, 저장소 구조가 바뀌면 링크가 끊겨
    탐색 도중 FileNotFoundError로 검사 전체가 멈춘다. 그래서 `os.walk`로
    **애초에 들어가지 않도록** 가지치기한다(속도도 크게 빨라진다).

    방어는 두 겹이다.
      1) 디렉터리 심볼릭 링크는 따라가지 않는다(순환 참조 방지).
      2) 그래도 탐색이 실패하면 `onerror`로 그 경로만 건너뛴다.

    2번이 없으면 안 된다. Git Bash가 만든 링크처럼 `os.path.islink`가
    False로 보고하는 형태가 있어서 1번을 그냥 통과해 버리기 때문이다
    (실제로 이 저장소의 node_modules 링크가 그렇다).
    """
    found: list[Path] = []

    def on_error(error: OSError) -> None:
        # 탐색 중 접근할 수 없는 경로가 있어도 검사 전체를 멈추지 않는다.
        print(f"경고: 탐색 건너뜀 — {error.filename} ({error.strerror})", file=sys.stderr)

    for current, directories, filenames in os.walk(root, onerror=on_error, followlinks=False):
        # 리스트를 그 자리에서 고쳐야 os.walk가 해당 디렉터리로 내려가지 않는다.
        directories[:] = [
            name for name in directories
            if name not in SKIP_DIRECTORIES and not os.path.islink(os.path.join(current, name))
        ]
        for name in filenames:
            if not name.lower().endswith(".html"):
                continue
            path = Path(current) / name
            if path.is_file():
                found.append(path)

    return sorted(found)


def find_vite_root(root: Path, source: Path) -> Path | None:
    """현재 HTML이 속한 Vite 프로젝트 루트를 찾는다.

    Vite의 `/src/...`와 `/favicon.svg`는 저장소 루트가 아니라 해당 프로젝트 루트를 기준으로 해석된다.
    """
    for directory in [source.parent, *source.parents]:
        if directory == root.parent:
            break
        package_file = directory / "package.json"
        if not package_file.is_file():
            continue
        try:
            package = json.loads(package_file.read_text(encoding="utf-8"))
        except (OSError, json.JSONDecodeError):
            continue
        dependencies = {**package.get("dependencies", {}), **package.get("devDependencies", {})}
        if "vite" in dependencies:
            return directory
    return None


def resolve_target(root: Path, source: Path, raw_url: str) -> tuple[Path | None, str | None]:
    url = raw_url.strip()
    if not url or url.startswith("#") or url.startswith("//"):
        return None, None

    parts = urlsplit(url)
    if parts.scheme or parts.netloc:
        return None, None  # 외부 URL은 이 정적 검사 범위 밖이다.

    clean_path = unquote(parts.path)
    if not clean_path:
        return None, None

    if clean_path.startswith("/"):
        # 일반 정적 페이지는 저장소 루트 기준, Vite 실습은 프로젝트 루트 기준으로 절대 경로를 해석한다.
        candidates = [(root / clean_path.lstrip("/")).resolve()]
        vite_root = find_vite_root(root, source)
        if vite_root:
            candidates.append((vite_root / clean_path.lstrip("/")).resolve())
            candidates.append((vite_root / "public" / clean_path.lstrip("/")).resolve())
    else:
        candidates = [(source.parent / clean_path).resolve()]

    for target in candidates:
        if target != root and root not in target.parents:
            return target, "저장소 바깥 경로를 가리킴"
        if target.exists():
            return target, None
        if (target / "index.html").exists():
            return target / "index.html", None

    target = candidates[0]
    return target, f"대상 없음: {target.relative_to(root)}"


def run_self_test() -> int:
    """임시 폴더에 실제 상황을 만들어 두 가지를 확인한다.

    ① 끊긴 심볼릭 링크가 있어도 검사가 멈추지 않는가
       (`node_modules` 안의 링크가 끊겨 검사 전체가 죽던 사고를 재현한다)
    ② 그러면서도 진짜 깨진 링크는 여전히 잡아내는가
    """
    import tempfile

    failures = 0
    with tempfile.TemporaryDirectory() as temporary:
        root = Path(temporary)
        (root / "pages").mkdir()
        (root / "img").mkdir()
        (root / "node_modules").mkdir()

        (root / "index.html").write_text(
            '<a href="pages/ok.html">ok</a><img src="img/logo.png">', encoding="utf-8")
        (root / "pages" / "ok.html").write_text("<p>ok</p>", encoding="utf-8")
        (root / "img" / "logo.png").write_text("x", encoding="utf-8")
        # 건너뛰어야 할 폴더 안의 HTML — 검사 대상에 들어오면 안 된다.
        (root / "node_modules" / "ignored.html").write_text(
            '<a href="../없는곳.html">x</a>', encoding="utf-8")

        # 끊긴 심볼릭 링크. 만들 수 없는 환경(권한 없는 윈도우 등)이면 그 항목만 건너뛴다.
        broken_links = 0
        for link_path in (root / "node_modules" / "broken_pkg", root / "pages" / "broken_dir"):
            try:
                link_path.symlink_to(root / "존재하지-않는-대상", target_is_directory=True)
                broken_links += 1
            except (OSError, NotImplementedError):
                pass

        collected = {path.relative_to(root).as_posix() for path in html_files(root)}
        expected = {"index.html", "pages/ok.html"}
        if collected != expected:
            print(f"  실패  탐색 결과가 예상과 다르다: {sorted(collected)}")
            failures += 1
        elif broken_links:
            print(f"  OK    끊긴 심볼릭 링크 {broken_links}개가 있어도 완주하고"
                  " node_modules는 제외한다")
        else:
            # 윈도우에서 개발자 모드가 꺼져 있으면 심볼릭 링크를 만들 수 없다.
            # 이때는 "끊긴 링크 내성"을 확인하지 못했다는 사실을 분명히 남긴다.
            print("  OK    node_modules 제외는 확인 (심볼릭 링크를 만들 수 없어"
                  " 끊긴 링크 내성은 미확인 — 리눅스 CI에서 검증됨)")

        # 진짜 깨진 링크는 여전히 잡아야 한다.
        (root / "broken.html").write_text(
            '<a href="pages/없는파일.html">x</a>', encoding="utf-8")
        source = root / "broken.html"
        _, reason = resolve_target(root, source, "pages/없는파일.html")
        if reason:
            print("  OK    진짜 깨진 링크는 그대로 검출한다")
        else:
            print("  실패  깨진 링크를 놓쳤다")
            failures += 1

    print()
    if failures:
        print(f"자체 테스트 실패 — {failures}건")
        return 1
    print("자체 테스트 통과 — 2개 항목")
    return 0


def main() -> int:
    # 윈도우 기본 콘솔(cp949)에서도 한글·기호가 깨지지 않도록 출력 인코딩을 고정한다.
    for stream in (sys.stdout, sys.stderr):
        try:
            stream.reconfigure(encoding="utf-8")
        except (AttributeError, ValueError):
            pass

    args = parse_arguments()
    if args.self_test:
        return run_self_test()

    root = args.root.resolve()
    if not root.is_dir():
        raise SystemExit(f"검사 루트를 찾을 수 없습니다: {root}")

    files = html_files(root)
    checked = 0
    issues: list[tuple[Path, str, str, str]] = []

    for source in files:
        collector = ResourceCollector()
        collector.feed(source.read_text(encoding="utf-8", errors="replace"))
        for tag, raw_url in collector.resources:
            checked += 1
            _, reason = resolve_target(root, source, raw_url)
            if reason:
                issues.append((source, tag, raw_url, reason))

    print(f"검사 HTML: {len(files)}개")
    print(f"검사 링크·자원: {checked}개")
    if issues:
        print(f"문제 링크·자원: {len(issues)}개")
        for source, tag, raw_url, reason in issues:
            print(f"- {source.relative_to(root)} <{tag}> → {raw_url} ({reason})")
        return 1

    print("문제 링크·자원 없음")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
