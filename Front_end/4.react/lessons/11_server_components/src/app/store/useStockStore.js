// ── STEP 1: persist + async 액션 + 포트폴리오 스토어 ──
// [개념 한눈에 보기]
// 1. Zustand 스토어: 전역 데이터(상태)와 데이터를 변경하는 함수(액션)를 하나로 묶어 관리합니다.
// 2. persist: 브라우저를 새로고침(F5)해도 데이터가 사라지지 않고 localStorage에 자동 저장/복원됩니다.
// 3. partialize: localStorage에 저장할 데이터만 콕 찝어 필터링합니다. (로딩/에러/현재가 등 동적 데이터 제외)
// 4. get(): 스토어 내부에서 다른 상태값이나 액션 함수를 불러올 때 사용합니다.

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// 📌 create와 persist로 전역 스토어 생성
const useStockStore = create(
  persist(
    (set, get) => ({
      // -------------------------------------------------------------
      // 📦 [상태 (State)]: 앱 전체에서 공유하는 데이터
      // -------------------------------------------------------------
      watchlist: ['AAPL', 'TSLA', 'MSFT'], // 관심 종목 코드 목록 (초기값)
      selectedSymbol: 'AAPL',               // 현재 화면에 선택된 종목 코드
      prices: {},                           // 종목별 실시간 시세 저장 객체 (예: { AAPL: 180.5, TSLA: 240.2 })
      loading: false,                       // API 통신 중 로딩 상태 표시 (true / false)
      error: null,                          // 에러 발생 시 에러 메시지 저장
      portfolio: { AAPL: { qty: 10, avgPrice: 170.5 } }, // 보유 중인 주식 내역 (종목코드: { 수량, 평단가 })

      // -------------------------------------------------------------
      // ⚡ [액션 (Actions)]: 상태를 변경하거나 API를 호출하는 함수들
      // -------------------------------------------------------------

      // 📌 1. 관심종목 추가
      addToWatchlist: (symbol) => {
        const { watchlist, fetchPrice } = get() // get()으로 기존 watchlist와 fetchPrice 함수 가져오기
        if (watchlist.includes(symbol)) return  // 이미 관심종목에 포함되어 있다면 중복 추가 방지

        // 관심종목 배열에 새 종목 추가
        set({ watchlist: [...watchlist, symbol] })

        // 종목을 추가하자마자 해당 종목의 최신 시세를 바로 API로 가져옴
        fetchPrice(symbol)
      },

      // 📌 2. 관심종목 삭제
      removeFromWatchlist: (symbol) =>
        set((state) => ({
          // filter를 사용해 클릭한 symbol만 제외한 새로운 배열로 관심종목 갱신
          watchlist: state.watchlist.filter((s) => s !== symbol),
        })),

      // 📌 3. 선택 종목 변경
      selectSymbol: (symbol) => set({ selectedSymbol: symbol }),

      // 📌 4. 단일 종목 시세 조회 (비동기 API 통신)
      fetchPrice: async (symbol) => {
        // API 요청 시작: 로딩 켜고 이전 에러 초기화
        set({ loading: true, error: null })
        try {
          // 백엔드 API Route (/api/stock/[symbol]) 호출
          const res = await fetch(`/api/stock/${symbol}`)
          if (!res.ok) throw new Error(`${symbol} 시세 조회 실패`)

          const data = await res.json()

          // 성공 시: 기존 prices 객체를 복사(...) 후 현재 종목의 최신 가격 갱신 및 로딩 해제
          set((state) => ({
            prices: { ...state.prices, [symbol]: data.price },
            loading: false,
          }))
        } catch (error) {
          // 실패 시: 에러 메시지 저장 및 로딩 해제
          set({ error: error.message, loading: false })
        }
      },

      // 📌 5. 관심종목 전체 병렬 조회
      fetchAllPrices: async () => {
        const { watchlist, fetchPrice } = get()
        // Promise.all: watchlist 안의 모든 종목 시세 조회를 동시에(병렬로) 처리하고 모두 끝날 때까지 기다림
        await Promise.all(watchlist.map((s) => fetchPrice(s)))
      },

      // 📌 6. 주식 매수 (신규 구매 또는 추가 구매 시 평단가 재계산)
      buyStock: (symbol, qty, price) => {
        const { portfolio } = get()
        const existing = portfolio[symbol] // 현재 이미 보유 중인 주식 내역인지 확인

        if (existing) {
          // 💡 이미 보유 중인 주식이면: 평단가 재계산 공식 적용
          // 1) 총 수량 = 기존 수량 + 새로 산 수량
          const totalQty = existing.qty + qty
          // 2) 총 매입원가 = (기존 수량 × 기존 평단가) + (새로 산 수량 × 새로 산 가격)
          const totalCost = existing.qty * existing.avgPrice + price * qty

          // 3) 새로운 평단가 = 총 매입원가 / 총 수량
          set((state) => ({
            portfolio: {
              ...state.portfolio,
              [symbol]: { qty: totalQty, avgPrice: totalCost / totalQty },
            },
          }))
        } else {
          // 💡 신규 등록 주식이면: 수량과 살 때 가격 그대로 저장
          set((state) => ({
            portfolio: {
              ...state.portfolio,
              [symbol]: { qty: qty, avgPrice: price },
            },
          }))
        }
      },

      // 📌 7. 주식 매도 (수량 차감 또는 전량 매도 시 종목 삭제)
      sellStock: (symbol, qty) => {
        const { portfolio } = get()
        const existing = portfolio[symbol]
        if (!existing) return // 보유 중인 종목이 없으면 아무 작업도 하지 않고 즉시 종료

        // 매도 후 남을 예상 수량 계산 (기존 수량 - 팔려는 수량)
        const remainingQty = existing.qty - qty

        // 1) 남은 수량이 0 이하라면: 내 포트폴리오 객체에서 해당 종목 아예 삭제
        if (remainingQty <= 0) {
          const newPortfolio = { ...portfolio }
          delete newPortfolio[symbol] // delete 키워드로 해당 종목 속성을 완벽히 제거
          set({ portfolio: newPortfolio })
        } else {
          // 2) 남은 수량이 1개 이상이면: 구매 평단가는 유지하고 수량(qty)만 차감
          set((state) => ({
            portfolio: {
              ...state.portfolio,
              [symbol]: { ...existing, qty: remainingQty },
            },
          }))
        }
      },
    }),

    // -------------------------------------------------------------
    // ⚙️ [persist 미들웨어 설정 (localStorage 저장 옵션)]
    // -------------------------------------------------------------
    {
      // 1) name: 브라우저 localStorage에 저장될 Key(열쇠) 이름입니다.
      name: 'stock-dashboard',

      // 2) partialize: 새로고침 후에도 '유지할 상태만 선택'하는 옵션입니다.
      // (loading, error, prices처럼 새로고침 시 다시 받아와야 하거나 초기화되어야 하는 데이터는 저장에서 제외됩니다.)
      partialize: (state) => ({
        watchlist: state.watchlist,
        selectedSymbol: state.selectedSymbol, // 선택된 종목 변수(selectedSymbol) 저장
        portfolio: state.portfolio,
      }),
    } // persist 괄호 종료
  ) // create 괄호 종료
)

export default useStockStore
