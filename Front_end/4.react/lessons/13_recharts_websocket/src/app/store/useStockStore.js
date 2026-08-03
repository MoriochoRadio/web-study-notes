// Zustand 전역 상태 관리 스토어 생성
// persist 미들웨어: 스토어 상태를 브라우저 localStorage에 자동 저장하여 새로고침 시에도 데이터 유지
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useStockStore = create(
  persist(
    (set, get) => ({
      // ── 테마 상태 ──
      theme: 'dark', // 현재 테마 상태 ('dark' 또는 'light')
      // 테마 변경 토글 함수: dark ↔ light 상태를 서로 뒤집음
      toggleTheme: () => set((s) => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),

      // ── 앱 기본 상태 ──
      watchlist: ['AAPL', 'TSLA', 'MSFT'], // 관심 종목 코드 목록
      selectedSymbol: 'AAPL', // 현재 선택된(차트에 표시 중인) 메인 종목코드
      prices: {}, // 각 종목의 최신 가격 저장 객체 { AAPL: 182.5, TSLA: 250.1, ... }
      loading: false, // 시세 조회 API 로딩 중 여부
      error: null, // 에러 발생 시 메시지 저장
      portfolio: { AAPL: { qty: 10, avgPrice: 170.5 } }, // 보유 주식 정보 { 종목: { 수량, 매수평단가 } }

      // 관심 종목 추가 액션
      addToWatchlist: (symbol) => {
        const { watchlist, fetchPrice } = get()
        if (watchlist.includes(symbol)) return // 이미 등록되어 있으면 중복 추가 방지
        set({ watchlist: [...watchlist, symbol] }) // 배열에 새 종목 추가
        fetchPrice(symbol) // 추가 직후 해당 종목 시세 조회
      },

      // 관심 종목 삭제 액션
      removeFromWatchlist: (symbol) =>
        set((state) => ({ watchlist: state.watchlist.filter((s) => s !== symbol) })),

      // 차트에 표시할 메인 종목 선택 액션
      selectSymbol: (symbol) => set({ selectedSymbol: symbol }),

      // 실시간 차트(StockChart) 등에서 새 시세가 들어올 때 prices 객체만 업데이트해 주는 액션
      setPrice: (symbol, price) =>
        set((state) => ({ prices: { ...state.prices, [symbol]: price } })),

      // 단일 종목 시세 조회 비동기(Async) 액션 (REST API 호출)
      fetchPrice: async (symbol) => {
        set({ loading: true, error: null })
        try {
          const res = await fetch(`/api/stock/${symbol}`)
          if (!res.ok) throw new Error(`${symbol} 시세 조회 실패`)
          const data = await res.json()
          // 성공 시 prices 상태 객체 갱신 및 로딩 완료
          set((state) => ({ prices: { ...state.prices, [symbol]: data.price }, loading: false }))
        } catch (err) {
          set({ error: err.message, loading: false })
        }
      },

      // 관심 종목 전체의 시세를 병렬(Promise.all)로 한번에 조회하는 액션
      fetchAllPrices: async () => {
        const { watchlist, fetchPrice } = get()
        await Promise.all(watchlist.map((s) => fetchPrice(s)))
      },

      // 주식 매수(Buy) 액션: 수량 추가 및 매수 평단가(이동평균) 계산
      buyStock: (symbol, qty, price) => {
        const { portfolio } = get()
        const existing = portfolio[symbol]
        if (existing) {
          // 이미 보유 중인 경우: 기존 수량 + 신규 수량, 평단가 재계산
          const totalQty = existing.qty + qty
          const totalCost = existing.qty * existing.avgPrice + qty * price
          set((state) => ({ portfolio: { ...state.portfolio, [symbol]: { qty: totalQty, avgPrice: totalCost / totalQty } } }))
        } else {
          // 신규 매수인 경우: 지정된 수량과 매수가로 새로 등록
          set((state) => ({ portfolio: { ...state.portfolio, [symbol]: { qty, avgPrice: price } } }))
        }
      },

      // 주식 매도(Sell) 액션: 수량 차감 및 전량 매도 시 객체에서 삭제
      sellStock: (symbol, qty) => {
        const { portfolio } = get()
        const existing = portfolio[symbol]
        if (!existing) return
        const remain = existing.qty - qty
        if (remain <= 0) {
          // 남은 수량이 0 이하면 포트폴리오에서 삭제
          set((state) => {
            const next = { ...state.portfolio }
            delete next[symbol]
            return { portfolio: next }
          })
        } else {
          // 잔여 수량 반영
          set((state) => ({ portfolio: { ...state.portfolio, [symbol]: { ...existing, qty: remain } } }))
        }
      },
    }),
    {
      name: 'stock-dashboard', // localStorage에 저장될 키 이름
      // partialize: localStorage에 영구 저장할 특정 상태 필드만 추출
      partialize: (state) => ({
        theme: state.theme, // 테마 상태 저장
        watchlist: state.watchlist, // 관심 종목 목록 저장
        selectedSymbol: state.selectedSymbol, // 선택된 종목 저장
        portfolio: state.portfolio, // 보유 포트폴리오 저장
      }),
    }
  )
)

export default useStockStore

