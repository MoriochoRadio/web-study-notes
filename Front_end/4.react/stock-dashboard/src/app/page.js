// ═══════════════════════════════════════════════════════════════════
// 📄 page.js — 대시보드 메인 페이지 (모든 컴포넌트의 조립처)
// ───────────────────────────────────────────────────────────────────
// 역할   : 어떤 컴포넌트를 어떤 순서/배치로 보여줄지 결정하고,
//          "지금 선택된 종목(selectedSymbol)" 상태를 총괄한다.
// 핵심 패턴 — 상태 끌어올리기(lifting state up):
//   selectedSymbol을 이 페이지(부모)가 들고 있고,
//   · 선택을 "바꾸는" 쪽(StockSearch, WatchlistPanel)에는 setSelectedSymbol을 내려주고
//   · 선택을 "읽는" 쪽(카드들, 차트, 뉴스)에는 selectedSymbol 값을 내려준다.
//   → 형제 컴포넌트끼리는 직접 대화할 수 없으니, 공통 부모가 중계하는 구조!
// ═══════════════════════════════════════════════════════════════════
'use client' // useState를 쓰므로 클라이언트 컴포넌트 선언 (브라우저에서 실행됨)
import { useState, lazy, Suspense } from 'react'
import StockSearch from '@/components/StockSearch'
import StockQuoteCard from '@/components/StockQuoteCard'
import TickerBoard from '@/components/TickerBoard'
import StockChart from '@/components/StockChart'
import RecommendationCard from '@/components/RecommendationCard'
import EarningsCard from '@/components/EarningsCard'
import WatchlistPanel from '@/components/WatchlistPanel'
import Skeleton from '@/components/Skeleton'

// lazy(...) : NewsList의 코드를 "처음부터" 내려받지 않고, 실제로 렌더링될 때
// 내려받는 코드 분할(code splitting). 첫 화면 로딩을 가볍게 하는 최적화.
// 아래에서 <Suspense fallback={...}>이 "코드 도착 전까지 보여줄 대체 화면"을 맡는다.
const NewsList = lazy(() => import('@/components/NewsList'))

export default function DashboardPage() {
  // const [selectedSymbol, setSelectedSymbol] = useState(null) 을 쪼개보면:
  //   selectedSymbol    → 현재 선택된 종목 심볼 (예: 'NVDA'). 처음엔 null(미선택)
  //   setSelectedSymbol → 선택을 바꾸는 리모컨 버튼. 자식들에게 onSelect라는 이름으로 전달됨
  const [selectedSymbol, setSelectedSymbol] = useState(null)

  return (
    // id="main-content" : layout.js의 스킵 링크가 점프해오는 도착 지점
    // space-y-8 : 자식 섹션들 사이 세로 간격을 일괄 통일 (lg에서 10으로 확대)
    <main id="main-content" className="mx-auto max-w-7xl space-y-8 px-4 py-6 sm:px-6 sm:py-8 lg:space-y-10 lg:px-8">
      {/* 전광판: selectedSymbol을 "읽기만" 함 (선택된 종목을 강조 표시하려고) */}
      <TickerBoard selectedSymbol={selectedSymbol} />

      {/* 대시보드 상단 — 핵심 동작인 "종목 찾기"를 가장 먼저 보여줌 */}
      <section className="space-y-4">
        <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-stock-muted">
          {/* 섹션 마커(터미널 커서 모양의 시안색 바) — 순수 장식이라 aria-hidden */}
          <span aria-hidden="true" className="h-3.5 w-1 rounded-full bg-stock-cyan/80" />
          종목 검색
        </h2>
        {/* onSelect={setSelectedSymbol} : "종목이 선택되면 이 함수를 불러줘"라고
            상태 변경 리모컨을 자식에게 통째로 넘기는 패턴 */}
        <StockSearch onSelect={setSelectedSymbol} />
        <WatchlistPanel onSelect={setSelectedSymbol} selectedSymbol={selectedSymbol} />
      </section>

      {/* 시세/투자의견/실적 카드 3종 + 차트 — 전부 selectedSymbol을 "읽는" 쪽 */}
      <section className="space-y-4">
        {/* 반응형 그리드: 모바일 1열 → sm(640px~) 2열 → lg(1024px~) 3열 */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          <StockQuoteCard symbol={selectedSymbol} />
          <RecommendationCard symbol={selectedSymbol} />
          <EarningsCard symbol={selectedSymbol} />
        </div>
        <StockChart symbol={selectedSymbol} />
      </section>

      {/* 종목 선택 시에만 — 해당 기업 뉴스
          {조건 && <컴포넌트/>} : 조건이 false면 아무것도 렌더링하지 않는 조건부 렌더링.
          selectedSymbol이 null이면 이 섹션 전체가 화면에서 사라진다 */}
      {selectedSymbol && (
        <section className="space-y-3">
          <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-stock-muted">
            <span aria-hidden="true" className="h-3.5 w-1 rounded-full bg-stock-cyan/80" />
            {selectedSymbol} 관련 뉴스
          </h2>
          {/* Suspense: lazy로 쪼갠 NewsList 코드가 도착할 때까지 스켈레톤을 대신 표시 */}
          <Suspense fallback={<Skeleton variant="list" className="h-48 w-full" />}>
            <NewsList mode="company" symbol={selectedSymbol} />
          </Suspense>
        </section>
      )}

      {/* 시장 전체 뉴스 — 특정 종목과 무관한 부가 콘텐츠라 맨 아래로 배치 */}
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
