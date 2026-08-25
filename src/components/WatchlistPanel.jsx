'use client'
import { useWatchlistStore } from '@/store/useWatchlistStore'

export default function WatchlistPanel({ onSelect, selectedSymbol }) {
    const { watchlist, removeSymbol } = useWatchlistStore()

    if (watchlist.length === 0) {
        return (
            <p className="rounded-xl border border-dashed border-gray-300 px-4 py-3 text-sm text-gray-500 dark:border-stock-border dark:text-stock-muted">
                관심 종목이 없습니다. 카드에서 ★ 버튼을 눌러 추가해보세요.
            </p>
        )
    }

    return (
        <div className="flex flex-wrap gap-2">
            {watchlist.map((symbol) => {
                const isSelected = symbol === selectedSymbol
                return (
                    <div
                        key={symbol}
                        className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm shadow-sm transition-colors
                            ${isSelected
                                ? 'border-stock-cyan bg-stock-cyan/10'
                                : 'border-gray-200 bg-white hover:border-stock-cyan/40 dark:border-stock-border dark:bg-stock-card dark:hover:border-stock-cyan/40'}`}
                    >
                        <button
                            onClick={() => onSelect(symbol)}
                            aria-pressed={isSelected}
                            className={`rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stock-cyan/60
                                ${isSelected ? 'font-semibold text-stock-cyan' : 'text-gray-700 dark:text-stock-light'}`}
                        >
                            {symbol}
                        </button>
                        <button
                            onClick={() => removeSymbol(symbol)}
                            aria-label={`${symbol} 관심 종목에서 제거`}
                            className="flex h-6 w-6 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-stock-red/10 hover:text-stock-red focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stock-red/60"
                        >
                            ×
                        </button>
                    </div>
                )
            })}
        </div>
    )
}
