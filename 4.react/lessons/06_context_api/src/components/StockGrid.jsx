// ── STEP 4: 두 Context를 소비하는 종목 그리드 ──
// 테마 색상(useTheme)과 관심목록 조작(useWatchlist)을 함께 사용한다.
// Header와 StockGrid가 '같은' watchlist를 공유하므로, 여기서 별을 누르면 Header의 개수도 즉시 바뀐다.
import { useTheme } from '../context/ThemeContext'
import { useWatchlist } from '../context/WatchlistContext'
import { STOCKS } from '../data/stocks'

export default function StockGrid() {
    const { cardBg, text, muted, border, primary } = useTheme()
    const { isWatching, addSymbol, removeSymbol } = useWatchlist()

    return (
        <div>
            <h2 style={{ margin: '1rem 0 0.75rem' }}>전체 종목</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
                {STOCKS.map((stock) => {
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