'use client'
import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import Skeleton from '@/components/Skeleton'
import EmptyState from '@/components/EmptyState'

export default function EarningsCard({ symbol }) {
    const [earnings, setEarnings] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!symbol) return

        setLoading(true)
        setError(null)
        fetch(`/api/earnings?symbol=${symbol}`)
            .then(res => {
                if (!res.ok) throw new Error('API 호출 실패')
                return res.json()
            })
            .then(data => {
                setEarnings(data)
                setLoading(false)
            })
            .catch(err => {
                setError(err.message)
                setLoading(false)
            })
    }, [symbol])

    if (!symbol) return <EmptyState icon="📅" message="종목을 선택하면 최근 실적(EPS)이 표시됩니다." className="h-full min-h-40" />
    if (loading) return <Skeleton variant="bars" className="h-60 w-full" />
    if (error) return (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-400">
            에러: {error}
        </div>
    )
    if (!earnings) return null

    const chartData = earnings.map((item) => ({
        quarter: `Q${item.quarter} ${item.year}`,
        estimate: item.estimate,
        actual: item.actual,
    }))

    return (
        <div className="animate-[fade-in-up_0.25s_ease-out] rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-stock-border dark:bg-stock-card">
            <h3 className="mb-3 text-sm font-bold tracking-tight text-stock-cyan">최근 실적 (EPS) — {symbol}</h3>

            <div
                role="img"
                aria-label={`${symbol} 분기별 EPS: ${chartData.map((d) => `${d.quarter} 예상 ${d.estimate}, 실제 ${d.actual}`).join(' / ')}`}
            >
                <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
                        <XAxis dataKey="quarter" tick={{ fontSize: 11, fill: 'var(--chart-tick)' }} />
                        <YAxis tick={{ fontSize: 11, fill: 'var(--chart-tick)' }} />
                        <Tooltip
                            cursor={{ fill: 'rgba(97,218,251,0.08)' }}
                            contentStyle={{ background: 'var(--chart-tooltip-bg)', border: '1px solid var(--chart-tooltip-border)', borderRadius: 8, fontSize: 12 }}
                            labelStyle={{ color: 'var(--chart-text)' }}
                            itemStyle={{ color: 'var(--chart-text)' }}
                        />
                        <Legend wrapperStyle={{ fontSize: 12, color: 'var(--chart-tick)' }} />
                        <Bar dataKey="estimate" fill="#8884d8" name="예상 EPS" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="actual" fill="#64ffda" name="실제 EPS" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
                {earnings.map((item) => (
                    <span key={item.period} className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-stock-muted">
                        Q{item.quarter} {item.year}
                        <span className={item.surprise > 0
                            ? 'rounded-full px-1.5 py-0.5 font-medium bg-green-100 text-green-700 dark:bg-stock-green/15 dark:text-stock-green'
                            : 'rounded-full px-1.5 py-0.5 font-medium bg-gray-100 text-gray-500 dark:bg-stock-border dark:text-stock-muted'}>
                            {item.surprise > 0 ? 'Surprise!' : 'Miss'}
                        </span>
                    </span>
                ))}
            </div>
        </div>
    )
}
