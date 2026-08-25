'use client'
import { useState, useEffect } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import Skeleton from '@/components/Skeleton'
import EmptyState from '@/components/EmptyState'

function CustomTooltip({ active, payload, label }) {
    if (!active || !payload || !payload.length) return null

    return (
        <div style={{ background: 'var(--chart-tooltip-bg)', border: '1px solid var(--chart-tooltip-border)', borderRadius: 8, padding: '8px 12px', fontSize: 13, color: 'var(--chart-text)' }}>
            <p>{label}</p>
            <p className="font-mono font-semibold text-stock-green">${payload[0].value.toFixed(2)}</p>
        </div>
    )
}
export default function StockChart({ symbol }) {
    const [chartData, setChartData] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (!symbol) return

        setIsLoading(true)
        setChartData([])
        fetch(`/api/stock/${symbol}/chart`)
            .then(res => res.json())
            .then(({ data }) => { setChartData(data); setIsLoading(false) })
            .catch(err => { console.error(err); setIsLoading(false) })
    }, [symbol])

    useEffect(() => {
        if (!symbol || isLoading) return

        const token = process.env.NEXT_PUBLIC_FINNHUB_API_KEY
        const ws = new WebSocket(`wss://ws.finnhub.io?token=${token}`)

        ws.onopen = () => {
            ws.send(JSON.stringify({ type: 'subscribe', symbol: symbol }))
        }

        ws.onmessage = (event) => {
            const msg = JSON.parse(event.data)
            if (msg.type !== 'trade' || !msg.data?.length) return

            const newPrice = msg.data[msg.data.length - 1].p
            const point = {
                time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
                price: parseFloat(newPrice.toFixed(2)),
            }

            setChartData((prev) => [...prev.slice(-59), point])
        }

        ws.onerror = (err) => console.log('websocket 오류:', err)

        return () => {
            if (ws.readyState === WebSocket.OPEN)
                ws.send(JSON.stringify({ type: 'unsubscribe', symbol: symbol }))
            ws.close()
        }
    }, [symbol, isLoading])

    if (!symbol) return <EmptyState icon="📈" message="종목을 선택하면 실시간 가격 추이 차트가 표시됩니다." className="h-64" />
    if (isLoading) return <Skeleton variant="chart" className="h-64 w-full" />

    return (
        <div className="animate-[fade-in-up_0.25s_ease-out] rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-stock-border dark:bg-stock-card">
            <h3 className="mb-2 text-sm font-bold tracking-tight text-stock-cyan">실시간 가격 추이 — {symbol}</h3>
            <div role="img" aria-label={`${symbol} 실시간 가격 추이 차트`}>
                <ResponsiveContainer width="100%" height={240}>
                    <AreaChart data={chartData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="stockChartFill" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#64ffda" stopOpacity={0.35} />
                                <stop offset="100%" stopColor="#64ffda" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} />
                        <XAxis dataKey="time" tick={{ fontSize: 10, fill: 'var(--chart-tick)' }} interval="preserveStartEnd" />
                        <YAxis domain={['auto', 'auto']} tick={{ fontSize: 10, fill: 'var(--chart-tick)' }} tickFormatter={(v) => `$${v.toFixed(0)}`} />
                        <Tooltip content={<CustomTooltip />} />
                        <Area type="monotone" dataKey="price" stroke="#64ffda" strokeWidth={2} fill="url(#stockChartFill)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}
