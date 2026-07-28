// ── STEP 4: 세 가지 Context(테마, 관심목록, 정렬)를 소비하는 종목 그리드 ──
// [설명]
// 1. useTheme(): 다크모드/라이트모드 색상 가져오기
// 2. useWatchlist(): 관심 종목 추가/제거 기능 가져오기
// 3. useSort(): SortContext 서랍장에서 현재 정렬 기준(sortBy)과 변경 함수(setSortBy) 가져오기

import { useTheme } from '../context/ThemeContext'
import { useWatchlist } from '../context/WatchlistContext'
import { useSort } from '../context/SortContext' // ← SortContext 읽어오기 위한 커스텀 훅
import { STOCKS } from '../data/stocks'

export default function StockGrid() {
    // 1) 테마 색상 값 가져오기
    const { cardBg, text, muted, border, primary } = useTheme()

    // 2) 관심목록 조작 기능 가져오기
    const { isWatching, addSymbol, removeSymbol } = useWatchlist()

    // 3) SortContext 서랍장에서 현재 정렬 상태(sortBy)와 변경 함수(setSortBy) 가져오기
    const { sortBy, setSortBy } = useSort()

    // 4) [핵심 로직] 원본 STOCKS 배열을 훼손하지 않기 위해 [...STOCKS]로 복사한 후,
    //    SortContext에서 읽어온 sortBy 기준에 맞춰 정렬(sort)합니다.
    const sortedStocks = [...STOCKS].sort((a, b) => {
        if (sortBy === 'price') {
            // 가격 높은 순 (내림차순: b - a)
            return b.price - a.price
        }
        if (sortBy === 'change') {
            // 변동률 높은 순 (내림차순: b - a)
            return b.change - a.change
        }
        // 기본값: 종목 코드(symbol) 알파벳 순 (오름차순)
        return a.symbol.localeCompare(b.symbol)
    })

    return (
        <div>
            {/* 헤더 및 정렬 버튼 영역 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '1rem 0 0.75rem' }}>
                <h2 style={{ margin: 0, color: text }}>전체 종목</h2>

                {/* 정렬 기준 변경 버튼들 */}
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <span style={{ fontSize: '13px', color: muted }}>정렬:</span>

                    {/* 1) 종목명순 버튼 */}
                    <button
                        onClick={() => setSortBy('symbol')}
                        style={{
                            padding: '4px 10px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer',
                            border: `1px solid ${sortBy === 'symbol' ? primary : border}`,
                            background: sortBy === 'symbol' ? primary : cardBg,
                            color: sortBy === 'symbol' ? '#ffffff' : text,
                            fontWeight: sortBy === 'symbol' ? 'bold' : 'normal',
                        }}
                    >
                        종목명순
                    </button>

                    {/* 2) 가격높은순 버튼 */}
                    <button
                        onClick={() => setSortBy('price')}
                        style={{
                            padding: '4px 10px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer',
                            border: `1px solid ${sortBy === 'price' ? primary : border}`,
                            background: sortBy === 'price' ? primary : cardBg,
                            color: sortBy === 'price' ? '#ffffff' : text,
                            fontWeight: sortBy === 'price' ? 'bold' : 'normal',
                        }}
                    >
                        가격높은순
                    </button>

                    {/* 3) 변동률높은순 버튼 */}
                    <button
                        onClick={() => setSortBy('change')}
                        style={{
                            padding: '4px 10px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer',
                            border: `1px solid ${sortBy === 'change' ? primary : border}`,
                            background: sortBy === 'change' ? primary : cardBg,
                            color: sortBy === 'change' ? '#ffffff' : text,
                            fontWeight: sortBy === 'change' ? 'bold' : 'normal',
                        }}
                    >
                        변동률높은순
                    </button>
                </div>
            </div>

            {/* 정렬된 주식 목록(sortedStocks) 렌더링 */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
                {sortedStocks.map((stock) => {
                    const watching = isWatching(stock.symbol)
                    const isUp = stock.change >= 0
                    return (
                        <div
                            key={stock.id}
                            style={{
                                padding: '14px', borderRadius: '10px', background: cardBg,
                                border: `1px solid ${watching ? primary : border}`, transition: 'border-color 0.2s',
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                <strong style={{ color: text }}>{stock.symbol}</strong>
                                <button
                                    onClick={() => (watching ? removeSymbol(stock.symbol) : addSymbol(stock.symbol))}
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: watching ? primary : muted }}
                                >
                                    {watching ? '★' : '☆'}
                                </button>
                            </div>
                            <p style={{ margin: '0 0 8px', fontSize: '12px', color: muted }}>{stock.name}</p>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                                <span style={{ fontSize: '18px', fontWeight: 'bold', color: text }}>${stock.price.toFixed(2)}</span>
                                <span style={{ fontSize: '13px', fontWeight: 'bold', color: isUp ? '#2e7d32' : '#c62828' }}>
                                    {isUp ? '+' : ''}{stock.change}%
                                </span>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}