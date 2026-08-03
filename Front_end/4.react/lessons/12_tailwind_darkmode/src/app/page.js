// ── STEP 5: 반응형 그리드 대시보드 (Tailwind) ──
// 개념 정리
//  - grid-cols-1 md:grid-cols-[300px_1fr]: 모바일은 1열, md 이상은 사이드바+메인 2열 (반응형).
//  - 좌측 클라이언트 패널 + 우측 서버 컴포넌트(Suspense) 구성은 11강과 동일.
import { Suspense } from 'react'
import StockSearch from './components/StockSearch'
import WatchlistPanel from './components/WatchlistPanel'
import PortfolioPanel from './components/PortfolioPanel'
import StockInfo from './components/StockInfo'

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
        <div className="p-5 rounded-xl border border-gray-200 bg-white dark:border-stock-border dark:bg-stock-card">
          <p className="text-gray-500 dark:text-stock-muted">차트 영역 (13강에서 구현)</p>
        </div>
      </section>
    </main>
  )
}
