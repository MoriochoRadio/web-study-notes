# 📝 AI 프롬프트 일지 (PROMPT_LOG.md)

> 제출 가이드: AI에게 어떤 지시를 내렸고, 원하는 결과를 얻기 위해 프롬프트를 어떻게
> 발전시켰는지 기록합니다. 기능을 하나 만들 때마다 아래 형식으로 이 문서에 바로 추가합니다.

---

## 프롬프트 작성 이력 (최소 3개)

### 1. [프로젝트 스캐폴딩] Next.js 프로젝트 초기 설정
* **프롬프트 전문**: "4.react/stock-dashboard 자리에 create-next-app으로 JS + Tailwind v4 +
  App Router + ESLint 조합으로 새 프로젝트를 만들어줘. 기존 lessons/07~13 강의와 같은
  Next 16.2.12 / React 19.2.4 버전, zustand·recharts 추가 설치."
* **AI 답변 요약**: `create-next-app`으로 스캐폴딩 → 기본 Geist 폰트/템플릿 제거 →
  13강 `globals.css`의 stock 색상 팔레트와 다크모드 `@variant` 설정을 그대로 재사용 →
  `zustand`, `recharts` 설치 → `npm run build`로 정상 빌드 확인.
* **기술적 제약 조건 포함 여부**: ✅ (버전 고정, 기존 코드 스타일 재사용 명시)

### 2. [기능 1] 스마트 주식 검색 백엔드 (`src/app/api/search/route.js`)
* **요청 방식**: 코드를 대신 생성해달라고 하지 않고, "정답을 바로 주지 말고 힌트만 달라"는
  방식으로 진행. 09강(`api_routes`)의 로컬 검색용 `route.js`를 참고 자료로 지정하고,
  Finnhub 실제 검색 엔드포인트(`/v1/search`)의 요청/응답 형식만 AI에게 질문한 뒤,
  직접 `route.js`를 작성 → "이렇게 했어, 분석해줘"라고 리뷰 요청 → 지적받은 원인만 보고
  스스로 코드를 수정, 이 과정을 3라운드 반복.
* **AI 답변 요약**: 매 라운드 AI는 코드를 대신 고쳐주지 않고 "무엇이 왜 잘못됐는지"만
  설명함 — ① `symbol`/`apiKey` 미선언으로 인한 `ReferenceError`, ② `fetch()`가 반환하는
  건 데이터가 아니라 `Response` 객체라서 `.json()`으로 한 번 더 풀어야 한다는 점,
  ③ Finnhub 응답이 배열이 아니라 `{ result: [...] }` 형태이고 필드명이 `symbol`/`name`이
  아니라 `displaySymbol`/`description`이라는 점. 최종 코드는 전부 직접 작성.
* **기술적 제약 조건 포함 여부**: ✅ (참고할 기존 파일을 명시적으로 지정, "코드를 대신
  쓰지 말고 원인만 설명해달라"는 제약을 매 라운드 유지)

### 3. (기능 2를 시작하면 이 자리에 추가)

---

## 프롬프트 재작성(Iterative Prompting) 경험 (1개 이상)

### 사례 1: 초기 빌드 실패 → 원인 파악 → 재요청
* **1차 시도**: create-next-app 기본 템플릿 그대로 사용.
* **문제**: `npm run build` 시 `next/font/google`(Geist 폰트)이 Google Fonts 서버에서
  폰트를 받아오지 못해 빌드 실패 (네트워크 제한 환경).
* **재작성한 프롬프트**: "next/font의 Google Fonts 자동 다운로드 대신, 13강 레슨들처럼
  시스템 폰트만 쓰도록 layout.js를 수정해줘."
* **결과**: `Geist`/`Geist_Mono` import 제거 → 빌드 정상화. 이 경험은 CODE_REVIEW.md에도
  Before/After로 정리했습니다.

### 사례 2: 기능 1 백엔드 — 3라운드에 걸친 자가 디버깅
* **1차 시도**: `symbol`, `apiKey` 변수를 선언 없이 템플릿 리터럴에서 사용 →
  `ReferenceError`로 실행 자체가 안 됨.
* **재질문**: "핀허브 API에 검색값을 줘서 받아와야 하는데 그 부분이 어려워, 내가 뭘
  잘못하고 있는거지?" → AI가 미선언 변수, `Response` 미파싱 두 가지 원인을 짚어줌.
* **2차 시도**: `apiKey` 선언 + `res.json()` 추가는 반영했지만, `data`(객체 전체)에
  바로 `.filter()`를 걸고 존재하지 않는 `s.name` 필드를 참조 → `||` 단락 평가 때문에
  "가끔은 되고 가끔은 크래시 나는" 잠재 버그 상태.
* **3차 시도**: `data.result`로 진짜 배열을 꺼내고, 실제 Finnhub 필드명(`displaySymbol`,
  `description`)으로 교정. `.filter()`가 이미 서버 쪽에서 끝난 필터링을 다시 하는
  중복 작업이라는 지적을 받고 `.map()` + `.slice(0,5)`로 리팩토링.
* **결과**: `npm run dev` 후 브라우저에서 `/api/search?q=apple` 직접 호출 →
  AAPL/APLE 등 5개 실제 Finnhub 결과가 원하는 형태(`{symbol, name, type}`)로 정상
  응답되는 것까지 확인. 이 3라운드 과정은 CODE_REVIEW.md 사례 2에 Before/After로
  정리했습니다.

---

*이 문서는 기능을 추가할 때마다 계속 갱신됩니다.*
