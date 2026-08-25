'use client'
import { useWatchlistStore } from '@/store/useWatchlistStore'

export default function ThemeToggle() {
    const theme = useWatchlistStore((s) => s.theme)
    const toggleTheme = useWatchlistStore((s) => s.toggleTheme)

    const isDark = theme === 'dark'

    return (
        <button
            onClick={toggleTheme}
            aria-label="테마 전환"
            aria-pressed={isDark}
            className="group relative inline-flex h-8 w-16 items-center rounded-full border border-gray-300 bg-gray-100 px-1
                       transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-stock-cyan/60
                       dark:border-stock-border dark:bg-stock-card"
        >
            <span
                className={`flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs shadow-md transition-transform duration-300 ease-out
                    dark:bg-stock-bg ${isDark ? 'translate-x-8' : 'translate-x-0'}`}
            >
                {isDark ? '🌙' : '☀️'}
            </span>
        </button>
    )
}
