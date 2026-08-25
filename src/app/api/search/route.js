
export async function GET(request) {

    const { searchParams } = new URL(request.url)
    const q = searchParams.get('q')?.toLowerCase().trim() || ''
    if (!q) return Response.json({ results: [] })

    const apiKey = process.env.FINNHUB_API_KEY
    const APISTOCK = await fetch(
        `https://finnhub.io/api/v1/search?q=${q}&token=${apiKey}`,
        { cache: 'no-store' }
    )
    const data = await APISTOCK.json()

    const STOCKS = data.result

    let results = STOCKS
        .map((s) => ({ symbol: s.displaySymbol, name: s.description, type: s.type }))
        .slice(0, 5)

    if (q.includes('bit') || q.includes('btc')) {
        results = [{ symbol: 'BINANCE:BTCUSDT', name: 'Bitcoin / Tether (Binance)', type: 'Crypto' }, ...results].slice(0, 5)
    }

    return Response.json({ results })

}
