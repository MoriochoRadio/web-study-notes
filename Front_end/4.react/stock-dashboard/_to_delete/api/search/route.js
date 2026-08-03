// ── 기능 1: 스마트 주식 검색 (GET /api/search?q=...) ──
// Finnhub Symbol Search API를 서버 사이드에서만 호출해 API Key가 브라우저에 노출되지
// 않도록 하는 프록시(BFF) 라우트. FINNHUB_API_KEY가 없는 환경(.env.local 미설정)에서도
// 대시보드를 확인할 수 있도록, 그럴 땐 대표 종목 몇 개로만 필터링한 더미 목록을 반환한다.
const DUMMY_STOCKS = [
  { symbol: 'AAPL', name: 'Apple Inc.', type: 'Common Stock' },
  { symbol: 'TSLA', name: 'Tesla Inc.', type: 'Common Stock' },
  { symbol: 'MSFT', name: 'Microsoft Corp.', type: 'Common Stock' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', type: 'Common Stock' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', type: 'Common Stock' },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', type: 'Common Stock' },
  { symbol: 'META', name: 'Meta Platforms Inc.', type: 'Common Stock' },
  { symbol: 'JPM', name: 'JPMorgan Chase & Co.', type: 'Common Stock' },
]

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q')?.trim() || ''
  if (!q) return Response.json({ results: [] })

  const apiKey = process.env.FINNHUB_API_KEY

  if (!apiKey) {
    const lower = q.toLowerCase()
    const results = DUMMY_STOCKS.filter(
      (s) => s.symbol.toLowerCase().includes(lower) || s.name.toLowerCase().includes(lower)
    ).slice(0, 8)
    return Response.json({ results, source: 'dummy' })
  }

  try {
    const res = await fetch(
      `https://finnhub.io/api/v1/search?q=${encodeURIComponent(q)}&token=${apiKey}`,
      { cache: 'no-store' }
    )
    if (!res.ok) throw new Error(`Finnhub API 호출 실패 (status ${res.status})`)
    const data = await res.json()
    const results = (data.result || [])
      .slice(0, 8)
      .map((r) => ({ symbol: r.displaySymbol, name: r.description, type: r.type }))
    return Response.json({ results, source: 'finnhub' })
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}
