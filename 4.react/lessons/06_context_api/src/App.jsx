// ── STEP 5: Provider 중첩으로 두 Context를 앱 전체에 공급 ──
// Provider로 감싼 하위 트리(Header, StockGrid)는 어디서든 useTheme/useWatchlist를 쓸 수 있다.
// 두 Context가 필요하니 Provider를 '중첩'해서 감싼다.
import { ThemeProvider } from './context/ThemeContext'
import { WatchlistProvider } from './context/WatchlistContext'
import Header from './components/header'
import StockGrid from './components/StockGrid'

export default function App() {
  return (
    <ThemeProvider>
      <WatchlistProvider>
        <Header />
        <main style={{ padding: '1rem', maxWidth: '900px', margin: '0 auto' }}>
          <StockGrid />
        </main>
      </WatchlistProvider>
    </ThemeProvider>
  )
}