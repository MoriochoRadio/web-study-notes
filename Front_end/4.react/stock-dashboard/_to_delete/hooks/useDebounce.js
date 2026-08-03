// ── 커스텀 훅: useDebounce ──
// 4.react/lessons/04_custom_hooks 에서 배운 것과 동일한 훅. 실시간 입력값을 delay(ms) 동안
// 지연시켰다가 타이핑이 멈춘 뒤의 최종 값만 반환한다 — 기능 1(스마트 주식 검색)에서
// 키 입력마다 Finnhub API를 호출하지 않도록(무료 호출 한도 보호) 검색어에 적용한다.
import { useState, useEffect } from 'react'

export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}
