// ── STEP 2b: 테마 토글 버튼 ──
// 스토어의 theme/toggleTheme와 연결. 클릭 → toggleTheme → ThemeWrapper가 .dark 갱신.
'use client'
import useStockStore from '@/app/store/useStockStore'

export default function ThemeToggle() {
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
