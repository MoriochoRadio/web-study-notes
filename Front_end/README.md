# 웹 개발 학습 기록 — 프런트엔드 과정 (취업아카데미)

취업아카데미 프런트엔드 과정의 원본 실습 코드·강의 자료·복습 노트를 함께 정리한 폴더입니다. HTML부터 React와 Next.js까지의 과정을 마쳤고, 마지막에는 학습 요소를 결합한 StockDash 졸업 과제를 제출했습니다.

## 학습 정리 대시보드

GitHub Pages 대시보드에서 전 과목 복습 노트를 한눈에 볼 수 있습니다. 카드 접기/펼치기, 검색, 다크 모드, 5분 플래시카드, 진도 체크, 개인 메모를 이용해 필요한 내용을 빠르게 복습할 수 있습니다.

| 학습 UX 기능 | 사용 방법 |
| --- | --- |
| 다음 학습 추천 | 아직 완료하지 않은 첫 카드를 개요에서 바로 열 수 있습니다. |
| 오늘의 학습 목표 | `1·3·5·10개` 중 오늘 완료할 카드 수를 정하면, 해당 날짜에 새로 완료한 카드 기준으로 진행 상황을 보여 줍니다. |
| 진도 마일스톤 | 전체 카드 완료율과 다음 `25%·50%·75%·100%` 목표까지 남은 카드 수를 확인합니다. |
| 읽기 밀도 | 상단의 **간격 좁게** 버튼으로 긴 카드 목록을 더 촘촘하게 볼 수 있으며 선택은 브라우저에 저장됩니다. |
| 모바일 빠른 실행 | 작은 화면 하단에서 **다음·검색·복습·도움**을 바로 실행합니다. |
| 진도 백업 | 가져오기 전에 기록 요약을 확인하고, 적용 후에는 **직전 가져오기 되돌리기**로 한 번 복원할 수 있습니다. |

👉 **[학습 정리 대시보드 바로가기](https://moriochoradio.github.io/web-study-notes/)**

## 학습 현황 및 최신 반영

2026-08-13 저장소 점검 기준으로, 프런트엔드 과정의 원본 수업 코드와 대시보드 복습 카드는 모두 연결되어 있습니다. React·Next.js 과정은 13개 실습 레슨과 이를 종합한 졸업 과제까지 완료한 형태이며, 대시보드에서는 과정 전체를 14개 단원으로 표시합니다.

| 구분 | 반영 범위 | 상태 |
| --- | --- | --- |
| HTML | 7개 실습 | ✅ 완료 |
| CSS | 12개 실습 | ✅ 완료 |
| JavaScript | 18개 실습(AJAX까지) | ✅ 완료 |
| React & Next.js | JSX부터 Recharts·WebSocket까지 13개 레슨 + 종합 단원 | ✅ 완료 |
| 졸업 과제 | [`4.react/stock-dashboard/`](4.react/stock-dashboard/) — Next.js, Zustand, Finnhub API | ✅ 완료·제출 |
| 기초 개념 사전 | 수업 중 실제 질문 Q&A를 포함한 39개 항목 | 대시보드에서 열람 |

## 최근 React·Next.js 수업 연결

| 레슨 | 핵심 주제 | 원본 코드 |
| --- | --- | --- |
| 10 | Zustand 비동기 액션·`persist`·매수/매도 포트폴리오 | [`10_zustand_async_persist/`](4.react/lessons/10_zustand_async_persist/) |
| 11 | 서버 컴포넌트·`Suspense`·스트리밍 | [`11_server_components/`](4.react/lessons/11_server_components/) |
| 12 | Tailwind CSS v4·전역 다크 모드 | [`12_tailwind_darkmode/`](4.react/lessons/12_tailwind_darkmode/) |
| 13 | Recharts·REST 초기 데이터·WebSocket 실시간 시세 | [`13_recharts_websocket/`](4.react/lessons/13_recharts_websocket/) |
| 졸업 과제 | StockDash로 전역 상태·API·테마·차트 기능 통합 | [`stock-dashboard/`](4.react/stock-dashboard/) |

## 직접 정리한 문서

| 문서 | 용도 |
| --- | --- |
| [`React_Nextjs_Master_Guide.md`](React_Nextjs_Master_Guide.md) | React/Next.js 01~13강 핵심 이론과 코드 패턴 종합 정리 |
| [`User_Learning_QnA_Archive.md`](User_Learning_QnA_Archive.md) | 수업 중 실제 질문 12개와 개념 풀이 |
| [`4.react/stock-dashboard/README.md`](4.react/stock-dashboard/README.md) | 졸업 과제의 기여도와 핵심 코드 명세 |

## 폴더 구조

```text
.
├── index.html            # 프런트엔드 학습 정리 대시보드
├── 1.html/               # HTML 실습 파일 (7개)
├── 2-css/                # CSS 실습 파일 (12개 단원)
│   └── css/              # 외부 스타일시트
├── 3.javascript/         # JavaScript 실습 파일 (18개 단원, AJAX까지)
│   └── js/               # 외부 스크립트와 data.json
├── 4.react/
│   ├── lessons/          # React & Next.js 레슨 01~13
│   └── stock-dashboard/  # 졸업 과제 (Next.js + Zustand + Finnhub API)
└── slides/               # 강의 슬라이드 원본 (PPTX 3건)
```

> 참고: CSS 폴더는 원래 `2.css`였으나, `.css`로 끝나는 경로에서 브라우저 내비게이션 오류가 발생해 `2-css`로 변경했습니다.

## 새 수업을 반영하는 체크리스트

새 실습은 먼저 적절한 단원 폴더에 원본 소스와 실행 방법을 기록합니다. 이어서 `index.html`에 같은 주제의 복습 카드와 소스 링크를 추가하고, 상단 통계·학습 여정·시험/복습 범위를 함께 갱신합니다. Next.js 실습은 해당 레슨 폴더에서 의존성을 설치한 뒤 `npm run lint`와 `npm run build`를 통과시키고, 정적 대시보드는 링크·검색·테마·학습 목표·모바일 빠른 실행 레이아웃을 확인한 뒤 커밋합니다.

버전 관리에는 소스와 문서만 포함합니다. `node_modules`, `.next`, `out`, `dist`, 환경 변수 파일, IDE 설정 등 로컬 생성물은 [`../Front_end/.gitignore`](.gitignore) 규칙으로 제외합니다. 백엔드 과정 자료는 [`../Back_end/`](../Back_end/)에서 이어서 관리합니다.
