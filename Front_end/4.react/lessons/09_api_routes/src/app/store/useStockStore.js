// 08강과 동일한 스토어 (아직 async 없음 — 10강에서 fetch 추가)
import { create } from 'zustand'

const useStockStore = create((set, get) => ({
  watchlist: ['AAPL', 'TSLA', 'MSFT'],
  selectedSymbol: 'AAPL',
  prices: { AAPL: 182.52, TSLA: 248.5, MSFT: 378.85 },

  addToWatchlist: (symbol) => {
    const { watchlist } = get()
    if (watchlist.includes(symbol)) return
    set({ watchlist: [...watchlist, symbol] })
  },
  removeFromWatchlist: (symbol) =>
    set((state) => ({ watchlist: state.watchlist.filter((s) => s !== symbol) })),
  selectSymbol: (symbol) => set({ selectedSymbol: symbol }),
  setPrice: (symbol, price) =>
    set((state) => ({ prices: { ...state.prices, [symbol]: price } })),
}))

export default useStockStore
