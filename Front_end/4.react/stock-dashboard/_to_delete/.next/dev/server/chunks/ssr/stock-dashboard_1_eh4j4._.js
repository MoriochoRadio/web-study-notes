module.exports = [
"[project]/stock-dashboard/src/hooks/useDebounce.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useDebounce",
    ()=>useDebounce
]);
// ── 커스텀 훅: useDebounce ──
// 4.react/lessons/04_custom_hooks 에서 배운 것과 동일한 훅. 실시간 입력값을 delay(ms) 동안
// 지연시켰다가 타이핑이 멈춘 뒤의 최종 값만 반환한다 — 기능 1(스마트 주식 검색)에서
// 키 입력마다 Finnhub API를 호출하지 않도록(무료 호출 한도 보호) 검색어에 적용한다.
var __TURBOPACK__imported__module__$5b$project$5d2f$stock$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/stock-dashboard/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
;
function useDebounce(value, delay = 300) {
    const [debouncedValue, setDebouncedValue] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$stock$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(value);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$stock$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const timer = setTimeout(()=>setDebouncedValue(value), delay);
        return ()=>clearTimeout(timer);
    }, [
        value,
        delay
    ]);
    return debouncedValue;
}
}),
"[project]/stock-dashboard/src/components/StockSearch.jsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>StockSearch
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$stock$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/stock-dashboard/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$stock$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/stock-dashboard/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$stock$2d$dashboard$2f$src$2f$hooks$2f$useDebounce$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/stock-dashboard/src/hooks/useDebounce.js [app-ssr] (ecmascript)");
// ── 기능 1: 스마트 주식 검색 (Symbol Search) ──
// 종목명(Apple)이나 티커(AAPL)를 입력하면 /api/search 를 호출해 드롭다운으로 추천 목록을 보여준다.
'use client';
;
;
;
function StockSearch({ onSelect }) {
    const [query, setQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$stock$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [results, setResults] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$stock$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isOpen, setIsOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$stock$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [searchError, setSearchError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$stock$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    // fetch가 실제로 끝난 검색어를 기억해둔다 — debouncedQuery와 다르면 "아직 요청 진행 중"이라는 뜻
    // (isSearching을 effect 안에서 동기적으로 setState하지 않고, 렌더링 중 비교로 파생시키기 위함)
    const [completedQuery, setCompletedQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$stock$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    // -1 = 아무 항목도 강조되지 않은 상태(키보드 방향키로 드롭다운을 훑을 때 쓰는 인덱스)
    const [highlightedIndex, setHighlightedIndex] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$stock$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(-1);
    const inputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$stock$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    // 키 입력마다 바로 fetch하지 않고, 타이핑이 0.3초간 멈춘 뒤의 검색어만 서버로 보낸다.
    const debouncedQuery = (0, __TURBOPACK__imported__module__$5b$project$5d2f$stock$2d$dashboard$2f$src$2f$hooks$2f$useDebounce$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useDebounce"])(query, 300);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$stock$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        // 검색어가 비어 있으면 fetch 자체를 하지 않는다 — results를 굳이 여기서 비우지 않아도
        // 아래 visibleResults가 debouncedQuery 기준으로 렌더링을 걸러주므로 화면엔 안 보인다.
        // (effect 본문에서 setState를 동기 호출하면 불필요한 리렌더가 연쇄될 수 있어 지양한다)
        if (!debouncedQuery.trim()) return;
        // AbortController로 "느린 응답이 나중에 도착해 최신 검색어의 결과를 덮어쓰는" 경쟁 상태를 막는다.
        // (예: "a" 요청이 늦게 도착해 "app" 요청보다 나중에 응답하면, 화면에 엉뚱한 결과가 남는 문제)
        const controller = new AbortController();
        fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`, {
            signal: controller.signal
        }).then(async (res)=>{
            if (!res.ok) {
                const body = await res.json().catch(()=>({}));
                throw new Error(body.error || `검색 요청 실패 (status ${res.status})`);
            }
            return res.json();
        }).then((data)=>{
            setResults(data.results || []);
            setHighlightedIndex(data.results?.length ? 0 : -1);
            setSearchError(null);
            setCompletedQuery(debouncedQuery);
        }).catch((err)=>{
            if (err.name === 'AbortError') return; // 최신 검색어로 대체된 요청 취소 — 에러 아님
            console.error('검색 요청 실패:', err);
            setSearchError('검색 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
            setResults([]);
            setCompletedQuery(debouncedQuery);
        });
        // 다음 검색어로 넘어가거나 컴포넌트가 사라질 때, 아직 끝나지 않은 이전 요청은 취소한다.
        return ()=>controller.abort();
    }, [
        debouncedQuery
    ]);
    // debouncedQuery가 비었을 때는 이전 results가 남아있어도 화면엔 아무것도 보여주지 않는다.
    const visibleResults = debouncedQuery.trim() ? results : [];
    // 아직 이 debouncedQuery에 대한 fetch가 안 끝났으면(completedQuery가 다르면) 검색 중인 상태
    const isSearching = Boolean(debouncedQuery.trim()) && completedQuery !== debouncedQuery;
    const handleSelect = (symbol)=>{
        onSelect?.(symbol);
        setQuery('');
        setResults([]);
        setSearchError(null);
        setHighlightedIndex(-1);
        setIsOpen(false);
        inputRef.current?.focus();
    };
    const handleKeyDown = (e)=>{
        if (!isOpen || visibleResults.length === 0) return;
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setHighlightedIndex((i)=>(i + 1) % visibleResults.length);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setHighlightedIndex((i)=>(i - 1 + visibleResults.length) % visibleResults.length);
        } else if (e.key === 'Enter') {
            if (highlightedIndex >= 0) {
                e.preventDefault();
                handleSelect(visibleResults[highlightedIndex].symbol);
            }
        } else if (e.key === 'Escape') {
            setIsOpen(false);
        }
    };
    const listboxId = 'stock-search-listbox';
    const activeOptionId = highlightedIndex >= 0 && visibleResults[highlightedIndex] ? `stock-search-option-${visibleResults[highlightedIndex].symbol}` : undefined;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$stock$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "relative w-full max-w-md",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$stock$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                ref: inputRef,
                role: "combobox",
                "aria-label": "종목 검색",
                "aria-expanded": isOpen,
                "aria-controls": listboxId,
                "aria-autocomplete": "list",
                "aria-activedescendant": activeOptionId,
                value: query,
                onChange: (e)=>{
                    setQuery(e.target.value);
                    setIsOpen(true);
                },
                onKeyDown: handleKeyDown,
                onFocus: ()=>setIsOpen(true),
                onBlur: ()=>setTimeout(()=>setIsOpen(false), 150),
                placeholder: "종목명 또는 티커 검색 (예: Apple, AAPL)",
                className: "w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-stock-cyan focus:outline-none focus:ring-1 focus:ring-stock-cyan dark:border-stock-border dark:bg-stock-card dark:text-stock-light dark:placeholder:text-stock-muted"
            }, void 0, false, {
                fileName: "[project]/stock-dashboard/src/components/StockSearch.jsx",
                lineNumber: 101,
                columnNumber: 7
            }, this),
            isOpen && isSearching && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$stock$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "absolute top-full z-20 mt-1 w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-center text-sm text-gray-500 shadow-lg dark:border-stock-border dark:bg-stock-card dark:text-stock-muted",
                role: "status",
                children: "🔍 검색 중..."
            }, void 0, false, {
                fileName: "[project]/stock-dashboard/src/components/StockSearch.jsx",
                lineNumber: 125,
                columnNumber: 9
            }, this),
            isOpen && !isSearching && searchError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$stock$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "absolute top-full z-20 mt-1 w-full rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-center text-sm text-red-600 shadow-lg dark:border-stock-red/40 dark:bg-stock-card dark:text-stock-red",
                role: "alert",
                children: searchError
            }, void 0, false, {
                fileName: "[project]/stock-dashboard/src/components/StockSearch.jsx",
                lineNumber: 136,
                columnNumber: 9
            }, this),
            isOpen && !isSearching && !searchError && visibleResults.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$stock$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                id: listboxId,
                role: "listbox",
                "aria-label": "검색 결과",
                className: "absolute top-full z-20 mt-1 max-h-72 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg dark:border-stock-border dark:bg-stock-card",
                children: visibleResults.map((r, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$stock$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                        role: "presentation",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$stock$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            id: `stock-search-option-${r.symbol}`,
                            type: "button",
                            role: "option",
                            "aria-selected": idx === highlightedIndex,
                            // input의 onBlur보다 먼저 실행돼 포커스를 유지시킴 → 드롭다운이 닫히기 전에 클릭이 확정됨
                            onMouseDown: (e)=>e.preventDefault(),
                            onMouseEnter: ()=>setHighlightedIndex(idx),
                            onClick: ()=>handleSelect(r.symbol),
                            className: `flex w-full items-center justify-between gap-2 px-4 py-2 text-left text-sm
                           ${idx === highlightedIndex ? 'bg-gray-100 dark:bg-gray-800' : ''}`,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$stock$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "flex min-w-0 items-baseline gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$stock$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                            className: "text-stock-cyan",
                                            children: r.symbol
                                        }, void 0, false, {
                                            fileName: "[project]/stock-dashboard/src/components/StockSearch.jsx",
                                            lineNumber: 169,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$stock$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "truncate text-gray-500 dark:text-stock-muted",
                                            children: r.name
                                        }, void 0, false, {
                                            fileName: "[project]/stock-dashboard/src/components/StockSearch.jsx",
                                            lineNumber: 170,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/stock-dashboard/src/components/StockSearch.jsx",
                                    lineNumber: 168,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$stock$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "shrink-0 rounded bg-gray-100 px-1.5 py-0.5 text-[11px] text-gray-500 dark:bg-stock-bg dark:text-stock-muted",
                                    children: r.type
                                }, void 0, false, {
                                    fileName: "[project]/stock-dashboard/src/components/StockSearch.jsx",
                                    lineNumber: 172,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/stock-dashboard/src/components/StockSearch.jsx",
                            lineNumber: 156,
                            columnNumber: 15
                        }, this)
                    }, r.symbol, false, {
                        fileName: "[project]/stock-dashboard/src/components/StockSearch.jsx",
                        lineNumber: 155,
                        columnNumber: 13
                    }, this))
            }, void 0, false, {
                fileName: "[project]/stock-dashboard/src/components/StockSearch.jsx",
                lineNumber: 147,
                columnNumber: 9
            }, this),
            isOpen && !isSearching && !searchError && debouncedQuery.trim() && visibleResults.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$stock$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "absolute top-full z-20 mt-1 w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-center text-sm text-gray-500 shadow-lg dark:border-stock-border dark:bg-stock-card dark:text-stock-muted",
                children: "검색 결과가 없습니다"
            }, void 0, false, {
                fileName: "[project]/stock-dashboard/src/components/StockSearch.jsx",
                lineNumber: 185,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/stock-dashboard/src/components/StockSearch.jsx",
        lineNumber: 100,
        columnNumber: 5
    }, this);
}
}),
"[project]/stock-dashboard/src/app/page.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>DashboardPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$stock$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/stock-dashboard/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$stock$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/stock-dashboard/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$stock$2d$dashboard$2f$src$2f$components$2f$StockSearch$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/stock-dashboard/src/components/StockSearch.jsx [app-ssr] (ecmascript)");
// ── 기능 1: 스마트 주식 검색 연동 ──
// 아직 기능 2(실시간 시세 대시보드)가 없으므로, 선택한 종목은 우선 텍스트로만 확인한다.
// 다음 기능을 만들 때 이 안내 문구 자리를 <StockQuoteCard symbol={selectedSymbol} />로 교체할 예정.
'use client';
;
;
;
function DashboardPage() {
    const [selectedSymbol, setSelectedSymbol] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$stock$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$stock$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        className: "mx-auto max-w-7xl space-y-6 p-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$stock$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$stock$2d$dashboard$2f$src$2f$components$2f$StockSearch$2e$jsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                onSelect: setSelectedSymbol
            }, void 0, false, {
                fileName: "[project]/stock-dashboard/src/app/page.js",
                lineNumber: 14,
                columnNumber: 7
            }, this),
            selectedSymbol ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$stock$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-sm text-gray-600 dark:text-stock-muted",
                children: [
                    "선택한 종목: ",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$stock$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                        className: "text-stock-cyan",
                        children: selectedSymbol
                    }, void 0, false, {
                        fileName: "[project]/stock-dashboard/src/app/page.js",
                        lineNumber: 18,
                        columnNumber: 19
                    }, this),
                    " — 기능 2(실시간 시세 대시보드)에서 이 자리에 시세 카드가 표시될 예정입니다."
                ]
            }, void 0, true, {
                fileName: "[project]/stock-dashboard/src/app/page.js",
                lineNumber: 17,
                columnNumber: 9
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$stock$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-sm text-gray-500 dark:text-stock-muted",
                children: "🚧 위 검색창에서 종목명이나 티커를 입력해보세요. 기능 2부터 하나씩 계속 만들어 나갑니다."
            }, void 0, false, {
                fileName: "[project]/stock-dashboard/src/app/page.js",
                lineNumber: 22,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/stock-dashboard/src/app/page.js",
        lineNumber: 13,
        columnNumber: 5
    }, this);
}
}),
"[project]/stock-dashboard/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

module.exports = __turbopack_context__.r("[project]/stock-dashboard/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)").vendored['react-ssr'].ReactJsxDevRuntime;
}),
];

//# sourceMappingURL=stock-dashboard_1_eh4j4._.js.map