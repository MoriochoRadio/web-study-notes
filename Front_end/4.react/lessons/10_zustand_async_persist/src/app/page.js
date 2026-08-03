// ── 메인 페이지 (app/page.js) ──
// [역할 설명]
// 주식 대시보드 전체의 메인 레이아웃 페이지입니다.
// 1. StockSearch: 종목 검색 및 관심종목 추가 컴포넌트
// 2. WatchlistPanel: 관심종목 목록 및 시세 조회 / 1주 매수 컴포넌트
// 3. PortfolioPanel: 내 포트폴리오 자산 / 평가손익 / 전량 매도 컴포넌트

import StockSearch from './components/StockSearch'
import WatchlistPanel from './components/WatchlistPanel'
import PortfolioPanel from './components/PortfolioPanel'

export default function Home() {
  return (
    <div style={{ maxWidth: 420, margin: '0 auto', padding: '1rem' }}>
      <h1 style={{ padding: '0 1rem' }}>📈 StockDash</h1>

      {/* 📌 1) 종목 검색 컴포넌트 */}
      <StockSearch />

      {/* 📌 2) 관심 종목 패널 컴포넌트 */}
      <WatchlistPanel />

      {/* 📌 3) 내 포트폴리오 패널 컴포넌트 */}
      <PortfolioPanel />
    </div>
  )
}
