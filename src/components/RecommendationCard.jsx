'use client'
import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import Skeleton from '@/components/Skeleton'
import EmptyState from '@/components/EmptyState'

export default function RecommendationCard({ symbol }) {
    const [rec, setRec] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!symbol) return

        setLoading(true)
        setError(null)
        fetch(`/api/recommendation?symbol=${symbol}`)
            .then(res => {
                if (!res.ok) throw new Error('API 호출 실패')
                return res.json()
            })
            .then(data => {
                setRec(data)
                setLoading(false)
            })
            .catch(err => {
                setError(err.message)
                setLoading(false)
            })
    }, [symbol])

    if (!symbol) return <EmptyState icon="💬" message="종목을 선택하면 전문가 투자의견이 표시됩니다." className="h-full min-h-40" />
    if (loading) return <Skeleton variant="bars" className="h-40 w-full" />
    if (error) return (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-400">
            에러: {error}
        </div>
    )
    if (!rec) return null

    const chartData = [
        { name: rec.symbol, strongBuy: rec.strongBuy, buy: rec.buy, hold: rec.hold, sell: rec.sell, strongSell: rec.strongSell },
    ]

    return (
        <div className="animate-[fade-in-up_0.25s_ease-out] rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-stock-border dark:bg-stock-card">
            <h3 className="mb-3 text-sm font-bold tracking-tight text-stock-cyan">전문가 투자의견 ({rec.symbol})</h3>
            <div
                role="img"
                aria-label={`${rec.symbol} 투자의견: Strong Buy ${rec.strongBuy}건, Buy ${rec.buy}건, Hold ${rec.hold}건, Sell ${rec.sell}건, Strong Sell ${rec.strongSell}건`}
            >
                <ResponsiveContainer width="100%" height={110}>
                    <BarChart data={chartData} layout="vertical" margin={{ left: 20 }}>
                        <XAxis type="number" hide />
                        <YAxis type="category" dataKey="name" hide />
                        <Tooltip
                            cursor={{ fill: 'rgba(97,218,251,0.08)' }}
                            contentStyle={{ background: 'var(--chart-tooltip-bg)', border: '1px solid var(--chart-tooltip-border)', borderRadius: 8, fontSize: 12 }}
                            labelStyle={{ color: 'var(--chart-text)' }}
                            itemStyle={{ color: 'var(--chart-text)' }}
                        />
                        <Legend wrapperStyle={{ fontSize: 12, color: 'var(--chart-tick)' }} />
                        <Bar dataKey="strongBuy" stackId="a" fill="#0f9d58" name="Strong Buy" radius={[4, 0, 0, 4]} />
                        <Bar dataKey="buy" stackId="a" fill="#64ffda" name="Buy" />
                        <Bar dataKey="hold" stackId="a" fill="#f4b400" name="Hold" />
                        <Bar dataKey="sell" stackId="a" fill="#e94560" name="Sell" />
                        <Bar dataKey="strongSell" stackId="a" fill="#8b0000" name="Strong Sell" radius={[0, 4, 4, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}
