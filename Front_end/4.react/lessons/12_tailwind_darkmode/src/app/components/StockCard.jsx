// ── STEP 4a: 관심종목 개별 카드 (Tailwind) ──
// 개념 정리
//  - 인라인 style 대신 Tailwind 유틸리티 클래스로 스타일링.
//  - dark: 변형으로 라이트/다크를 함께 대응 (예: bg-white dark:bg-stock-card).
//  - 라이트 모드 가독성을 위해 글자색을 라이트/다크로 분리(text-gray-900 dark:text-stock-light).
'use client'
import useStockStore from '@/app/store/useStockStore'

export default function StockCard({ symbol }) {
  const price = useStockStore((s) => s.prices[symbol])
  const selectedSymbol = useStockStore((s) => s.selectedSymbol)
  const selectSymbol = useStockStore((s) => s.selectSymbol)
  const removeFromWatchlist = useStockStore((s) => s.removeFromWatchlist)
  const buyStock = useStockStore((s) => s.buyStock)

  const isSelected = selectedSymbol === symbol

  return (
    <div
      onClick={() => selectSymbol(symbol)}
      className={`rounded-xl border p-3 cursor-pointer transition-colors
        bg-white dark:bg-stock-card
        ${isSelected ? 'border-stock-cyan' : 'border-gray-200 dark:border-stock-border hover:border-stock-cyan/50'}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <strong className="font-mono text-gray-900 dark:text-stock-light">{symbol}</strong>
          <div className="text-xs text-gray-500 dark:text-stock-muted">
            {price ? `$${price.toFixed(2)}` : '로딩 중...'}
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation()
            removeFromWatchlist(symbol)
          }}
          className="text-stock-red hover:opacity-70 text-sm"
        >
          ✕
        </button>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation()
          if (price) buyStock(symbol, 1, price)
        }}
        disabled={!price}
        className="mt-2 w-full py-1 text-xs rounded-lg border border-stock-cyan/40 text-stock-cyan
                   bg-stock-cyan/10 hover:bg-stock-cyan/20 transition-colors disabled:opacity-40"
      >
        ＋1주 매수
      </button>
    </div>
  )
}
