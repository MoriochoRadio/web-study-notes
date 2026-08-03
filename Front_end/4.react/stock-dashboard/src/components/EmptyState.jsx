// ═══════════════════════════════════════════════════════════════════
// 📄 EmptyState.jsx — "아직 보여줄 데이터가 없어요" 안내 상자 (순수 프레젠테이션)
// ───────────────────────────────────────────────────────────────────
// 역할   : 종목 미선택 등으로 카드가 비어있을 때, 빈 화면 대신
//          점선 테두리 상자 + 아이콘 + 안내 문구를 보여준다.
// 쓰는 곳: StockQuoteCard / RecommendationCard / EarningsCard / StockChart
//          (각자 아이콘과 문구만 props로 다르게 넘긴다)
// UX 원칙: "빈 화면은 다음 행동을 안내하는 기회다" — 뭘 하면 채워지는지 알려주기
// props  : icon(이모지), message(안내 문구), className(높이 등 추가 조정용)
// ═══════════════════════════════════════════════════════════════════

// 종목 미선택 등, 데이터가 아직 없는 카드에 공통으로 쓰는 순수 프레젠테이션 컴포넌트
export default function EmptyState({ icon = '📊', message, className = '' }) {
    return (
        // border-dashed(점선 테두리) = "여기는 아직 채워지지 않은 자리"라는 시각 관례
        // ${className} 을 맨 뒤에 붙여서, 부르는 쪽이 높이(h-full min-h-40 등)를 덧붙일 수 있게 함
        <div className={`flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500 dark:border-stock-border dark:text-stock-muted ${className}`}>
            {/* 장식용 이모지 → 스크린리더가 읽지 않게 aria-hidden */}
            <span className="text-2xl" aria-hidden="true">{icon}</span>
            <p>{message}</p>
        </div>
    )
}
