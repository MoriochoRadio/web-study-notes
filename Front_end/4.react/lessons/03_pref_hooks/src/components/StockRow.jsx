// ── STEP 3: React.memo 로 감싼 자식 컴포넌트 ──
// [컴포넌트 서열]: 3위 (StockList 부모 안에 속한 가장 하위 막내 자식 컴포넌트)
// 🎬 [3幕 시나리오]: 4총사 공조 체계의 최종 방어막 역할을 수행합니다.
import { memo } from 'react'

/**
 * 💡 [구조 분해 할당 문법]
 * - function StockRow(props) 대신 { stock, isFavorite, onToggleFavorite } 처럼 
 *   부모(StockList)가 던져준 전달 상자(props)에서 필요한 알맹이만 받자마자 바로 쪼개서 가져옵니다.
 * 
 * 💡 [memo( ... ) 최적화 방어막 작동 원리]
 * - 부모인 StockList가 다시 그려질 때(리렌더링), 자식인 StockRow도 원래는 같이 다 그려져야 하지만,
 *   React.memo로 감싸주면 리액트가 이전 props와 현재 props를 꼼꼼하게 대조합니다:
 * 
 *   1. AAPL (클릭된 주식): isFavorite 상태가 false ➔ true로 변경됨 ➔ "나만 다시 그려야지!" (리렌더링 ⭕)
 *   2. TSLA 등 나머지 9개 주식: stock, isFavorite, onToggleFavorite 모두 100% 동일함 ➔ "나는 스킵!" (리렌더링 🛑)
 */
const StockRow = memo(function StockRow({ stock, isFavorite, onToggleFavorite }) {
    // 💡 개발자 도구(F12) 콘솔에서 언제 몇 번 다시 그려지는지 관찰하는 로그
    // - 별(★)을 누르면 클릭된 딱 1개의 종목 로그만 찍혀야 memo가 정상 작동하는 것입니다!
    console.log(`${stock.symbol} 렌더링`)

    // 주가 등락률이 0 이상(양수/상승)인지 판단 (true/false)
    const isUp = stock.change >= 0

    return (
        <li style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', marginBottom: '6px', borderRadius: '8px', border: '1px solid #eee' }}>
            {/* 
                별(★/☆) 클릭 버튼: 
                - 클릭 시 부모(StockList)로부터 전달받은 onToggleFavorite('AAPL') 함수를 실행합니다.
                - 이 실행이 부모의 setFavorites 상태를 바꾸면서 부모를 리렌더링시키게 됩니다.
            */}
            <button onClick={() => onToggleFavorite(stock.symbol)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}>
                {isFavorite ? '★' : '☆'}
            </button>
            
            {/* 종목 심볼 / 회사 이름 / 가격 */}
            <strong style={{ width: '60px' }}>{stock.symbol}</strong>
            <span style={{ flex: 1, color: '#666', fontSize: '13px' }}>{stock.name}</span>
            <span style={{ fontWeight: 'bold' }}>${stock.price.toFixed(2)}</span>
            
            {/* 상승이면 파란색+, 하락이면 빨간색 표시 */}
            <span style={{ width: '70px', textAlign: 'right', color: isUp ? 'blue' : 'red', fontWeight: 'bold' }}>
                {isUp ? '+' : ''}{stock.change}%
            </span>
        </li>
    )
})

export default StockRow