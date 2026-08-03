// ── STEP 3: Recharts 라인 차트 + 실시간 갱신 ──
// 개념: 초기 데이터(REST) 로드 → 실시간(WebSocket 또는 폴링)으로 점 추가.
//   ⚠️ setPrice(스토어 갱신)는 setChartData 업데이터 '밖'에서 호출! (pushPrice 참고)
'use client'
import { useEffect, useRef, useState } from 'react'
// Recharts 라이브러리에서 반응형 라인 차트를 그리기 위한 컴포넌트들
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import useStockStore from '@/app/store/useStockStore'

// 헬퍼(보조) 함수: 현재 시각을 "오후 02:15:30" 형태의 한국어 시간 문자열로 변환
function nowLabel() {
  return new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

export default function StockChart() {
  // 현재 선택된 종목코드 (Zustand 스토어에서 구독)
  const selectedSymbol = useStockStore((s) => s.selectedSymbol)
  // 최신 종목 가격을 Zustand 스토어에 업데이트해 주는 함수
  const setPrice = useStockStore((s) => s.setPrice)
  // chartData: 차트의 X축(시간)과 Y축(가격)을 그리기 위한 데이터 배열 [{time, price}, ...]
  const [chartData, setChartData] = useState([])
  // isLoading: 로딩 화면(스켈레톤/텍스트) 표시 여부 (기본값: true)
  const [isLoading, setIsLoading] = useState(true)
  // lastPriceRef: 리렌더링 없이 직전 최신 가격을 내부 기억장소에 보존하는 useRef
  const lastPriceRef = useRef(0)

  // ── [1단계: 초기 차트 데이터 로드] ──
  // 종목(selectedSymbol)이 바뀔 때마다 /api/stock/[symbol]/chart 에서 초기 60개 데이터를 가져옴
  useEffect(() => {
    let alive = true // 💡 비동기 취소표: 광속 클릭 시 이전 요청의 응답이 화면을 덮어쓰는 버그 방지
    setIsLoading(true) // 로딩 시작

    fetch(`/api/stock/${selectedSymbol}/chart`)
      .then((r) => r.json()) // 응답받은 HTTP Response 객체를 자바스크립트 객체로 변환
      .then(({ data }) => {  // { symbol, data } 객체에서 data 배열만 { 구조 분해 할당 }
        if (!alive) return   // 이미 다른 종목을 클릭했으면 이전 요청 응답을 무시하고 탈출
        setChartData(data)   // 60개 과거 차트 가격 정보 상태 저장
        // 💡 data[data.length - 1]: 배열의 맨 마지막(가장 최신) 데이터 점의 가격을 lastPriceRef에 기억
        if (data.length) lastPriceRef.current = data[data.length - 1].price
        setIsLoading(false)  // 로딩 완료 -> 차트 렌더링 시작
      })

    // 클인업(Clean-up) 함수: 종목이 변경되거나 컴포넌트가 꺼질 때 리액트가 자동 실행하여 취소표 찍음
    return () => { alive = false }
  }, [selectedSymbol])

  // ── [2단계: 실시간 차트 갱신 (웹소켓 또는 폴링)] ──
  useEffect(() => {
    if (isLoading) return // 초기 데이터 로드가 끝날 때까지 대기

    // 새 가격이 들어올 때마다 차트 배열에 추가하고 스토어와 동기화하는 공통 처리 헬퍼 함수
    const pushPrice = (price) => {
      // 💡 price.toFixed(2): 소수점 2자리 반올림 (문자열 반환) -> parseFloat(): 다시 숫자(Float)로 변환
      const newPrice = parseFloat(price.toFixed(2))
      lastPriceRef.current = newPrice
      const point = { time: nowLabel(), price: newPrice }

      // 💡 ...prev.slice(-59): 기존 60개 중 가장 오래된 맨 앞 1개를 버리고 최신 59개만 남김
      // 뒤에 새 point 1개를 덧붙여 차트 데이터 개수를 항상 최신 60개로 일정하게 유지 (슬라이딩 윈도우)
      setChartData((prev) => [...prev.slice(-59), point])
      setPrice(selectedSymbol, newPrice) // 전역 스토어 가격 동기화
    }

    // env.local에서 공개 API 키 가져오기 (NEXT_PUBLIC_ 이 붙어야 브라우저 클라이언트에서 읽을 수 있음)
    const token = process.env.NEXT_PUBLIC_FINNHUB_API_KEY

    // 1번 방식: WebSocket 실시간 수신 (키가 존재할 때)
    if (token) {
      const ws = new WebSocket(`wss://ws.finnhub.io?token=${token}`)
      // 웹소켓 전화선 연결 성공 시 구독(subscribe) 요청 메시지 송신
      ws.onopen = () => ws.send(JSON.stringify({ type: 'subscribe', symbol: selectedSymbol }))

      // 웹소켓에서 실시간 주가 체결 소식이 올 때마다 실행
      ws.onmessage = (event) => {
        const msg = JSON.parse(event.data)
        if (msg.type !== 'trade' || !msg.data?.length) return
        // 💡 msg.data[msg.data.length - 1].p: 체결 내역 중 가장 최신 거래 객체의 p(Price=가격)
        pushPrice(msg.data[msg.data.length - 1].p)
      }
      ws.onerror = (err) => console.log('websocket 오류:', err)

      // 웹소켓 정리(Clean-up): 종목 변경/언마운트 시 구독 해제(unsubscribe) 및 소켓 완전히 닫기(close)
      return () => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ type: 'unsubscribe', symbol: selectedSymbol }))
        }
        ws.close() // 이전 작업에서 연결된 소켓 완전히 닫기
      }
    } else {
      // 2번 방식: 폴링 폴백 (API 키가 없거나 주석 처리했을 때)
      // 2초마다 백엔드 시세 API를 호출하여 시세를 갱신함
      const id = setInterval(async () => {
        try {
          const res = await fetch(`/api/stock/${selectedSymbol}`, { cache: 'no-store' })
          const q = await res.json()
          if (typeof q.price === 'number' && q.price !== 0) pushPrice(q.price)
        } catch (err) {
          console.warn('[StockChart] 폴링 실패:', err.message)
        }
      }, 2000)

      // 타이머 정리(Clean-up): 언마운트/종목 변경 시 타이머 해제
      return () => clearInterval(id)
    }
  }, [selectedSymbol, isLoading, setPrice]) // useEffect 종료

  // 차트 데이터의 가장 마지막(최신) 가격과 첫 번째(과거) 가격을 비교하여 상승/하락 색상 결정
  const last = chartData[chartData.length - 1]?.price || 0
  const first = chartData[0]?.price || 0
  const isUp = last >= first // 상승 중이면 true(민트색), 하락 중이면 false(빨간색)

  return (
    <div className="p-4 rounded-xl border border-gray-200 bg-white dark:border-stock-border dark:bg-stock-card">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-lg font-bold text-stock-cyan">{selectedSymbol}</h3>
          <span className="text-2xl font-bold text-gray-900 dark:text-white">${last.toFixed(2)}</span>
        </div>
        <span className="flex items-center gap-2 text-xs text-gray-500 dark:text-stock-muted">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> 실시간
        </span>
      </div>

      {isLoading ? (
        <div className="h-60 flex items-center justify-center text-gray-500 dark:text-stock-muted">차트 로딩 중...</div>
      ) : (
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#0f346055" />
            <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#8892b0' }} interval="preserveStartEnd" />
            <YAxis domain={['auto', 'auto']} tick={{ fontSize: 10, fill: '#8892b0' }} tickFormatter={(v) => `$${v.toFixed(0)}`} />
            <Tooltip contentStyle={{ background: '#0d2137', border: '1px solid #0f3460', borderRadius: 8, fontSize: 13 }} labelStyle={{ color: '#8892b0' }} />
            <Line type="monotone" dataKey="price" stroke={isUp ? '#64ffda' : '#e94560'} strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}