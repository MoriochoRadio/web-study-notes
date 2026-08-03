// ═══════════════════════════════════════════════════════════════════
// 📄 WatchlistPanel.jsx — 관심 종목 칩(알약 버튼) 목록 (기능 8)
// ───────────────────────────────────────────────────────────────────
// 역할   : 스토어의 watchlist를 칩으로 나열. 칩의 심볼을 누르면 그 종목을 선택하고,
//          × 를 누르면 관심 종목에서 제거한다. 비어있으면 안내 문구를 보여준다.
// props  : onSelect(선택 알림 콜백 = page.js의 setSelectedSymbol)
//          selectedSymbol(현재 선택된 종목 — 강조 표시용)
// 데이터 출처: 종목 추가는 StockQuoteCard의 ★ 버튼 → 스토어 → 여기 자동 반영
//          (스토어를 구독 중이므로 다른 컴포넌트가 바꿔도 즉시 리렌더링됨!)
// ═══════════════════════════════════════════════════════════════════
'use client'
import { useWatchlistStore } from '@/store/useWatchlistStore'

// onSelect: 패널에서 종목을 클릭했을 때 page.js의 selectedSymbol을 바꿔주는 콜백
// selectedSymbol: 현재 선택된 종목 (강조 표시용)
export default function WatchlistPanel({ onSelect, selectedSymbol }) {
    // 스토어에서 목록과 제거 액션을 구조분해로 꺼냄
    const { watchlist, removeSymbol } = useWatchlistStore()

    // 빈 상태 처리: "빈 화면"이 아니라 "어떻게 채우는지" 안내 (점선 상자 관례)
    if (watchlist.length === 0) {
        return (
            <p className="rounded-xl border border-dashed border-gray-300 px-4 py-3 text-sm text-gray-500 dark:border-stock-border dark:text-stock-muted">
                관심 종목이 없습니다. 카드에서 ★ 버튼을 눌러 추가해보세요.
            </p>
        )
    }

    return (
        // flex-wrap: 칩이 많아지면 자동으로 다음 줄로 넘어감
        <div className="flex flex-wrap gap-2">
            {watchlist.map((symbol) => {
                // 이 칩이 현재 선택된 종목인가? (강조 스타일 분기용)
                const isSelected = symbol === selectedSymbol
                return (
                    // 칩 껍데기: 선택되면 하늘색 테두리+옅은 배경, 아니면 회색 (hover 시 살짝 강조)
                    <div
                        key={symbol}
                        className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm shadow-sm transition-colors
                            ${isSelected
                                ? 'border-stock-cyan bg-stock-cyan/10'
                                : 'border-gray-200 bg-white hover:border-stock-cyan/40 dark:border-stock-border dark:bg-stock-card dark:hover:border-stock-cyan/40'}`}
                    >
                        {/* 심볼 버튼: 누르면 이 종목을 선택.
                            aria-pressed: "지금 눌린(선택된) 상태인가"를 보조기기에 알림 */}
                        <button
                            onClick={() => onSelect(symbol)}
                            aria-pressed={isSelected}
                            className={`rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stock-cyan/60
                                ${isSelected ? 'font-semibold text-stock-cyan' : 'text-gray-700 dark:text-stock-light'}`}
                        >
                            {symbol}
                        </button>
                        {/* 제거 버튼: h-6 w-6 = 터치 타겟 크기 확보(24px, 접근성 기준).
                            aria-label: '×'만으로는 무슨 버튼인지 알 수 없어서 이름을 따로 제공 */}
                        <button
                            onClick={() => removeSymbol(symbol)}
                            aria-label={`${symbol} 관심 종목에서 제거`}
                            className="flex h-6 w-6 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-stock-red/10 hover:text-stock-red focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stock-red/60"
                        >
                            ×
                        </button>
                    </div>
                )
            })}
        </div>
    )
}
