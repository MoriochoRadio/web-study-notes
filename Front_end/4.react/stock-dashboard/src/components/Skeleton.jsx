// ═══════════════════════════════════════════════════════════════════
// 📄 Skeleton.jsx — 로딩 중에 보여주는 "뼈대 화면" (순수 프레젠테이션)
// ───────────────────────────────────────────────────────────────────
// 역할   : 데이터가 오기 전, 실제 카드와 비슷한 모양의 회색 뼈대를 먼저 그려서
//          "곧 여기에 뭐가 뜰지"를 미리 보여준다. (빈 화면/스피너보다 체감 대기시간↓)
// 사용법 : <Skeleton variant="quote" />  처럼 variant로 모양을 고른다.
//          variant 종류: 'quote'(시세 카드) / 'chart'(큰 차트) / 'bars'(막대 차트)
//                        / 'list'(뉴스 목록) / 'block'(기본: 그냥 사각형)
// 뒷받침 : shimmer 애니메이션은 globals.css의 @keyframes shimmer와 세트
// ═══════════════════════════════════════════════════════════════════

// 모든 뼈대 조각이 공유하는 "반짝임" 클래스 묶음.
// 원리: 폭 200%짜리 투명→흰빛→투명 그라디언트 배경을 깔고(shimmer가 배경 위치를
// 왼쪽 밖→오른쪽 밖으로 이동) 빛이 스윽 지나가는 것처럼 보이게 한다.
// 문자열 상수로 빼둔 이유: 아래 variant들이 전부 재사용하므로 한 곳만 고치면 됨
const SHIMMER =
    'bg-gray-200 bg-[length:200%_100%] bg-gradient-to-r from-transparent via-white/60 to-transparent ' +
    'bg-no-repeat [animation:shimmer_1.6s_ease-in-out_infinite] dark:bg-stock-border dark:via-white/10'

// variant별로 실제 카드 레이아웃(제목/숫자/보조정보 위치)을 흉내 낸 뼈대를 그려서
// "뭐가 로딩되는 중인지"를 로딩 단계에서부터 짐작할 수 있게 한다.
export default function Skeleton({ className = 'h-24 w-full', variant = 'block' }) {
    // ── 시세 카드(StockQuoteCard) 모양: 심볼 자리 + 큰 가격 자리 + 하단 3칸 ──
    if (variant === 'quote') {
        return (
            <div className={`rounded-xl border border-gray-200 bg-white p-5 dark:border-stock-border dark:bg-stock-card ${className}`}>
                <div className="flex items-start justify-between">
                    <div className={`h-6 w-16 rounded-md ${SHIMMER}`} />      {/* 심볼 자리 */}
                    <div className="flex flex-col items-end gap-2">
                        <div className={`h-4 w-4 rounded-full ${SHIMMER}`} /> {/* ★ 버튼 자리 */}
                        <div className={`h-7 w-24 rounded-md ${SHIMMER}`} />  {/* 큰 가격 자리 */}
                        <div className={`h-4 w-28 rounded-md ${SHIMMER}`} />  {/* 등락 배지 자리 */}
                    </div>
                </div>
                <div className="mt-4 flex gap-3">
                    <div className={`h-3 w-14 rounded ${SHIMMER}`} />         {/* 고가/저가/전일종가 */}
                    <div className={`h-3 w-14 rounded ${SHIMMER}`} />
                    <div className={`h-3 w-16 rounded ${SHIMMER}`} />
                </div>
            </div>
        )
    }

    // ── 큰 차트(StockChart) 모양: 제목 줄 + 차트 영역 ──
    if (variant === 'chart') {
        return (
            <div className={`rounded-xl border border-gray-200 bg-white p-4 dark:border-stock-border dark:bg-stock-card ${className}`}>
                <div className={`h-4 w-36 rounded ${SHIMMER}`} />
                {/* h-[calc(100%-1.75rem)] : 부모 높이에서 제목 줄만큼 뺀 나머지를 꽉 채움 */}
                <div className={`mt-4 h-[calc(100%-1.75rem)] w-full rounded-lg ${SHIMMER}`} />
            </div>
        )
    }

    // ── 막대 차트 카드(Recommendation/Earnings) 모양 ──
    if (variant === 'bars') {
        return (
            <div className={`rounded-xl border border-gray-200 p-4 dark:border-stock-border ${className}`}>
                <div className={`h-4 w-40 rounded ${SHIMMER}`} />
                <div className={`mt-3 h-[calc(100%-1.75rem)] w-full rounded-lg ${SHIMMER}`} />
            </div>
        )
    }

    // ── 뉴스 목록(NewsList) 모양: [썸네일 + 제목 2줄 + 출처] ×3줄 ──
    if (variant === 'list') {
        return (
            <div className={`space-y-3 ${className}`}>
                {/* [0,1,2].map : 같은 뼈대 한 줄을 3번 반복해서 그리는 간단한 트릭 */}
                {[0, 1, 2].map((i) => (
                    <div key={i} className="flex gap-3">
                        <div className={`h-16 w-16 flex-shrink-0 rounded-lg ${SHIMMER}`} />
                        <div className="min-w-0 flex-1 space-y-2 py-1">
                            <div className={`h-4 w-full rounded ${SHIMMER}`} />
                            <div className={`h-4 w-2/3 rounded ${SHIMMER}`} />
                            <div className={`h-3 w-1/3 rounded ${SHIMMER}`} />
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    // ── 기본형: 아무 데나 쓸 수 있는 그냥 반짝이는 사각형 ──
    return <div className={`rounded-xl ${SHIMMER} ${className}`} />
}
