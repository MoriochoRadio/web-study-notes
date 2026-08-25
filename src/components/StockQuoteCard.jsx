'use client'
import { useStockData } from '@/hooks/useStockData'
import { useWatchlistStore } from '@/store/useWatchlistStore'
import Skeleton from '@/components/Skeleton'
import EmptyState from '@/components/EmptyState'

export default function StockQuoteCard({ symbol }) {
    const { data, loading, error } = useStockData(symbol)
    const { addSymbol, removeSymbol, isWatched } = useWatchlistStore()

    if (!symbol) return <EmptyState icon="🔍" message="종목을 검색하거나 관심 종목에서 선택하면 시세가 표시됩니다." className="h-full min-h-40" />
    if (loading) return <Skeleton variant="quote" />

    if (error) return <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm
           text-red-600 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-400">에러발생: {error}</div>
    if (!data) return null

    const watched = isWatched(data.symbol)
    const isUp = data.change >= 0

    return (
        <div className="animate-[fade-in-up_0.25s_ease-out] rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-stock-border dark:bg-stock-card">
            <div className="flex items-start justify-between">
                <div>
                    <h3 className="text-lg font-bold tracking-tight text-gray-900 dark:text-stock-light">{data.symbol}</h3>
                    <button
                        onClick={() => watched ? removeSymbol(data.symbol) : addSymbol(data.symbol)}
                        aria-label={watched ? '관심 종목에서 제거' : '관심 종목에 추가'}
                        className="mt-1 rounded text-lg text-yellow-400 transition-transform hover:scale-110 hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stock-cyan/60"
                    >
                        {watched ? '★' : '☆'}
                    </button>
                </div>

                <div className="text-right">
                    <div className="font-mono text-3xl font-bold tabular-nums tracking-tight text-gray-900 dark:text-stock-light">
                        ${data.price.toFixed(2)}
                    </div>

                    <div className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-mono text-sm font-semibold tabular-nums
                        ${isUp ? 'bg-stock-green/10 text-stock-green' : 'bg-stock-red/10 text-stock-red'}`}>
                        <span>{isUp ? '▲' : '▼'}</span>
                        {isUp ? '+' : ''}${data.change.toFixed(2)} ({data.changePercent.toFixed(2)}%)
                    </div>
                </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2 border-t border-gray-100 pt-3 text-center dark:border-stock-border/60">
                <div>
                    <div className="text-[11px] uppercase tracking-wide text-gray-500 dark:text-stock-muted">고가</div>
                    <div className="font-mono text-sm font-medium tabular-nums text-gray-700 dark:text-stock-light">${data.high}</div>
                </div>
                <div>
                    <div className="text-[11px] uppercase tracking-wide text-gray-500 dark:text-stock-muted">저가</div>
                    <div className="font-mono text-sm font-medium tabular-nums text-gray-700 dark:text-stock-light">${data.low}</div>
                </div>
                <div>
                    <div className="text-[11px] uppercase tracking-wide text-gray-500 dark:text-stock-muted">전일종가</div>
                    <div className="font-mono text-sm font-medium tabular-nums text-gray-700 dark:text-stock-light">${data.prevClose}</div>
                </div>
            </div>
        </div>
    )
}
