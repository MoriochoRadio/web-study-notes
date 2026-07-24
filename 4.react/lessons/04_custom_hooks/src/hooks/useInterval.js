// ── STEP 3: 인터벌(주기 실행) 커스텀 훅 ──
// 개념: 지정한 주기(delay)마다 반복 함수(callback)를 안전하게 실행함. delay가 null이면 타이머 정지.
import { useEffect, useRef } from 'react'

// [useInterval] callback: 반복 실행할 함수 / delay: 반복 주기(밀리초, null이면 일시정지)
export function useInterval(callback, delay) {
    // 1. [useRef] 최신 callback 함수를 보관하는 메모장 생성 (값이 바뀌어도 타이머가 리셋되지 않음)
    const savedCallback = useRef(callback)

    // 2. [useEffect] callback 함수가 바뀔 때마다 메모장에 최신 함수를 기록 (타이머는 켜진 상태 유지)
    useEffect(() => {
        savedCallback.current = callback
    }, [callback])

    // 3. [useEffect] delay(주기)가 설정되면 실제 setInterval 타이머 동작
    useEffect(() => {
        // [정지 스위치] delay가 null이면 타이머를 실행하지 않고 즉시 종료 (일시정지 기능)
        if (delay === null) return

        // [setInterval] delay(예: 1000ms)마다 메모장에 적힌 최신 함수(savedCallback.current)를 실행
        const id = setInterval(() => savedCallback.current(), delay)

        // [Cleanup 함수] delay가 바뀌거나 컴포넌트가 꺼질 때 이전 타이머(setInterval)를 깨끗이 제거
        return () => clearInterval(id)
    }, [delay]) // delay가 변경될 때만 타이머를 새로 설정함
}