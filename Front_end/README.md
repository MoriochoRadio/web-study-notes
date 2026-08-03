# 웹 개발 학습 기록 (취업아카데미)

취업아카데미에서 진행 중인 HTML / CSS / JavaScript 실습 코드와 강의 자료를 정리한 저장소입니다.

## 📄 학습 정리 페이지

GitHub Pages로 배포된 학습 대시보드에서 지금까지 배운 내용과 앞으로 학습할 내용을 한눈에 볼 수 있습니다.

👉 **[학습 정리 페이지 바로가기](https://moriochoradio.github.io/web-study-notes/)**

## 학습 현황 (2026-07-20 기준)

| 구분 | 실습 개수 |
| --- | --- |
| HTML | 7개 |
| CSS | 13개 |
| JavaScript | 19개 (AJAX/XMLHttpRequest까지) |
| 강의자료(PPT) | 2건 |

다음 학습 예정: **Promise & fetch API** → jQuery → React 기초 (자세한 목록은 대시보드의 "다음 학습 예정" 탭 참고)

## 폴더 구조

```
.
├── index.html            # 학습 정리 대시보드 (GitHub Pages 메인 페이지)
├── README.md
├── 1.html/               # HTML 실습 파일 (7개)
├── 2-css/                # CSS 실습 파일 (13개)
│   └── css/              # 외부 스타일시트(.css)
├── 3.javascript/         # JavaScript 실습 파일 (19개, js19: AJAX)
│   └── js/               # 외부 스크립트(.js), data.json(AJAX 실습용 데이터)
└── slides/               # 강의 슬라이드 원본 (PPTX 2건)
```

> 참고: CSS 폴더는 원래 `2.css`였으나, `.css`로 끝나는 경로에서 브라우저 내비게이션 오류가 발생해 `2-css`로 변경했습니다.

## 업데이트 방식

이 저장소는 새로운 실습을 마칠 때마다 Claude와 함께 수동으로 진행합니다.

1. 로컬 실습 폴더에서 새로 추가/수정된 파일을 확인
2. 해당 폴더(`1.html/`, `2-css/`, `3.javascript/` 등)에 파일 업로드(커밋)
3. `index.html`의 학습 데이터(`htmlModules`/`cssModules`/`jsModules`/`nextTopics`)와 상단 통계 배지를 갱신
4. GitHub Pages 라이브 사이트에서 반영 여부 확인
