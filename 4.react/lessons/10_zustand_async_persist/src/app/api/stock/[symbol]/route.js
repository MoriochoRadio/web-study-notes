// ── 종목 시세 조회 API Route (GET /api/stock/[symbol]) ──
// [역할 설명]
// 1. 프론트엔드(Zustand 스토어의 fetchPrice)에서 요청이 들어오면 실행되는 백엔드 API입니다.
// 2. 동적 라우트 [symbol] 경로에서 종목 코드를 꺼냅니다 (예: AAPL, TSLA).
// 3. 프로젝트 루트의 환경변수(.env.local)에 API 키가 있다면 실제 Finnhub 증권 API를 호출하고,
//    없다면 서비스가 멈추지 않도록 가짜(더미) 시세 데이터를 생성하여 반환합니다.

export async function GET(request, { params }) {
  // 📌 1) URL 경로 파라미터 [symbol] 꺼내기
  // Next.js 15부터 params는 비동기(Promise) 객체이므로 await params로 꺼내야 합니다.
  const { symbol } = await params

  // 📌 2) 프로젝트 루트의 .env.local 파일에서 보안 API 키 읽기
  const apiKey = process.env.FINNHUB_API_KEY

  // 📌 3) API 키가 없을 때 (더미 시세 데이터 반환)
  if (!apiKey) {
    return Response.json({
      symbol: symbol.toUpperCase(),
      price: parseFloat((Math.random() * 50 + 150).toFixed(2)),
      change: parseFloat((Math.random() * 4 - 2).toFixed(2)),
      changePercent: parseFloat((Math.random() * 2 - 1).toFixed(2)),
      timestamp: Date.now(),
      source: 'dummy', // 출처: 더미 데이터
    })
  }

  // 📌 4) API 키가 있을 때 (실제 Finnhub 증권 API 서버와 백엔드끼리 통신)
  try {
    const res = await fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`, {
      cache: 'no-store', // 최신 시세를 얻기 위해 백엔드 fetch 캐시 사용 금지
    })
    if (!res.ok) throw new Error(`API 호출 실패 (status ${res.status})`)

    const data = await res.json()
    console.log(`Finnhub API 데이터 - ${symbol}:`, data) // Node.js 터미널 출력 로그

    // Finnhub API 원본 데이터에서 필요한 값만 정돈하여 프론트엔드 클라이언트에 응답
    return Response.json({
      symbol: symbol.toUpperCase(),
      price: data.c,          // c: Current price (현재가)
      change: data.d,         // d: Change (변동금액)
      changePercent: data.dp, // dp: Change percent (변동률)
      timestamp: Date.now(),
      source: 'finnhub',      // 출처: Finnhub API
    })
  } catch (err) {
    // 에러 발생 시 500 상태코드와 함께 에러 메시지 반환
    return Response.json({ error: err.message }, { status: 500 })
  }
}
