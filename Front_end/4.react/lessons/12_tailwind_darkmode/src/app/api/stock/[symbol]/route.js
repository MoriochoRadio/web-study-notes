// 09강과 동일 — 종목 시세 API (GET /api/stock/[symbol]). 스토어의 fetchPrice가 호출한다.
export async function GET(request, { params }) {
  const { symbol } = await params
  const apiKey = process.env.FINNHUB_API_KEY

  if (!apiKey) {
    return Response.json({
      symbol,
      price: parseFloat((Math.random() * 50 + 150).toFixed(2)),
      change: parseFloat((Math.random() * 4 - 2).toFixed(2)),
      changePercent: parseFloat((Math.random() * 2 - 1).toFixed(2)),
      timestamp: Date.now(),
      source: 'dummy',
    })
  }

  try {
    const res = await fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`, { cache: 'no-store' })
    if (!res.ok) throw new Error(`API 호출 실패 (status ${res.status})`)
    const data = await res.json()
    return Response.json({
      symbol, price: data.c, change: data.d, changePercent: data.dp, timestamp: Date.now(), source: 'finnhub',
    })
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}
