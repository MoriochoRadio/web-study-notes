'use client'
import { useState, lazy, Suspense } from 'react'
import StockSearch from '@/components/StockSearch'
import StockQuoteCard from '@/components/StockQuoteCard'
import TickerBoard from '@/components/TickerBoard'
import StockChart from '@/components/StockChart'
import RecommendationCard from '@/components/RecommendationCard'
import EarningsCard from '@/components/EarningsCard'
import WatchlistPanel from '@/components/WatchlistPanel'
import Skeleton from '@/components/Skeleton'

const NewsList = lazy(() => import('@/components/NewsList'))

export default function DashboardPage() {
  const [selectedSymbol, setSelectedSymbol] = useState(null)

  return (
    <main id="main-content" className="mx-auto max-w-7xl space-y-8 px-4 py-6 sm:px-6 sm:py-8 lg:space-y-10 lg:px-8">
      <TickerBoard selectedSymbol={selectedSymbol} />

      <section className="space-y-4">
        <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-stock-muted">
          <span aria-hidden="true" className="h-3.5 w-1 rounded-full bg-stock-cyan/80" />
          종목 검색
        </h2>
        <StockSearch onSelect={setSelectedSymbol} />
        <WatchlistPanel onSelect={setSelectedSymbol} selectedSymbol={selectedSymbol} />
      </section>

      <section className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          <StockQuoteCard symbol={selectedSymbol} />
          <RecommendationCard symbol={selectedSymbol} />
          <EarningsCard symbol={selectedSymbol} />
        </div>
        <StockChart symbol={selectedSymbol} />
      </section>

      {selectedSymbol && (
        <section className="space-y-3">
          <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-stock-muted">
            <span aria-hidden="true" className="h-3.5 w-1 rounded-full bg-stock-cyan/80" />
            {selectedSymbol} 관련 뉴스
          </h2>
          <Suspense fallback={<Skeleton variant="list" className="h-48 w-full" />}>
            <NewsList mode="company" symbol={selectedSymbol} />
          </Suspense>
        </section>
      )}

      <section className="space-y-3">
        <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-stock-muted">
          <span aria-hidden="true" className="h-3.5 w-1 rounded-full bg-stock-cyan/80" />
          시장 뉴스
        </h2>
        <Suspense fallback={<Skeleton variant="list" className="h-48 w-full" />}>
          <NewsList mode="market" />
        </Suspense>
      </section>
    </main>
  )
}
