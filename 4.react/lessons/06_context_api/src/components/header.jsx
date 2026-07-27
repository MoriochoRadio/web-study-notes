// ── STEP 3: 두 Context를 '소비'하는 헤더 ──
// props를 하나도 받지 않는데도, useTheme/useWatchlist로 전역 값에 바로 접근한다.
// (이것이 Context의 핵심 — prop drilling 없이 원하는 곳에서 바로 꺼내 쓰기)
import { useTheme } from '../context/ThemeContext'
import { useWatchlist } from '../context/WatchlistContext'

export default function Header() {
    //useTheme() -> ThemeContext반환 -> value={isDark, toggle, text, border} 
    const { isDark, toggle, text, border } = useTheme()
    const { watchlist } = useWatchlist()

    return (
        <header
            style={{
                padding: '12px 1.5rem', borderBottom: `1px solid ${border}`,
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '20px' }}>📈</span>
                <h1 style={{ margin: 0, fontSize: '18px', color: text }}>StockPractice</h1>
                <span
                    style={{
                        fontSize: '12px', padding: '2px 8px', borderRadius: '12px',
                        background: isDark ? '#0f3460' : '#e3f2fd', color: isDark ? '#61dafb' : '#0066cc',
                    }}
                >
                    관심종목 {watchlist.length}개
                </span>
            </div>

            <button
                onClick={toggle}
                style={{
                    padding: '6px 14px', borderRadius: '20px', border: `1px solid ${border}`,
                    background: 'none', color: text, cursor: 'pointer', fontSize: '14px',
                }}
            >
                {isDark ? '☀️ 라이트' : '🌙 다크'}
            </button>
        </header>
    )
}