// ═══════════════════════════════════════════════════════════════════
// 📄 layout.js — 모든 페이지를 감싸는 최상위 틀 (Next.js App Router 규칙 파일)
// ───────────────────────────────────────────────────────────────────
// 역할   : <html>/<body> 뼈대 + 상단 고정 헤더 + 테마 적용 래퍼를 제공.
//          {children} 자리에 page.js의 내용이 끼워진다.
// 구조   : <html> → <body> → 스킵링크 → <ThemeWrapper> → 헤더 + {children}
// 포인트 : 이 파일에는 'use client'가 없다 = 서버 컴포넌트.
//          상태(테마)를 다루는 부분은 ThemeWrapper/ThemeToggle(클라이언트)로 분리했다.
// ═══════════════════════════════════════════════════════════════════
import './globals.css'
import ThemeWrapper from '@/components/ThemeWrapper'
import ThemeToggle from '@/components/ThemeToggle'

// metadata를 export하면 Next.js가 <head>의 <title>/<meta> 태그를 자동 생성해준다
export const metadata = {
  title: 'StockDash — 실시간 주식 대시보드',
  description: 'Finnhub API + WebSocket 기반 실시간 주식 대시보드 (취업아카데미 실전 프로젝트)',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-gray-50 text-gray-900 dark:bg-stock-bg dark:text-stock-light">
        {/* [접근성] 스킵 링크: 키보드(Tab) 사용자가 헤더를 건너뛰고 본문으로 바로
            이동하는 링크. 평소엔 sr-only(화면에서 숨김)였다가 Tab으로 포커스가
            닿는 순간에만 나타난다. #main-content는 page.js의 <main> id와 연결됨 */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-stock-cyan focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-stock-bg"
        >
          본문으로 건너뛰기
        </a>
        {/* ThemeWrapper: 스토어의 theme 값에 따라 <html>에 .dark 클래스를 넣고 빼는 역할.
            이 래퍼 "안쪽"이어야 다크모드가 적용된다 */}
        <ThemeWrapper>
          {/* 헤더 클래스 해설:
              sticky top-0 z-50  → 스크롤해도 화면 최상단에 붙어 있음 (z-50: 다른 요소 위)
              bg-white/80 + backdrop-blur-md → 반투명 배경 + 뒤 내용을 뿌옇게(유리 느낌)
              px-4 sm:px-6 lg:px-8 → 화면이 커질수록 좌우 여백 확대 (반응형 3단계) */}
          <header
            className="sticky top-0 z-50 flex items-center justify-between border-b border-gray-200/80 bg-white/80
                       px-4 py-3 text-gray-800 backdrop-blur-md sm:px-6 lg:px-8
                       dark:border-stock-border/80 dark:bg-stock-bg/80 dark:text-gray-200"
          >
            <div className="flex items-center gap-2.5">
              {/* aria-hidden: 장식용 이모지는 스크린리더가 읽지 않게 숨김 */}
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
