// ── STEP 4d: 포트폴리오 (Tailwind) ──
// 10강 로직 그대로, 스타일만 Tailwind + dark: 변형.
'use client'
import useStockStore from '@/app/store/useStockStore'

export default function PortfolioPanel() {
  const portfolio = useStockStore((s) => s.portfolio)
  const prices = useStockStore((s) => s.prices)
  const sellStock = useStockStore((s) => s.sellStock)

  const holdings = Object.entries(portfolio)
  const totalValue = holdings.reduce((sum, [symbol, h]) => sum + (prices[symbol] || h.avgPrice) * h.qty, 0)
  const totalCost = holdings.reduce((sum, [, h]) => sum + h.avgPrice * h.qty, 0)
  const totalPnl = totalValue - totalCost
  const totalPnlPct = totalCost > 0 ? (totalPnl / totalCost) * 100 : 0

  return (
    <div className="p-2">
      <h2 className="px-2 mb-2 text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-stock-muted">
        내 포트폴리오
      </h2>

      <div className="mb-3 p-3 rounded-lg border border-gray-200 bg-white dark:border-stock-border dark:bg-stock-card">
        <div className="text-xs text-gray-500 dark:text-stock-muted">총 평가금액</div>
        <div className="text-xl font-bold text-gray-900 dark:text-stock-light">${totalValue.toFixed(2)}</div>
        <div className={`text-sm ${totalPnl >= 0 ? 'text-emerald-600 dark:text-stock-green' : 'text-stock-red'}`}>
          {totalPnl >= 0 ? '+' : ''}{totalPnl.toFixed(2)} ({totalPnlPct.toFixed(2)}%)
        </div>
      </div>

      {holdings.length === 0 && <p className="text-sm text-gray-500 dark:text-stock-muted">보유 종목이 없습니다.</p>}

      {holdings.map(([symbol, h]) => {
        const cur = prices[symbol] || h.avgPrice
        const pnl = (cur - h.avgPrice) * h.qty
        const pnlPct = ((cur - h.avgPrice) / h.avgPrice) * 100
        const isUp = pnl >= 0
        const upColor = isUp ? 'text-emerald-600 dark:text-stock-green' : 'text-stock-red'
        return (
          <div key={symbol} className="mb-2 p-3 rounded-lg border border-gray-200 bg-white dark:border-stock-border dark:bg-stock-card">
            <div className="flex justify-between">
              <strong className="text-gray-900 dark:text-stock-light">{symbol}</strong>
              <span className={`text-sm ${upColor}`}>{isUp ? '+' : ''}{pnlPct.toFixed(2)}%</span>
            </div>
            <div className="mt-1 text-xs text-gray-500 dark:text-stock-muted">
              {h.qty}주 · 평균 ${h.avgPrice.toFixed(2)} · 현재 ${cur.toFixed(2)}
            </div>
            <div className="mt-2 flex justify-between items-center">
              <span className={`text-sm ${upColor}`}>{isUp ? '+' : ''}${pnl.toFixed(2)}</span>
              <button
                onClick={() => sellStock(symbol, h.qty)}
                className="px-2.5 py-0.5 text-[11px] rounded border border-stock-red text-stock-red hover:bg-stock-red/10"
              >
                전량 매도
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
