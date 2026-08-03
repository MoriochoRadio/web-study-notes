// ── STEP 2: 관심목록 Context ── (빈칸 채우기)
// 개념: 여러 컴포넌트가 공유하는 상태를 Context에 두고 add/remove로 조작.
// 막히면 정답 참고: lessons_edu/06_context_api/src/context/WatchlistContext.jsx
import { createContext, useState, useContext, useCallback } from 'react'

const WatchlistContext = createContext(null)

export function WatchlistProvider({ children }) {
    const [watchlist, setWatchlist] = useState(['AAPL', 'TSLA'])

    // TODO: STEP 2 — 종목 추가 함수(중복이면 무시)를 useCallback으로 만드세요.
    const addSymbol = useCallback((symbol) => {
        setWatchlist((prev) => (prev.includes(symbol) ? prev : [...prev, symbol]))
    }, [])

    // TODO: STEP 2 — 종목 제거 함수(filter로 제거)를 useCallback으로 만드세요.
    const removeSymbol = useCallback((symbol) => {
        setWatchlist((prev) => prev.filter((s) => s !== symbol))
    }, [])

    // 조회 (제공됨)
    const isWatching = (symbol) => watchlist.includes(symbol)

    // TODO: STEP 2 — { watchlist, addSymbol, removeSymbol, isWatching }를 Provider로 공급하세요.
    return <WatchlistContext.Provider value={{ watchlist, addSymbol, removeSymbol, isWatching }}>
        {children}</WatchlistContext.Provider>
}

export function useWatchlist() {
    // TODO: STEP 2 — useContext로 WatchlistContext 값을 꺼내 ctx에 담으세요.
    const ctx = useContext(WatchlistContext) // ← useContext(WatchlistContext)로 교체
    if (!ctx) throw new Error('useWatchlist은 WatchlistProvider 안에서 사용하세요')
    return ctx
}