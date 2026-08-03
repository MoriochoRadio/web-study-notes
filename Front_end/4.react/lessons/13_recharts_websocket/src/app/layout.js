// ── STEP 3: 레이아웃 — 헤더 + 테마 토글 + ThemeWrapper ──
// body/header에 Tailwind 클래스 + dark: 변형을 적용해 라이트/다크를 모두 대응.
import './globals.css'
import ThemeWrapper from './components/ThemeWrapper'
import ThemeToggle from './components/ThemeToggle'

export const metadata = { title: 'StockDash — 주식 대시보드' }

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body className="bg-white text-gray-900 dark:bg-stock-bg dark:text-stock-light min-h-screen">
        <ThemeWrapper>
          <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-3 border-b
                             border-gray-200 bg-gray-100 text-gray-800
                             dark:border-stock-border dark:bg-gray-800 dark:text-gray-200 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <span className="text-xl">📈</span>
              <h1 className="text-lg font-bold text-stock-cyan">StockDash</h1>
            </div>
            <ThemeToggle />
          </header>
          {children}
        </ThemeWrapper>
      </body>
    </html>
  )
}
