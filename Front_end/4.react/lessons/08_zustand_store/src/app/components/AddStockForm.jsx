// ── STEP 2: 관심종목 추가 폼 컴포넌트 (중복 체크 메시지 적용) ──
// [핵심 개념]
// 1. 스토어 내부의 중복 방지(useStockStore의 includes 체크)는 기본 보장용으로 둡니다.
// 2. 컴포넌트(UI)에서 사용자에게 "이미 있는 종목입니다"라는 피드백 메시지를 보여주기 위해
//    스토어의 watchlist를 구독하여 입력 시 미리 검사(includes)하고 setMsg로 안내를 표시합니다.

'use client'
import { useState } from 'react'
import useStockStore from '@/app/store/useStockStore'

export default function AddStockForm() {
    // 1) 사용자 입력값(input)과 중복 안내 메시지(msg) 상태
    const [input, setInput] = useState('')
    const [msg, setMsg] = useState('')

    // 2) Zustand 스토어에서 현재 관심목록(watchlist)과 추가 함수(addToWatchlist)를 각각 셀렉터로 가져옴
    const watchlist = useStockStore((s) => s.watchlist)
    const addToWatchlist = useStockStore((s) => s.addToWatchlist)

    // 3) 종목 추가 이벤트 핸들러
    const handleAdd = () => {
        // 공백 입력 방지
        if (!input.trim()) return

        const symbol = input.toUpperCase()

        // 📌 [슬라이드 과제 핵심] 스토어의 watchlist에 이미 해당 종목이 들어있는지 체크!
        if (watchlist.includes(symbol)) {
            setMsg(`이미 있는 종목: ${symbol}`)
            return
        }

        // 중복이 아니면 이전 메시지 초기화 후 스토어에 추가
        setMsg('')
        addToWatchlist(symbol)
        setInput('')
    }

    return (
        <div style={{ padding: '1rem' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
                <input
                    value={input}
                    onChange={(e) => {
                        setInput(e.target.value)
                        if (msg) setMsg('') // 타자 칠 때 기존 안내 메시지 초기화
                    }}
                    onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                    placeholder="종목 코드 입력 (예: NVDA)"
                    style={{
                        flex: 1, padding: '8px 12px', borderRadius: '6px',
                        border: '1px solid #0f3460', background: '#0d2137', color: '#ccd6f6'
                    }}
                />
                <button
                    onClick={handleAdd}
                    style={{
                        padding: '8px 16px', borderRadius: '6px',
                        background: '#61dafb', color: '#0a192f', border: 'none',
                        cursor: 'pointer', fontWeight: 'bold'
                    }}
                >
                    추가
                </button>
            </div>

            {/* 📌 중복 추가 시 빨간색/주황색 안내 메시지 표시 */}
            {msg && (
                <p style={{ color: '#ff6b6b', fontSize: '13px', marginTop: '8px', marginBottom: 0, fontWeight: 'bold' }}>
                    ⚠️ {msg}
                </p>
            )}
        </div>
    )
}