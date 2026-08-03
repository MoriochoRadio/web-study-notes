// ── STEP 2: 관심종목 패널 (WatchlistPanel) ──
// [역할 설명]
// 1. Zustand 스토어의 관심종목(watchlist) 목록과 종목별 가격(prices)을 화면에 출력합니다.
// 2. 컴포넌트가 처음 마운트되면 useEffect를 통해 모든 관심종목의 최신 시세를 일괄 조회합니다 (fetchAllPrices).
// 3. 종목을 클릭하면 선택 상태(selectSymbol)가 변경되고, '✕'를 누르면 삭제(removeFromWatchlist)됩니다.
// 4. 수량을 입력받아 원하는 수량만큼 매수(buyStock)합니다.

'use client'
import { useState, useEffect } from 'react'
import useStockStore from '@/app/store/useStockStore'

// 개별 관심종목 아이템 컴포넌트 (수량 입력 state 개별 관리)
function WatchlistItem({ symbol }) {
  const selectedSymbol = useStockStore((s) => s.selectedSymbol)
  const prices = useStockStore((s) => s.prices)
  const selectSymbol = useStockStore((s) => s.selectSymbol)
  const removeFromWatchlist = useStockStore((s) => s.removeFromWatchlist)
  const buyStock = useStockStore((s) => s.buyStock)

  const [qty, setQty] = useState(1) // 입력된 수량 상태 (기본값: 1)
  const price = prices[symbol]

  // 📌 이미지 속 handleBuy 매수 핸들러 함수
  const handleBuy = () => {
    const price = prices[symbol]
    if (!price || qty < 1) return
    buyStock(symbol, Number(qty), price)
  }

  return (
    <li
      onClick={() => selectSymbol(symbol)}
      style={{
        padding: '12px',
        marginBottom: '8px',
        borderRadius: '8px',
        border: `1px solid ${selectedSymbol === symbol ? '#61dafb' : '#0f3460'}`,
        cursor: 'pointer',
        backgroundColor: selectedSymbol === symbol ? '#123a2a' : '#0d2137',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <strong style={{ color: '#ccd6f6' }}>{symbol}</strong>
          <div style={{ fontSize: '12px', color: '#8892b0' }}>
            {price ? `$${price.toFixed(2)}` : '로딩 중...'}
          </div>
        </div>

        {/* 관심종목 삭제 버튼 */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            removeFromWatchlist(symbol)
          }}
          style={{
            background: 'none',
            border: 'none',
            color: '#e94560',
            cursor: 'pointer',
            fontSize: '16px',
          }}
        >
          ✕
        </button>
      </div>

      {/* 📌 수량 입력 및 매수 폼 */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ display: 'flex', gap: '8px', marginTop: '8px' }}
      >
        <input
          type="number"
          min="1"
          value={qty}
          onChange={(e) => setQty(e.target.value)}
          style={{
            width: '60px',
            padding: '4px 8px',
            borderRadius: '6px',
            border: '1px solid #0f3460',
            background: '#0a192f',
            color: '#ccd6f6',
            fontSize: '12px',
          }}
        />
        <button
          onClick={handleBuy}
          disabled={!price}
          style={{
            flex: 1,
            padding: '5px',
            fontSize: '12px',
            borderRadius: '6px',
            background: '#61dafb22',
            color: '#61dafb',
            border: '1px solid #61dafb55',
            cursor: price ? 'pointer' : 'not-allowed',
          }}
        >
          매수하기
        </button>
      </div>
    </li>
  )
}

export default function WatchlistPanel() {
  const watchlist = useStockStore((s) => s.watchlist)
  const fetchAllPrices = useStockStore((s) => s.fetchAllPrices)

  useEffect(() => {
    fetchAllPrices()
  }, [fetchAllPrices])

  return (
    <div style={{ padding: '1rem' }}>
      <h2>관심종목</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {watchlist.map((symbol) => (
          <WatchlistItem key={symbol} symbol={symbol} />
        ))}
      </ul>
    </div>
  )
}
