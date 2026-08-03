# 웹 개발 학습 기록 — 프론트엔드 과정 (취업아카데미)

취업아카데미 프론트엔드 과정의 실습 코드·강의 자료·학습 노트를 정리한 폴더입니다.
HTML부터 React & Next.js 풀스택까지 커리큘럼 전체를 완료했고, 졸업 과제(StockDash)까지 제출을 마쳤습니다.

## 📄 학습 정리 대시보드

GitHub Pages로 배포된 대시보드에서 전 과목 복습 노트를 한눈에 볼 수 있습니다.
카드 접기/펼치기 · 검색 · 다크모드 · 5분 플래시카드 복습 · 진도 체크 기능을 지원합니다.

👉 **[학습 정리 대시보드 바로가기](https://moriochoradio.github.io/web-study-notes/)**

## 학습 현황 (2026-08-03 기준 — 커리큘럼 전체 완료 🎉)

| 구분 | 단원 | 상태 |
| --- | --- | --- |
| HTML | 7개 | ✅ 완료 |
| CSS | 12개 | ✅ 완료 |
| JavaScript | 18개 (AJAX까지) | ✅ 완료 |
| React & Next.js | 14개 (JSX부터 Recharts+WebSocket까지) | ✅ 완료 |
| 🎓 졸업 과제 | StockDash 주식 대시보드 ([`4.react/stock-dashboard/`](4.react/stock-dashboard/)) | ✅ 완료·제출 |
| 기초 개념 사전 | 39개 항목 (수업 중 실제 질문 Q&A 포함) | 대시보드에서 열람 |

## 직접 정리한 문서

- [`React_Nextjs_Master_Guide.md`](React_Nextjs_Master_Guide.md) — React/Next.js 01~13강 핵심 이론·코드 패턴 종합 정리
- [`User_Learning_QnA_Archive.md`](User_Learning_QnA_Archive.md) — 수업 중 실제로 했던 질문 12개와 개념 풀이
- [`4.react/stock-dashboard/README.md`](4.react/stock-dashboard/README.md) — 졸업 과제 기여도·핵심 코드 명세 (CODE_REVIEW·PROMPT_LOG 문서와 한 세트)

## 폴더 구조

```
.
├── index.html            # 학습 정리 대시보드 (GitHub Pages 메인 페이지)
├── 1.html/               # HTML 실습 파일 (7개)
├── 2-css/                # CSS 실습 파일 (12개 단원)
│   └── css/              # 외부 스타일시트(.css)
├── 3.javascript/         # JavaScript 실습 파일 (18개 단원, AJAX까지)
│   └── js/               # 외부 스크립트(.js), data.json
├── 4.react/
│   ├── lessons/          # React & Next.js 레슨 01~13 (폴더 번호 = 카드 번호 - 1)
│   └── stock-dashboard/  # 🎓 졸업 과제 (Next.js + Zustand + Finnhub API)
└── slides/               # 강의 슬라이드 원본 (PPTX 3건)
```

> 참고: CSS 폴더는 원래 `2.css`였으나, `.css`로 끝나는 경로에서 브라우저 내비게이션 오류가 발생해 `2-css`로 변경했습니다.

## 업데이트 방식

이 폴더는 새로운 학습을 마칠 때마다 Claude와 함께 수동으로 관리합니다.

1. 실습 코드를 해당 폴더에 추가하고 확인 후 커밋
2. `index.html`에 복습 노트 카드(한 줄 요약 → 쉽게 말하면 → 개념 → 주석 달린 코드 → 핵심 정리)를 추가
3. 상단 통계 배지·개요 카드 숫자를 갱신
4. 로컬 서버로 렌더링 검증 후 push → GitHub Pages 라이브 반영 확인

백엔드 과정 자료는 [`../Back_end/`](../Back_end/)에 정리할 예정입니다.
