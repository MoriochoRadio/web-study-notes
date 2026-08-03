// ── STEP 4c: 검색 (Tailwind) ──
// 09강 로직 그대로, 스타일만 Tailwind 클래스 + dark: 변형으로.
'use client'
import { useState, useRef } from 'react'
import useStockStore from '@/app/store/useStockStore'

export default function StockSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const inputRef = useRef(null)
  const addToWatchlist = useStockStore((s) => s.addToWatchlist)

  const handleChange = async (e) => {
    const q = e.target.value
    setQuery(q)
    if (!q.trim()) {
      setResults([])
      return
    }
    const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`)
    const data = await res.json()
    setResults(data.results || [])
  }

  const handleSelect = (symbol) => {
    addToWatchlist(symbol)
    setQuery('')
    setResults([])
    inputRef.current?.focus()
  }

  return (
    <div className="relative p-2">
      <input
        ref={inputRef}
        value={query}
        onChange={handleChange}
        placeholder="종목 검색 (예: Apple, AAPL)"
        className="w-full px-3 py-2 rounded-lg text-sm
                   border border-gray-300 bg-white text-gray-900
                   dark:border-stock-border dark:bg-[#0a192f] dark:text-stock-light"
      />
      {results.length > 0 && (
        <ul className="absolute left-2 right-2 top-full z-50 mt-1 p-1 list-none rounded-lg shadow-xl
                       border border-gray-200 bg-white dark:border-stock-border dark:bg-stock-card">
          {results.map((r) => (
            <li
              key={r.symbol}
              onClick={() => handleSelect(r.symbol)}
              className="flex justify-between px-3 py-2 rounded-md cursor-pointer
                         hover:bg-gray-100 dark:hover:bg-stock-border"
            >
              <span>
                <strong className="text-stock-cyan">{r.symbol}</strong>
                <span className="ml-2 text-xs text-gray-500 dark:text-stock-muted">{r.name}</span>
              </span>
              <span className="text-[11px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 dark:bg-[#0a192f] dark:text-stock-muted">
                {r.exchange}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
