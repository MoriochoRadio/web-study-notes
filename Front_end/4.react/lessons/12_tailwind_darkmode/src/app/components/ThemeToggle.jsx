// ── STEP 2b: 테마 토글 버튼 ── (빈칸 채우기)
// 개념: 스토어 theme/toggleTheme 구독 → 클릭 시 토글.
// 막히면 정답 참고: lessons_edu/12_tailwind_darkmode/app/components/ThemeToggle.jsx
'use client'
import useStockStore from '@/app/store/useStockStore'

export default function ThemeToggle() {
  // TODO: STEP 2 — 스토어에서 theme와 toggleTheme을 구독하세요.
  const theme = useStockStore((s) => s.theme)
  const toggleTheme = useStockStore((s) => s.toggleTheme)

  return (
    <button
      onClick={toggleTheme}
      className="px-3 py-1 rounded-lg text-sm border border-stock-border text-stock-muted
                 hover:text-stock-cyan hover:border-stock-cyan/50 transition-colors cursor-pointer"
    >
      {theme === 'dark' ? '🌙 다크' : '☀️ 라이트'}
    </button>
  )
}
