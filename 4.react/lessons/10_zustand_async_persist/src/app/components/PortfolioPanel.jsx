// ── STEP 3: 포트폴리오 패널 (PortfolioPanel) ──
// [역할 설명]
// 1. Zustand 스토어의 보유 주식(portfolio) 및 최신 시세(prices)를 바탕으로
//    총 평가금액, 총 원금, 총 손익($), 손익률(%)을 계산하여 보여줍니다.
// 2. 보유 종목별 수량, 평단가, 현재가, 개별 평가손익을 표시합니다.
// 3. '전량 매도' 버튼 클릭 시 sellStock을 호출해 해당 주식을 전량 매도 처리합니다.

'use client'
import useStockStore from '@/app/store/useStockStore'

export default function PortfolioPanel() {
  // 📌 1) Zustand 스토어에서 보유 자산(portfolio), 실시간 시세(prices), 매도 액션(sellStock) 구독
  const portfolio = useStockStore((s) => s.portfolio)
  const prices = useStockStore((s) => s.prices)
  const sellStock = useStockStore((s) => s.sellStock)

  // 📌 2) 객체 형태의 portfolio를 배열 형태로 변환: [ [symbol, {qty, avgPrice}], ... ]
  // (예: { AAPL: { qty: 10, avgPrice: 170.5 } } -> [ ['AAPL', { qty: 10, avgPrice: 170.5 }] ])
  const holdings = Object.entries(portfolio)

  // 📌 3) 총 평가금액(totalValue) 계산 (`reduce` 이용)
  // - holdings 배열을 돌면서 각 종목의 (현재가 × 수량)을 더해나갑니다.
  // - 최신 시세(prices[symbol])가 없으면 구매 평단가(h.avgPrice)를 대신 사용합니다.
  // - 맨 뒤의 0은 초기 합계 시작 금액(0원)입니다.
  const totalValue = holdings.reduce(
    (sum, [symbol, h]) => sum + (prices[symbol] || h.avgPrice) * h.qty,
    0
  )

  // 📌 4) 나의 총 매입원가(totalCost) 계산 (`reduce` 이용)
  // - holdings 배열을 돌면서 각 종목의 (구매 평단가 × 수량)을 더해나갑니다.
  // - [, h] 형태의 구조 분해로 첫 번째 인자인 종목코드(symbol)는 생략하고 내역 객체(h)만 가져옵니다.
  const totalCost = holdings.reduce(
    (sum, [, h]) => sum + h.avgPrice * h.qty,
    0
  )

  // 📌 5) 총 손익($) = 총 평가금액 - 총 매입원가
  const totalPnl = totalValue - totalCost

  // 📌 6) 총 손익률(%) = (총 손익 / 총 매입원가) × 100 (원금이 0보다 큰 경우에만 계산)
  const totalPnlPct = totalCost > 0 ? (totalPnl / totalCost) * 100 : 0

  return (
    <div style={{ padding: '1rem' }}>
      <h2>내 포트폴리오</h2>

      {/* 📌 총 자산 / 수익률 요약 카드 */}
      <div
        style={{
          padding: '12px',
          marginBottom: '1rem',
          borderRadius: '8px',
          background: '#0d2137',
          border: '1px solid #0f3460',
        }}
      >
        <div style={{ fontSize: '12px', color: '#8892b0' }}>총 평가금액</div>
        {/* toFixed(2): 소수점 둘째 자리까지 표시 */}
        <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#ccd6f6' }}>
          ${totalValue.toFixed(2)}
        </div>
        {/* 이익이면 초록색(#64ffda), 손실이면 빨간색(#e94560) 표시 */}
        <div style={{ fontSize: '13px', color: totalPnl >= 0 ? '#64ffda' : '#e94560' }}>
          {totalPnl >= 0 ? '+' : ''}
          {totalPnl.toFixed(2)} ({totalPnlPct.toFixed(2)}%)
        </div>
      </div>

      {/* 보유 종목이 없을 때 보여줄 안내 메시지 */}
      {holdings.length === 0 && (
        <p style={{ color: '#8892b0', fontSize: '13px' }}>보유 종목이 없습니다.</p>
      )}

      {/* 📌 보유 종목 개별 카드 목록 */}
      {holdings.map(([symbol, h]) => {
        const cur = prices[symbol] || h.avgPrice // 현재 시세 (없으면 구매 평단가 사용)
        const pnl = (cur - h.avgPrice) * h.qty   // 종목별 평가손익($) = (현재가 - 평단가) × 수량
        const pnlPct = ((cur - h.avgPrice) / h.avgPrice) * 100 // 종목별 수익률(%)
        const isUp = pnl >= 0                    // 이익 여부 (양수: 초록색, 음수: 빨간색)

        return (
          <div
            key={symbol}
            style={{
              padding: '12px',
              marginBottom: '8px',
              borderRadius: '8px',
              background: '#0d2137',
              border: `1px solid ${isUp ? '#64ffda33' : '#e9456033'}`,
            }}
          >
            {/* 상단: 종목명 및 개별 수익률 */}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <strong style={{ color: '#ccd6f6' }}>{symbol}</strong>
              <span style={{ color: isUp ? '#64ffda' : '#e94560', fontSize: '13px' }}>
                {isUp ? '+' : ''}
                {pnlPct.toFixed(2)}%
              </span>
            </div>

            {/* 중단: 수량, 평단가, 현재가 상세 내역 */}
            <div style={{ fontSize: '12px', color: '#8892b0', marginTop: '4px' }}>
              {h.qty}주 · 평균 ${h.avgPrice.toFixed(2)} · 현재 ${cur.toFixed(2)}
            </div>

            {/* 하단: 손익($)금액 및 전량 매도 버튼 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
              <span style={{ color: isUp ? '#64ffda' : '#e94560', fontSize: '13px' }}>
                {isUp ? '+' : ''}${pnl.toFixed(2)}
              </span>

              {/* 📌 전량 매도 버튼: 현재 보유 중인 수량(h.qty) 전체를 매도하도록 sellStock 호출 */}
              <button
                onClick={() => sellStock(symbol, h.qty)}
                style={{
                  padding: '3px 10px',
                  fontSize: '11px',
                  borderRadius: '4px',
                  border: '1px solid #e94560',
                  background: 'none',
                  color: '#e94560',
                  cursor: 'pointer',
                }}
              >
                전량 매도
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
