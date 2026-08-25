export async function GET(request) {
    const { searchParams } = new URL(request.url)
    const symbol = searchParams.get('symbol')
    if (!symbol) return Response.json({ error: '종목 코드가 없습니다.' }, { status: 400 })

    const apiKey = process.env.FINNHUB_API_KEY

    const res = await fetch(`https://finnhub.io/api/v1/stock/earnings?symbol=${symbol}&limit=4&token=${apiKey}`, { cache: 'no-store' })

    if (!res.ok) return Response.json({ error: 'API 호출 실패' }, { status: 500 })
    const data = await res.json()
    if (!data || !Array.isArray(data) || data.length === 0) {
        return Response.json({ error: '실적 데이터 없음' }, { status: 404 })
    }

    return Response.json(data)
}
