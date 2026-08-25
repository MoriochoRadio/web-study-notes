# 🔍 AI 코드 리뷰 & 디버깅 일지 (CODE_REVIEW.md)

AI가 만들어준 코드를 그대로 쓰지 않고 React 개념에 기반해 직접 검증하고 수정한
과정을 기록합니다. 수업 코드 기반으로, 기능 로직을 AI에게 전부 작성해달라고 하지 않고 부분 작성한 뒤 이렇게 작성했는데 리뷰해줘 라고 요청하는 방식으로 AI를 활용했습니다. 아래 사례들은 주요 코드 수정 기록입니다.
핵심 사례 6건만 골라 담았습니다.

---

## 1) 코드의 한계/오류 분석 (최소 1건)

가장 대표적인 사례는 사례 1입니다. 기능 1(스마트 주식 검색) `route.js`의 1차 시도는
선언하지 않은 변수(`symbol`, `apiKey`)를 참조해 `ReferenceError`가 났고, 2차 시도는
`fetch()`가 반환하는 `Response` 객체에 `.filter()` 메서드가 없다는 걸 놓쳐 실패했으며,
3차 시도에서야 실제 응답이 `{ count, result: [...] }` 구조라는 걸 반영해서 정상
동작했습니다. 이 외에도 조건부 `return` 뒤에서 훅을 호출해 React Hooks 규칙을
위반한 사례(사례 5), 컴포넌트 내부에 정의한 함수가 매 렌더링마다 재생성되는
문제(사례 4), 외부 API가 예상과 다른 응답 구조를 줄 때 검증이 없었던 문제(사례 3)
등 총 6건의 한계/오류를 아래 "2)"에서 Before/After로 분석했습니다.

## 2) Before & After 코드 비교 및 수정 이유

## 사례 1: [기능 1] 백엔드 `route.js` — 직접 작성한 코드를 AI 리뷰로 3단계에 걸쳐 검증·수정

이 사례는 AI가 준 코드에서 오류를 찾은 게 아니라, 수업 코드 기반으로 수정 작성한 코드를 AI에게 리뷰받으며 원인만 설명 듣고 고친 과정입니다. 정답을 바로 받지 않고 매 라운드 왜 틀렸는지 물어보며 수정하였습니다.

**1차 시도 (Before)** — 선언하지 않은 변수를 그대로 참조
```js
const APISTOCK = await fetch(
    `https://finnhub.io/api/v1/search?q=${symbol}&token=${apiKey}`,
    { cache: 'no-store' }
)
const results = APISTOCK.filter(
    (s) => s.symbol.toLowerCase().includes(q) || s.name.toLowerCase().includes(q)
).slice(0, 5)
```
`symbol`과 `apiKey`를 이 함수 안에서 선언한 적이 없어서 바로 `ReferenceError`가
났습니다. 검색어는 이미 `q`로 추출해뒀는데 엉뚱한 이름을 썼고, API 키는 읽어오는
코드 자체가 없었습니다. 게다가 `fetch()`가 돌려주는 건 실제 데이터가 아니라
`Response` 객체(포장 상자)라서 `.filter()`라는 메서드 자체가 존재하지 않았습니다.

**최종본 (After)** — 3라운드에 걸쳐 직접 수정
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
Finnhub 검색 API는 우리가 보낸 `q`로 이미 서버 쪽에서 필터링을 끝내고 결과를
줍니다. 그런데도 클라이언트에서 `symbol`/`name`에 `q`가 포함되는지 다시 검사하면,
Finnhub가 별칭·유사종목 로직으로 매칭시킨 결과를 제 단순한 검사가 오히려 걸러낼
위험이 있습니다. 그래서 다시 필터링하지 않고, Finnhub의 실제 필드명(`displaySymbol`,
`description`)을 프로젝트 전체에서 써온 이름(`symbol`, `name`)으로 모양만 바꿔주는
`.map()`으로 교체했습니다. `/api/search?q=apple`을 직접 호출해서 AAPL, APLE 등 5개
종목이 정상 반환되는 걸 브라우저에서 확인했습니다.

---

## 사례 2: [기능 2] `StockQuoteCard` — props 변경과 state 갱신 사이의 렌더링 타이밍 레이스

**Before** — `loading`/`error`만 가드하고 바로 데이터 렌더링
```jsx
if (loading) return <div>로딩중...</div>
if (error) return <div>에러발생: {error}</div>

return (
  <div>
    <h3>{data.symbol}</h3>
    ...
```
검색 결과를 클릭해 `symbol` prop이 `null`에서 `"AAPL"`로 바뀌는 순간, `useEffect`가
`load()`를 호출해 `loading: true`로 바꾸는 건 이 렌더링이 커밋된 이후에 일어납니다.
즉 `symbol`은 이미 있는데 `loading`/`data`/`error`는 아직 이전 값 그대로인 아주 짧은
렌더링 프레임이 실제로 존재하고, 이때 `data`가 여전히 `null`이라
`Cannot read properties of null`로 크래시가 났습니다. 브라우저에서 이 에러를 재현한
뒤 원인을 거꾸로 따라가서 알아냈습니다.

**After**
```jsx
if (loading) return <div>로딩중...</div>
if (error) return <div>에러발생: {error}</div>
if (!data) return null

return ( ... )
```
React에서는 prop이 바뀐다고 컴포넌트의 내부 state가 자동으로 리셋되지 않습니다.
state는 `useEffect`가 실행돼야 갱신되는데, effect는 render가 DOM에 커밋된 다음에
실행되니까 한 박자 늦습니다. 그 늦는 구간을 방어하는 안전망으로 `!data` 가드를
추가했습니다.

---

## 사례 3: [기능 2] `route.js`/`useStockData.js` — 해외 종목(D.BK) 처리 시 서버 응답 검증 누락

**Before** — `route.js`
```js
const data = await res.json()
const result = { symbol, price: data.c, change: data.d, /* ... */ }
return Response.json(result)
```
여러 종목을 빠르게 클릭하며 테스트하던 중 해외 거래소 종목(`D.BK`, 방콕거래소)에서
`Cannot read properties of undefined (reading 'toFixed')` 에러가 났습니다. 브라우저
Network 탭으로 실제 응답을 확인해보니, Finnhub 무료 플랜이 이 종목의 실시간 시세를
지원하지 않아서 `data.c`(현재가) 자체가 없는 응답을 주고 있었습니다. `route.js`는
이걸 그대로 통과시켰고, `JSON.stringify`가 `undefined` 값인 `price` 키를 아예
빼버려서 클라이언트는 `price`가 없는 객체를 "성공"으로 받았습니다.

**After** — `route.js`에 검증 추가, `useStockData.js`도 `res.ok`로 에러 분리
```js
// route.js
const data = await res.json()
if (typeof data.c !== 'number') {
  return Response.json({ error: '이 종목은 실시간 시세를 지원하지 않습니다.' }, { status: 404 })
}
const result = { symbol, price: data.c, /* ... */ }
return Response.json(result)
```
```js
// useStockData.js
fetch('/api/quote?symbol=' + symbol)
  .then(async (res) => {
    if (!res.ok) {
      const body = await res.json()
      throw new Error(body.error)
    }
    return res.json()
  })
  .then(data => setState({ data, loading: false, error: null }))
  .catch(err => setState({ data: null, loading: false, error: err.message }))
```
외부 API는 성공(200)이어도 우리가 기대하는 형태의 데이터를 준다는 보장이 없습니다.
서버(`route.js`)에서 데이터 유효성을 한 번 검증해서 실패를 명확한 에러 응답으로
바꿔주고, 클라이언트(`useStockData.js`)는 `res.ok`로 그 신호를 받아 `error` state로
정확히 분기해야 화면이 안전해집니다.

---

## 사례 4: [기능 4] `StockChart` — 컴포넌트 내부에 정의된 `CustomTooltip`으로 인한 불필요한 재생성

**Before**
```jsx
export default function StockChart({ symbol }) {
  // ...
  function CustomTooltip({ active, payload, label }) { /* ... */ }
  // ...
}
```
`CustomTooltip`을 `StockChart` 함수 몸통 안쪽에 선언하면, 실시간 웹소켓 갱신으로
`StockChart`가 리렌더링될 때마다(새 체결가가 들어올 때마다) `CustomTooltip` 함수
자체가 매번 새로 생성됩니다. React는 함수 참조가 바뀌면 다른 컴포넌트로 취급하기
때문에 불필요한 재마운트·재계산이 반복될 수 있습니다. 기능정의서가 이 기능의 학습
포인트로 "렌더링 최적화"를 명시하여 확인했습니다.

**After**
```jsx
function CustomTooltip({ active, payload, label }) { /* ... */ }  // 파일 최상단, 컴포넌트 밖

export default function StockChart({ symbol }) {
  // ...
}
```
`CustomTooltip`은 `StockChart`의 내부 상태나 클로저를 전혀 참조하지 않는 순수
표시용 컴포넌트입니다. 이런 컴포넌트는 부모 함수 바깥(모듈 최상단)에 한 번만
정의해두면, 부모가 아무리 자주 리렌더링돼도 같은 함수 참조를 재사용하게 되어
불필요한 재생성을 막을 수 있습니다.

---

## 사례 5: [기능 8] `StockQuoteCard` — 조건부 `return` 뒤에 위치한 커스텀 훅 호출 (Hooks 규칙 위반)

**Before**
```jsx
export default function StockQuoteCard({ symbol }) {
    const { data, loading, error } = useStockData(symbol)

    if (!symbol) return null
    if (loading) return <div>로딩중...</div>
    if (error) return <div>에러발생: {error}</div>
    if (!data) return null

    const { addSymbol, removeSymbol, isWatched } = useWatchlistStore()
    const watched = isWatched(data.symbol)
    // ...
}
```
`useWatchlistStore()`는 React 훅인데 네 개의 조건부 `return` 뒤에 호출되고
있었습니다. `symbol`이 없거나 데이터가 로딩/에러 상태인 렌더링에서는 이 줄까지
실행이 도달하지 않아 훅이 호출되지 않고, 데이터가 준비된 렌더링에서만 호출됩니다.
React는 훅 호출 순서로 각 훅의 내부 상태를 추적하기 때문에, 렌더링마다 호출되는
훅의 개수나 순서가 달라지면 상태가 꼬이거나 런타임 에러가 날 수 있습니다.

**After**
```jsx
export default function StockQuoteCard({ symbol }) {
    const { data, loading, error } = useStockData(symbol)
    const { addSymbol, removeSymbol, isWatched } = useWatchlistStore()

    if (!symbol) return null
    if (loading) return <div>로딩중...</div>
    if (error) return <div>에러발생: {error}</div>
    if (!data) return null

    const watched = isWatched(data.symbol)
    // ...
}
```
React의 Hooks 규칙은 모든 훅이 컴포넌트 함수의 최상단에서, 조건문·반복문·중첩 함수
없이, 매 렌더링마다 항상 같은 순서로 호출돼야 한다고 요구합니다. 반면
`isWatched(data.symbol)`처럼 훅이 아니라 스토어에서 꺼내온 일반 함수를 호출하는
건 이 규칙의 적용 대상이 아니라서, `data`가 확정된 이후(조건부 `return`을 지난
지점)에 호출해도 안전합니다. 훅 호출과 훅에서 꺼낸 값·함수의 사용을 구분해서
생각하야 함을 알 수 있었습니다.

---

## 사례 6: [최종 통합 테스트] `recommendation/route.js`가 `earnings/route.js` 코드로 통째로 덮어써짐

**Before** — 실제로 저장돼 있던, 잘못된 `recommendation/route.js`
```js
export async function GET(request) {
    const { searchParams } = new URL(request.url)
    const symbol = searchParams.get('symbol')
    if (!symbol) return Response.json({ error: '종목 코드가 없습니다.' }, { status: 400 })
    const apiKey = process.env.FINNHUB_API_KEY

    const res = await fetch(
        `https://finnhub.io/api/v1/stock/earnings?symbol=${symbol}&limit=4&token=${apiKey}`,
        { cache: 'no-store' }
    )
    if (!res.ok) return Response.json({ error: 'API 호출 실패' }, { status: 500 })
    const data = await res.json()
    if (!data || !Array.isArray(data) || data.length === 0) {
        return Response.json({ error: '실적 데이터 없음' }, { status: 404 })
    }
    return Response.json(data)   // 4개 분기 배열을 그대로 리턴
}
```
최종 통합 테스트에서 브라우저로 직접 확인해보니 "전문가 투자의견" 카드의 제목이
비어 있고 막대그래프도 안 그려졌습니다. 브라우저 콘솔에서 `/api/recommendation`
응답을 직접 찍어보니 `RecommendationCard.jsx`가 기대하는
`{symbol, buy, hold, sell, strongBuy, strongSell}` 단일 객체가 아니라,
`earnings/route.js`가 리턴해야 할 4개 분기짜리 배열이 그대로 오고 있었습니다. 두
파일을 비교해보니 완전히 동일한 내용이었습니다 — 기능 6을 만들던 중 저장 실수로
`recommendation/route.js`가 `earnings/route.js`와 같은 코드로 덮어써진 것이었습니다.
컴포넌트 쪽은 배열을 객체처럼 다루려 했기 때문에(`rec.symbol`, `rec.buy` 등이
배열엔 없는 속성이라 전부 `undefined`) 에러 없이 조용히 빈 화면만 나와서 더 늦게
발견됐습니다.

**After** — 기능 5의 원래 로직으로 복구
```js
export async function GET(request) {
    const { searchParams } = new URL(request.url)
    const symbol = searchParams.get('symbol')
    if (!symbol) return Response.json({ error: '종목 코드가 없습니다.' }, { status: 400 })
    const apiKey = process.env.FINNHUB_API_KEY

    const res = await fetch(
        `https://finnhub.io/api/v1/stock/recommendation?symbol=${symbol}&token=${apiKey}`,
        { cache: 'no-store' }
    )
    if (!res.ok) return Response.json({ error: 'API 호출 실패' }, { status: 500 })
    const data = await res.json()
    if (!data || !Array.isArray(data) || data.length === 0) {
        return Response.json({ error: '추천 데이터 없음' }, { status: 404 })
    }
    const first = data[0]
    return Response.json({
        symbol: symbol,
        buy: first.buy,
        hold: first.hold,
        sell: first.sell,
        strongBuy: first.strongBuy,
        strongSell: first.strongSell,
    })
}
```
두 API 라우트가 겉보기엔 구조(fetch → res.ok 체크 → json 파싱 → 검증)가 거의
똑같아서, 파일을 헷갈려 저장해도 문법 에러가 전혀 나지 않았습니다. 둘 다 정상적으로
실행되는 JS 코드였기 때문입니다. 이런 종류의 실수는 코드만 정적으로 읽는 리뷰로는
잡기 어렵고, 실제로 브라우저에서 그 기능을 켜서 화면에 기대한 값이 정말로 나오는지
눈으로 확인해야만 발견되었습니다. 그래서 매 기능이 끝날 때뿐 아니라, 프로젝트를
마무리하는 최종 통합 테스트 단계에서 모든 기능을 처음부터 다시 한번 실제로 눌러보며
검증하는 과정이 꼭 필요했습니다.
