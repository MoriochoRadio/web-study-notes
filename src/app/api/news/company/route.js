export async function GET(request) {
    const { searchParams } = new URL(request.url)
    const symbol = searchParams.get('symbol')
    if (!symbol) return Response.json({ error: '종목 코드가 없습니다.' }, { status: 400 })

    const apiKey = process.env.FINNHUB_API_KEY

    const to = new Date().toISOString().slice(0, 10)
    const from = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)

    const res = await fetch(
        `https://finnhub.io/api/v1/company-news?symbol=${symbol}&from=${from}&to=${to}&token=${apiKey}`,
        { cache: 'no-store' }
    )

    if (!res.ok) return Response.json({ error: 'API 호출 실패' }, { status: 500 })
    const data = await res.json()

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
