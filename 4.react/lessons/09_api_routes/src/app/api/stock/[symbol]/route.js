// ── STEP 2: 동적 API Route (GET /api/stock/[symbol]) ──
// [역할 설명]
// [symbol] 처럼 폴더명에 대괄호가 들어간 것을 "동적 라우트(Dynamic Route)"라고 합니다.
// 주소가 /api/stock/AAPL, /api/stock/NVDA 처럼 가변적으로 들어올 때 처리합니다.

//경로구조: /api/stock/[symbol]/[date]
//-> /api/stock/MSFT/2026-07-30
//경로구조: /api/stock/[...symbol]
//-> /api/stock/MSFT/2026-07-30/2026-07-29/2026-07-28

export async function GET(request, { params }) {
    // 📌 1) 동적 경로 파라미터 symbol 꺼내기
    // Next.js 15 버전부터는 params가 비동기(Promise) 객체이므로 await params로 꺼내야 합니다.
    const { symbol } = await params

    // 📌 2) 환경변수(.env.local)에 등록된 보안 API 키 읽기
    // .env.local -> 환경설정파일 -> process.env -> 알아서 환경파일을 찾는다.
    const apiKey = process.env.FINNHUB_API_KEY

    // 📌 3) API 키가 없을 때 (더미 시세 데이터 반환)
    // Finnhub API 키가 등록되어 있지 않은 상태에서도 앱이 동작하도록 시뮬레이션 데이터를 제공합니다.
    if (!apiKey) {
        const price = parseFloat((150 + Math.random() * 50).toFixed(2))
        const change = parseFloat((Math.random() * 6 - 3).toFixed(2))
        return Response.json({
            symbol: symbol.toUpperCase(),
            price,
            change,
            timestamp: Date.now(),
            source: 'dummy' // 출처: 더미 데이터
        })
    }

    // 📌 4) API 키가 있을 때 (실제 Finnhub 증권 API 서버와 통신)
    try {
        const res = await fetch(
            `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`,
            { cache: 'no-store' } // 최신 시세를 얻기 위해 캐시를 사용하지 않음
        )
        if (!res.ok) throw new Error(`API 호출 실패 (status ${res.status})`)
        const data = await res.json()

        return Response.json({
            symbol: symbol.toUpperCase(),
            price: data.c,        // c: Current price (현재가)
            change: data.d,       // d: Change (변동금액)
            changePercent: data.dp, // dp: Change percent (변동률)
            timestamp: Date.now(),
            source: 'finnhub'     // 출처: Finnhub API
        })
    } catch (err) {
        return Response.json({ error: err.message }, { status: 500 })
    }
}
