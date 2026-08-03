// ═══════════════════════════════════════════════════════════════════
// 📄 /api/earnings — 어닝 서프라이즈(분기 실적) API (기능 6)
// ───────────────────────────────────────────────────────────────────
// 호출 예 : GET /api/earnings?symbol=NVDA
// 응답 예 : [ { actual:1.62, estimate:1.56, quarter:4, year:2026, surprise:0.06, ... }, ×4개 ]
// 쓰는 곳 : EarningsCard.jsx (예상 vs 실제 EPS 막대그래프 + Surprise!/Miss 뱃지)
// recommendation과의 차이: 거기선 data[0] 하나만 리턴했지만,
// 여기선 "4개 분기 비교"가 요구사항이라 배열 전체를 그대로 리턴한다.
// ═══════════════════════════════════════════════════════════════════
export async function GET(request) {
    // URL에서 symbol 꺼내기 + 없으면 400 — 다른 라우트들과 같은 패턴
    const { searchParams } = new URL(request.url)
    const symbol = searchParams.get('symbol')
    if (!symbol) return Response.json({ error: '종목 코드가 없습니다.' }, { status: 400 })

    const apiKey = process.env.FINNHUB_API_KEY

    // 엔드포인트: /stock/earnings, 파라미터: symbol + limit=4(최근 4개 분기만) + token
    // (recommendation route와 URL 구조가 똑같고 엔드포인트 이름과 limit만 다름)
    const res = await fetch(`https://finnhub.io/api/v1/stock/earnings?symbol=${symbol}&limit=4&token=${apiKey}`, { cache: 'no-store' })

    if (!res.ok) return Response.json({ error: 'API 호출 실패' }, { status: 500 })
    const data = await res.json()
    // 방어 코드: 없거나/배열 아니거나/비었으면 404
    if (!data || !Array.isArray(data) || data.length === 0) {
        return Response.json({ error: '실적 데이터 없음' }, { status: 404 })
    }

    // data는 이미 최근 4개 분기 배열입니다 (recommendation처럼 [0]만 꺼내는 게 아니라
    // 배열 전체를 그대로 클라이언트에 넘깁니다 — "4개 분기 비교"가 요구사항이니까요)
    // 각 항목: { actual(실제EPS), estimate(예상EPS), period, quarter, year,
    //           surprise(실제-예상 차이), surprisePercent, symbol }
    return Response.json(data)
}
