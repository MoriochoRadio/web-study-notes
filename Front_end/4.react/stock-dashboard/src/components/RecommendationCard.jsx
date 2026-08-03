// ═══════════════════════════════════════════════════════════════════
// 📄 RecommendationCard.jsx — 전문가 투자의견 누적 막대그래프 카드 (기능 5)
// ───────────────────────────────────────────────────────────────────
// 역할   : /api/recommendation을 호출해 Strong Buy ~ Strong Sell 5단계 의견 수를
//          가로 누적 막대 하나로 표시한다.
// props  : symbol — 선택 종목 (null이면 안내 상자)
// 상태 3종 세트(rec/loading/error) + useEffect fetch = 이 프로젝트의 표준 데이터 패턴
// ═══════════════════════════════════════════════════════════════════
'use client'
import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import Skeleton from '@/components/Skeleton'
import EmptyState from '@/components/EmptyState'

export default function RecommendationCard({ symbol }) {
    // rec     → API 응답 { symbol, buy, hold, sell, strongBuy, strongSell }
    // loading → 로딩 중? (true로 시작해야 첫 화면에 스켈레톤이 뜸)
    // error   → 에러 문구 (없으면 null)
    const [rec, setRec] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        // 종목 미선택이면 fetch 자체를 안 함 (아래 가드가 빈 상태 화면을 처리)
        if (!symbol) return

        // 재요청 시작: 로딩 켜고 이전 에러 지우기
        setLoading(true)
        setError(null)
        // fetch 체이닝 (useStockData.js와 같은 패턴):
        //   res.ok 확인 → 실패면 throw로 .catch까지 점프 / 성공이면 json 파싱
        fetch(`/api/recommendation?symbol=${symbol}`)
            .then(res => {
                if (!res.ok) throw new Error('API 호출 실패')
                return res.json()
            })
            .then(data => {
                setRec(data)
                setLoading(false)
            })
            .catch(err => {
                setError(err.message)
                setLoading(false)
            })
    }, [symbol]) // symbol이 바뀔 때마다 새로 불러옴

    // ── 가드 4단계 (순서 중요: 미선택 → 로딩 → 에러 → 데이터 없음) ──
    if (!symbol) return <EmptyState icon="💬" message="종목을 선택하면 전문가 투자의견이 표시됩니다." className="h-full min-h-40" />
    if (loading) return <Skeleton variant="bars" className="h-40 w-full" />
    if (error) return (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-400">
            에러: {error}
        </div>
    )
    if (!rec) return null

    // Recharts 누적 막대그래프는 "한 행짜리 배열"에 여러 dataKey를 쌓는 방식으로 그립니다
    // (행이 1개 = 막대 1줄, dataKey 5개 = 그 줄을 5가지 색 구간으로 나눔)
    const chartData = [
        { name: rec.symbol, strongBuy: rec.strongBuy, buy: rec.buy, hold: rec.hold, sell: rec.sell, strongSell: rec.strongSell },
    ]

    return (
        <div className="animate-[fade-in-up_0.25s_ease-out] rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-stock-border dark:bg-stock-card">
            <h3 className="mb-3 text-sm font-bold tracking-tight text-stock-cyan">전문가 투자의견 ({rec.symbol})</h3>
            {/* [접근성] 차트는 SVG 그림이라 스크린리더가 내용을 못 읽는다.
                role="img" + aria-label로 "이 그림이 말하는 내용"을 문장으로 제공 */}
            <div
                role="img"
                aria-label={`${rec.symbol} 투자의견: Strong Buy ${rec.strongBuy}건, Buy ${rec.buy}건, Hold ${rec.hold}건, Sell ${rec.sell}건, Strong Sell ${rec.strongSell}건`}
            >
                {/* ResponsiveContainer: 부모 너비에 맞춰 차트 크기 자동 조절 */}
                <ResponsiveContainer width="100%" height={110}>
                    {/* layout="vertical" = 막대가 가로로 눕는다 */}
                    <BarChart data={chartData} layout="vertical" margin={{ left: 20 }}>
                        {/* hide: 축 자체는 숨김 (막대 하나뿐이라 축 눈금이 오히려 소음) */}
                        <XAxis type="number" hide />
                        <YAxis type="category" dataKey="name" hide />
                        {/* 툴팁 색상에 var(--chart-...) 사용: globals.css의 CSS 변수라서
                            라이트/다크 테마를 컴포넌트가 몰라도 자동으로 따라감! */}
                        <Tooltip
                            cursor={{ fill: 'rgba(97,218,251,0.08)' }}
                            contentStyle={{ background: 'var(--chart-tooltip-bg)', border: '1px solid var(--chart-tooltip-border)', borderRadius: 8, fontSize: 12 }}
                            labelStyle={{ color: 'var(--chart-text)' }}
                            itemStyle={{ color: 'var(--chart-text)' }}
                        />
                        <Legend wrapperStyle={{ fontSize: 12, color: 'var(--chart-tick)' }} />
                        {/* stackId="a" 가 전부 같음 = 5개 Bar가 한 줄에 이어 붙는 "누적" 막대.
                            radius: 맨 왼쪽 조각은 왼쪽 모서리만, 맨 오른쪽 조각은 오른쪽 모서리만 둥글게 */}
                        <Bar dataKey="strongBuy" stackId="a" fill="#0f9d58" name="Strong Buy" radius={[4, 0, 0, 4]} />
                        <Bar dataKey="buy" stackId="a" fill="#64ffda" name="Buy" />
                        <Bar dataKey="hold" stackId="a" fill="#f4b400" name="Hold" />
                        <Bar dataKey="sell" stackId="a" fill="#e94560" name="Sell" />
                        <Bar dataKey="strongSell" stackId="a" fill="#8b0000" name="Strong Sell" radius={[0, 4, 4, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}
