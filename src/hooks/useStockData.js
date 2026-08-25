import { useState, useEffect, useCallback } from 'react'

export function useStockData(symbol) {
    const [state, setState] = useState({ data: null, loading: true, error: null })

    const load = useCallback(() => {
        setState((prev) => ({ ...prev, loading: true, error: null }))

        fetch('/api/quote?symbol=' + symbol)
            .then(async (res) => {
                if (!res.ok) {
                    const body = await res.json()
                    throw new Error(body.error)
                }
                return res.json()
            })
            .then(data => setState({ data, loading: false, error: null }))
            .catch(err => setState({ data: null, loading: false, error: err.message }))

    }, [symbol])

    useEffect(() => {
        if (!symbol) {
            setState({ data: null, loading: false, error: null })
            return
        }
        load()
    }, [load])

    return { ...state, refetch: load }
}
