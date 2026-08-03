// ═══════════════════════════════════════════════════════════════════
// 📄 NewsList.jsx — 뉴스 목록 (기능 7) : 컴포넌트 하나로 두 API를 처리하는 재사용 예시
// ───────────────────────────────────────────────────────────────────
// 역할   : mode에 따라 시장 전체 뉴스 또는 특정 기업 뉴스를 불러와 목록으로 표시
// props  : mode('market' | 'company'), symbol(mode가 'company'일 때만 필요)
// 재사용 원리: 두 API(/api/news/market, /api/news/company)가 "같은 응답 shape"을
//          갖도록 서버에서 맞춰놔서, 프론트는 URL만 갈아끼우면 나머지가 동일하다.
// 참고   : page.js에서 lazy()로 불러오는 컴포넌트라, 실제 렌더링 시점에 코드가 도착한다
// ═══════════════════════════════════════════════════════════════════
'use client'
import { useState, useEffect } from 'react'
import Skeleton from '@/components/Skeleton'

// mode: 'market' (시장 전체 뉴스) 또는 'company' (해당 기업 뉴스)
// symbol: mode가 'company'일 때만 필요
export default function NewsList({ mode, symbol }) {
    // 표준 3종 세트 (다른 카드들과 동일 패턴)
    const [news, setNews] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        // company 모드인데 symbol이 없으면 아직 부를 수 없음 → 조용히 대기
        if (mode === 'company' && !symbol) return

        setLoading(true)
        setError(null)

        // mode에 따라 호출할 URL만 다르게 만든다 (삼항 연산자 한 줄)
        // — 이 한 줄이 "컴포넌트 하나로 두 기능"을 가능하게 하는 스위치
        const url = mode === 'market' ? '/api/news/market' : `/api/news/company?symbol=${symbol}`

        fetch(url)
            .then(res => {
                if (!res.ok) throw new Error('API 호출 실패')
                return res.json()
            })
            .then(data => {
                setNews(data)
                setLoading(false)
            })
            .catch(err => {
                setError(err.message)
                setLoading(false)
            })
    }, [mode, symbol]) // mode나 symbol이 바뀌면 다시 불러옴

    // ── 가드 3단계: 로딩 → 에러 → 빈 목록 ──
    if (loading) return <Skeleton variant="list" className="h-48 w-full" />
    if (error) return (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-400">
            에러: {error}
        </div>
    )
    if (!news || news.length === 0) return (
        <div className="rounded-xl border border-dashed border-gray-300 px-4 py-6 text-center text-sm text-gray-500 dark:border-stock-border dark:text-stock-muted">
            뉴스가 없습니다.
        </div>
    )

    return (
        <ul className="space-y-1">
            {news.map((item) => (
                <li key={item.id}>
                    {/* 기사 전체(썸네일+제목+출처)를 <a>로 감싸 클릭 영역을 넓게.
                        target="_blank"           → 새 탭에서 열기
                        rel="noopener noreferrer" → 새 탭 페이지가 원래 페이지를 조작하지
                                                    못하게 막는 보안 관례 (짝꿍처럼 항상 같이 씀) */}
                    <a href={item.url} target="_blank" rel="noopener noreferrer"
                        className="flex gap-3 rounded-xl p-2 transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stock-cyan/60 dark:hover:bg-stock-card">
                        {/* alt="" : 썸네일은 장식이라 스크린리더가 건너뛰게 (제목이 이미 정보 전달)
                            flex-shrink-0 : 제목이 길어도 이미지가 찌그러지지 않게 */}
                        <img src={item.image} alt="" className="h-16 w-16 flex-shrink-0 rounded-lg object-cover shadow-sm" />
                        <div className="min-w-0">
                            {/* line-clamp-2 : 제목이 아무리 길어도 2줄에서 말줄임(...) 처리 */}
                            <p className="line-clamp-2 text-sm font-medium text-gray-900 hover:text-stock-cyan dark:text-stock-light">
                                {item.headline}
                            </p>
                            {/* item.datetime은 "초" 단위 유닉스 타임스탬프인데 JS Date는
                                "밀리초"를 쓰므로 1000을 곱해야 한다:
                                new Date(item.datetime * 1000).toLocaleString() */}
                            <p className="mt-1 text-xs text-gray-500 dark:text-stock-muted">
                                {item.source} • {new Date(item.datetime * 1000).toLocaleString()}
                            </p>
                        </div>
                    </a>
                </li>
            ))}
        </ul>
    )
}
