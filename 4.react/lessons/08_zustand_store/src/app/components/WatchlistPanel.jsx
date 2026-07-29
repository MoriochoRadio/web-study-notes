// ── STEP 3: 관심종목 목록 컴포넌트 (파생 셀렉터 적용) ──
// [핵심 개념: 파생 값 셀렉터 구독(Derived Selector)]
// useStockStore((s) => s.watchlist.length) 처럼 전체 배열이 아니라 '개수(length)'만 쏙 짚어서 구독합니다.
// 이렇게 파생된 값만 구독하면 관심종목의 '개수'가 바뀔 때만 이 count 부분이 최적화되어 리렌더링됩니다.

'use client'
import useStockStore from '@/app/store/useStockStore'

export default function WatchlistPanel() {
    // 1) 파생 셀렉터(Derived Selector): 관심종목 개수(length)만 쏙 뽑아오기
    const count = useStockStore((s) => s.watchlist.length)

    // 2) Zustand 중앙 저장소에서 필요한 다른 상태와 액션 가져오기
    const watchlist = useStockStore((s) => s.watchlist)             // 관심종목 배열
    const selectedSymbol = useStockStore((s) => s.selectedSymbol)   // 선택된 종목 코드
    const prices = useStockStore((s) => s.prices)                   // 가격 객체
    const selectSymbol = useStockStore((s) => s.selectSymbol)       // 선택 변경 함수
    const removeFromWatchlist = useStockStore((s) => s.removeFromWatchlist) // 삭제 함수

    return (
        <div style={{ padding: '1rem' }}>
            {/* 📌 [슬라이드 과제 핵심] 관심종목 개수({count}) 표기 */}
            <h2>관심종목 ({count}개)</h2>
            
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {watchlist.map((symbol) => (
                    <li
                        key={symbol}
                        onClick={() => selectSymbol(symbol)}
                        style={{
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            padding: '12px', marginBottom: '8px', borderRadius: '8px',
                            border: `1px solid ${selectedSymbol === symbol ? '#61dafb' : '#0f3460'}`,
                            cursor: 'pointer', backgroundColor: selectedSymbol === symbol ? '#123a2a' : '#0d2137',
                        }}
                    >
                        <div>
                            <strong style={{ color: '#ccd6f6' }}>{symbol}</strong>
                            <div style={{ fontSize: '12px', color: '#8892b0' }}>
                                {prices[symbol] ? `$${prices[symbol].toFixed(2)}` : '가격 없음'}
                            </div>
                        </div>

                        {/* ✕ 삭제 버튼 */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation()
                                removeFromWatchlist(symbol)
                            }}
                            style={{ background: 'none', border: 'none', color: '#e94560', cursor: 'pointer', fontSize: '16px' }}
                        >
                            ✕
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    )
}