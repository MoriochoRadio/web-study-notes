// ── STEP 4: 차트를 대시보드에 배치 (앱 완성) ──
// 12강의 "차트 영역 (13강에서 구현)" 자리를 실제 StockChart로 교체.
import { Suspense } from 'react'
import StockSearch from './components/StockSearch'
import WatchlistPanel from './components/WatchlistPanel'
import PortfolioPanel from './components/PortfolioPanel'
import StockInfo from './components/StockInfo'
import StockChart from './components/StockChart'

function CardSkeleton({ className }) {
  return <div className={`rounded-xl border border-stock-border animate-pulse bg-stock-card ${className}`} />
}

export default function DashboardPage() {
  return (
    <main className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-4 max-w-7xl mx-auto p-4">
      <aside className="space-y-3">
        <StockSearch />
        <WatchlistPanel />
        <PortfolioPanel />
      </aside>

      <section className="space-y-4">
        <Suspense fallback={<CardSkeleton className="h-40" />}>
          <StockInfo symbol="AAPL" />
        </Suspense>
        {/* 실시간 차트 (선택된 종목을 따라감) */}
        <StockChart />
      </section>
    </main>
  )
}
