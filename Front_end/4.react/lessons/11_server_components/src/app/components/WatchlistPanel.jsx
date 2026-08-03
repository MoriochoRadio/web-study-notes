// ── STEP 2: 관심종목 패널 (WatchlistPanel) ──
// [역할 설명]
// 1. Zustand 스토어의 관심종목(watchlist) 목록과 종목별 가격(prices)을 화면에 출력합니다.
// 2. 컴포넌트가 처음 마운트되면 useEffect를 통해 모든 관심종목의 최신 시세를 일괄 조회합니다 (fetchAllPrices).
// 3. 종목을 클릭하면 선택 상태(selectSymbol)가 변경되고, '✕'를 누르면 삭제(removeFromWatchlist)됩니다.
// 4. '+1주 매수' 버튼을 누르면 해당 종목을 1주 매수(buyStock)합니다.

'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import useStockStore from '@/app/store/useStockStore'

export default function WatchlistPanel() {
  // 📌 1) Zustand 스토어에서 필요한 상태 및 액션 함수들만 각각 개별 구독 (리렌더링 성능 최적화)
  const watchlist = useStockStore((s) => s.watchlist)
  const selectedSymbol = useStockStore((s) => s.selectedSymbol)
  const prices = useStockStore((s) => s.prices)
  const selectSymbol = useStockStore((s) => s.selectSymbol)
  const removeFromWatchlist = useStockStore((s) => s.removeFromWatchlist)
  const fetchAllPrices = useStockStore((s) => s.fetchAllPrices)
  const buyStock = useStockStore((s) => s.buyStock)

  const router = useRouter()

  // 📌 2) 최초 마운트 시 1회: 관심종목 전체 시세 일괄 조회
  // (가격 정보는 localStorage에 저장하지 않으므로, 앱이 켜질 때마다 최신 시세를 다시 불러옵니다.)
  useEffect(() => {
    fetchAllPrices()
  }, [fetchAllPrices])

  return (
    <div style={{ padding: '1rem' }}>
      <h2>관심종목</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {watchlist.map((symbol) => {
          const price = prices[symbol]
          return (
            <li
              key={symbol}
              onClick={() => {
                selectSymbol(symbol) // 클릭 시 선택된 종목 변경 (하이라이트 표시)
                router.push(`/?symbol=${symbol}`)
              }}
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
              {/* price 시세 데이터가 들어오면 소수점 둘째 자리까지 표시, 들어오기 전엔 '로딩 중...' */}
              {price ? `$${price.toFixed(2)}` : '로딩 중...'}
            </div>
          </div>

          {/* 📌 관심종목 삭제 버튼 */}
          <button
            onClick={(e) => {
              e.stopPropagation() // 부모 <li>의 onClick(종목 선택) 이벤트 전파 방지
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

        {/* 📌 1주 매수 버튼 */}
        <button
          onClick={(e) => {
            e.stopPropagation() // 부모 <li>의 onClick(종목 선택) 클릭 이벤트 전파 방지
            // 시세 가격(price)이 유효하면 수량 1주를 현재 가격(price)으로 매수 실행
            if (price) buyStock(symbol, 1, price)
          }}
          disabled={!price} // 아직 시세 데이터를 로딩 중이면 매수 버튼 비활성화
          style={{
            marginTop: '8px',
            width: '100%',
            padding: '5px',
            fontSize: '12px',
            borderRadius: '6px',
            background: '#61dafb22',
            color: '#61dafb',
            border: '1px solid #61dafb55',
            cursor: price ? 'pointer' : 'not-allowed',
          }}
        >
          ＋1주 매수
        </button>
      </li>
      )
        })}
    </ul>
    </div >
  )
}
