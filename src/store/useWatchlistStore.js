import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useWatchlistStore = create(
    persist(
        (set, get) => ({
            watchlist: [],

            addSymbol: (symbol) => set((state) => ({
                watchlist: state.watchlist.includes(symbol)
                    ? state.watchlist
                    : [...state.watchlist, symbol]
            })),

            removeSymbol: (symbol) => set((state) => ({
                watchlist: state.watchlist.filter((s) => s !== symbol),
            })),

            isWatched: (symbol) => get().watchlist.includes(symbol),

            theme: 'dark',
            toggleTheme: () => set((state) => ({
                theme: state.theme === 'dark' ? 'light' : 'dark',
            })),
        }),
        {
            name: 'watchlist-storage',
        }
    )
)
