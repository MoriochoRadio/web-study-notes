'use client'
import { useState, useEffect, useRef } from 'react'
import { useDebounce } from '@/hooks/useDebounce'


export default function StockSearch() {
    const inputRef = useRef(null)

    const [query, setQuery] = useState('')
    const debouncedQuery = useDebounce(query, 300)

    const [results, setResults] = useState([])

    useEffect(() => {
        // ① debouncedQuery가 비어있으면(trim했을 때 빈 문자열이면) → setResults([]) 하고 끝내기
        if (!debouncedQuery.trim()) { setResults([]); return; }

        // ② 아니면 fetch('/api/search?q=' + debouncedQuery) 호출
        else {
            fetch('/api/search?q=' + debouncedQuery)
                .then(res => res.json())
                .then(data => setResults(data.results))
        }
    }, [debouncedQuery])   // debouncedQuery가 바뀔 때만 이 effect가 다시 실행됨


    const handleSearch = (e) => { setQuery(e.target.value) }
    const handleClear = () => {
        setQuery('')
        setResults([])

        // inputRef가 가리키고 있는 실제 <input> HTML 엘리먼트에 커서 포커스를 강제로 부여함!
        inputRef.current.focus()
    }

    return (
        <div style={{ padding: '1rem', maxWidth: '500px' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
                {/* ref={inputRef} : 이 HTML <input> 엘리먼트를 inputRef 손가락 변수와 실시간 연결함 */}
                <input
                    ref={inputRef}
                    value={query}
                    onChange={handleSearch}
                    placeholder="종목 검색..."
                    style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid #ddd' }}
                    autoFocus
                />
                <button onClick={handleClear}>지우기</button>
            </div>

            {/* 검색 결과 목록 출력 영역 (.map 반복문) */}
            <ul style={{ listStyle: 'none', padding: 0, marginTop: '8px' }}>
                {results.map((s) => (
                    // .map()으로 찍어내는 각 반복 항목에는 리액트 식별용 고유 번호표 key={s.symbol} 가 필수!
                    <li key={s.symbol} style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #eee', marginBottom: '4px', display: 'flex', justifyContent: 'space-between' }}>
                        <span><strong>{s.symbol}</strong> — {s.name}</span>
                    </li>
                ))}
            </ul>
        </div>
    )
}
