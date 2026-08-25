'use client'
import { useState, useEffect } from 'react'
import Skeleton from '@/components/Skeleton'

export default function NewsList({ mode, symbol }) {
    const [news, setNews] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (mode === 'company' && !symbol) return

        setLoading(true)
        setError(null)

        const url = mode === 'market' ? '/api/news/market' : `/api/news/company?symbol=${symbol}`

        fetch(url)
            .then(res => {
                if (!res.ok) throw new Error('API 호출 실패')
                return res.json()
            })
            .then(data => {
                setNews(data)
                setLoading(false)
            })
            .catch(err => {
                setError(err.message)
                setLoading(false)
            })
    }, [mode, symbol])

    if (loading) return <Skeleton variant="list" className="h-48 w-full" />
    if (error) return (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-400">
            에러: {error}
        </div>
    )
    if (!news || news.length === 0) return (
        <div className="rounded-xl border border-dashed border-gray-300 px-4 py-6 text-center text-sm text-gray-500 dark:border-stock-border dark:text-stock-muted">
            뉴스가 없습니다.
        </div>
    )

    return (
        <ul className="space-y-1">
            {news.map((item) => (
                <li key={item.id}>
                    <a href={item.url} target="_blank" rel="noopener noreferrer"
                        className="flex gap-3 rounded-xl p-2 transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stock-cyan/60 dark:hover:bg-stock-card">
                        <img src={item.image} alt="" className="h-16 w-16 flex-shrink-0 rounded-lg object-cover shadow-sm" />
                        <div className="min-w-0">
                            <p className="line-clamp-2 text-sm font-medium text-gray-900 hover:text-stock-cyan dark:text-stock-light">
                                {item.headline}
                            </p>
                            <p className="mt-1 text-xs text-gray-500 dark:text-stock-muted">
                                {item.source} • {new Date(item.datetime * 1000).toLocaleString()}
                            </p>
                        </div>
                    </a>
                </li>
            ))}
        </ul>
    )
}
