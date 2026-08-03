// ═══════════════════════════════════════════════════════════════════
// 📄 /api/recommendation — 전문가 투자의견 API (기능 5)
// ───────────────────────────────────────────────────────────────────
// 호출 예 : GET /api/recommendation?symbol=NVDA
// 응답 예 : { symbol:'NVDA', buy:30, hold:5, sell:1, strongBuy:40, strongSell:0 }
// 쓰는 곳 : RecommendationCard.jsx (누적 막대그래프)
// 포인트 : Finnhub는 "월별 이력 배열"을 주지만, 카드에는 최신 1건만 필요해서
//          data[0]만 꺼내 단일 객체로 리턴한다. (⚠️ 이 shape을 바꾸면 카드가 깨짐 —
//          실제로 이 파일이 earnings 코드로 덮어써져 카드가 빈 화면이 됐던 사고가
//          CODE_REVIEW.md 사례 11에 기록되어 있다)
// ═══════════════════════════════════════════════════════════════════
export async function GET(request) {
    // URL에서 symbol 꺼내기 + 없으면 400 에러 — quote route와 같은 패턴
    const { searchParams } = new URL(request.url)
    const symbol = searchParams.get('symbol')
    if (!symbol) return Response.json({ error: '종목 코드가 없습니다.' }, { status: 400 })

    const apiKey = process.env.FINNHUB_API_KEY

    // ① 기능 2 route.js와 똑같은 패턴: fetch → res.ok 체크 → json 파싱
    const res = await fetch(`https://finnhub.io/api/v1/stock/recommendation?symbol=${symbol}&token=${apiKey}`, { cache: 'no-store' })
    if (!res.ok) return Response.json({ error: 'API 호출 실패' }, { status: 500 })
    const data = await res.json()
    // 방어 코드 3중 체크: 값이 없거나 / 배열이 아니거나 / 빈 배열이면 404.
    // 외부 API는 언제든 예상 밖의 응답을 줄 수 있어서 이렇게 걸러야 안전하다.
    if (!data || !Array.isArray(data) || data.length === 0) return Response.json({ error: '추천 데이터 없음' }, { status: 404 })

    // Finnhub 응답은 [최신월, 이전월, ...] 순서의 배열 → 최신 1건만 사용
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
