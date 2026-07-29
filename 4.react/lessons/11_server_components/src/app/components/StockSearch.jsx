// ── 종목 검색 컴포넌트 (StockSearch) ──
// [역할 설명]
// 1. 사용자가 검색창에 키워드를 입력하면 백엔드 검색 API (/api/search?q=)를 호출합니다.
// 2. 검색어와 부합하는 검색 결과 목록을 드롭다운 형태로 보여줍니다.
// 3. 드롭다운 항목을 클릭하면 Zustand 스토어의 addToWatchlist(symbol)를 호출하여 관심종목으로 등록하고 시세를 즉시 가져옵니다.

'use client'
import { useState, useRef } from 'react'
import useStockStore from '@/app/store/useStockStore'

export default function StockSearch() {
  const [query, setQuery] = useState('')       // 입력한 검색어 상태
  const [results, setResults] = useState([])   // API로부터 받아온 검색 결과 목록 상태
  const inputRef = useRef(null)                // input 태그 직접 접근 참조 (검색 후 포커스 이동용)
  const addToWatchlist = useStockStore((s) => s.addToWatchlist) // Zustand 관심종목 추가 액션 가져오기

  // 📌 검색어 입력 시 실행되는 이벤트 핸들러 (실시간 자동완성 API 통신)
  const handleChange = async (e) => {
    const q = e.target.value
    setQuery(q)

    // 입력창이 빈 문자열이거나 공백뿐이면 드롭다운 결과 닫기
    if (!q.trim()) {
      setResults([])
      return
    }

    // 백엔드 API 요청 (/api/search?q=apple 형태로 인코딩하여 요청)
    const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`)
    const data = await res.json()
    setResults(data.results || [])
  }

  // 📌 검색 결과 드롭다운에서 특정한 종목 항목을 클릭했을 때
  const handleSelect = (symbol) => {
    addToWatchlist(symbol) // 스토어에 등록 + 최신 시세 fetchPrice 호출까지 자동 수행
    setQuery('')           // 검색 입력창 텍스트 비우기
    setResults([])         // 드롭다운 목록 닫기
    inputRef.current?.focus() // 다시 검색창으로 마우스 포커스 이동
  }

  return (
    <div style={{ position: 'relative', padding: '1rem' }}>
      {/* 📌 1) 검색어 입력창 */}
      <input
        ref={inputRef}
        value={query}
        onChange={handleChange}
        placeholder="종목 검색 (예: Apple, AAPL)"
        style={{
          width: '100%',
          padding: '10px 14px',
          borderRadius: '8px',
          border: '1px solid #0f3460',
          background: '#0a192f',
          color: '#ccd6f6',
          fontSize: '14px',
        }}
      />

      {/* 📌 2) 검색 결과 드롭다운 목록 */}
      {results.length > 0 && (
        <ul
          style={{
            position: 'absolute',
            top: '100%',
            left: '1rem',
            right: '1rem',
            background: '#0d2137',
            border: '1px solid #0f3460',
            borderRadius: '8px',
            listStyle: 'none',
            padding: '4px',
            margin: 0,
            zIndex: 100,
          }}
        >
          {results.map((r) => (
            <li
              key={r.symbol}
              onClick={() => handleSelect(r.symbol)}
              style={{
                padding: '10px 12px',
                cursor: 'pointer',
                borderRadius: '6px',
                display: 'flex',
                justify: 'space-between',
              }}
            >
              <span>
                <strong style={{ color: '#61dafb' }}>{r.symbol}</strong>
                <span style={{ color: '#8892b0', marginLeft: '8px', fontSize: '13px' }}>
                  {r.name}
                </span>
              </span>
              <span
                style={{
                  fontSize: '11px',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  background: '#0a192f',
                  color: '#8892b0',
                }}
              >
                {r.exchange}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
