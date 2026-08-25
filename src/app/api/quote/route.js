export async function GET(request) {
    const { searchParams } = new URL(request.url)
    const symbol = searchParams.get('symbol')

    if (!symbol) return Response.json({ error: '종목 코드가 없습니다.' }, { status: 400 })

    const apiKey = process.env.FINNHUB_API_KEY

    const res = await fetch(
        `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`,
        { cache: 'no-store' }
    )

    const data = await res.json()

    if (typeof data.c !== 'number') {
        return Response.json({ error: '이 종목은 실시간 시세를 지원하지 않습니다.' }, { status: 404 })
    }

    const result = {
        symbol,
        price: data.c,
        change: data.d,
        changePercent: data.dp,
        high: data.h,
        low: data.l,
        prevClose: data.pc,
    }

    return Response.json(result)
}
