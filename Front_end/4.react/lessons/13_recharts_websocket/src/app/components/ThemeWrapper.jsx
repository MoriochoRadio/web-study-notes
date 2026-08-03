// ── STEP 2a: 스토어의 theme → <html>의 .dark 클래스로 반영 ──
// 개념 정리
//  - Tailwind의 dark: 유틸리티는 <html>에 .dark가 있을 때만 켜진다.
//  - 스토어 theme 값이 바뀌면 useEffect로 documentElement에 .dark를 add/remove 한다.
'use client'
import { useEffect } from 'react'
import useStockStore from '@/app/store/useStockStore'

export default function ThemeWrapper({ children }) {
  const theme = useStockStore((s) => s.theme)

  useEffect(() => {
    const root = document.documentElement // = <html>
    if (theme === 'dark') root.classList.add('dark')
    else root.classList.remove('dark')
  }, [theme])

  return children
}
