// ═══════════════════════════════════════════════════════════════════
// 📄 StockChart.jsx — 실시간 가격 추이 영역 차트 (기능 4)
// ───────────────────────────────────────────────────────────────────
// 역할   : 2단계로 차트를 그린다.
//   1단계(useEffect #1): /api/stock/[symbol]/chart 를 fetch → 차트의 "초기 모양"
//   2단계(useEffect #2): WebSocket으로 실시간 체결가를 받아 점을 계속 이어 붙임
// props  : symbol — 선택 종목
// 왜 2단계? 첫 데이터도 없는 상태에서 실시간 점부터 붙이면 순서가 꼬여서,
//   초기 로딩(isLoading)이 끝난 "후에만" WebSocket을 연결한다 (13강 패턴)
// ═══════════════════════════════════════════════════════════════════
'use client'
import { useState, useEffect } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import Skeleton from '@/components/Skeleton'
import EmptyState from '@/components/EmptyState'

// 커스텀 툴팁: 마우스 올렸을 때 시간+가격 보여주기.
// Recharts가 active(툴팁 켜짐?), payload(그 지점의 데이터), label(x축 값)을 넣어서 불러준다.
function CustomTooltip({ active, payload, label }) {
    // active가 false거나 payload가 비어있으면 아무것도 안 보여주기 (null 리턴)
    if (!active || !payload || !payload.length) return null

    return (
        // 색상은 var(--chart-...) = globals.css의 테마 연동 CSS 변수 (라이트/다크 자동 대응)
        <div style={{ background: 'var(--chart-tooltip-bg)', border: '1px solid var(--chart-tooltip-border)', borderRadius: 8, padding: '8px 12px', fontSize: 13, color: 'var(--chart-text)' }}>
            <p>{label}</p>
            <p className="font-mono font-semibold text-stock-green">${payload[0].value.toFixed(2)}</p>
        </div>
    )
}
export default function StockChart({ symbol }) {
    // chartData  → 차트에 그릴 점들의 배열 [{ time: '오후 02:26', price: 130.5 }, ...]
    // isLoading  → 초기 데이터 로딩 중? (true로 시작 → 스켈레톤부터 표시)
    const [chartData, setChartData] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    // ── 1단계 useEffect: 초기 데이터 fetch ──
    useEffect(() => {
        if (!symbol) return

        setIsLoading(true)
        // setChartData([]) 를 fetch "전에" 하는 이유(레이스 컨디션 방지):
        // 종목을 바꾸는 순간 이전 종목의 점들이 화면에 남아 있으면, 새 데이터가
        // 도착하기 전까지 "이전 종목 차트에 새 종목 점이 섞이는" 버그가 생겼었다.
        // 먼저 비우고 시작하면 항상 깨끗한 상태에서 새 데이터가 채워진다.
        setChartData([])
        fetch(`/api/stock/${symbol}/chart`)
            .then(res => res.json())
            // ({ data }) : 응답 객체 { symbol, data }에서 data만 구조분해로 바로 꺼내는 문법
            .then(({ data }) => { setChartData(data); setIsLoading(false) })
            .catch(err => { console.error(err); setIsLoading(false) })
    }, [symbol]) // 종목이 바뀔 때마다 처음부터 다시

    // ── 2단계 useEffect: 실시간 웹소켓 갱신 ──
    useEffect(() => {
        // 초기 로딩이 안 끝났으면 아직 연결하지 않고 대기 (13강 패턴과 동일한 이유:
        // 첫 데이터도 안 왔는데 실시간 점부터 붙이면 순서가 꼬임)
        if (!symbol || isLoading) return

        // WebSocket은 브라우저가 직접 연결하므로 NEXT_PUBLIC_ 키를 쓴다
        const token = process.env.NEXT_PUBLIC_FINNHUB_API_KEY
        const ws = new WebSocket(`wss://ws.finnhub.io?token=${token}`)

        // 연결되면 이 symbol 하나만 구독 (useLiveTicker.js의 onopen 패턴, 종목 1개 버전)
        ws.onopen = () => {
            ws.send(JSON.stringify({ type: 'subscribe', symbol: symbol }))
        }

        ws.onmessage = (event) => {
            const msg = JSON.parse(event.data)
            if (msg.type !== 'trade' || !msg.data?.length) return

            // 한 메시지에 체결이 여러 건 올 수 있는데, 차트에는 가장 최근 것 하나면 충분
            // → 배열의 마지막 항목: msg.data[msg.data.length - 1], .p = 체결가
            const newPrice = msg.data[msg.data.length - 1].p
            const point = {
                time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
                price: parseFloat(newPrice.toFixed(2)),
            }

            // prev.slice(-59) = 기존 점들 중 "뒤에서 59개"만 남기고 + 새 점 1개 추가
            // → 배열이 항상 최신 60개로 유지된다 (무한히 길어져서 느려지는 것 방지)
            setChartData((prev) => [...prev.slice(-59), point])
        }

        ws.onerror = (err) => console.log('websocket 오류:', err)

        // cleanup: useLiveTicker.js에서 했던 것과 같은 패턴 (readyState 체크 포함),
        // 이번엔 symbol 하나만 unsubscribe 하고 연결을 닫는다.
        // 실행 시점: 종목이 바뀌기 직전 + 컴포넌트가 사라질 때
        return () => {
            if (ws.readyState === WebSocket.OPEN)
                ws.send(JSON.stringify({ type: 'unsubscribe', symbol: symbol }))
            ws.close()
        }
    }, [symbol, isLoading]) // isLoading이 true→false로 바뀌는 순간 = 연결 시작 신호



    // ── 가드: 미선택 → 안내 / 로딩 → 스켈레톤 ──
    if (!symbol) return <EmptyState icon="📈" message="종목을 선택하면 실시간 가격 추이 차트가 표시됩니다." className="h-64" />
    if (isLoading) return <Skeleton variant="chart" className="h-64 w-full" />

    return (
        <div className="animate-[fade-in-up_0.25s_ease-out] rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-stock-border dark:bg-stock-card">
            <h3 className="mb-2 text-sm font-bold tracking-tight text-stock-cyan">실시간 가격 추이 — {symbol}</h3>
            {/* [접근성] SVG 차트를 스크린리더에게 소개 */}
            <div role="img" aria-label={`${symbol} 실시간 가격 추이 차트`}>
                <ResponsiveContainer width="100%" height={240}>
                    <AreaChart data={chartData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                        {/* <defs> + linearGradient: SVG 그라디언트 정의.
                            위(민트 35% 불투명)→아래(완전 투명)로 옅어지는 영역 채우기 재료 */}
                        <defs>
                            <linearGradient id="stockChartFill" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#64ffda" stopOpacity={0.35} />
                                <stop offset="100%" stopColor="#64ffda" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        {/* vertical={false}: 세로 격자선 숨김 (가로선만 남겨 덜 어수선하게) */}
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} />
                        {/* interval="preserveStartEnd": x축 라벨이 넘칠 때 처음/끝은 꼭 남기고 중간만 생략 */}
                        <XAxis dataKey="time" tick={{ fontSize: 10, fill: 'var(--chart-tick)' }} interval="preserveStartEnd" />
                        {/* domain={['auto','auto']}: y축 범위를 데이터에 맞게 자동 조절
                            tickFormatter: 눈금 숫자를 "$130" 형태로 표시 */}
                        <YAxis domain={['auto', 'auto']} tick={{ fontSize: 10, fill: 'var(--chart-tick)' }} tickFormatter={(v) => `$${v.toFixed(0)}`} />
                        {/* content={<CustomTooltip />}: 기본 툴팁 대신 위에서 만든 커스텀 툴팁 사용 */}
                        <Tooltip content={<CustomTooltip />} />
                        {/* fill="url(#stockChartFill)": 위에서 정의한 그라디언트를 id로 참조 */}
                        <Area type="monotone" dataKey="price" stroke="#64ffda" strokeWidth={2} fill="url(#stockChartFill)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}
