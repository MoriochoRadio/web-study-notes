// ── 기능 1: 스마트 주식 검색 (Symbol Search) ──
// 종목명(Apple)이나 티커(AAPL)를 입력하면 /api/search 를 호출해 드롭다운으로 추천 목록을 보여준다.
'use client'

import { useState, useEffect, useRef } from 'react'
import { useDebounce } from '@/hooks/useDebounce'

export default function StockSearch({ onSelect }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [searchError, setSearchError] = useState(null)
  // fetch가 실제로 끝난 검색어를 기억해둔다 — debouncedQuery와 다르면 "아직 요청 진행 중"이라는 뜻
  // (isSearching을 effect 안에서 동기적으로 setState하지 않고, 렌더링 중 비교로 파생시키기 위함)
  const [completedQuery, setCompletedQuery] = useState('')
  // -1 = 아무 항목도 강조되지 않은 상태(키보드 방향키로 드롭다운을 훑을 때 쓰는 인덱스)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const inputRef = useRef(null)

  // 키 입력마다 바로 fetch하지 않고, 타이핑이 0.3초간 멈춘 뒤의 검색어만 서버로 보낸다.
  const debouncedQuery = useDebounce(query, 300)

  useEffect(() => {
    // 검색어가 비어 있으면 fetch 자체를 하지 않는다 — results를 굳이 여기서 비우지 않아도
    // 아래 visibleResults가 debouncedQuery 기준으로 렌더링을 걸러주므로 화면엔 안 보인다.
    // (effect 본문에서 setState를 동기 호출하면 불필요한 리렌더가 연쇄될 수 있어 지양한다)
    if (!debouncedQuery.trim()) return

    // AbortController로 "느린 응답이 나중에 도착해 최신 검색어의 결과를 덮어쓰는" 경쟁 상태를 막는다.
    // (예: "a" 요청이 늦게 도착해 "app" 요청보다 나중에 응답하면, 화면에 엉뚱한 결과가 남는 문제)
    const controller = new AbortController()

    fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`, { signal: controller.signal })
      .then(async (res) => {
        if (!res.ok) {
          const body = await res.json().catch(() => ({}))
          throw new Error(body.error || `검색 요청 실패 (status ${res.status})`)
        }
        return res.json()
      })
      .then((data) => {
        setResults(data.results || [])
        setHighlightedIndex(data.results?.length ? 0 : -1)
        setSearchError(null)
        setCompletedQuery(debouncedQuery)
      })
      .catch((err) => {
        if (err.name === 'AbortError') return // 최신 검색어로 대체된 요청 취소 — 에러 아님
        console.error('검색 요청 실패:', err)
        setSearchError('검색 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.')
        setResults([])
        setCompletedQuery(debouncedQuery)
      })

    // 다음 검색어로 넘어가거나 컴포넌트가 사라질 때, 아직 끝나지 않은 이전 요청은 취소한다.
    return () => controller.abort()
  }, [debouncedQuery])

  // debouncedQuery가 비었을 때는 이전 results가 남아있어도 화면엔 아무것도 보여주지 않는다.
  const visibleResults = debouncedQuery.trim() ? results : []
  // 아직 이 debouncedQuery에 대한 fetch가 안 끝났으면(completedQuery가 다르면) 검색 중인 상태
  const isSearching = Boolean(debouncedQuery.trim()) && completedQuery !== debouncedQuery

  const handleSelect = (symbol) => {
    onSelect?.(symbol)
    setQuery('')
    setResults([])
    setSearchError(null)
    setHighlightedIndex(-1)
    setIsOpen(false)
    inputRef.current?.focus()
  }

  const handleKeyDown = (e) => {
    if (!isOpen || visibleResults.length === 0) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlightedIndex((i) => (i + 1) % visibleResults.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlightedIndex((i) => (i - 1 + visibleResults.length) % visibleResults.length)
    } else if (e.key === 'Enter') {
      if (highlightedIndex >= 0) {
        e.preventDefault()
        handleSelect(visibleResults[highlightedIndex].symbol)
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false)
    }
  }

  const listboxId = 'stock-search-listbox'
  const activeOptionId =
    highlightedIndex >= 0 && visibleResults[highlightedIndex]
      ? `stock-search-option-${visibleResults[highlightedIndex].symbol}`
      : undefined

  return (
    <div className="relative w-full max-w-md">
      <input
        ref={inputRef}
        role="combobox"
        aria-label="종목 검색"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        aria-autocomplete="list"
        aria-activedescendant={activeOptionId}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value)
          setIsOpen(true)
        }}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setTimeout(() => setIsOpen(false), 150)}
        placeholder="종목명 또는 티커 검색 (예: Apple, AAPL)"
        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900
                   placeholder:text-gray-400 focus:border-stock-cyan focus:outline-none focus:ring-1
                   focus:ring-stock-cyan dark:border-stock-border dark:bg-stock-card dark:text-stock-light
                   dark:placeholder:text-stock-muted"
      />

      {isOpen && isSearching && (
        <p
          className="absolute top-full z-20 mt-1 w-full rounded-lg border border-gray-200 bg-white
                     px-4 py-3 text-center text-sm text-gray-500 shadow-lg dark:border-stock-border
                     dark:bg-stock-card dark:text-stock-muted"
          role="status"
        >
          🔍 검색 중...
        </p>
      )}

      {isOpen && !isSearching && searchError && (
        <p
          className="absolute top-full z-20 mt-1 w-full rounded-lg border border-red-200 bg-red-50
                     px-4 py-3 text-center text-sm text-red-600 shadow-lg dark:border-stock-red/40
                     dark:bg-stock-card dark:text-stock-red"
          role="alert"
        >
          {searchError}
        </p>
      )}

      {isOpen && !isSearching && !searchError && visibleResults.length > 0 && (
        <ul
          id={listboxId}
          role="listbox"
          aria-label="검색 결과"
          className="absolute top-full z-20 mt-1 max-h-72 w-full overflow-y-auto rounded-lg border
                     border-gray-200 bg-white shadow-lg dark:border-stock-border dark:bg-stock-card"
        >
          {visibleResults.map((r, idx) => (
            <li key={r.symbol} role="presentation">
              <button
                id={`stock-search-option-${r.symbol}`}
                type="button"
                role="option"
                aria-selected={idx === highlightedIndex}
                // input의 onBlur보다 먼저 실행돼 포커스를 유지시킴 → 드롭다운이 닫히기 전에 클릭이 확정됨
                onMouseDown={(e) => e.preventDefault()}
                onMouseEnter={() => setHighlightedIndex(idx)}
                onClick={() => handleSelect(r.symbol)}
                className={`flex w-full items-center justify-between gap-2 px-4 py-2 text-left text-sm
                           ${idx === highlightedIndex ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
              >
                <span className="flex min-w-0 items-baseline gap-2">
                  <strong className="text-stock-cyan">{r.symbol}</strong>
                  <span className="truncate text-gray-500 dark:text-stock-muted">{r.name}</span>
                </span>
                <span
                  className="shrink-0 rounded bg-gray-100 px-1.5 py-0.5 text-[11px] text-gray-500
                             dark:bg-stock-bg dark:text-stock-muted"
                >
                  {r.type}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {isOpen && !isSearching && !searchError && debouncedQuery.trim() && visibleResults.length === 0 && (
        <p
          className="absolute top-full z-20 mt-1 w-full rounded-lg border border-gray-200 bg-white
                     px-4 py-3 text-center text-sm text-gray-500 shadow-lg dark:border-stock-border
                     dark:bg-stock-card dark:text-stock-muted"
        >
          검색 결과가 없습니다
        </p>
      )}
    </div>
  )
}
