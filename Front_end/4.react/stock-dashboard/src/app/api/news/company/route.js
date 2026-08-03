// ═══════════════════════════════════════════════════════════════════
// 📄 /api/news/company — 특정 기업 뉴스 API (기능 7-2)
// ───────────────────────────────────────────────────────────────────
// 호출 예 : GET /api/news/company?symbol=NVDA
// 응답 예 : [ { id, headline, image, source, datetime, url }, ×10개 ] (market과 동일 shape)
// 쓰는 곳 : NewsList.jsx (mode="company") — 응답 모양이 market과 같아서
//           NewsList 컴포넌트 하나로 두 API를 다 처리할 수 있다 (재사용의 핵심!)
// market과의 차이: symbol 필수 + from/to 날짜 범위(최근 7일)가 추가로 필요
// ═══════════════════════════════════════════════════════════════════
export async function GET(request) {
    const { searchParams } = new URL(request.url)
    const symbol = searchParams.get('symbol')
    if (!symbol) return Response.json({ error: '종목 코드가 없습니다.' }, { status: 400 })

    const apiKey = process.env.FINNHUB_API_KEY

    // company news는 from/to 날짜 범위가 "YYYY-MM-DD" 형식으로 꼭 필요하다.
    // to   = 오늘: new Date() → toISOString() → "2026-08-02T05:12:...Z" → slice(0,10) → "2026-08-02"
    // from = 7일 전: Date.now()(밀리초) - 7일치 밀리초(7×24시간×60분×60초×1000)
    const to = new Date().toISOString().slice(0, 10)
    const from = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)

    const res = await fetch(
        `https://finnhub.io/api/v1/company-news?symbol=${symbol}&from=${from}&to=${to}&token=${apiKey}`,
        { cache: 'no-store' }
    )

    if (!res.ok) return Response.json({ error: 'API 호출 실패' }, { status: 500 })
    const data = await res.json()

    // market route와 동일: 10개만 잘라 필요한 필드만 리턴 (shape 통일이 재사용의 열쇠)
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
