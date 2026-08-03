// ═══════════════════════════════════════════════════════════════════
// 📄 /api/news/market — 시장 전체 뉴스 API (기능 7-1)
// ───────────────────────────────────────────────────────────────────
// 호출 예 : GET /api/news/market   (파라미터 없음 — "시장 전체" 뉴스라서)
// 응답 예 : [ { id, headline, image, source, datetime, url }, ×10개 ]
// 쓰는 곳 : NewsList.jsx (mode="market")
// GET()에 request 인자가 없는 이유: 쿼리 파라미터를 읽을 일이 없어서 생략 가능
// ═══════════════════════════════════════════════════════════════════
export async function GET() {
    const apiKey = process.env.FINNHUB_API_KEY

    // market news 엔드포인트는 /news, 쿼리는 category=general 하나만 있으면 된다
    const res = await fetch(`https://finnhub.io/api/v1/news?category=general&token=${apiKey}`, { cache: 'no-store' })

    if (!res.ok) return Response.json({ error: 'API 호출 실패' }, { status: 500 })
    const data = await res.json()

    // 응답 개수가 아주 많을 수 있어서 최근 10개만 잘라(slice),
    // 필요한 필드만 골라내서(map) 응답 크기를 줄여 리턴.
    // datetime은 "초 단위" 유닉스 타임스탬프 그대로 넘긴다 → 화면 표시용 변환(×1000)은
    // NewsList.jsx가 담당 (서버는 데이터만, 표시 형식은 프론트가 — 역할 분리)
    const results = data.slice(0, 10).map((item) => ({
        id: item.id,
        headline: item.headline,
        image: item.image,
        source: item.source,
        datetime: item.datetime,
        url: item.url,
    }))

    return Response.json(results)
}
