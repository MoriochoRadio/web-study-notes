// ── [StockSearch.jsx] 검색창 컴포넌트 전체 해설 ──
//
// 🎯 이 컴포넌트의 목적:
// 1. 사용자가 검색창에 타자를 칩니다 (예: "a", "ap", "app").
// 2. 타자를 칠 때마다 /api/search 백엔드 서버에 "이 글자로 시작하는 주식 찾아줘!" 요청을 보냅니다.
// 3. 서버가 찾아준 주식 목록을 검색창 아래에 드롭다운(목록)으로 보여줍니다.
// 4. 사용자가 드롭다운에서 주식을 클릭하면 관심종목에 추가하고 검색창을 깨끗하게 비웁니다.

'use client' // 브라우저 이벤트(onChange, onClick)와 리액트 State를 사용하기 위한 필수 선언

import { useState, useRef } from 'react'
import useStockStore from '@/app/store/useStockStore'

export default function StockSearch() {
  // ─────────────────────────────────────────────────────────
  // 📌 1단계: 변수 및 상태(State) 준비하기
  // ─────────────────────────────────────────────────────────
  
  // query: 사용자가 입력창에 타자 친 '글자'를 기억합니다. (기본값: 빈문자열 '')
  const [query, setQuery] = useState('')

  // results: 백엔드 서버에서 찾아온 '주식 결과 배열'을 기억합니다. (기본값: 빈배열 [])
  const [results, setResults] = useState([])

  // inputRef: 검색 완료 후 입력창에 커서를 다시 '반짝반짝' 포커스 띄우기 위한 도구
  const inputRef = useRef(null)

  // addToWatchlist: Zustand 전역 저장소에서 "관심종목 추가 함수"를 가져옵니다.
  const addToWatchlist = useStockStore((s) => s.addToWatchlist)

  // ─────────────────────────────────────────────────────────
  // 📌 2단계: 사용자가 타자를 칠 때마다 실행되는 함수 (handleChange)
  // ─────────────────────────────────────────────────────────
  const handleChange = async (e) => {
    // ① e.target.value : 방금 막 입력창에 타자 친 글자 전체 (예: "app")
    const q = e.target.value
    
    // ② setQuery(q) : 입력창 화면에 방금 친 글자가 실시간으로 보이도록 State 갱신
    setQuery(q)

    // ③ [예외 처리] 만약 사용자가 글자를 백스페이스로 다 지워서 공백이 된 경우!
    //    공백만 있을 때는 서버에 검색 요청을 보낼 필요가 없으므로 
    //    검색 결과 목록을 비우고(setResults([])) 즉시 함수를 종료(return)합니다.
    if (!q.trim()) {
      setResults([])
      return
    }

    // ④ [서버 요청] 백엔드 API 주소(/api/search?q=app)로 검색 요청을 보냅니다.
    // - fetch()는 서버에 요청을 보내고 응답이 올 때까지 기다립니다 (await)
    // - encodeURIComponent(q)는 "한글"이나 "공백"을 쳤을 때 URL 주소가 깨지지 않게 변환해 줍니다.
    const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`)

    // ⑤ [데이터 변환] 서버에서 전송받은 'JSON 텍스트 상자(res)'를 뜯어서
    //    자바스크립트가 점(.) 찍어서 쓸 수 있는 진짜 '객체/배열 데이터(data)'로 변환합니다.
    const data = await res.json()

    // ⑥ [결과 저장] 서버가 찾아준 주식 배열(data.results)을 results State에 보관합니다.
    //    이제 results에 데이터가 들어가면서 화면 아래에 드롭다운 목록이 짠! 하고 나타납니다.
    setResults(data.results || [])
  }

  // ─────────────────────────────────────────────────────────
  // 📌 3단계: 드롭다운 검색 결과 중에서 하나를 클릭했을 때 (handleSelect)
  // ─────────────────────────────────────────────────────────
  const handleSelect = (symbol) => {
    // ① 클릭한 주식 종목 코드(예: "AAPL")를 Zustand 관심종목에 추가합니다.
    addToWatchlist(symbol)

    // ② 검색이 끝났으므로 입력창 글자(query)를 다시 빈칸('')으로 비웁니다.
    setQuery('')

    // ③ 드롭다운 검색 결과 목록(results)도 빈배열([])로 만들어 화면에서 감춥니다.
    setResults([])

    // ④ inputRef.current?.focus() : 사용자가 다음 검색을 바로 할 수 있도록 입력창에 커서를 다시 띄웁니다.
    // - ?. (옵셔널 체이닝): inputRef가 비어있을 때 에러로 앱이 튕기지 않게 보호하는 안전장치
    inputRef.current?.focus()
  }

  // ─────────────────────────────────────────────────────────
  // 📌 4단계: 화면에 보여줄 HTML (JSX)
  // ─────────────────────────────────────────────────────────
  return (
    <div style={{ position: 'relative', padding: '1rem' }}>
      
      {/* 1) 검색 입력창 */}
      <input
        ref={inputRef}          // 3단계의 포커스(focus) 기능을 위한 연결고리
        value={query}           // 2단계에서 관리하는 타자 친 글자
        onChange={handleChange} // 타자 칠 때마다 2단계 함수 실행!
        placeholder="종목 검색 (예: Apple, AAPL)"
        style={{
          width: '100%', padding: '10px 14px', borderRadius: '8px',
          border: '1px solid #0f3460', background: '#0a192f', color: '#ccd6f6', fontSize: '14px'
        }}
      />

      {/* 2) 검색 결과 드롭다운 목록 (결과 배열(results)에 데이터가 1개 이상 있을 때만 화면에 띄움) */}
      {results.length > 0 && (
        <ul
          style={{
            position: 'absolute', top: '100%', left: '1rem', right: '1rem',
            background: '#0d2137', border: '1px solid #0f3460', borderRadius: '8px',
            listStyle: 'none', padding: '4px', margin: 0, zIndex: 100
          }}
        >
          {/* results 배열을 하나씩 돌면서(map) 주식 항목(li)으로 출력 */}
          {results.map((r) => (
            <li
              key={r.symbol}
              onClick={() => handleSelect(r.symbol)} // 주식 클릭 시 3단계 함수 실행!
              style={{
                padding: '10px 12px', cursor: 'pointer', borderRadius: '6px',
                display: 'flex', justifyContent: 'space-between'
              }}
            >
              <span>
                {/* 종목 코드 (예: AAPL) */}
                <strong style={{ color: '#61dafb' }}>{r.symbol}</strong>
                {/* 회사 이름 (예: Apple Inc.) */}
                <span style={{ color: '#8892b0', marginLeft: '8px', fontSize: '13px' }}>{r.name}</span>
              </span>
              
              {/* 거래소 이름 (예: NASDAQ) */}
              <span style={{ fontSize: '11px', padding: '2px 6px', borderRadius: '4px', background: '#0a192f', color: '#8892b0' }}>
                {r.exchange}
              </span>
            </li>
          ))}
        </ul>
      )}

      {/* 3) 📌 [슬라이드 과제 핵심] 검색어는 입력했지만(query.trim()), 결과가 0개(results.length === 0)일 때만 안내 문구 표시 */}
      {query.trim() && results.length === 0 && (
        <p style={{
          position: 'absolute', top: '100%', left: '1rem', right: '1rem',
          background: '#0d2137', border: '1px solid #0f3460', borderRadius: '8px',
          padding: '12px', color: '#8892b0', fontSize: '13px', margin: 0, textAlign: 'center', zIndex: 100
        }}>
          검색 결과가 없습니다
        </p>
      )}
    </div>
  )
}
