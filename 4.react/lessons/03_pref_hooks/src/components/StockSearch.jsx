// ── STEP 2: useRef — DOM 접근 & 렌더와 무관한 값 보존 ──
// [컴포넌트 서열]: 2위 (App의 자식이며 StockList와 동급인 검색 전용 독립 컴포넌트)
// 🎬 [2幕 시나리오 무대]: 타자 입력 시 이 컴포넌트만 독자적으로 리렌더링되는 영역
import { useState, useRef } from 'react'
import { STOCKS } from '../data/stocks'

export default function StockSearch() {
    // 💡 1. useState: 값이 바뀌면 화면을 싹 다 다시 그리는 상태 데이터
    const [query, setQuery] = useState('')      // 사용자가 입력창에 타자 친 텍스트 문자열
    const [results, setResults] = useState([])  // 검색 텍스트에 매칭된 주식 데이터 객체 배열

    // 💡 2. useRef 용도① [HTML DOM 접근 손가락]: 실제 <input> 엘리먼트를 직접 손가락으로 가리킴
    const inputRef = useRef(null)

    // 💡 3. useRef 용도② [비밀 메모장]: 화면 렌더링을 일으키지 않고 조용히 렌더 횟수만 세는 카운터
    const renderCount = useRef(0)
    renderCount.current += 1 // 이 컴포넌트 함수가 실행될 때마다 숫자를 1씩 몰래 증가시킴

    /**
     * 💡 4. handleSearch (사용자가 입력창에 타자를 칠 때마다 실행되는 이벤트 핸들러)
     * - [동작 시나리오]:
     *   1. 브라우저가 생성한 이벤트 객체(e)에서 현재 타자 친 글자 e.target.value ('a')를 읽어옴.
     *   2. setQuery('a') 및 setResults([...]) 를 호출하여 화면을 다시 그리라고 리액트에 요청함.
     *   3. useState에 의해 StockSearch가 리렌더링되면서 renderCount.current(숫자 2)가 화면에 출력됨!
     */
    const handleSearch = (e) => {
        const q = e.target.value // onChange가 터진 실제 <input> 태그의 작성된 값
        setQuery(q)

        // 삼항 연산자 (조건 ? 참일때 : 거짓일때)
        setResults(
            q.trim()
                ? STOCKS.filter(
                    // 화살표 함수 중괄호 {} 생략 ➔ 조건식 판단 결과(true/false)가 암시적으로 자동 return 됨
                    // 주식의 symbol 또는 name에 입력어 q가 들어있으면 true 반환 ➔ 검색 결과 배열에 포함!
                    (s) =>
                        s.symbol.toLowerCase().includes(q.toLowerCase()) ||
                        s.name.toLowerCase().includes(q.toLowerCase())
                )
                : [] // 검색어가 없거나 공백이면 빈 배열 반환
        )
    }

    /**
     * 💡 5. handleClear (지우기 버튼 클릭 시 입력값 초기화 및 포커스)
     */
    const handleClear = () => {
        setQuery('')
        setResults([])
        
        // inputRef가 가리키고 있는 실제 <input> HTML 엘리먼트에 커서 포커스를 강제로 부여함!
        inputRef.current.focus()
    }

    return (
        <div style={{ padding: '1rem', maxWidth: '500px' }}>
            {/* setQuery로 화면이 다시 그려질 때, useRef 비밀메모장에 쌓여있던 최신 숫자가 함께 얹혀서 출력됨 */}
            <p style={{ fontSize: '12px', color: '#888' }}>렌더링 횟수: {renderCount.current}</p>

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
                    // .map()으로 찍어내는 각 반복 항목에는 리액트 식별용 고유 번호표 key={s.id} 가 필수!
                    <li key={s.id} style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #eee', marginBottom: '4px', display: 'flex', justifyContent: 'space-between' }}>
                        <span><strong>{s.symbol}</strong> — {s.name}</span>
                        <span style={{ color: s.change >= 0 ? 'blue' : 'red' }}>{s.change >= 0 ? '+' : ''}{s.change}%</span>
                    </li>
                ))}
            </ul>
        </div>
    )
}