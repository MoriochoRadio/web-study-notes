# 웹 개발 학습 기록 (취업아카데미)

🇰🇷 한국어 · 🇬🇧 [English](README.en.md)

취업아카데미 과정의 실습 코드와 학습 노트를 정리한 저장소입니다.
2026-08부터 프론트엔드 / 백엔드 과정을 폴더로 나눠 관리합니다.

👉 **[학습 정리 대시보드 바로가기](https://moriochoradio.github.io/web-study-notes/)**

## 학습 범위

| 과정 | 내용 | 상태 |
| --- | --- | --- |
| 프론트엔드 | HTML 7 · CSS 12 · JavaScript 18(AJAX까지) · React/Next.js 14단원 + 졸업 과제 StockDash | ✅ 완료 |
| 백엔드 | Java — 날짜별 수업 실습 + 예습·복습 노트(개념 카드, 실습과제 12문제, 시험 대비 102문제) | 🔄 진행 중 (2026-08-03 시작) |

## 왜 이렇게 정리하나 — Q&A

**Q. 왜 코드만 쌓지 않고 대시보드 형태로 만들었나?**
복습이 목적이라서. 모든 노트가 "한 줄 요약 → 쉽게 말하면 → 개념 → 주석 달린 코드 → 핵심 정리" 형식을 따르고,
검색·플래시카드·진도 체크·오답 노트 기능으로 나중에 다시 찾아보기 쉽게 했습니다.

**Q. 폴더는 왜 Front_end / Back_end로 나눴나?**
과정이 둘이라서. 각 폴더가 자기 대시보드(`index.html`)와 README를 갖고,
루트 `index.html`은 기존 링크 호환용 리다이렉트만 담당합니다.

**Q. 노트에 실린 코드는 검증하나?**
합니다. 자바 코드는 전부 `javac`로 컴파일·실행해 결과를 확인했고(대시보드에 실제 콘솔 출력 첨부),
프론트엔드 노트도 로컬 서버 렌더링 검증 후 push합니다.

## 폴더 구조

```
.
├── index.html    # Front_end/ 대시보드로 리다이렉트 (기존 링크 호환용)
├── Front_end/    # 프론트엔드 과정 (HTML · CSS · JS · React/Next.js — 완료)
│   ├── index.html        # 학습 정리 대시보드 본체
│   ├── 1.html/ 2-css/ 3.javascript/ 4.react/   # 실습 코드
│   └── slides/           # 강의 자료(PPT)
└── Back_end/     # 백엔드(Java) 과정 (진행 중 — 2026-08-03 시작)
    ├── index.html            # Java 백엔드 학습 노트 대시보드
    ├── java_edu_project/     # 수업 실습 코드 (날짜별 패키지)
    └── *.pptx / *.pdf        # 교안 · 실습과제
```

과정별 상세 내용은 [`Front_end/README.md`](Front_end/README.md) ·
[`Back_end/README.md`](Back_end/README.md)를 참고하세요.
