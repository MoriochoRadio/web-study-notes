import { isUSMarketOpen } from '@/lib/market'

function generateDummyData(symbol) {
    const now = Date.now()
    const oneMin = 60 * 1000
    const base = symbol === 'AAPL' ? 182 : symbol === 'TSLA' ? 250 : symbol === 'NVDA' ? 130
        : symbol.includes('BTC') ? 65000 : 150
    return Array.from({ length: 60 }, (_, i) => {
        const t = now - (59 - i) * oneMin
        const noise = (Math.random() - 0.5) * 3
        return {
            time: new Date(t).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
            price: parseFloat((base + noise + i * 0.05).toFixed(2)),
        }
    })
}

export async function GET(request, { params }) {
    const { symbol } = await params
    const apiKey = process.env.FINNHUB_API_KEY

    const isCrypto = symbol.includes(':')

    if (!apiKey || (!isCrypto && !isUSMarketOpen())) {
        return Response.json({ symbol, data: generateDummyData(symbol) })
    }

    try {
        const res = await fetch(
            `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`,
            { cache: 'no-store' }
        )

        if (!res.ok) throw new Error(`quote 실패 (${res.status})`)

        const data = await res.json()

        if (typeof data.c !== 'number') throw new Error('quote 없음')

        const point = {
            time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            price: parseFloat(data.c.toFixed(2)),
        }

        return Response.json({ symbol, data: [point] })

    } catch (err) {
        return Response.json({ symbol, data: generateDummyData(symbol) })
    }
}
