export async function GET() {
    const apiKey = process.env.FINNHUB_API_KEY

    const res = await fetch(`https://finnhub.io/api/v1/news?category=general&token=${apiKey}`, { cache: 'no-store' })

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
