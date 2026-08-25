'use client'
import { useState, useEffect, useRef } from 'react'
import { useDebounce } from '@/hooks/useDebounce'

export default function StockSearch({ onSelect }) {
    const inputRef = useRef(null)

    const [query, setQuery] = useState('')

    const debouncedQuery = useDebounce(query, 300)

    const [results, setResults] = useState([])

    useEffect(() => {
        if (!debouncedQuery.trim()) { setResults([]); return; }
        else {
            fetch('/api/search?q=' + debouncedQuery)
                .then(res => res.json())
                .then(data => setResults(data.results))
        }
    }, [debouncedQuery])

    const handleSearch = (e) => { setQuery(e.target.value) }

    const handleClear = () => {
        setQuery('')
        setResults([])
        inputRef.current.focus()
    }

    const handleSelect = (symbol) => {
        onSelect(symbol)
        setQuery('')
        setResults([])
        inputRef.current.focus()
    }

    const showNoResults = debouncedQuery.trim() && query.trim() === debouncedQuery.trim() && results.length === 0
    const isWaiting = query.trim() && query.trim() !== debouncedQuery.trim()

    return (
        <div className="relative max-w-lg">
            <label htmlFor="stock-search-input" className="sr-only">종목 검색</label>
            <div className="flex gap-2">
                <div className="relative flex-1">
                    <span aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 dark:text-stock-muted">
                        🔍
                    </span>
                    <input
                        id="stock-search-input"
                        ref={inputRef}
                        value={query}
                        onChange={handleSearch}
                        placeholder="종목 검색 (예: AAPL, Tesla)"
                        autoComplete="off"
                        autoCorrect="off"
                        spellCheck={false}
                        className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-8 text-sm text-gray-900 transition-colors
                                   placeholder:text-gray-400 focus:border-stock-cyan focus:outline-none focus:ring-2 focus:ring-stock-cyan/30
                                   dark:border-stock-border dark:bg-stock-card dark:text-stock-light dark:placeholder:text-stock-muted"
                        autoFocus
                    />
                    {isWaiting && (
                        <span
                            aria-hidden="true"
                            className="pointer-events-none absolute right-3 top-1/2 h-2 w-2 -translate-y-1/2 animate-pulse rounded-full bg-stock-cyan/70"
                        />
                    )}
                </div>
                <button
                    onClick={handleClear}
                    className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-600 transition-colors hover:border-stock-red/50 hover:bg-gray-100 hover:text-stock-red focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stock-cyan/60 dark:border-stock-border dark:text-stock-muted dark:hover:bg-stock-border"
                >
                    지우기
                </button>
            </div>

            <div aria-live="polite" className="sr-only">
                {results.length > 0 ? `검색 결과 ${results.length}건` : showNoResults ? '검색 결과 없음' : ''}
            </div>

            {showNoResults && (
                <div className="absolute top-full left-0 right-0 z-50 mt-2 rounded-lg border border-gray-200 bg-white p-3 text-center text-sm text-gray-500 shadow-xl dark:border-stock-border dark:bg-stock-card dark:text-stock-muted">
                    &lsquo;{debouncedQuery}&rsquo;에 대한 검색 결과가 없습니다.
                </div>
            )}

            {results.length > 0 && (
                <ul role="listbox" className="absolute top-full left-0 right-0 z-50 mt-2 max-h-80 overflow-auto rounded-lg border border-gray-200 bg-white p-1 shadow-xl dark:border-stock-border dark:bg-stock-card">
                    {results.map((s) => (
                        <li key={s.symbol} role="none">
                            <button
                                type="button"
                                role="option"
                                aria-selected="false"
                                onClick={() => handleSelect(s.symbol)}
                                className="flex w-full justify-between rounded-md border-l-2 border-transparent px-3 py-2 text-left transition-colors hover:border-stock-cyan hover:bg-gray-100 focus-visible:border-stock-cyan focus-visible:bg-gray-100 focus-visible:outline-none dark:hover:bg-stock-border dark:focus-visible:bg-stock-border"
                            >
                                <span><strong className="text-stock-cyan">{s.symbol}</strong> — <span className="text-gray-500 dark:text-stock-muted">{s.name}</span></span>
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
