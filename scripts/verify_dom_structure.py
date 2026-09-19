#!/usr/bin/env python3
"""학습 노트 HTML의 DOM 구조가 실제로 의도대로 만들어지는지 검사한다.

태그 개수만 세는 검사로는 잡히지 않는 종류의 사고를 잡는다. 실제로 겪은 두 건:

  1) <b>앞부분</code>  — <b>를 </code>로 닫아 <b>가 열린 채 남았다.
     텍스트만 보면 <b>와 </b> 개수가 맞아떨어져서 어떤 개수 검사도 통과했지만,
     브라우저는 뒤따르는 <section> 여러 개를 그 <b> 안으로 집어넣었다.

  2) List<String>  — 제네릭 표기를 이스케이프하지 않았다.
     브라우저가 <string>이라는 요소를 만들어 내고, 닫히지 않으니 역시
     뒤 섹션 전부가 그 안에 중첩됐다.

두 경우 모두 화면은 멀쩡해 보이고 CI도 통과했다. 실제로 파싱해 봐야 드러난다.
그래서 이 스크립트는 개수를 세지 않고 <b>스택을 쌓아 트리를 만든다</b>.

사용법:
    python3 scripts/verify_dom_structure.py
    python3 scripts/verify_dom_structure.py --root /경로/저장소
    python3 scripts/verify_dom_structure.py --self-test   # 검사 규칙 자체를 점검
"""

from __future__ import annotations

import argparse
import sys
from dataclasses import dataclass
from html.parser import HTMLParser
from pathlib import Path

# 검사 대상 — 직접 작성하는 학습 대시보드와 환경 준비 안내
TARGET_FILES = (
    Path("index.html"),
    Path("Front_end") / "index.html",
    Path("Back_end") / "index.html",
    Path("setup") / "index.html",
)

# 끝 태그가 없는 요소. 스택에 쌓지 않는다.
VOID_ELEMENTS = {
    "area", "base", "br", "col", "embed", "hr", "img", "input",
    "link", "meta", "param", "source", "track", "wbr",
}

# 끝 태그를 생략할 수 있는 요소 → "이 태그가 새로 열리면 자동으로 닫힌다"는 목록.
# 같은 태그가 다시 열릴 때는 아래 목록과 무관하게 항상 닫히고,
# 부모의 끝 태그를 만났을 때는 handle_endtag가 처리한다.
#
# 주의: <li> 안에 <ul>이 오는 중첩 목록은 정상이므로 li를 닫으면 안 된다.
#       <p>만 예외적으로 블록 요소가 열리면 닫힌다(HTML 명세).
OPTIONAL_END_TAG = {
    "li": set(),
    "dt": {"dd"}, "dd": {"dt"},
    "p": None,  # None = 모든 블록 요소가 닫는다 (아래에서 BLOCK_ELEMENTS로 채운다)
    "tr": set(),
    "td": {"th", "tr"}, "th": {"td", "tr"},
    "thead": {"tbody", "tfoot"}, "tbody": {"tfoot"}, "tfoot": set(),
    "option": {"optgroup"},
}

# 글 흐름 안에 들어가는 요소(인라인). 이 안에 블록 요소가 들어가면 구조가 깨진 것이다.
INLINE_ELEMENTS = {
    "a", "abbr", "b", "bdi", "bdo", "cite", "code", "data", "dfn", "em", "i",
    "kbd", "mark", "q", "rp", "rt", "ruby", "s", "samp", "small", "span",
    "strong", "sub", "sup", "time", "u", "var", "button", "label", "summary",
}

# 인라인 요소 안에 있으면 안 되는 블록/구획 요소
BLOCK_ELEMENTS = {
    "section", "article", "main", "header", "footer", "nav", "aside",
    "div", "ul", "ol", "dl", "table", "form", "figure", "details", "pre", "h1",
    "h2", "h3", "h4", "h5", "h6", "blockquote", "p",
}

# 표준 HTML 요소. 여기 없고 하이픈도 없는 이름은 이스케이프 실수로 본다.
KNOWN_ELEMENTS = VOID_ELEMENTS | INLINE_ELEMENTS | BLOCK_ELEMENTS | {
    "html", "head", "body", "title", "style", "script", "noscript", "template",
    "span", "li", "dt", "dd", "tr", "td", "th", "thead", "tbody", "tfoot",
    "caption", "colgroup", "option", "optgroup", "select", "textarea",
    "fieldset", "legend", "datalist", "output", "progress", "meter",
    "figcaption", "hgroup", "address", "map", "object", "picture", "canvas",
    "svg", "path", "circle", "rect", "line", "polyline", "polygon", "g", "text",
    "defs", "use", "symbol", "title", "dialog", "slot", "iframe", "video",
    "audio", "ins", "del", "search",
}


# <p>는 어떤 블록 요소가 열리든 닫힌다 — 위에서 None으로 표시해 둔 자리를 채운다.
OPTIONAL_END_TAG["p"] = frozenset(BLOCK_ELEMENTS)


@dataclass
class Problem:
    line: int
    kind: str
    detail: str


@dataclass
class OpenTag:
    name: str
    line: int


class StructureParser(HTMLParser):
    """태그를 스택으로 쌓아 실제 트리를 재현하면서 이상한 지점을 기록한다."""

    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.stack: list[OpenTag] = []
        self.problems: list[Problem] = []
        self.ids: dict[str, int] = {}
        self.duplicate_ids: list[Problem] = []
        self.anchors: list[tuple[str, int]] = []
        self.sections: list[tuple[str, list[str], int]] = []
        self.unknown_seen: set[str] = set()

    # ---------------------------------------------------------- 내부 도구
    def _auto_close(self, new_tag: str) -> None:
        """끝 태그를 생략할 수 있는 요소를 브라우저처럼 알아서 닫는다."""
        while self.stack:
            top = self.stack[-1].name
            if top not in OPTIONAL_END_TAG:
                return
            closes_on = OPTIONAL_END_TAG[top]
            if new_tag == top or new_tag in closes_on:
                self.stack.pop()
                continue
            return

    def _ancestors(self) -> list[str]:
        return [t.name for t in self.stack]

    # ---------------------------------------------------------- 파서 콜백
    def handle_starttag(self, tag: str, attrs) -> None:
        tag = tag.lower()
        line = self.getpos()[0]

        # 이스케이프하지 않은 <String> 같은 것. 하이픈이 있으면 커스텀 요소로 인정한다.
        if tag not in KNOWN_ELEMENTS and "-" not in tag and tag not in self.unknown_seen:
            self.unknown_seen.add(tag)
            self.problems.append(Problem(
                line, "알 수 없는 태그",
                "<%s> — 표준 HTML 요소가 아니다. 제네릭·부등호를 "
                "&lt; &gt; 로 이스케이프하지 않았을 가능성이 높다." % tag))

        attr_map = {k.lower(): (v or "") for k, v in attrs}

        if "id" in attr_map:
            element_id = attr_map["id"]
            if element_id in self.ids:
                self.duplicate_ids.append(Problem(
                    line, "중복 id",
                    'id="%s" — %d행에서 이미 사용했다.' % (element_id, self.ids[element_id])))
            else:
                self.ids[element_id] = line

        href = attr_map.get("href", "")
        if tag == "a" and href.startswith("#") and len(href) > 1:
            self.anchors.append((href[1:], line))

        if tag in VOID_ELEMENTS:
            return

        self._auto_close(tag)

        # 블록 요소가 인라인 요소 안에 들어갔는지 — 구조 붕괴의 직접 신호
        if tag in BLOCK_ELEMENTS:
            for ancestor in reversed(self.stack):
                if ancestor.name in INLINE_ELEMENTS:
                    self.problems.append(Problem(
                        line, "구조 붕괴",
                        "<%s>가 <%s>(%d행에서 열림) 안에 들어갔다. "
                        "그 인라인 태그가 닫히지 않았을 가능성이 높다."
                        % (tag, ancestor.name, ancestor.line)))
                    break

        if tag == "section":
            self.sections.append((attr_map.get("id", "(id 없음)"), self._ancestors(), line))

        self.stack.append(OpenTag(tag, line))

    def handle_startendtag(self, tag, attrs) -> None:
        # <br /> 처럼 스스로 닫는 형태. 여는 처리만 하고 스택에는 남기지 않는다.
        tag_lower = tag.lower()
        if tag_lower in VOID_ELEMENTS:
            self.handle_starttag(tag, attrs)
            return
        self.handle_starttag(tag, attrs)
        if self.stack and self.stack[-1].name == tag_lower:
            self.stack.pop()

    def handle_endtag(self, tag: str) -> None:
        tag = tag.lower()
        line = self.getpos()[0]
        if tag in VOID_ELEMENTS:
            return

        for depth in range(len(self.stack) - 1, -1, -1):
            if self.stack[depth].name != tag:
                continue
            # 이 태그 위에 남아 있던 것들은 닫히지 않은 채 끝난 것이다.
            for leaked in self.stack[depth + 1:]:
                if leaked.name in OPTIONAL_END_TAG:
                    continue  # 생략 가능한 태그는 브라우저도 여기서 닫는다
                self.problems.append(Problem(
                    leaked.line, "닫히지 않은 태그",
                    "<%s>가 열린 채 </%s>(%d행)를 만났다. "
                    "다른 태그로 잘못 닫았을 가능성이 높다." % (leaked.name, tag, line)))
            del self.stack[depth:]
            return

        self.problems.append(Problem(
            line, "짝 없는 끝 태그", "</%s>에 대응하는 여는 태그가 없다." % tag))

    def finish(self) -> None:
        for leaked in self.stack:
            if leaked.name in OPTIONAL_END_TAG or leaked.name in {"html", "body", "head"}:
                continue
            self.problems.append(Problem(
                leaked.line, "닫히지 않은 태그",
                "<%s>가 문서 끝까지 닫히지 않았다." % leaked.name))


def check_file(path: Path) -> list[Problem]:
    return analyse(path.read_text(encoding="utf-8"))


def analyse(markup: str) -> list[Problem]:
    """문자열을 그대로 검사한다. 자체 테스트와 파일 검사가 같은 경로를 쓰게 한다."""
    parser = StructureParser()
    parser.feed(markup)
    parser.close()
    parser.finish()

    problems = list(parser.problems) + list(parser.duplicate_ids)
    for section_id, ancestors, line in parser.sections:
        inline_ancestors = [name for name in ancestors if name in INLINE_ELEMENTS]
        if inline_ancestors:
            problems.append(Problem(
                line, "섹션 위치 이상",
                'id="%s" 섹션이 %s 안에 있다. 정상이라면 main·body 아래에 있어야 한다.'
                % (section_id, " > ".join("<%s>" % n for n in inline_ancestors))))
    for anchor, line in parser.anchors:
        if anchor not in parser.ids:
            problems.append(Problem(
                line, "깨진 앵커", 'href="#%s" — 그런 id가 문서에 없다.' % anchor))
    return sorted(problems, key=lambda p: (p.line, p.kind))


# (설명, 마크업, 걸려야 하는 문제 유형) — 유형이 None이면 "문제가 없어야 한다"는 뜻
SELF_TESTS = (
    ("정상 문서", "<main><section id='a'><p>글</p></section></main>", None),
    ("중첩 목록(정상)", "<main><ul><li>가<ul><li>나</li></ul></li></ul></main>", None),
    ("끝 태그 생략(정상)", "<main><ul><li>가<li>나</ul><table><tr><td>1<td>2</table></main>", None),
    ("b를 code로 잘못 닫음", "<main><p><b>글</code></p></main>", "닫히지 않은 태그"),
    ("짝 없는 끝 태그", "<main><p>글</code></p></main>", "짝 없는 끝 태그"),
    ("제네릭 이스케이프 누락", "<main><p>List<String>을 쓴다</p></main>", "알 수 없는 태그"),
    ("인라인 안의 블록", "<main><b><section id='x'>내용</section></b></main>", "구조 붕괴"),
    ("섹션이 인라인에 삼켜짐", "<main><b>제목<section id='y'>내용</section></b></main>", "섹션 위치 이상"),
    ("중복 id", "<main><div id='dup'></div><div id='dup'></div></main>", "중복 id"),
    ("깨진 앵커", "<main><a href='#없음'>이동</a></main>", "깨진 앵커"),
    ("닫히지 않은 채 문서 끝", "<main><div><span>글</div>", "닫히지 않은 태그"),
)


def run_self_test() -> int:
    """규칙 하나하나가 실제로 동작하는지 확인한다. 검사기 자체의 회귀를 막는다."""
    failures = 0
    for name, markup, expected in SELF_TESTS:
        kinds = {p.kind for p in analyse(markup)}
        if expected is None:
            ok = not kinds
            detail = "문제 없음" if ok else "예상 밖 검출: %s" % ", ".join(sorted(kinds))
        else:
            ok = expected in kinds
            detail = "[%s] 검출" % expected if ok else "검출 실패 (나온 것: %s)" % (
                ", ".join(sorted(kinds)) or "없음")
        print("  %s  %-24s %s" % ("OK  " if ok else "실패", name, detail))
        if not ok:
            failures += 1

    print()
    if failures:
        print("자체 테스트 실패 — %d건" % failures)
        return 1
    print("자체 테스트 통과 — 규칙 %d개" % len(SELF_TESTS))
    return 0


def parse_arguments() -> argparse.Namespace:
    default_root = Path(__file__).resolve().parents[1]
    parser = argparse.ArgumentParser(
        description="학습 노트 HTML을 실제로 파싱해 DOM 구조가 깨지지 않았는지 검사합니다.")
    parser.add_argument("--root", type=Path, default=default_root, help="저장소 루트 경로")
    parser.add_argument("--self-test", action="store_true",
                        help="검사 규칙 자체가 동작하는지 확인하고 종료")
    return parser.parse_args()


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
    total_problems = 0
    checked = 0

    for relative in TARGET_FILES:
        path = root / relative
        if not path.is_file():
            print("건너뜀 (파일 없음): %s" % relative.as_posix())
            continue

        checked += 1
        problems = check_file(path)
        label = relative.as_posix()

        if not problems:
            print("OK    %s" % label)
            continue

        total_problems += len(problems)
        print("실패  %s — 문제 %d건" % (label, len(problems)))
        for problem in problems[:40]:
            print("  %s:%d  [%s] %s" % (label, problem.line, problem.kind, problem.detail))
        if len(problems) > 40:
            print("  ... 외 %d건" % (len(problems) - 40))

    if checked == 0:
        print("검사할 대시보드를 찾지 못했습니다.", file=sys.stderr)
        return 1

    print()
    if total_problems:
        print("DOM 구조 검사 실패 — 총 %d건" % total_problems)
        return 1

    print("DOM 구조 정상 — 대시보드 %d개 검사" % checked)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
