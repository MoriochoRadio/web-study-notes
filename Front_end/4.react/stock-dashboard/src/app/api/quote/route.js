// ═══════════════════════════════════════════════════════════════════
// 📄 /api/quote — 종목 하나의 현재 시세 API (기능 2)
// ───────────────────────────────────────────────────────────────────
// 호출 예 : GET /api/quote?symbol=AAPL
// 응답 예 : { symbol:'AAPL', price:200.75, change:5.71, changePercent:2.93,
//            high:202, low:194.95, prevClose:195.04 }
// 쓰는 곳 : useStockData.js (→ StockQuoteCard.jsx)
// ⚠️ 이 응답 shape(필드 이름들)을 바꾸면 useStockData/StockQuoteCard가 전부 깨진다!
// ═══════════════════════════════════════════════════════════════════
export async function GET(request) {
    // ① 기능 1에서 했던 것과 똑같이: URL에서 쿼리값 꺼내기
    //    이번엔 q가 아니라 "symbol"이라는 이름으로 받는다 (예: /api/quote?symbol=AAPL)
    const { searchParams } = new URL(request.url)
    const symbol = searchParams.get('symbol') // ?. 나 || '' 는 이번엔 필요 없음 — symbol이 없으면 그냥 에러로 처리할 거라서

    // ② symbol이 없으면 바로 에러 응답.
    //    { status: 400 } = "요청이 잘못됐다"는 HTTP 상태코드.
    //    프론트(useStockData)는 res.ok가 false가 되어 이 error 문구를 throw해서 쓴다.
    if (!symbol) return Response.json({ error: '종목 코드가 없습니다.' }, { status: 400 })

    // ③ API 키 꺼내기 — 기능 1과 완전히 동일 (서버 전용이라 브라우저에 노출 안 됨)
    const apiKey = process.env.FINNHUB_API_KEY

    // ④ Finnhub "Quote" 엔드포인트 호출
    //    형태: https://finnhub.io/api/v1/quote?symbol=AAPL&token=키
    const res = await fetch(
        `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`,
        { cache: 'no-store' }
    )

    // ⑤ Response 껍데기를 진짜 데이터(json)로 바꾸기
    const data = await res.json()

    // Finnhub 무료 플랜은 일부 해외 종목의 실시간 시세를 지원하지 않는다.
    // 그런 경우 c(현재가)가 숫자가 아니거나 0/null로 오므로, 여기서 걸러서
    // 404(찾을 수 없음)로 응답 → 카드에 "지원하지 않는 종목" 에러 박스가 뜬다.
    if (typeof data.c !== 'number') {
        return Response.json({ error: '이 종목은 실시간 시세를 지원하지 않습니다.' }, { status: 404 })
    }

    // ⑥ Finnhub Quote 응답은 배열이 아니라 객체 하나임 (검색 API와 다른 점!)
    //    실제 필드명이 c/d/dp처럼 암호 같아서, 우리 프로젝트에서 쓰기 편한
    //    이름(price/change/...)으로 "번역"해서 리턴한다 (map이 아니라 그냥 객체 하나 만들기)
    const result = {
        symbol,
        price: data.c,     // c  = current (현재가)
        change: data.d,    // d  = delta (전일 대비 변동액)
        changePercent: data.dp, // dp = delta percent (변동률 %)
        high: data.h,      // h  = high (오늘 고가)
        low: data.l,       // l  = low (오늘 저가)
        prevClose: data.pc, // pc = previous close (전일 종가)
    }

    return Response.json(result)
}
