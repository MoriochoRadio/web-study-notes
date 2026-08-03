// ═══════════════════════════════════════════════════════════════════
// 📄 StockSearch.jsx — 디바운스 종목 검색창 + 결과 드롭다운 (기능 1)
// ───────────────────────────────────────────────────────────────────
// 역할   : 입력이 0.3초 멈추면 /api/search를 호출해 드롭다운으로 결과를 띄우고,
//          하나를 고르면 부모(page.js)의 selectedSymbol을 바꾼다.
// props  : onSelect — 부모가 내려준 "선택 알림" 콜백 (= setSelectedSymbol)
// 상태 흐름 한눈에:
//   query(실시간 입력) ──0.3초 디바운스──▶ debouncedQuery ──useEffect──▶ fetch ──▶ results
// ═══════════════════════════════════════════════════════════════════
'use client'
import { useState, useEffect, useRef } from 'react'
import { useDebounce } from '@/hooks/useDebounce'

export default function StockSearch({ onSelect }) {
    // useRef(null): input DOM에 직접 접근하기 위한 손잡이.
    // <input ref={inputRef}>로 연결해두면 inputRef.current가 실제 input 요소가 되어
    // .focus() 같은 DOM 메서드를 직접 부를 수 있다 (지우기/선택 후 커서 되돌리기용)
    const inputRef = useRef(null)

    // query      → 입력창의 실시간 값 (한 글자 칠 때마다 즉시 갱신)
    // setQuery   → 그 값을 바꾸는 리모컨 버튼
    const [query, setQuery] = useState('')

    // 훅 조합의 핵심: query를 useDebounce에 통과시키면
    // "0.3초 타이핑이 멈춘 뒤의 값"이 debouncedQuery로 나온다.
    // → API 호출은 query가 아니라 이 debouncedQuery에 반응하게 만든다 (요청 폭주 방지)
    const debouncedQuery = useDebounce(query, 300)

    // results → 드롭다운에 뿌릴 검색 결과 배열 [{ symbol, name, type }, ...]
    const [results, setResults] = useState([])

    useEffect(() => {
        // 검색어가 비어있으면(공백 포함) 결과를 비우고 API를 부르지 않는다
        if (!debouncedQuery.trim()) { setResults([]); return; }
        else {
            // /api/search 호출 → Response를 json으로 풀고 → results 상태에 저장
            // (응답 shape: { results: [...] } — search route.js가 정한 모양)
            fetch('/api/search?q=' + debouncedQuery)
                .then(res => res.json())
                .then(data => setResults(data.results))
        }
    }, [debouncedQuery]) // 실시간 query가 아니라 "확정된" debouncedQuery가 바뀔 때만 실행!

    // 입력 이벤트 → query 갱신 (제어 컴포넌트 패턴: 입력값을 React 상태가 소유)
    const handleSearch = (e) => { setQuery(e.target.value) }

    // "지우기" 버튼: 검색어/결과를 모두 비우고 커서를 입력창으로 되돌림
    const handleClear = () => {
        setQuery('')
        setResults([])
        inputRef.current.focus()
    }

    // ① 종목을 선택하면 onSelect(symbol)로 부모에게 알리고,
    //    오버레이(드롭다운)가 선택 후에도 떠 있지 않도록 query와 results를 둘 다 비운다
    const handleSelect = (symbol) => {
        onSelect(symbol)
        setQuery('')
        setResults([])
        inputRef.current.focus()
    }

    // ── 파생 값 2개: 새 상태(useState)를 만들지 않고, 이미 있는 상태들을 "조합"만 해서 계산 ──
    // 검색은 끝났는데(디바운스가 최신 입력을 따라잡음) 결과가 0건일 때만 "결과 없음"을
    // 보여준다. query와 debouncedQuery를 비교하는 이유: "지우기"를 누르면 query는 바로
    // 비워지지만 debouncedQuery는 디바운스 훅 내부에서 300ms 뒤에야 따라오므로, 이 둘이
    // 같을 때만 판단해야 "지우기" 직후 결과 없음 문구가 잠깐 잘못 뜨는 걸 막을 수 있다.
    const showNoResults = debouncedQuery.trim() && query.trim() === debouncedQuery.trim() && results.length === 0
    // 반대로 둘이 아직 다르면 = 디바운스 대기 중(곧 검색이 나감) → 입력창 안에 작은
    // "검색 중" 점을 띄워 피드백을 준다. fetch 진행 상태까지는 알 수 없지만(그건 로직
    // 영역), 최소한 타이핑 직후 무반응 구간은 없앤다.
    const isWaiting = query.trim() && query.trim() !== debouncedQuery.trim()

    return (
        // ② 바깥 div의 relative + 아래 <ul>의 absolute 조합 = 드롭다운이 문서 흐름을
        //    밀어내지 않고 다른 콘텐츠 "위에 떠 있는" 오버레이가 되는 핵심 장치.
        //    top-full(입력창 바로 아래) + left-0 right-0(입력창 너비만큼) + z-50(맨 위층)
        <div className="relative max-w-lg">
            {/* sr-only 라벨: 화면에는 안 보이지만 스크린리더가 "이 입력창이 뭔지" 읽어줌 */}
            <label htmlFor="stock-search-input" className="sr-only">종목 검색</label>
            <div className="flex gap-2">
                <div className="relative flex-1">
                    {/* 돋보기 아이콘: pointer-events-none = 클릭이 아이콘에 안 막히고 input으로 통과 */}
                    <span aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 dark:text-stock-muted">
                        🔍
                    </span>
                    <input
                        id="stock-search-input"
                        ref={inputRef}
                        value={query}            // 제어 컴포넌트: 표시값은 항상 React 상태와 일치
                        onChange={handleSearch}
                        placeholder="종목 검색 (예: AAPL, Tesla)"
                        autoComplete="off"       // 브라우저 자동완성 끔 (티커 입력에 방해)
                        autoCorrect="off"        // 모바일 자동수정 끔
                        spellCheck={false}       // 'AAPL'에 빨간 밑줄 안 생기게
                        // pl-9: 돋보기 자리 확보 / pr-8: 검색중 점 자리 확보
                        // focus:ring-2 = 포커스 시 하늘색 링 (지금 어디에 커서가 있는지 명확히)
                        className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-8 text-sm text-gray-900 transition-colors
                                   placeholder:text-gray-400 focus:border-stock-cyan focus:outline-none focus:ring-2 focus:ring-stock-cyan/30
                                   dark:border-stock-border dark:bg-stock-card dark:text-stock-light dark:placeholder:text-stock-muted"
                        autoFocus                // 페이지 열리자마자 커서가 여기에
                    />
                    {/* "검색 준비 중" 맥동 점: isWaiting일 때만 입력창 오른쪽에 표시 */}
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

            {/* 스크린리더용 실시간 알림 영역: aria-live="polite" = 내용이 바뀌면
                (하던 말 끝나고) 읽어줌. sr-only라 눈에는 안 보임 */}
            <div aria-live="polite" className="sr-only">
                {results.length > 0 ? `검색 결과 ${results.length}건` : showNoResults ? '검색 결과 없음' : ''}
            </div>

            {/* 결과 없음 안내 (조건은 위 showNoResults 주석 참고) */}
            {showNoResults && (
                <div className="absolute top-full left-0 right-0 z-50 mt-2 rounded-lg border border-gray-200 bg-white p-3 text-center text-sm text-gray-500 shadow-xl dark:border-stock-border dark:bg-stock-card dark:text-stock-muted">
                    {/* &lsquo;/&rsquo; = 타이포그래피용 홑따옴표. JSX에서 '를 그냥 쓰면 eslint 에러 */}
                    &lsquo;{debouncedQuery}&rsquo;에 대한 검색 결과가 없습니다.
                </div>
            )}

            {/* 결과 드롭다운: results가 있을 때만 렌더링 (조건부 렌더링) */}
            {results.length > 0 && (
                <ul role="listbox" className="absolute top-full left-0 right-0 z-50 mt-2 max-h-80 overflow-auto rounded-lg border border-gray-200 bg-white p-1 shadow-xl dark:border-stock-border dark:bg-stock-card">
                    {results.map((s) => (
                        // role="none": li 자체는 의미 없는 껍데기라고 표시 (실제 옵션은 안의 button)
                        <li key={s.symbol} role="none">
                            {/* ⭐ 접근성 핵심: div/li + onClick 이 아니라 진짜 <button>을 쓴다!
                                버튼은 Tab 포커스, Enter/Space 실행, 스크린리더 인식을
                                브라우저가 공짜로 제공한다 (직접 키보드 핸들러 짤 필요 없음) */}
                            <button
                                type="button"
                                role="option"
                                aria-selected="false"
                                onClick={() => handleSelect(s.symbol)}
                                // focus-visible:... = 키보드 포커스 시 hover와 같은 강조 표시
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
