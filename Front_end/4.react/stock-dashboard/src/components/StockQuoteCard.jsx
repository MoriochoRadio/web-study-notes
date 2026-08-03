// ═══════════════════════════════════════════════════════════════════
// 📄 StockQuoteCard.jsx — 선택 종목의 현재 시세 카드 (기능 2 + 기능 8의 ★ 버튼)
// ───────────────────────────────────────────────────────────────────
// 역할   : useStockData(symbol) 훅으로 시세를 받아 카드로 표시.
//          ★ 버튼으로 관심 종목 추가/제거(스토어 액션 호출)도 겸한다.
// props  : symbol — 부모(page.js)가 내려준 현재 선택 종목 (null이면 미선택)
// 렌더링 순서(중요!): 훅 호출 → 가드(빈/로딩/에러/데이터없음) → 본 화면
// ═══════════════════════════════════════════════════════════════════
'use client'
import { useStockData } from '@/hooks/useStockData'
import { useWatchlistStore } from '@/store/useWatchlistStore'
import Skeleton from '@/components/Skeleton'
import EmptyState from '@/components/EmptyState'

export default function StockQuoteCard({ symbol }) {
    // ⚠️ Hooks 규칙: 모든 훅은 조건부 return보다 "먼저", 항상 같은 순서로 호출돼야 한다!
    // (이 카드에서 실제로 겪은 버그 — useWatchlistStore를 조건부 return 뒤에 뒀다가
    //  "Rendered more hooks than during the previous render" 에러 발생.
    //  PROMPT_LOG.md 사례 10 참고)
    const { data, loading, error } = useStockData(symbol)
    const { addSymbol, removeSymbol, isWatched } = useWatchlistStore()

    // ── 가드(early return) 4단계: 순서가 곧 우선순위다 ──
    // ① 종목 미선택 → 안내 상자  ② 로딩 중 → 스켈레톤
    if (!symbol) return <EmptyState icon="🔍" message="종목을 검색하거나 관심 종목에서 선택하면 시세가 표시됩니다." className="h-full min-h-40" />
    if (loading) return <Skeleton variant="quote" />

    // ③ 에러 → 빨간 에러 박스 (라이트/다크 각각 대응하는 클래스)
    if (error) return <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm
           text-red-600 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-400">에러발생: {error}</div>
    // ④ 데이터가 아직 없으면 아무것도 안 그림
    if (!data) return null

    // 여기서부터는 data가 확실히 존재 — 파생 값 계산은 가드 통과 후에 해도 안전
    // (훅이 아닌 일반 계산은 조건부 return 뒤에 있어도 Hooks 규칙과 무관!)
    const watched = isWatched(data.symbol)   // 이 종목이 관심 목록에 있나?
    const isUp = data.change >= 0            // 상승(true)/하락(false)

    return (
        // animate-[fade-in-up...] : 스켈레톤 → 실제 카드 전환 시 살짝 떠오르는 등장 효과
        <div className="animate-[fade-in-up_0.25s_ease-out] rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-stock-border dark:bg-stock-card">
            <div className="flex items-start justify-between">
                {/* 왼쪽: 심볼 + ★ 버튼 */}
                <div>
                    <h3 className="text-lg font-bold tracking-tight text-gray-900 dark:text-stock-light">{data.symbol}</h3>
                    {/* ★ 토글 버튼: watched 여부에 따라 제거/추가 액션과 아이콘이 갈린다.
                        aria-label도 상태에 맞춰 바뀜 (스크린리더가 현재 가능한 동작을 읽도록) */}
                    <button
                        onClick={() => watched ? removeSymbol(data.symbol) : addSymbol(data.symbol)}
                        aria-label={watched ? '관심 종목에서 제거' : '관심 종목에 추가'}
                        className="mt-1 rounded text-lg text-yellow-400 transition-transform hover:scale-110 hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stock-cyan/60"
                    >
                        {watched ? '★' : '☆'}
                    </button>
                </div>

                {/* 오른쪽: 가격(시각적 주인공 — 가장 크고 굵게) + 등락 배지 */}
                <div className="text-right">
                    {/* font-mono + tabular-nums: 터미널 느낌 + 숫자 폭 고정(가격 변해도 안 흔들림) */}
                    <div className="font-mono text-3xl font-bold tabular-nums tracking-tight text-gray-900 dark:text-stock-light">
                        ${data.price.toFixed(2)}
                    </div>

                    {/* 등락 배지: isUp에 따라 초록(stock-green)/빨강(stock-red) 계열로 분기.
                        ▲/▼ 기호를 함께 써서 "색만으로 정보 전달" 금지 원칙(접근성)도 지킴 */}
                    <div className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-mono text-sm font-semibold tabular-nums
                        ${isUp ? 'bg-stock-green/10 text-stock-green' : 'bg-stock-red/10 text-stock-red'}`}>
                        <span>{isUp ? '▲' : '▼'}</span>
                        {isUp ? '+' : ''}${data.change.toFixed(2)} ({data.changePercent.toFixed(2)}%)
                    </div>
                </div>
            </div>

            {/* 하단 보조 정보 3칸: 위계상 "조연"이라 작고 옅게 (라벨은 아주 작은 대문자) */}
            <div className="mt-4 grid grid-cols-3 gap-2 border-t border-gray-100 pt-3 text-center dark:border-stock-border/60">
                <div>
                    <div className="text-[11px] uppercase tracking-wide text-gray-500 dark:text-stock-muted">고가</div>
                    <div className="font-mono text-sm font-medium tabular-nums text-gray-700 dark:text-stock-light">${data.high}</div>
                </div>
                <div>
                    <div className="text-[11px] uppercase tracking-wide text-gray-500 dark:text-stock-muted">저가</div>
                    <div className="font-mono text-sm font-medium tabular-nums text-gray-700 dark:text-stock-light">${data.low}</div>
                </div>
                <div>
                    <div className="text-[11px] uppercase tracking-wide text-gray-500 dark:text-stock-muted">전일종가</div>
                    <div className="font-mono text-sm font-medium tabular-nums text-gray-700 dark:text-stock-light">${data.prevClose}</div>
                </div>
            </div>
        </div>
    )
}
