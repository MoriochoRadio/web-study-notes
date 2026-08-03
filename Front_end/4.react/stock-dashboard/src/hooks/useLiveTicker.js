// ═══════════════════════════════════════════════════════════════════
// 📄 useLiveTicker.js — WebSocket으로 여러 종목의 실시간 체결가를 받는 커스텀 훅
// ───────────────────────────────────────────────────────────────────
// 역할   : Finnhub WebSocket에 연결해 symbols 배열의 종목들을 한꺼번에 구독하고,
//          { prices(현재가 모음), flashes(방금 오른/내린 방향) } 를 돌려준다.
// 쓰는 곳: TickerBoard.jsx (상단 전광판)
// fetch와의 차이: fetch는 "한 번 묻고 한 번 답 받기"(편지),
//                WebSocket은 "전화 연결을 계속 유지하며 서버가 수시로 말해줌"(통화).
// ═══════════════════════════════════════════════════════════════════
'use client'
import { useState, useEffect, useRef } from 'react'

// 전광판에 항상 띄울 대표 종목들. BINANCE:BTCUSDT 같은 코인 심볼이 섞여 있는 이유:
// 미국장이 닫힌 시간에도 코인은 24시간 체결이 일어나서 "실시간으로 움직이는 모습"을 볼 수 있다.
export const MAJOR_SYMBOLS = ['BINANCE:BTCUSDT', 'BINANCE:ETHUSDT', 'AAPL', 'TSLA', 'NVDA']

export function useLiveTicker(symbols) {
    // prices  → { 'AAPL': 200.75, 'TSLA': 250.1, ... }  심볼별 현재가
    // flashes → { 'AAPL': 'up' | 'down' | null, ... }   방금 가격이 움직인 방향(0.5초만 유지)
    const [prices, setPrices] = useState({})
    const [flashes, setFlashes] = useState({})

    // useRef를 쪼개보면:
    //   "리렌더링을 일으키지 않고 값 하나를 기억해두는 상자". .current로 읽고 쓴다.
    //   여기서는 "직전 가격"을 기억하는 용도 — 직전 가격은 화면에 그릴 게 아니라
    //   비교용으로만 쓰니까, state로 두면 불필요한 리렌더링만 생긴다. 그래서 ref.
    const prevPricesRef = useRef({})

    useEffect(() => {
        // NEXT_PUBLIC_ 접두사가 붙은 환경변수만 브라우저에서 읽을 수 있다.
        // (WebSocket은 브라우저가 직접 연결하므로 서버 전용 키를 쓸 수 없음)
        const token = process.env.NEXT_PUBLIC_FINNHUB_API_KEY
        const ws = new WebSocket(`wss://ws.finnhub.io?token=${token}`)

        // 연결이 열리면(onopen) 종목마다 "구독 신청" 메시지를 보낸다.
        // WebSocket은 문자열만 주고받으므로 JSON.stringify로 객체→문자열 변환
        ws.onopen = () => {
            symbols.forEach((sym) => ws.send(JSON.stringify({ type: 'subscribe', symbol: sym })))
        }

        // 서버가 메시지를 보낼 때마다(onmessage) 실행되는 수신 핸들러
        ws.onmessage = (event) => {
            const msg = JSON.parse(event.data) // 문자열 → 객체 복원
            // trade(체결) 타입이 아니거나 데이터가 비어있으면 무시.
            // msg.data?.length 의 ?. : msg.data가 없어도 에러 없이 undefined → falsy 처리
            if (msg.type !== 'trade' || !msg.data?.length) return

            // 한 메시지에 여러 종목의 체결이 섞여 올 수 있어서 forEach로 하나씩 처리
            // trade.s = 심볼, trade.p = 체결가
            msg.data.forEach((trade) => {
                const prevPrice = prevPricesRef.current[trade.s]

                // 직전 가격이 있고(첫 수신이 아니고), 가격이 실제로 변했을 때만 반짝임 처리
                if (prevPrice !== undefined && trade.p !== prevPrice) {
                    const direction = trade.p > prevPrice ? 'up' : 'down'

                    // 이 종목의 flash 방향을 기록 → TickerBoard가 초록/빨강 배경으로 표시
                    setFlashes((prev) => ({ ...prev, [trade.s]: direction }))

                    // 0.5초 뒤에 flash를 다시 끈다(null) → "반짝"하고 사라지는 효과
                    setTimeout(() => {
                        setFlashes((prev) => ({ ...prev, [trade.s]: null }))
                    }, 500)
                }

                // 다음 비교를 위해 "직전 가격"을 갱신 (ref라서 리렌더링 없음)
                prevPricesRef.current[trade.s] = trade.p
            })

            // 함수형 업데이트 (prev) => {...} 를 쓰는 이유:
            // 메시지가 연달아 빠르게 도착해도, 항상 "가장 최신 상태(prev)"를 복사한 뒤
            // 바뀐 종목만 덮어써서 다른 종목 가격이 사라지지 않게 하기 위함
            setPrices((prev) => {
                const next = { ...prev }
                msg.data.forEach((trade) => { next[trade.s] = trade.p })
                return next
            })
        }

        ws.onerror = (err) => console.log('websocket 오류:', err)

        // [Cleanup] 컴포넌트가 사라지거나 symbols가 바뀌어 재연결하기 "직전"에 실행.
        // 연결을 유지하는 리소스(WebSocket)는 반드시 이전 연결을 정리해야
        // 메모리 누수/중복 구독이 안 생긴다.
        // readyState === OPEN 체크: 아직 연결이 살아있을 때만 unsubscribe를 보낼 수 있음
        return () => {
            if (ws.readyState === WebSocket.OPEN)
                symbols.forEach((sym) => ws.send(JSON.stringify({ type: 'unsubscribe', symbol: sym })))
            ws.close()
        }
    }, [symbols]) // ⚠️ symbols를 부르는 쪽에서 매번 새 배열로 만들면 재연결이 반복된다!
                  //    그래서 MAJOR_SYMBOLS를 파일 밖 상수로 빼서 "같은 배열"을 유지한다 (참조 동일성)

    return { prices, flashes }
}
