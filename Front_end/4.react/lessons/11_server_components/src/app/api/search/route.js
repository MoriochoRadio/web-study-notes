// ── 검색 API Route (GET /api/search?q=...) ──
// [역할 설명]
// 클라이언트(프론트엔드)에서 검색어를 입력받아(예: ?q=apple),
// 서버 내부의 종목 DB(STOCKS)에서 종목명 또는 종목 코드가 일치하는 결과를 찾아 최대 5개까지 응답합니다.

const STOCKS = [
  { symbol: 'AAPL', name: 'Apple Inc.', exchange: 'NASDAQ' },
  { symbol: 'TSLA', name: 'Tesla Inc.', exchange: 'NASDAQ' },
  { symbol: 'MSFT', name: 'Microsoft Corp.', exchange: 'NASDAQ' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', exchange: 'NASDAQ' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', exchange: 'NASDAQ' },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', exchange: 'NASDAQ' },
  { symbol: 'META', name: 'Meta Platforms Inc.', exchange: 'NASDAQ' },
  { symbol: 'JPM', name: 'JPMorgan Chase & Co.', exchange: 'NYSE' },
  { symbol: 'V', name: 'Visa Inc.', exchange: 'NYSE' },
  { symbol: 'JNJ', name: 'Johnson & Johnson', exchange: 'NYSE' },
]

export async function GET(request) {
  // 📌 1) URL 쿼리 파라미터(?q=...) 읽어오기
  const { searchParams } = new URL(request.url)

  // 📌 2) ?q= 뒤의 검색어 추출 및 대소문자 구분 방지를 위한 소문자 변환
  const q = searchParams.get('q')?.toLowerCase() || ''

  // 📌 3) 조기 리턴 (Early Return): 검색어 q가 비어있다면 즉시 빈 배열 응답 후 종료
  if (!q) return Response.json({ results: [] })

  // 📌 4) 종목 코드(symbol) 또는 종목 이름(name)에 검색어 q가 포함된 항목 필터링 (최대 5개 제한)
  const results = STOCKS.filter(
    (s) => s.symbol.toLowerCase().includes(q) || s.name.toLowerCase().includes(q)
  ).slice(0, 5)

  // 📌 5) 검색 결과 JSON 응답
  return Response.json({ results })
}
