#!/usr/bin/env python3
"""백엔드(Java) 대시보드의 카드 인벤토리와 상단 통계가 일치하는지 검사한다.

수업 일차, 자바 개념 카드, 실습과제, 학습 여정이 추가될 때 카드 수만 늘리고
상단 요약을 갱신하지 않은 경우를 커밋 전에 찾는다.
"""

from __future__ import annotations

import argparse
import re
from dataclasses import dataclass
from pathlib import Path


@dataclass(frozen=True)
class InventoryRule:
    section_id: str
    stat_class: str
    label: str
    item_pattern: str


RULES = (
    InventoryRule("class-section", "class", "수업 진도", r'<article\s+class="[^"]*\bnote-card\b[^"]*"'),
    InventoryRule("basic-section", "basic", "자바 기초", r'<article\s+class="[^"]*\bnote-card\b[^"]*"'),
    InventoryRule("oop-section", "oop", "객체지향", r'<article\s+class="[^"]*\bnote-card\b[^"]*"'),
    InventoryRule("util-section", "util", "자바 활용", r'<article\s+class="[^"]*\bnote-card\b[^"]*"'),
    InventoryRule("net-section", "net", "네트워크", r'<article\s+class="[^"]*\bnote-card\b[^"]*"'),
    InventoryRule("prac-section", "prac", "실습과제", r'<article\s+class="[^"]*\bnote-card\b[^"]*"'),
    InventoryRule("journey-section", "journey", "학습 여정", r'<div\s+class="[^"]*\bjourney-step\b[^"]*"'),
    InventoryRule("concepts-section", "concepts", "개념 사전", r'<article\s+class="[^"]*\bnote-card\b[^"]*"'),
)


def parse_arguments() -> argparse.Namespace:
    default_root = Path(__file__).resolve().parents[1]
    parser = argparse.ArgumentParser(description="백엔드 대시보드의 학습 인벤토리를 검사합니다.")
    parser.add_argument("--root", type=Path, default=default_root, help="저장소 루트 경로")
    return parser.parse_args()


def extract_section(html: str, section_id: str) -> str:
    match = re.search(rf'<section\s+id="{re.escape(section_id)}"[^>]*>(.*?)</section>', html, flags=re.DOTALL)
    if not match:
        raise ValueError(f"섹션을 찾을 수 없습니다: {section_id}")
    return match.group(1)


def statistic_count(html: str, stat_class: str) -> int:
    pattern = rf'<div\s+class="stat-card\s+{re.escape(stat_class)}"><div\s+class="n">(\d+)</div>'
    match = re.search(pattern, html)
    if not match:
        raise ValueError(f"상단 통계를 찾을 수 없습니다: {stat_class}")
    return int(match.group(1))


def main() -> int:
    root = parse_arguments().root.resolve()
    dashboard = root / "Back_end" / "index.html"
    if not dashboard.is_file():
        raise SystemExit(f"대시보드를 찾을 수 없습니다: {dashboard}")

    html = dashboard.read_text(encoding="utf-8")
    errors: list[str] = []
    rows: list[tuple[str, int, int]] = []

    for rule in RULES:
        cards = len(re.findall(rule.item_pattern, extract_section(html, rule.section_id)))
        stat = statistic_count(html, rule.stat_class)
        rows.append((rule.label, cards, stat))
        if cards != stat:
            errors.append(f"{rule.label}: 대시보드 항목 {cards}개, 상단 통계 {stat}개")

    print("대상          항목  통계")
    print("-----------------------")
    for label, cards, stat in rows:
        print(f"{label:<12}{cards:>4}{stat:>6}")

    if errors:
        print("\n불일치 발견:")
        for error in errors:
            print(f"- {error}")
        return 1

    print("\n백엔드 대시보드 인벤토리 일치")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
