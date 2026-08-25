'use client'
import { useEffect } from 'react'
import { useWatchlistStore } from '@/store/useWatchlistStore'

export default function ThemeWrapper({ children }) {
    const theme = useWatchlistStore((s) => s.theme)

    useEffect(() => {
        const root = document.documentElement
        if (theme === 'dark') {
            root.classList.add('dark')
        } else {
            root.classList.remove('dark')
        }
    }, [theme])

    return children
}
