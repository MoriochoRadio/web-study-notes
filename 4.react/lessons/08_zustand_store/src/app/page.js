// ── STEP 4: 페이지 조합 ──
// AddStockForm으로 종목을 추가하고 WatchlistPanel에서 목록을 확인.
// 두 컴포넌트는 props를 주고받지 않지만 같은 Zustand 스토어로 연결된다.
import AddStockForm from './components/AddStockForm'
import WatchlistPanel from './components/WatchlistPanel'

export default function Home() {
  return (
    <div style={{ maxWidth: 420, margin: '0 auto', padding: '1rem' }}>
      <h1 style={{ padding: '0 1rem' }}>📈 StockDash</h1>
      <AddStockForm />
      <WatchlistPanel />
    </div>
  )
}