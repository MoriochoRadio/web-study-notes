// ── STEP 2: Suspense + 서버 컴포넌트로 대시보드 완성 ── (빈칸 채우기)
// 개념: <Suspense fallback>로 async 서버 컴포넌트를 감싸면 로딩 중 스켈레톤 표시.
// 막히면 정답 참고: lessons_edu/11_server_components/app/page.js
import { Suspense } from 'react'
import StockSearch from './components/StockSearch'
import WatchlistPanel from './components/WatchlistPanel'
import PortfolioPanel from './components/PortfolioPanel'
import StockInfo from './components/StockInfo'

function CardSkeleton({ height = '180px' }) {
  return (
    <div style={{ height, borderRadius: '12px', border: '1px solid #0f3460', background: 'linear-gradient(90deg, #0d2137 20%, #0e478d 40%, #0d2137 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
  )
}

export default async function DashboardPage({ searchParams }) {
  const { symbol } = await searchParams
  const symbolVal = symbol || "AAPL"
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '1rem', minHeight: '100vh', padding: '1rem' }}>
      <aside style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <StockSearch />
        <WatchlistPanel />
        <PortfolioPanel />
      </aside>

      <main style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {/* TODO: STEP 2 — 아래 StockInfo를 <Suspense fallback={<CardSkeleton />}>로 감싸세요.
            (로딩 동안 스켈레톤이 보이고, 준비되면 실제 정보로 교체됩니다) */}
        <Suspense fallback={<CardSkeleton />}>
          <StockInfo symbol={symbolVal} />
        </Suspense>

        <div style={{ padding: '1.25rem', borderRadius: '12px', border: '1px solid #0f3460', background: '#0d2137' }}>
          <p style={{ color: '#8892b0' }}>차트 영역 (13강에서 구현)</p>
        </div>
      </main>
    </div>
  )
}