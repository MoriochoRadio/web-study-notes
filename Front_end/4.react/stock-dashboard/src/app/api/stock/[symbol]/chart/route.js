// ═══════════════════════════════════════════════════════════════════
// 📄 /api/stock/[symbol]/chart — 차트 초기 데이터 API (기능 4)
// ───────────────────────────────────────────────────────────────────
// 호출 예 : GET /api/stock/NVDA/chart   ← 쿼리(?symbol=)가 아니라 "경로"에 심볼이 들어감!
//           폴더명이 [symbol] 처럼 대괄호면 그 자리의 경로 조각을 변수로 받는다 (동적 라우트)
// 응답 예 : { symbol:'NVDA', data: [ { time:'오후 02:26', price:130.5 }, ... ] }
// 쓰는 곳 : StockChart.jsx — 이 응답으로 차트의 "처음 모양"을 그리고,
//           그 이후의 실시간 점 추가는 StockChart의 WebSocket이 담당한다.
// 전략   : 장이 열려있으면 실제 현재가 1점으로 시작, 닫혀있으면(또는 실패하면)
//           그럴듯한 더미 60점으로 시작 → 어떤 상황에도 차트가 비어 보이지 않게!
// ═══════════════════════════════════════════════════════════════════
import { isUSMarketOpen } from '@/lib/market'

// (제공) 그럴듯한 가짜 60개 분봉 데이터 생성 헬퍼
// Array.from({ length: 60 }, (_, i) => ...) : 길이 60짜리 배열을 만들며
// 각 칸을 콜백의 리턴값으로 채운다 (i = 0~59). for문 없이 배열을 "생성+변환" 한 번에.
function generateDummyData(symbol) {
    const now = Date.now()
    const oneMin = 60 * 1000 // 1분 = 60,000밀리초
    // 종목별로 그럴듯한 기준가를 다르게 (AAPL이면 182달러 부근에서 움직이는 것처럼)
    const base = symbol === 'AAPL' ? 182 : symbol === 'TSLA' ? 250 : symbol === 'NVDA' ? 130 : 150
    return Array.from({ length: 60 }, (_, i) => {
        const t = now - (59 - i) * oneMin // 59분 전 → 현재까지 1분 간격 시각
        const noise = (Math.random() - 0.5) * 3 // -1.5 ~ +1.5 사이 랜덤 잡음 (지그재그 느낌)
        return {
            time: new Date(t).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
            price: parseFloat((base + noise + i * 0.05).toFixed(2)), // i*0.05 = 살짝 우상향 추세
        }
    })
}

// 동적 라우트에서는 두 번째 인자 { params }로 경로 변수를 받는다.
// (Next.js 15+에서 params는 Promise라서 await로 풀어야 함 — AGENTS.md 참고사항)
export async function GET(request, { params }) {
    const { symbol } = await params
    const apiKey = process.env.FINNHUB_API_KEY

    // ① API 키가 없거나(!apiKey), 미국장이 닫혀있으면(!isUSMarketOpen())
    //    → 실시세를 받을 수 없으니 더미 60점을 리턴하고 끝
    if (!apiKey || !isUSMarketOpen()) {
        return Response.json({ symbol, data: generateDummyData(symbol) })
    }

    // ② 장이 열려있으면: 기능 2에서 만든 것과 똑같은 방식으로 /v1/quote를 호출해
    //    "현재가 1개"만 { time, price } 점 하나짜리 배열로 리턴.
    //    (이후의 점들은 StockChart의 WebSocket이 실시간으로 이어 붙인다)

    try {
        // 1. 기능 2 route.js와 완전히 똑같은 fetch 호출
        const res = await fetch(
            `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`,
            { cache: 'no-store' }
        )

        // 2. res.ok 체크 — 실패면 throw로 catch까지 점프
        if (!res.ok) throw new Error(`quote 실패 (${res.status})`)

        // 3. json으로 파싱
        const data = await res.json()

        // 4. "data.c가 숫자인지" 체크 (유효한 시세인지 확인 — quote route와 동일한 방어)
        if (typeof data.c !== 'number') throw new Error('quote 없음')

        // 5. 기능 2는 { symbol, price, change, ... } 여러 필드를 리턴했지만,
        //    차트는 딱 { time, price } 점 하나만 필요하다.
        const point = {
            time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            price: parseFloat(data.c.toFixed(2)),
        }

        // 6. 이 점 하나를 배열에 담아서 { symbol, data: [점] } 형태로 리턴
        return Response.json({ symbol, data: [point] })

    } catch (err) {
        // try 안 어디서든 실패하면(네트워크 에러, 위의 throw 포함) 더미로 대체 —
        // "차트가 아예 안 뜨는 것"보다 "더미라도 뜨는 것"이 낫다는 폴백(fallback) 전략
        return Response.json({ symbol, data: generateDummyData(symbol) })
    }
}
