// ═══════════════════════════════════════════════════════════════════
// 📄 TickerBoard.jsx — 상단에서 흐르는 실시간 시세 전광판 (기능 3)
// ───────────────────────────────────────────────────────────────────
// 역할   : useLiveTicker 훅에서 실시간 가격을 받아, 좌→우로 흐르는
//          전광판 배지들로 표시. 가격이 변하면 초록/빨강으로 0.5초 반짝인다.
// props  : selectedSymbol — 현재 선택된 종목이면 배지에 하늘색 테두리 강조
// 무한 스크롤 원리: 같은 목록을 2벌 이어 붙이고 전체를 -50%까지 밀면(ticker-scroll)
//          1벌 너비만큼 이동한 순간이 시작 모습과 똑같아서 끊김 없이 반복된다.
// ═══════════════════════════════════════════════════════════════════
'use client'
import { useLiveTicker, MAJOR_SYMBOLS } from '@/hooks/useLiveTicker'

export default function TickerBoard({ selectedSymbol }) {
    // 훅 호출 한 줄로 실시간 데이터 수신 끝!
    // prices  = { 심볼: 현재가 }  /  flashes = { 심볼: 'up'|'down'|null }
    const { prices, flashes } = useLiveTicker(MAJOR_SYMBOLS)

    // 배지 1개를 그리는 헬퍼 함수 (JSX 안에서 map으로 반복 호출됨)
    // isDuplicate: 무한 스크롤용 "복제 2벌째"인지 여부 → 스크린리더 중복 낭독 방지에 사용
    const renderItem = (sym, keySuffix, isDuplicate) => {
        const flash = flashes[sym]
        const isSelected = sym === selectedSymbol
        return (
            <div
                // key에 keySuffix(인덱스)를 섞는 이유: 같은 심볼이 2벌 존재하므로
                // 심볼만으로는 key가 중복됨 → "AAPL-2", "AAPL-7"처럼 유일하게 만든다
                key={`${sym}-${keySuffix}`}
                // aria-hidden={isDuplicate || undefined} : 복제 2벌째만 보조기기에서 숨김.
                // (|| undefined 를 쓰면 false일 때 속성 자체가 안 붙어서 HTML이 깔끔)
                aria-hidden={isDuplicate || undefined}
                // 클래스 우선순위: flash가 있으면 flash 색이 선택 강조를 덮는다 (뒤에 온 클래스가 승리)
                className={`flex items-center gap-2 whitespace-nowrap rounded-full border px-3 py-1.5 text-sm shadow-sm transition-colors duration-300
                    ${isSelected ? 'border-stock-cyan bg-stock-cyan/10' : 'border-gray-200 bg-white dark:border-stock-border dark:bg-stock-card'}
                    ${flash === 'up' ? 'border-stock-green/60 bg-stock-green/20 text-stock-green' : ''}
                    ${flash === 'down' ? 'border-stock-red/60 bg-stock-red/20 text-stock-red' : ''}`}
            >
                <strong className="text-stock-cyan">{sym}</strong>
                {/* prices[sym]이 아직 없으면(첫 체결 전) '대기중...'을 작고 흐리게 표시.
                    tabular-nums: 모든 숫자의 폭을 똑같이 → 가격이 바뀌어도 배지가 안 씰룩거림 */}
                <span className={`font-mono tabular-nums ${prices[sym] ? '' : 'text-xs text-gray-400 dark:text-stock-muted'}`}>
                    {prices[sym] ? `$${prices[sym].toFixed(2)}` : '대기중...'}
                </span>
            </div>
        )
    }

    return (
        // role="region" + aria-label : 스크린리더에게 "이 구역은 실시간 시세 영역"이라고 소개
        // group 클래스: 자식에서 group-hover:를 쓰기 위한 짝꿍 표시
        <div
            role="region"
            aria-label="실시간 주요 종목 시세"
            className="group overflow-hidden rounded-xl border border-gray-200 bg-gray-50 dark:border-stock-border dark:bg-stock-bg"
        >
            {/* w-max: 내용물 전체 너비만큼 늘어나게 (잘리지 않고 흐르도록)
                [animation:...] : globals.css의 ticker-scroll을 20초 주기 무한 반복으로 적용
                group-hover:[animation-play-state:paused] : 부모에 마우스를 올리면 일시정지
                (순수 CSS라 자바스크립트 이벤트 없이 동작!) */}
            <div className="flex w-max gap-3 p-3 [animation:ticker-scroll_20s_linear_infinite] group-hover:[animation-play-state:paused]">
                {/* [...A, ...A] : 배열을 2벌로 복제 (무한 스크롤 재료).
                    i >= MAJOR_SYMBOLS.length 가 true인 것들이 "2벌째" */}
                {[...MAJOR_SYMBOLS, ...MAJOR_SYMBOLS].map((sym, i) => renderItem(sym, i, i >= MAJOR_SYMBOLS.length))}
            </div>
        </div>
    )
}
