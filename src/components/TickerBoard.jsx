'use client'
import { useLiveTicker, MAJOR_SYMBOLS } from '@/hooks/useLiveTicker'

export default function TickerBoard({ selectedSymbol }) {
    const { prices, flashes } = useLiveTicker(MAJOR_SYMBOLS)

    const renderItem = (sym, keySuffix, isDuplicate) => {
        const flash = flashes[sym]
        const isSelected = sym === selectedSymbol
        return (
            <div
                key={`${sym}-${keySuffix}`}
                aria-hidden={isDuplicate || undefined}
                className={`flex items-center gap-2 whitespace-nowrap rounded-full border px-3 py-1.5 text-sm shadow-sm transition-colors duration-300
                    ${isSelected ? 'border-stock-cyan bg-stock-cyan/10' : 'border-gray-200 bg-white dark:border-stock-border dark:bg-stock-card'}
                    ${flash === 'up' ? 'border-stock-green/60 bg-stock-green/20 text-stock-green' : ''}
                    ${flash === 'down' ? 'border-stock-red/60 bg-stock-red/20 text-stock-red' : ''}`}
            >
                <strong className="text-stock-cyan">{sym}</strong>
                <span className={`font-mono tabular-nums ${prices[sym] ? '' : 'text-xs text-gray-400 dark:text-stock-muted'}`}>
                    {prices[sym] ? `$${prices[sym].toFixed(2)}` : '대기중...'}
                </span>
            </div>
        )
    }

    return (
        <div
            role="region"
            aria-label="실시간 주요 종목 시세"
            className="group overflow-hidden rounded-xl border border-gray-200 bg-gray-50 dark:border-stock-border dark:bg-stock-bg"
        >
            <div className="flex w-max gap-3 p-3 [animation:ticker-scroll_20s_linear_infinite] group-hover:[animation-play-state:paused]">
                {[...MAJOR_SYMBOLS, ...MAJOR_SYMBOLS].map((sym, i) => renderItem(sym, i, i >= MAJOR_SYMBOLS.length))}
            </div>
        </div>
    )
}
