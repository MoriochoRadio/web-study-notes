// ── STEP 4b: 관심종목 패널 (StockCard 목록) ──
// 컨테이너 역할만 하고, 개별 카드 렌더링은 StockCard가 담당(컴포넌트 분리).
'use client'
import { useEffect } from 'react'
import useStockStore from '@/app/store/useStockStore'
import StockCard from './StockCard'

export default function WatchlistPanel() {
  const watchlist = useStockStore((s) => s.watchlist)
  const fetchAllPrices = useStockStore((s) => s.fetchAllPrices)

  useEffect(() => {
    fetchAllPrices()
  }, [fetchAllPrices])

  return (
    <div className="p-2">
      <h2 className="px-2 mb-2 text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-stock-muted">
        관심종목 ({watchlist.length})
      </h2>
      <div className="space-y-2">
        {watchlist.map((symbol) => (
          <StockCard key={symbol} symbol={symbol} />
        ))}
      </div>
    </div>
  )
}
