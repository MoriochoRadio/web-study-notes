// ── STEP 1: React.memo & useCallback 최적화 비교 실습 ──
// 개념: memo는 props가 같으면 리렌더링을 건너뜀. 단, useCallback으로 함수 참조를 고정해야 memo가 정상 작동함!
import { useState, memo, useCallback } from 'react'

// ❌ [React.memo 없음] 일반 컴포넌트
// 부모(MemoComparison)의 상태(tick)가 바뀔 때마다 무조건 자식도 같이 다시 그려짐! (불필요한 리렌더링)
function RowWithoutMemo({ symbol, price, change, onToggle }) {
    console.log(`[memo없음] ${symbol} 렌더링`) // 콘솔에 찍히는 로그로 리렌더링 확인 가능
    const isUp = change >= 0
    return (
        <div style={{ padding: '10px', marginBottom: '4px', border: '1px solid #ffcdd2', borderRadius: '6px' }}>
            <strong>{symbol}</strong> ${price.toFixed(2)}
            <span style={{ color: isUp ? 'blue' : 'red', marginLeft: '8px' }}>{isUp ? '+' : ''}{change}%</span>
            <button onClick={() => onToggle(symbol)} style={{ marginLeft: '8px' }}>★</button>
        </div>
    )
}

// ✅ [React.memo 적용] 최적화된 컴포넌트
// 💡 memo(function ...): 부모가 리렌더링되어도, 전달받는 props(symbol, price, change, onToggle)의 값이 변하지 않았다면 리렌더링을 완전히 막아줌!
const RowWithMemo = memo(function RowWithMemo({ symbol, price, change, onToggle }) {
    console.log(`[memo있음] ${symbol} 렌더링`) // props가 변경될 때만 로그가 찍힘!
    const isUp = change >= 0
    return (
        <div style={{ padding: '10px', marginBottom: '4px', border: '1px solid #c8e6c9', borderRadius: '6px' }}>
            <strong>{symbol}</strong> ${price.toFixed(2)}
            <span style={{ color: isUp ? 'blue' : 'red', marginLeft: '8px' }}>{isUp ? '+' : ''}{change}%</span>
            <button onClick={() => onToggle(symbol)} style={{ marginLeft: '8px' }}>★</button>
        </div>
    )
})

// 테스트용 더미 주식 목록 데이터
const stocks = [
    { symbol: 'AAPL', price: 182.52, change: 1.24 },
    { symbol: 'TSLA', price: 248.5, change: -2.15 },
    { symbol: 'MSFT', price: 378.85, change: 0.87 },
]

export default function MemoComparison() {
    // 부모의 리렌더링을 강제로 일으키기 위한 단순 숫자를 관리하는 상태
    const [tick, setTick] = useState(0)

    // ✅ [useCallback] 전달할 함수 메모리 고정
    // 💡 왜 useCallback으로 감싸야 하나요?
    // - 감싸지 않으면 부모가 리렌더링될 때마다 onToggle 함수가 새로 생성됩니다.
    // - 함수 주소가 새로워지면 RowWithMemo는 "onToggle이 바뀌었네?" 하고 memo를 작성했어도 다시 그려지게 됩니다!
    // - 의존성 배열 []을 비워두면, 컴포넌트가 처음 생성될 때 함수 주소를 고정해 주므로 memo가 정상 작동합니다!
    const onToggle = useCallback((symbol) => {
        console.log('토글:', symbol)
    }, [])

    return (
        <div style={{ padding: '1.5rem', maxWidth: '500px' }}>
            {/* 부모의 상태(tick)를 변경시키는 버튼 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '1rem' }}>
                <button onClick={() => setTick((t) => t + 1)} style={{ padding: '8px 16px' }}>부모 리렌더 유발 (tick: {tick})</button>
                <span style={{ fontSize: '12px', color: '#888' }}>콘솔을 열고 눌러보세요</span>
            </div>

            {/* ❌ memo가 없는 주식 목록 (부모 버튼 누르면 계속 로그가 찍히며 다시 그려짐) */}
            <h4 style={{ color: '#c62828' }}>❌ React.memo 없음</h4>
            {stocks.map((s) => (
                <RowWithoutMemo key={s.symbol} {...s} onToggle={onToggle} />
            ))}

            {/* ✅ memo + useCallback이 적용된 주식 목록 (부모 버튼 눌러도 로그 안 찍히고 리렌더링 완전히 스킵!) */}
            <h4 style={{ color: '#2e7d32', marginTop: '1rem' }}>✅ React.memo + useCallback (리렌더링 스킵 완료)</h4>
            {stocks.map((s) => (
                <RowWithMemo key={s.symbol} {...s} onToggle={onToggle} />
            ))}
        </div>
    )
}