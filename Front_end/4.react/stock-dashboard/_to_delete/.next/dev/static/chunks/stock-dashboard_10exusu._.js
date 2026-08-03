(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/stock-dashboard/src/hooks/useDebounce.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useDebounce",
    ()=>useDebounce
]);
// ── 커스텀 훅: useDebounce ──
// 4.react/lessons/04_custom_hooks 에서 배운 것과 동일한 훅. 실시간 입력값을 delay(ms) 동안
// 지연시켰다가 타이핑이 멈춘 뒤의 최종 값만 반환한다 — 기능 1(스마트 주식 검색)에서
// 키 입력마다 Finnhub API를 호출하지 않도록(무료 호출 한도 보호) 검색어에 적용한다.
var __TURBOPACK__imported__module__$5b$project$5d2f$stock$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/stock-dashboard/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
function useDebounce(value, delay = 300) {
    _s();
    const [debouncedValue, setDebouncedValue] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$stock$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(value);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$stock$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useDebounce.useEffect": ()=>{
            const timer = setTimeout({
                "useDebounce.useEffect.timer": ()=>setDebouncedValue(value)
            }["useDebounce.useEffect.timer"], delay);
            return ({
                "useDebounce.useEffect": ()=>clearTimeout(timer)
            })["useDebounce.useEffect"];
        }
    }["useDebounce.useEffect"], [
        value,
        delay
    ]);
    return debouncedValue;
}
_s(useDebounce, "KDuPAtDOgxm8PU6legVJOb3oOmA=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/stock-dashboard/src/components/StockSearch.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>StockSearch
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$stock$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/stock-dashboard/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$stock$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/stock-dashboard/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$stock$2d$dashboard$2f$src$2f$hooks$2f$useDebounce$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/stock-dashboard/src/hooks/useDebounce.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
// ── 기능 1: 스마트 주식 검색 (Symbol Search) ──
// 종목명(Apple)이나 티커(AAPL)를 입력하면 /api/search 를 호출해 드롭다운으로 추천 목록을 보여준다.
'use client';
;
;
function StockSearch({ onSelect }) {
    _s();
    const [query, setQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$stock$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [results, setResults] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$stock$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isOpen, setIsOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$stock$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [searchError, setSearchError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$stock$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // fetch가 실제로 끝난 검색어를 기억해둔다 — debouncedQuery와 다르면 "아직 요청 진행 중"이라는 뜻
    // (isSearching을 effect 안에서 동기적으로 setState하지 않고, 렌더링 중 비교로 파생시키기 위함)
    const [completedQuery, setCompletedQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$stock$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    // -1 = 아무 항목도 강조되지 않은 상태(키보드 방향키로 드롭다운을 훑을 때 쓰는 인덱스)
    const [highlightedIndex, setHighlightedIndex] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$stock$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(-1);
    const inputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$stock$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // 키 입력마다 바로 fetch하지 않고, 타이핑이 0.3초간 멈춘 뒤의 검색어만 서버로 보낸다.
    const debouncedQuery = (0, __TURBOPACK__imported__module__$5b$project$5d2f$stock$2d$dashboard$2f$src$2f$hooks$2f$useDebounce$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDebounce"])(query, 300);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$stock$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "StockSearch.useEffect": ()=>{
            // 검색어가 비어 있으면 fetch 자체를 하지 않는다 — results를 굳이 여기서 비우지 않아도
            // 아래 visibleResults가 debouncedQuery 기준으로 렌더링을 걸러주므로 화면엔 안 보인다.
            // (effect 본문에서 setState를 동기 호출하면 불필요한 리렌더가 연쇄될 수 있어 지양한다)
            if (!debouncedQuery.trim()) return;
            // AbortController로 "느린 응답이 나중에 도착해 최신 검색어의 결과를 덮어쓰는" 경쟁 상태를 막는다.
            // (예: "a" 요청이 늦게 도착해 "app" 요청보다 나중에 응답하면, 화면에 엉뚱한 결과가 남는 문제)
            const controller = new AbortController();
            fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`, {
                signal: controller.signal
            }).then({
                "StockSearch.useEffect": async (res)=>{
                    if (!res.ok) {
                        const body = await res.json().catch({
                            "StockSearch.useEffect": ()=>({})
                        }["StockSearch.useEffect"]);
                        throw new Error(body.error || `검색 요청 실패 (status ${res.status})`);
                    }
                    return res.json();
                }
            }["StockSearch.useEffect"]).then({
                "StockSearch.useEffect": (data)=>{
                    setResults(data.results || []);
                    setHighlightedIndex(data.results?.length ? 0 : -1);
                    setSearchError(null);
                    setCompletedQuery(debouncedQuery);
                }
            }["StockSearch.useEffect"]).catch({
                "StockSearch.useEffect": (err)=>{
                    if (err.name === 'AbortError') return; // 최신 검색어로 대체된 요청 취소 — 에러 아님
                    console.error('검색 요청 실패:', err);
                    setSearchError('검색 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
                    setResults([]);
                    setCompletedQuery(debouncedQuery);
                }
            }["StockSearch.useEffect"]);
            // 다음 검색어로 넘어가거나 컴포넌트가 사라질 때, 아직 끝나지 않은 이전 요청은 취소한다.
            return ({
                "StockSearch.useEffect": ()=>controller.abort()
            })["StockSearch.useEffect"];
        }
    }["StockSearch.useEffect"], [
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$stock$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "relative w-full max-w-md",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$stock$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
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
            isOpen && isSearching && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$stock$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "absolute top-full z-20 mt-1 w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-center text-sm text-gray-500 shadow-lg dark:border-stock-border dark:bg-stock-card dark:text-stock-muted",
                role: "status",
                children: "🔍 검색 중..."
            }, void 0, false, {
                fileName: "[project]/stock-dashboard/src/components/StockSearch.jsx",
                lineNumber: 125,
                columnNumber: 9
            }, this),
            isOpen && !isSearching && searchError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$stock$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "absolute top-full z-20 mt-1 w-full rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-center text-sm text-red-600 shadow-lg dark:border-stock-red/40 dark:bg-stock-card dark:text-stock-red",
                role: "alert",
                children: searchError
            }, void 0, false, {
                fileName: "[project]/stock-dashboard/src/components/StockSearch.jsx",
                lineNumber: 136,
                columnNumber: 9
            }, this),
            isOpen && !isSearching && !searchError && visibleResults.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$stock$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                id: listboxId,
                role: "listbox",
                "aria-label": "검색 결과",
                className: "absolute top-full z-20 mt-1 max-h-72 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg dark:border-stock-border dark:bg-stock-card",
                children: visibleResults.map((r, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$stock$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                        role: "presentation",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$stock$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$stock$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "flex min-w-0 items-baseline gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$stock$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                            className: "text-stock-cyan",
                                            children: r.symbol
                                        }, void 0, false, {
                                            fileName: "[project]/stock-dashboard/src/components/StockSearch.jsx",
                                            lineNumber: 169,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$stock$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$stock$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
            isOpen && !isSearching && !searchError && debouncedQuery.trim() && visibleResults.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$stock$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
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
_s(StockSearch, "1u1i0ZnM/cnUmPC41DXx9+J3eA4=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$stock$2d$dashboard$2f$src$2f$hooks$2f$useDebounce$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDebounce"]
    ];
});
_c = StockSearch;
var _c;
__turbopack_context__.k.register(_c, "StockSearch");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/stock-dashboard/src/app/page.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>DashboardPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$stock$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/stock-dashboard/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$stock$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/stock-dashboard/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$stock$2d$dashboard$2f$src$2f$components$2f$StockSearch$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/stock-dashboard/src/components/StockSearch.jsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
// ── 기능 1: 스마트 주식 검색 연동 ──
// 아직 기능 2(실시간 시세 대시보드)가 없으므로, 선택한 종목은 우선 텍스트로만 확인한다.
// 다음 기능을 만들 때 이 안내 문구 자리를 <StockQuoteCard symbol={selectedSymbol} />로 교체할 예정.
'use client';
;
;
function DashboardPage() {
    _s();
    const [selectedSymbol, setSelectedSymbol] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$stock$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$stock$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        className: "mx-auto max-w-7xl space-y-6 p-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$stock$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$stock$2d$dashboard$2f$src$2f$components$2f$StockSearch$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                onSelect: setSelectedSymbol
            }, void 0, false, {
                fileName: "[project]/stock-dashboard/src/app/page.js",
                lineNumber: 14,
                columnNumber: 7
            }, this),
            selectedSymbol ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$stock$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-sm text-gray-600 dark:text-stock-muted",
                children: [
                    "선택한 종목: ",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$stock$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
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
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$stock$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
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
_s(DashboardPage, "Uy2aJJVW41RG+qZTr+Qo17ZK/4I=");
_c = DashboardPage;
var _c;
__turbopack_context__.k.register(_c, "DashboardPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/stock-dashboard/node_modules/next/dist/compiled/react/cjs/react-jsx-dev-runtime.development.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$stock$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/stock-dashboard/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
/**
 * @license React
 * react-jsx-dev-runtime.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ "use strict";
"production" !== ("TURBOPACK compile-time value", "development") && function() {
    function getComponentNameFromType(type) {
        if (null == type) return null;
        if ("function" === typeof type) return type.$$typeof === REACT_CLIENT_REFERENCE ? null : type.displayName || type.name || null;
        if ("string" === typeof type) return type;
        switch(type){
            case REACT_FRAGMENT_TYPE:
                return "Fragment";
            case REACT_PROFILER_TYPE:
                return "Profiler";
            case REACT_STRICT_MODE_TYPE:
                return "StrictMode";
            case REACT_SUSPENSE_TYPE:
                return "Suspense";
            case REACT_SUSPENSE_LIST_TYPE:
                return "SuspenseList";
            case REACT_ACTIVITY_TYPE:
                return "Activity";
            case REACT_VIEW_TRANSITION_TYPE:
                return "ViewTransition";
        }
        if ("object" === typeof type) switch("number" === typeof type.tag && console.error("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), type.$$typeof){
            case REACT_PORTAL_TYPE:
                return "Portal";
            case REACT_CONTEXT_TYPE:
                return type.displayName || "Context";
            case REACT_CONSUMER_TYPE:
                return (type._context.displayName || "Context") + ".Consumer";
            case REACT_FORWARD_REF_TYPE:
                var innerType = type.render;
                type = type.displayName;
                type || (type = innerType.displayName || innerType.name || "", type = "" !== type ? "ForwardRef(" + type + ")" : "ForwardRef");
                return type;
            case REACT_MEMO_TYPE:
                return innerType = type.displayName || null, null !== innerType ? innerType : getComponentNameFromType(type.type) || "Memo";
            case REACT_LAZY_TYPE:
                innerType = type._payload;
                type = type._init;
                try {
                    return getComponentNameFromType(type(innerType));
                } catch (x) {}
        }
        return null;
    }
    function testStringCoercion(value) {
        return "" + value;
    }
    function checkKeyStringCoercion(value) {
        try {
            testStringCoercion(value);
            var JSCompiler_inline_result = !1;
        } catch (e) {
            JSCompiler_inline_result = !0;
        }
        if (JSCompiler_inline_result) {
            JSCompiler_inline_result = console;
            var JSCompiler_temp_const = JSCompiler_inline_result.error;
            var JSCompiler_inline_result$jscomp$0 = "function" === typeof Symbol && Symbol.toStringTag && value[Symbol.toStringTag] || value.constructor.name || "Object";
            JSCompiler_temp_const.call(JSCompiler_inline_result, "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.", JSCompiler_inline_result$jscomp$0);
            return testStringCoercion(value);
        }
    }
    function getTaskName(type) {
        if (type === REACT_FRAGMENT_TYPE) return "<>";
        if ("object" === typeof type && null !== type && type.$$typeof === REACT_LAZY_TYPE) return "<...>";
        try {
            var name = getComponentNameFromType(type);
            return name ? "<" + name + ">" : "<...>";
        } catch (x) {
            return "<...>";
        }
    }
    function getOwner() {
        var dispatcher = ReactSharedInternals.A;
        return null === dispatcher ? null : dispatcher.getOwner();
    }
    function UnknownOwner() {
        return Error("react-stack-top-frame");
    }
    function hasValidKey(config) {
        if (hasOwnProperty.call(config, "key")) {
            var getter = Object.getOwnPropertyDescriptor(config, "key").get;
            if (getter && getter.isReactWarning) return !1;
        }
        return void 0 !== config.key;
    }
    function defineKeyPropWarningGetter(props, displayName) {
        function warnAboutAccessingKey() {
            specialPropKeyWarningShown || (specialPropKeyWarningShown = !0, console.error("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)", displayName));
        }
        warnAboutAccessingKey.isReactWarning = !0;
        Object.defineProperty(props, "key", {
            get: warnAboutAccessingKey,
            configurable: !0
        });
    }
    function elementRefGetterWithDeprecationWarning() {
        var componentName = getComponentNameFromType(this.type);
        didWarnAboutElementRef[componentName] || (didWarnAboutElementRef[componentName] = !0, console.error("Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."));
        componentName = this.props.ref;
        return void 0 !== componentName ? componentName : null;
    }
    function ReactElement(type, key, props, owner, debugStack, debugTask) {
        var refProp = props.ref;
        type = {
            $$typeof: REACT_ELEMENT_TYPE,
            type: type,
            key: key,
            props: props,
            _owner: owner
        };
        null !== (void 0 !== refProp ? refProp : null) ? Object.defineProperty(type, "ref", {
            enumerable: !1,
            get: elementRefGetterWithDeprecationWarning
        }) : Object.defineProperty(type, "ref", {
            enumerable: !1,
            value: null
        });
        type._store = {};
        Object.defineProperty(type._store, "validated", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: 0
        });
        Object.defineProperty(type, "_debugInfo", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: null
        });
        Object.defineProperty(type, "_debugStack", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: debugStack
        });
        Object.defineProperty(type, "_debugTask", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: debugTask
        });
        Object.freeze && (Object.freeze(type.props), Object.freeze(type));
        return type;
    }
    function jsxDEVImpl(type, config, maybeKey, isStaticChildren, debugStack, debugTask) {
        var children = config.children;
        if (void 0 !== children) if (isStaticChildren) if (isArrayImpl(children)) {
            for(isStaticChildren = 0; isStaticChildren < children.length; isStaticChildren++)validateChildKeys(children[isStaticChildren]);
            Object.freeze && Object.freeze(children);
        } else console.error("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
        else validateChildKeys(children);
        if (hasOwnProperty.call(config, "key")) {
            children = getComponentNameFromType(type);
            var keys = Object.keys(config).filter(function(k) {
                return "key" !== k;
            });
            isStaticChildren = 0 < keys.length ? "{key: someKey, " + keys.join(": ..., ") + ": ...}" : "{key: someKey}";
            didWarnAboutKeySpread[children + isStaticChildren] || (keys = 0 < keys.length ? "{" + keys.join(": ..., ") + ": ...}" : "{}", console.error('A props object containing a "key" prop is being spread into JSX:\n  let props = %s;\n  <%s {...props} />\nReact keys must be passed directly to JSX without using spread:\n  let props = %s;\n  <%s key={someKey} {...props} />', isStaticChildren, children, keys, children), didWarnAboutKeySpread[children + isStaticChildren] = !0);
        }
        children = null;
        void 0 !== maybeKey && (checkKeyStringCoercion(maybeKey), children = "" + maybeKey);
        hasValidKey(config) && (checkKeyStringCoercion(config.key), children = "" + config.key);
        if ("key" in config) {
            maybeKey = {};
            for(var propName in config)"key" !== propName && (maybeKey[propName] = config[propName]);
        } else maybeKey = config;
        children && defineKeyPropWarningGetter(maybeKey, "function" === typeof type ? type.displayName || type.name || "Unknown" : type);
        return ReactElement(type, children, maybeKey, getOwner(), debugStack, debugTask);
    }
    function validateChildKeys(node) {
        isValidElement(node) ? node._store && (node._store.validated = 1) : "object" === typeof node && null !== node && node.$$typeof === REACT_LAZY_TYPE && ("fulfilled" === node._payload.status ? isValidElement(node._payload.value) && node._payload.value._store && (node._payload.value._store.validated = 1) : node._store && (node._store.validated = 1));
    }
    function isValidElement(object) {
        return "object" === typeof object && null !== object && object.$$typeof === REACT_ELEMENT_TYPE;
    }
    var React = __turbopack_context__.r("[project]/stock-dashboard/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)"), REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"), REACT_PORTAL_TYPE = Symbol.for("react.portal"), REACT_FRAGMENT_TYPE = Symbol.for("react.fragment"), REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode"), REACT_PROFILER_TYPE = Symbol.for("react.profiler"), REACT_CONSUMER_TYPE = Symbol.for("react.consumer"), REACT_CONTEXT_TYPE = Symbol.for("react.context"), REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE = Symbol.for("react.suspense"), REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list"), REACT_MEMO_TYPE = Symbol.for("react.memo"), REACT_LAZY_TYPE = Symbol.for("react.lazy"), REACT_ACTIVITY_TYPE = Symbol.for("react.activity"), REACT_VIEW_TRANSITION_TYPE = Symbol.for("react.view_transition"), REACT_CLIENT_REFERENCE = Symbol.for("react.client.reference"), ReactSharedInternals = React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, hasOwnProperty = Object.prototype.hasOwnProperty, isArrayImpl = Array.isArray, createTask = console.createTask ? console.createTask : function() {
        return null;
    };
    React = {
        react_stack_bottom_frame: function(callStackForError) {
            return callStackForError();
        }
    };
    var specialPropKeyWarningShown;
    var didWarnAboutElementRef = {};
    var unknownOwnerDebugStack = React.react_stack_bottom_frame.bind(React, UnknownOwner)();
    var unknownOwnerDebugTask = createTask(getTaskName(UnknownOwner));
    var didWarnAboutKeySpread = {};
    exports.Fragment = REACT_FRAGMENT_TYPE;
    exports.jsxDEV = function(type, config, maybeKey, isStaticChildren) {
        var trackActualOwner = 1e4 > ReactSharedInternals.recentlyCreatedOwnerStacks++;
        if (trackActualOwner) {
            var previousStackTraceLimit = Error.stackTraceLimit;
            Error.stackTraceLimit = 10;
            var debugStackDEV = Error("react-stack-top-frame");
            Error.stackTraceLimit = previousStackTraceLimit;
        } else debugStackDEV = unknownOwnerDebugStack;
        return jsxDEVImpl(type, config, maybeKey, isStaticChildren, debugStackDEV, trackActualOwner ? createTask(getTaskName(type)) : unknownOwnerDebugTask);
    };
}();
}),
"[project]/stock-dashboard/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$stock$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/stock-dashboard/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
'use strict';
if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
else {
    module.exports = __turbopack_context__.r("[project]/stock-dashboard/node_modules/next/dist/compiled/react/cjs/react-jsx-dev-runtime.development.js [app-client] (ecmascript)");
}
}),
]);

//# sourceMappingURL=stock-dashboard_10exusu._.js.map