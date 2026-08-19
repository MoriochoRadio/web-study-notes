#!/usr/bin/env python3
"""프런트엔드 대시보드의 학습 단원 수와 요약 표기가 일치하는지 검사한다.

새 수업 카드를 추가한 뒤 이 스크립트를 실행하면, 카드 수는 늘렸지만
헤더·통계 카드·React 졸업 과제 구분을 갱신하지 않은 경우를 찾을 수 있다.
"""

from __future__ import annotations

import argparse
import re
from dataclasses import dataclass
from pathlib import Path


@dataclass(frozen=True)
class SubjectRule:
    key: str
    section_id: str
    header_pattern: str
    stat_pattern: str
    label: str


RULES = (
    SubjectRule("html", "html-section", r"HTML\s+(\d+)개\s+단원", r'<div class="stat-card html"><div class="n">(\d+)</div>', "HTML"),
    SubjectRule("css", "css-section", r"CSS\s+(\d+)개\s+단원", r'<div class="stat-card css"><div class="n">(\d+)</div>', "CSS"),
    SubjectRule("js", "js-section", r"JavaScript\s+(\d+)개\s+단원", r'<div class="stat-card js"><div class="n">(\d+)</div>', "JavaScript"),
    SubjectRule("react", "react-section", r"React·Next\.js\s+(\d+)개\s+레슨", r'<div class="stat-card react"><div class="n">(\d+)</div><div class="l">React·Next\.js 레슨</div>', "React·Next.js"),
)


def parse_arguments() -> argparse.Namespace:
    default_root = Path(__file__).resolve().parents[1]
    parser = argparse.ArgumentParser(description="프런트엔드 대시보드의 학습 단원 인벤토리를 검사합니다.")
    parser.add_argument("--root", type=Path, default=default_root, help="저장소 루트 경로")
    return parser.parse_args()


def section_source(html: str, section_id: str) -> str:
    match = re.search(rf'<section\s+id="{re.escape(section_id)}"[^>]*>(.*?)</section>', html, flags=re.DOTALL)
    if not match:
        raise ValueError(f"섹션을 찾을 수 없습니다: {section_id}")
    return match.group(1)


def first_number(source: str, pattern: str, label: str) -> int:
    match = re.search(pattern, source)
    if not match:
        raise ValueError(f"{label} 표기를 찾을 수 없습니다.")
    return int(match.group(1))


def note_cards(section_html: str) -> list[str]:
    return re.findall(r'<article\s+class="note-card"\s+id="([^"]+)"', section_html)


def main() -> int:
    args = parse_arguments()
    root = args.root.resolve()
    dashboard = root / "Front_end" / "index.html"
    if not dashboard.is_file():
        raise SystemExit(f"대시보드를 찾을 수 없습니다: {dashboard}")

    html = dashboard.read_text(encoding="utf-8")
    errors: list[str] = []
    rows: list[tuple[str, int, int, int]] = []

    for rule in RULES:
        cards = note_cards(section_source(html, rule.section_id))
        card_count = len(cards)
        if rule.key == "react":
            capstones = [card for card in cards if card == "react-capstone"]
            lesson_cards = [card for card in cards if card != "react-capstone"]
            if len(capstones) != 1:
                errors.append(f"React 섹션의 졸업 과제 카드는 1개여야 합니다. 현재: {len(capstones)}개")
            card_count = len(lesson_cards)

        header_count = first_number(html, rule.header_pattern, f"헤더 {rule.label}")
        stat_count = first_number(html, rule.stat_pattern, f"통계 {rule.label}")
        rows.append((rule.label, card_count, header_count, stat_count))
        if len({card_count, header_count, stat_count}) != 1:
            errors.append(
                f"{rule.label}: 카드 {card_count}개, 헤더 {header_count}개, 통계 {stat_count}개로 일치하지 않습니다."
            )

    print("대상              카드  헤더  통계")
    print("--------------------------------")
    for label, cards, header, stat in rows:
        print(f"{label:<16}{cards:>4}{header:>6}{stat:>6}")

    if errors:
        print("\n불일치 발견:")
        for error in errors:
            print(f"- {error}")
        return 1

    print("\n프런트엔드 대시보드 인벤토리 일치")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
