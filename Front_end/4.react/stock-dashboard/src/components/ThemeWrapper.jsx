// ═══════════════════════════════════════════════════════════════════
// 📄 ThemeWrapper.jsx — 테마 상태를 "실제 화면색"으로 연결하는 다리
// ───────────────────────────────────────────────────────────────────
// 역할   : 스토어의 theme 값이 바뀔 때마다 <html> 태그에 dark 클래스를
//          붙였다 뗐다 해서, Tailwind의 dark: 유틸리티를 실제로 켜고 끈다.
// 왜 필요? Tailwind는 "html에 .dark가 있는가"만 보고, Zustand는 자바스크립트
//          변수만 안다. 이 둘을 이어주는 게 이 컴포넌트의 유일한 임무.
// 관계도 : ThemeToggle(버튼 클릭) → 스토어 theme 변경 → 이 래퍼가 감지 → html.dark 토글
// ═══════════════════════════════════════════════════════════════════
'use client'
import { useEffect } from 'react'
import { useWatchlistStore } from '@/store/useWatchlistStore'

// theme 상태가 바뀔 때마다 <html> 태그에 dark 클래스를 붙였다 뗐다 해서
// Tailwind의 dark: 유틸리티를 실제로 켜고 끄는 역할만 하는 래퍼 컴포넌트
export default function ThemeWrapper({ children }) {
    // (s) => s.theme : 스토어에서 theme 값"만" 골라 구독하는 선택자(selector).
    // 이렇게 하면 watchlist가 바뀔 때는 이 컴포넌트가 리렌더링되지 않는다 (성능 최적화)
    const theme = useWatchlistStore((s) => s.theme)

    // useEffect를 쓰는 이유: document(브라우저 DOM)를 직접 만지는 일은
    // "렌더링 계산"이 아니라 "외부 세계와의 동기화"라서 effect에서 해야 한다.
    useEffect(() => {
        const root = document.documentElement // = <html> 태그
        if (theme === 'dark') {
            root.classList.add('dark')
        } else {
            root.classList.remove('dark')
        }
    }, [theme]) // theme이 바뀔 때마다 재실행

    // 화면에 자기 자신의 태그는 아무것도 그리지 않고, 자식들만 그대로 통과시킨다
    return children
}
