'use client'
import { useState, useEffect, useRef } from 'react'

export const MAJOR_SYMBOLS = ['BINANCE:BTCUSDT', 'BINANCE:ETHUSDT', 'AAPL', 'TSLA', 'NVDA']

export function useLiveTicker(symbols) {
    const [prices, setPrices] = useState({})
    const [flashes, setFlashes] = useState({})

    const prevPricesRef = useRef({})
    const flashTimersRef = useRef({})

    useEffect(() => {
        const token = process.env.NEXT_PUBLIC_FINNHUB_API_KEY
        const ws = new WebSocket(`wss://ws.finnhub.io?token=${token}`)

        ws.onopen = () => {
            symbols.forEach((sym) => ws.send(JSON.stringify({ type: 'subscribe', symbol: sym })))
        }

        ws.onmessage = (event) => {
            const msg = JSON.parse(event.data)
            if (msg.type !== 'trade' || !msg.data?.length) return

            msg.data.forEach((trade) => {
                const prevPrice = prevPricesRef.current[trade.s]

                if (prevPrice !== undefined && trade.p !== prevPrice) {
                    const direction = trade.p > prevPrice ? 'up' : 'down'

                    setFlashes((prev) => ({ ...prev, [trade.s]: direction }))

                    clearTimeout(flashTimersRef.current[trade.s])

                    flashTimersRef.current[trade.s] = setTimeout(() => {
                        setFlashes((prev) => ({ ...prev, [trade.s]: null }))
                    }, 500)
                }

                prevPricesRef.current[trade.s] = trade.p
            })

            setPrices((prev) => {
                const next = { ...prev }
                msg.data.forEach((trade) => { next[trade.s] = trade.p })
                return next
            })
        }

        ws.onerror = (err) => console.log('websocket 오류:', err)

        return () => {
            if (ws.readyState === WebSocket.OPEN)
                symbols.forEach((sym) => ws.send(JSON.stringify({ type: 'unsubscribe', symbol: sym })))
            ws.close()
        }
    }, [symbols])

    return { prices, flashes }
}
