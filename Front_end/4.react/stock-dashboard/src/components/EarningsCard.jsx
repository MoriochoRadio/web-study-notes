// ═══════════════════════════════════════════════════════════════════
// 📄 EarningsCard.jsx — 어닝 서프라이즈(분기 실적) 카드 (기능 6)
// ───────────────────────────────────────────────────────────────────
// 역할   : /api/earnings에서 최근 4개 분기의 실적 배열을 받아
//          ① 예상 vs 실제 EPS 쌍막대 그래프  ② 분기별 Surprise!/Miss 뱃지 로 표시.
// props  : symbol — 선택 종목
// RecommendationCard와의 차이: 거긴 응답이 객체 1개 → 배열 [{...}]로 감쌌지만,
//          여긴 응답이 진짜 배열(4개 분기) → .map()으로 차트용 모양으로 변환한다.
// ═══════════════════════════════════════════════════════════════════
'use client'
import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import Skeleton from '@/components/Skeleton'
import EmptyState from '@/components/EmptyState'

export default function EarningsCard({ symbol }) {
    // 표준 3종 세트: 데이터/로딩/에러 (RecommendationCard와 동일 패턴)
    const [earnings, setEarnings] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!symbol) return

        setLoading(true)
        setError(null)
        fetch(`/api/earnings?symbol=${symbol}`)
            .then(res => {
                if (!res.ok) throw new Error('API 호출 실패')
                return res.json()
            })
            .then(data => {
                setEarnings(data)
                setLoading(false)
            })
            .catch(err => {
                setError(err.message)
                setLoading(false)
            })
    }, [symbol])

    // ── 가드 4단계 ──
    if (!symbol) return <EmptyState icon="📅" message="종목을 선택하면 최근 실적(EPS)이 표시됩니다." className="h-full min-h-40" />
    if (loading) return <Skeleton variant="bars" className="h-60 w-full" />
    if (error) return (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-400">
            에러: {error}
        </div>
    )
    if (!earnings) return null

    // earnings(Finnhub 원본 배열)를 차트가 원하는 모양으로 변환.
    // .map() = 배열의 각 항목을 "다른 모양의 항목"으로 바꾼 새 배열 만들기.
    //   원본 항목: { actual, estimate, period, quarter, year, surprise, ... }
    //   변환 결과: { quarter: 'Q4 2026'(x축 라벨), estimate, actual }  ← 차트에 필요한 3개만
    const chartData = earnings.map((item) => ({
        quarter: `Q${item.quarter} ${item.year}`,
        estimate: item.estimate,
        actual: item.actual,
    }))

    return (
        <div className="animate-[fade-in-up_0.25s_ease-out] rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-stock-border dark:bg-stock-card">
            <h3 className="mb-3 text-sm font-bold tracking-tight text-stock-cyan">최근 실적 (EPS) — {symbol}</h3>

            {/* [접근성] SVG 차트 내용을 스크린리더용 문장으로 요약해서 제공 */}
            <div
                role="img"
                aria-label={`${symbol} 분기별 EPS: ${chartData.map((d) => `${d.quarter} 예상 ${d.estimate}, 실제 ${d.actual}`).join(' / ')}`}
            >
                <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={chartData}>
                        {/* 색상은 전부 var(--chart-...) = globals.css의 테마 연동 CSS 변수 */}
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
                        <XAxis dataKey="quarter" tick={{ fontSize: 11, fill: 'var(--chart-tick)' }} />
                        <YAxis tick={{ fontSize: 11, fill: 'var(--chart-tick)' }} />
                        <Tooltip
                            cursor={{ fill: 'rgba(97,218,251,0.08)' }}
                            contentStyle={{ background: 'var(--chart-tooltip-bg)', border: '1px solid var(--chart-tooltip-border)', borderRadius: 8, fontSize: 12 }}
                            labelStyle={{ color: 'var(--chart-text)' }}
                            itemStyle={{ color: 'var(--chart-text)' }}
                        />
                        <Legend wrapperStyle={{ fontSize: 12, color: 'var(--chart-tick)' }} />
                        {/* stackId가 없으므로 누적이 아니라 "나란히 서는" 쌍막대.
                            radius=[4,4,0,0]: 막대 윗모서리만 둥글게 */}
                        <Bar dataKey="estimate" fill="#8884d8" name="예상 EPS" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="actual" fill="#64ffda" name="실제 EPS" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* 분기별 뱃지 줄: surprise > 0 (실제가 예상을 웃돎) → 초록 "Surprise!"
                                아니면 → 회색 "Miss" — 조건부 className 삼항 패턴 */}
            <div className="mt-3 flex flex-wrap gap-2">
                {earnings.map((item) => (
                    // key={item.period}: 반복 렌더링에는 항목마다 고유 key 필수 (period = 분기 날짜라 유일)
                    <span key={item.period} className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-stock-muted">
                        Q{item.quarter} {item.year}
                        <span className={item.surprise > 0
                            ? 'rounded-full px-1.5 py-0.5 font-medium bg-green-100 text-green-700 dark:bg-stock-green/15 dark:text-stock-green'
                            : 'rounded-full px-1.5 py-0.5 font-medium bg-gray-100 text-gray-500 dark:bg-stock-border dark:text-stock-muted'}>
                            {item.surprise > 0 ? 'Surprise!' : 'Miss'}
                        </span>
                    </span>
                ))}
            </div>
        </div>
    )
}
