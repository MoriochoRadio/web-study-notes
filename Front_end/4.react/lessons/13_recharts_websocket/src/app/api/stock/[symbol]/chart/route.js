// ── STEP 1: 차트 초기 데이터 API → GET /api/stock/[symbol]/chart ── (빈칸 채우기)
// 개념: 키 없음/장 마감 → 더미 60개, 개장 → 실제 1점. 응답 { symbol, data: [{time, price}] }.
// 막히면 정답 참고: lessons_edu/13_recharts_websocket/app/api/stock/[symbol]/chart/route.js
import { isUSMarketOpen } from '@/app/lib/market'

// (헬퍼는 제공됨) 더미 60개 생성
// [{"time":"오전 09:01", "price":181.23},
//  {"time":"오전 09:02", "price":181.23},
//   ..... 
//  ]
function generateDummyData(symbol) {
  const now = Date.now()
  const oneMin = 60 * 1000 // 1분을 ms로 환산
  const base = symbol === 'AAPL' ? 182 : symbol === 'TSLA' ? 250 : 150
  return Array.from({ length: 60 }, (_, i) => {
    const t = now - (59 - i) * oneMin
    const noise = (Math.random() - 0.5) * 3
    return {
      time: new Date(t).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
      price: parseFloat((base + noise + i * 0.05).toFixed(2)),
    }
  })
}
// /api/stock/[symbol]/chart
export async function GET(request, { params }) {
  const { symbol } = await params
  const apiKey = process.env.FINNHUB_API_KEY

  // TODO: STEP 1 — 키가 없거나(!apiKey) 미국장이 닫혀 있으면(!isUSMarketOpen()) 더미 60개를 반환하세요.
  //   (generateDummyData(symbol)를 { symbol, data } 형태로 Response.json)
  if (!apiKey || !isUSMarketOpen()) {
    return Response.json({ symbol, data: generateDummyData(symbol) })
  }
  // 키 있음 + 장 개장 → 실제 현재가 1점 (제공됨)
  try {
    const res = await fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`, { cache: 'no-store' })
    if (!res.ok) throw new Error(`quote 실패 (${res.status})`)
    const q = await res.json()
    if (typeof q.c !== 'number' || q.c === 0) throw new Error('quote 없음')
    const point = {
      time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      price: parseFloat(q.c.toFixed(2)),
    }
    return Response.json({ symbol, data: [point] })
  } catch (err) {
    console.warn('[chart] 실제 API 실패 → 더미 폴백:', err.message)
    return Response.json({ symbol, data: generateDummyData(symbol) })
  }
}
