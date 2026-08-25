import './globals.css'
import ThemeWrapper from '@/components/ThemeWrapper'
import ThemeToggle from '@/components/ThemeToggle'

export const metadata = {
  title: 'StockDash — 실시간 주식 대시보드',
  description: 'Finnhub API + WebSocket 기반 실시간 주식 대시보드 (취업아카데미 실전 프로젝트)',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-gray-50 text-gray-900 dark:bg-stock-bg dark:text-stock-light">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-stock-cyan focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-stock-bg"
        >
          본문으로 건너뛰기
        </a>
        <ThemeWrapper>
          <header
            className="sticky top-0 z-50 flex items-center justify-between border-b border-gray-200/80 bg-white/80
                       px-4 py-3 text-gray-800 backdrop-blur-md sm:px-6 lg:px-8
                       dark:border-stock-border/80 dark:bg-stock-bg/80 dark:text-gray-200"
          >
            <div className="flex items-center gap-2.5">
              <span aria-hidden="true" className="text-xl drop-shadow-[0_0_6px_rgba(97,218,251,0.5)]">📈</span>
              <h1 className="text-lg font-bold tracking-tight text-stock-cyan sm:text-xl">
                StockDash
              </h1>
            </div>
            <ThemeToggle />
          </header>
          {children}
        </ThemeWrapper>
      </body>
    </html>
  )
}
