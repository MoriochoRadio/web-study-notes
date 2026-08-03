// ── STEP 3: 세 Context(테마, 관심목록, 정렬)를 소비하는 헤더 ──
// [Context API를 사용하는 핵심 이유!]
// Header 컴포넌트에 정렬 버튼(종목코드, 가격, 변동률)을 만들어 두면,
// Header에서 버튼을 클릭했을 때 멀리 떨어진 StockGrid 목록이 자동으로 정렬됩니다.
// props 전달(Prop Drilling) 없이도 두 컴포넌트가 SortContext를 통해 소통하기 때문입니다.

import { useTheme } from '../context/ThemeContext'
import { useWatchlist } from '../context/WatchlistContext'
import { useSort } from '../context/SortContext' // ← 1) SortContext 커스텀 훅 가져오기

export default function Header() {
    const { isDark, toggle, text, border, primary } = useTheme()
    const { watchlist } = useWatchlist()

    // 2) SortContext에서 현재 정렬 기준(sortBy)과 변경 함수(setSortBy) 가져오기
    const { sortBy, setSortBy } = useSort()

    return (
        <header
            style={{
                padding: '12px 1.5rem', borderBottom: `1px solid ${border}`,
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px'
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

            {/* Header 상단에 배치된 정렬 버튼 영역 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '12px', color: text }}>정렬:</span>

                {/* 1) 종목코드 버튼 */}
                <button
                    onClick={() => setSortBy('symbol')}
                    style={{
                        padding: '4px 8px', borderRadius: '4px', fontSize: '12px', cursor: 'pointer',
                        border: `1px solid ${sortBy === 'symbol' ? primary : border}`,
                        background: sortBy === 'symbol' ? primary : 'none',
                        color: sortBy === 'symbol' ? '#ffffff' : text,
                        fontWeight: sortBy === 'symbol' ? 'bold' : 'normal',
                    }}
                >
                    종목코드
                </button>

                {/* 2) 가격 버튼 */}
                <button
                    onClick={() => setSortBy('price')}
                    style={{
                        padding: '4px 8px', borderRadius: '4px', fontSize: '12px', cursor: 'pointer',
                        border: `1px solid ${sortBy === 'price' ? primary : border}`,
                        background: sortBy === 'price' ? primary : 'none',
                        color: sortBy === 'price' ? '#ffffff' : text,
                        fontWeight: sortBy === 'price' ? 'bold' : 'normal',
                    }}
                >
                    가격
                </button>

                {/* 3) 변동률 버튼 */}
                <button
                    onClick={() => setSortBy('change')}
                    style={{
                        padding: '4px 8px', borderRadius: '4px', fontSize: '12px', cursor: 'pointer',
                        border: `1px solid ${sortBy === 'change' ? primary : border}`,
                        background: sortBy === 'change' ? primary : 'none',
                        color: sortBy === 'change' ? '#ffffff' : text,
                        fontWeight: sortBy === 'change' ? 'bold' : 'normal',
                    }}
                >
                    변동률
                </button>

                {/* 다크모드/라이트모드 토글 버튼 */}
                <button
                    onClick={toggle}
                    style={{
                        padding: '6px 14px', borderRadius: '20px', border: `1px solid ${border}`,
                        background: 'none', color: text, cursor: 'pointer', fontSize: '14px', marginLeft: '8px'
                    }}
                >
                    {isDark ? '☀️ 라이트' : '🌙 다크'}
                </button>
            </div>
        </header>
    )
}