## 기여도 및 핵심 코드 명세서

### 1) 코드 기여도 지표 (구분)

**[AI 중심 구현]** — UI 스타일링(Tailwind CSS), 단순 반환 템플릿 코드 등

다크모드 토글과 선택 종목 강조 표시는 AI에게 직접 작성해달라고
요청했습니다. 12강(`12_tailwind_darkmode`)의 패턴을 그대로 가져다 사용했습니다.
후 반응형 레이아웃, 접근성 개선, 다크 테마 통일 같은
UI/UX 전면 개편은 AI에게 맡겨 진행했습니다. 시작 전에 "`useEffect`/
`fetch`/상태 로직/API 응답 shape는 손대지 말고 스타일링만 허용"이라는 규칙을 먼저
정해뒀고, 매 라운드가 끝날 때마다 브라우저로 직접 눌러보며 동작이 그대로인지 확인했습니다.

**[본인 직접 구현/리팩토링]** — Zustand 스토어 상태 로직, Custom Hook 연동, 비동기
데이터 에러 핸들링 등

기능 1~8의 핵심 로직(커스텀 훅, API Route, Zustand watchlist 상태)은 전부 AI의
힌트와 빈칸 채우기 방식으로 직접 작성했습니다. `StockQuoteCard`/`StockSearch`를
Tailwind로 옮길 때도 상태 초기화 로직과 드롭다운 오버레이 포지셔닝은 직접 짰습니다.
버그도 여섯 건 직접 잡았습니다 — 전광판 애니메이션 인터리빙, 차트 레이스 컨디션,
Hooks 규칙 위반 두 건, 해외 종목 응답 검증 누락, `recommendation` 라우트 오사용까지,
전부 [`CODE_REVIEW.md`](./CODE_REVIEW.md)에 Before/After로 남겨뒀습니다.

### 2) 내가 직접 작성한 핵심 코드 라인 설명

**`search/route.js` — Finnhub 응답을 실제 배열로 꺼내 쓰기까지**

```js
const apiKey = process.env.FINNHUB_API_KEY
const APISTOCK = await fetch(
    `https://finnhub.io/api/v1/search?q=${q}&token=${apiKey}`,
    { cache: 'no-store' }
)
const data = await APISTOCK.json()   // Response 껍데기를 진짜 데이터로
const STOCKS = data.result           // 진짜 배열은 { count, result } 한 겹 더 안에 있었음
const results = STOCKS
    .map((s) => ({ symbol: s.displaySymbol, name: s.description, type: s.type }))
    .slice(0, 5)
```

`fetch()`가 돌려주는 값은 실제 데이터가 아니라 `Response` 객체라서, 여기에 바로
`.filter()`나 `.map()`을 걸면 그런 메서드가 없다는 에러가 납니다. `await .json()`으로
한 번 더 파싱해야 진짜 데이터가 나오는데, Finnhub는 그마저도 배열을 바로 주지 않고
`{ count, result }` 객체 한 겹 안에 감싸서 줍니다. 처음엔 이 구조를 몰라서 세 번
고쳐가며 알아냈고(자세한 과정은 [`CODE_REVIEW.md`](./CODE_REVIEW.md) 사례 1),
최종적으로는 Finnhub 필드명(`displaySymbol`, `description`)을 프로젝트 전체에서 쓰는
이름(`symbol`, `name`)으로 맞춰주는 `.map()`으로 정리했습니다. 이 route를 호출하는
`StockSearch` 컴포넌트는 `useDebounce`로 입력을 지연시키고 `useState`로 검색 결과를
관리하는데, route가 어떤 모양으로 데이터를 돌려주느냐가 그 상태 로직에 그대로
영향을 줍니다.

**`useLiveTicker.js` — WebSocket 구독/해제와 `useEffect` cleanup**

```js
useEffect(() => {
    const ws = new WebSocket(`wss://ws.finnhub.io?token=${token}`)
    ws.onopen = () => {
        symbols.forEach((sym) => ws.send(JSON.stringify({ type: 'subscribe', symbol: sym })))
    }
    ws.onmessage = (event) => { /* ... 체결가로 prices 갱신 ... */ }
    return () => {
        if (ws.readyState === WebSocket.OPEN)
            symbols.forEach((sym) => ws.send(JSON.stringify({ type: 'unsubscribe', symbol: sym })))
        ws.close()
    }
}, [symbols])
```

`useEffect`와 그 cleanup 함수(`return () => {...}`)를 활용한 커스텀 훅입니다.
WebSocket처럼 연결을 유지하는 리소스는 새 연결을 열기 전에 이전 연결을 정리해줘야
메모리 누수나 중복 구독이 안 생깁니다. 그래서 `ws.close()`만 부르지 않고,
`readyState`가 `OPEN`인지 먼저 확인한 뒤 `unsubscribe` 메시지를 보내서 Finnhub 서버
쪽 구독까지 함께 정리했습니다. 이전 체결가와 비교해 상승/하락 방향을 표시하는
부분에는 리렌더링을 유발하지 않고 직전 값만 기억하면 되는 `useRef`를 썼습니다.
