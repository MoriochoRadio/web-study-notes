#!/usr/bin/env python3
"""정적 학습 노트의 로컬 링크·자원 누락을 검사한다.

사용법:
    python3 scripts/check_internal_links.py
    python3 scripts/check_internal_links.py --root /경로/저장소
"""

from __future__ import annotations

import argparse
import json
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
    return parser.parse_args()


def html_files(root: Path) -> list[Path]:
    return [
        file for file in root.rglob("*.html")
        if file.is_file() and not any(part in SKIP_DIRECTORIES for part in file.parts)
    ]


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


def main() -> int:
    args = parse_arguments()
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
