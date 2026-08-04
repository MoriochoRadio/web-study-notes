// ═══════════════════════════════════════════════════════════════════
// 📄 /api/search — 종목 검색 API (기능 1)
// ───────────────────────────────────────────────────────────────────
// 호출 예 : GET /api/search?q=apple
// 응답 예 : { results: [ { symbol:'AAPL', name:'APPLE INC', type:'Common Stock' }, ... ] }
// 쓰는 곳 : StockSearch.jsx
//
// 💡 왜 브라우저가 Finnhub를 직접 안 부르고 이 라우트를 거치나?
//    API 키(FINNHUB_API_KEY)를 브라우저에 노출하지 않기 위해서다.
//    이 파일은 서버에서만 실행되므로 키가 사용자에게 절대 보이지 않는다.
// ═══════════════════════════════════════════════════════════════════

// Next.js 규칙: app/api/.../route.js 안에서 GET 이라는 이름의 함수를 export하면
// 그 주소로 오는 GET 요청을 이 함수가 처리한다. request에는 요청 정보가 담겨 있다.
export async function GET(request) {


    ///// request 의 url 받아서 검색쿼리(q)를 추출하는 부분 /////
    // request.url은 "http://localhost:3000/api/search?q=AAPL" 같은 통문자열이라
    // new URL()로 감싸면 searchParams(쿼리 파라미터 도구)를 꺼내 쓸 수 있다.
    const { searchParams } = new URL(request.url)
    //url은 /api/search?q=AAPL 형태임
    const q = searchParams.get('q')?.toLowerCase().trim() || ''
    //?. 은 정상값이면 toLowerCase() 실행 / 만약 q가 없으면 에러 대신 undefined 리턴하고 뒤에 || ''이 실행됨
    if (!q) return Response.json({ results: [] }) //q없으면 걍 반환시킴 (빈 검색어에 API 호출 낭비 방지)

    ///// 이제 서버에서 q값 가져와야함. /////
    // process.env : .env.local 파일의 환경변수를 읽는 통로 (서버 전용)
    const apiKey = process.env.FINNHUB_API_KEY
    // cache: 'no-store' → Next.js가 응답을 캐시하지 않고 매번 새로 요청 (시세류는 항상 최신이어야 하니까)
    const APISTOCK = await fetch(
        `https://finnhub.io/api/v1/search?q=${q}&token=${apiKey}`,
        { cache: 'no-store' }
    ) //아직 json으로 안바꿨음 — fetch가 주는 건 Response 껍데기
    const data = await APISTOCK.json() //json으로 바꿔도 아직 배열이 아님 — { count, result: [...] } 형태의 객체

    const STOCKS = data.result //result 속의 진짜 배열을 꺼냄

    // Finnhub의 필드명(displaySymbol/description)을 우리 앱에서 쓰기 쉬운
    // 이름(symbol/name)으로 바꾸고(map), 5개만 잘라서(slice) 응답 크기를 줄인다.
    // ⚠️ 이 { symbol, name, type } 모양(응답 shape)을 바꾸면 StockSearch.jsx가 깨짐!
    let results = STOCKS
        .map((s) => ({ symbol: s.displaySymbol, name: s.description, type: s.type }))
        .slice(0, 5) //이름만 나중에 쉽게 쓰려고 바꾸고, 5개 잘라서 리턴

    // Finnhub 주식 검색 API에는 코인이 안 걸림 — 미국장이 닫혀있어도 실시간으로
    // 움직이는 모습을 보여주려고 "bit"/"btc" 검색어일 때만 직접 하나 끼워 넣는다
    if (q.includes('bit') || q.includes('btc')) {
        results = [{ symbol: 'BINANCE:BTCUSDT', name: 'Bitcoin / Tether (Binance)', type: 'Crypto' }, ...results].slice(0, 5)
    }

    return Response.json({ results })



}
