// ── STEP 2: 디바운스 커스텀 훅 ──
// 개념: 실시간 입력값(value)을 일정 시간(delay) 동안 지연시켰다가, 입력이 멈추면 마지막 값만 반환함.
import { useState, useEffect } from 'react'

// [useDebounce] 실시간 입력값(value)과 지연시간(delay, 기본 300ms = 0.3초)을 인자로 받는 훅
export function useDebounce(value, delay = 300) {
    // 1. 0.3초 대기 후 확정될 최종 디바운스 값(debouncedValue)과 상태 변경 함수(setDebouncedValue) 생성
    const [debouncedValue, setDebouncedValue] = useState(value)

    useEffect(() => {
        // 2. [setTimeout] 지정한 delay(0.3초) 동안 기다렸다가, 입력이 멈추면 setDebouncedValue(value)를 실행하여 최종값 갱신
        const timer = setTimeout(() => setDebouncedValue(value), delay)

        // 3. [Cleanup 함수] 0.3초가 지나기 전에 사용자가 또 키보드를 치면 (value가 바뀌면)
        //    이전에 예약해둔 타이머를 취소(clearTimeout)하여 옛날 글자 요청이 실행되는 것을 방지함! (핵심!)
        return () => clearTimeout(timer)

    }, [value, delay]) // 4. 입력값(value)이나 지연시간(delay)이 바뀔 때마다 useEffect 재실행

    // 5. 0.3초 동안 타이핑이 멈춘 후 최종 확정된 디바운스 값을 밖으로 리턴
    return debouncedValue
}