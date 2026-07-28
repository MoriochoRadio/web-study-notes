// ── STEP 5: Provider 중첩으로 여러 Context를 앱 전체에 공급 ──
// [개념 설명]
// Context가 1개일 때: <ThemeProvider>...</ThemeProvider>
// Context가 2개일 때: <ThemeProvider><WatchlistProvider>...</WatchlistProvider></ThemeProvider>
// Context가 3개일 때: <ThemeProvider><WatchlistProvider><SortProvider>...</SortProvider></WatchlistProvider></ThemeProvider>
//
// 이렇게 Provider를 계속 중첩해 감싸주면, 그 내부의 컴포넌트들(Header, StockGrid 등)은
// props 전달 없이도 언제든 useTheme(), useWatchlist(), useSort() 훅으로 전역 데이터에 접근할 수 있습니다.

import { ThemeProvider } from './context/ThemeContext'
import { WatchlistProvider } from './context/WatchlistContext'
import { SortProvider } from './context/SortContext' // ← 1) SortProvider 임포트
import Header from './components/header'
import StockGrid from './components/StockGrid'

export default function App() {
  return (
    <ThemeProvider>
      <WatchlistProvider>
        {/* 2) 세 번째 Provider(SortProvider)를 중첩하여 감쌉니다 */}
        <SortProvider>
          <Header />
          <main style={{ padding: '1rem', maxWidth: '900px', margin: '0 auto' }}>
            <StockGrid />
          </main>
        </SortProvider>
      </WatchlistProvider>
    </ThemeProvider>
  )
}