// 10강 스토어 + 테마 상태(theme/toggleTheme) 추가 ── (빈칸 채우기)
// 개념: 다크/라이트도 전역 상태로 두고 persist에 저장.
// 막히면 정답 참고: lessons_edu/12_tailwind_darkmode/app/store/useStockStore.js
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useStockStore = create(
  persist(
    (set, get) => ({
      // ── 테마 상태 (빈칸)
      // TODO: STEP 2 — theme 초기값('dark')과, dark↔light를 뒤집는 toggleTheme 액션을 추가하세요.
      theme: 'dark',
      toggleTheme: () => set((s) => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),

      // ── 앱 상태 (10강 완성본)
      watchlist: ['AAPL', 'TSLA', 'MSFT'],
      selectedSymbol: 'AAPL',
      prices: {},
      loading: false,
      error: null,
      portfolio: { AAPL: { qty: 10, avgPrice: 170.5 } },

      addToWatchlist: (symbol) => {
        const { watchlist, fetchPrice } = get()
        if (watchlist.includes(symbol)) return
        set({ watchlist: [...watchlist, symbol] })
        fetchPrice(symbol)
      },
      removeFromWatchlist: (symbol) => set((state) => ({ watchlist: state.watchlist.filter((s) => s !== symbol) })),
      selectSymbol: (symbol) => set({ selectedSymbol: symbol }),

      fetchPrice: async (symbol) => {
        set({ loading: true, error: null })
        try {
          const res = await fetch(`/api/stock/${symbol}`)
          if (!res.ok) throw new Error(`${symbol} 시세 조회 실패`)
          const data = await res.json()
          set((state) => ({ prices: { ...state.prices, [symbol]: data.price }, loading: false }))
        } catch (err) {
          set({ error: err.message, loading: false })
        }
      },
      fetchAllPrices: async () => {
        const { watchlist, fetchPrice } = get()
        await Promise.all(watchlist.map((s) => fetchPrice(s)))
      },
      buyStock: (symbol, qty, price) => {
        const { portfolio } = get()
        const existing = portfolio[symbol]
        if (existing) {
          const totalQty = existing.qty + qty
          const totalCost = existing.qty * existing.avgPrice + qty * price
          set((state) => ({ portfolio: { ...state.portfolio, [symbol]: { qty: totalQty, avgPrice: totalCost / totalQty } } }))
        } else {
          set((state) => ({ portfolio: { ...state.portfolio, [symbol]: { qty, avgPrice: price } } }))
        }
      },
      sellStock: (symbol, qty) => {
        const { portfolio } = get()
        const existing = portfolio[symbol]
        if (!existing) return
        const remain = existing.qty - qty
        if (remain <= 0) {
          set((state) => {
            const next = { ...state.portfolio }
            delete next[symbol]
            return { portfolio: next }
          })
        } else {
          set((state) => ({ portfolio: { ...state.portfolio, [symbol]: { ...existing, qty: remain } } }))
        }
      },
    }),
    {
      name: 'stock-dashboard',
      partialize: (state) => ({
        // TODO: STEP 2 — 테마도 저장되도록 theme를 추가하세요.
        theme: state.theme,
        watchlist: state.watchlist,
        selectedSymbol: state.selectedSymbol,
        portfolio: state.portfolio,
      }),
    }
  )
)

export default useStockStore
