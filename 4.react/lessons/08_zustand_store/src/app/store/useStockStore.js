// ── STEP 1: Zustand 스토어 (전역 중앙 저장소) ──
// [핵심 개념]
// 1. create((set, get) => ({ ... })) : 중앙 저장소를 생성합니다.
// 2. set : 상태(state)를 새롭게 업데이트(변경)하는 함수입니다.
// 3. get : 현재 저장되어 있는 모든 최신 상태/함수 객체를 읽어오는 함수입니다.

import { create } from 'zustand'

const useStockStore = create((set, get) => ({
    // ──────────────────────────────────────────
    // 📌 [1] 전역 상태 (공유 데이터)
    // ──────────────────────────────────────────
    watchlist: ['AAPL', 'TSLA', 'MSFT'], // 관심종목 배열
    selectedSymbol: 'AAPL',               // 현재 선택된 종목 코드
    prices: { AAPL: 182.52, TSLA: 248.5, MSFT: 378.85 }, // 종목별 가격 객체

    // ──────────────────────────────────────────
    // 📌 [2] 액션 함수 (데이터 조작 리모컨)
    // ──────────────────────────────────────────
    
    // 1) 관심종목 추가
    addToWatchlist: (symbol) => {
        // get() : 현재 시점의 최신 상태 객체를 가져옵니다. ({ watchlist, prices, ... })
        const { watchlist } = get()
        
        // 이미 목록에 존재하는 종목이면 추가하지 않고 중단
        if (watchlist.includes(symbol)) return
        
        // set() : 기존 배열에 새 종목을 추가하여 watchlist 상태를 업데이트
        set({ watchlist: [...watchlist, symbol] })
    },

    // 2) 관심종목 제거
    removeFromWatchlist: (symbol) => {
        // set((state) => ... ) : state 매개변수에는 저장소의 전체 상태가 들어옵니다.
        // .filter((s) => s !== symbol) : 클릭한 symbol과 다른 종목들만 골라내어 새 배열 생성
        set((state) => ({
            watchlist: state.watchlist.filter((s) => s !== symbol)
        }))
    },

    // 3) 선택 종목 변경
    selectSymbol: (symbol) => set({ selectedSymbol: symbol }),

    // 4) 특정 종목 가격 갱신 (고급 문법 포함)
    setPrice: (symbol, price) => set((state) => ({
        prices: {
            ...state.prices,   // 기존 가격 정보들을 지우지 않고 복사해옴
            [symbol]: price    // [symbol] 대괄호: 변수에 들어있는 값(예: 'NVDA')을 객체의 키(Key)로 사용함
        }
    })),
}))

export default useStockStore