// ═══════════════════════════════════════════════════════════════════
// 📄 useDebounce.js — "입력이 멈출 때까지 기다렸다가 값을 넘겨주는" 커스텀 훅
// ───────────────────────────────────────────────────────────────────
// 역할   : 실시간 입력값(value)을 delay(기본 0.3초) 동안 지연시켰다가,
//          입력이 멈추면 마지막 값만 반환한다.
// 쓰는 곳: StockSearch.jsx — 한 글자 칠 때마다 API를 부르면 요청이 폭주하므로,
//          "타이핑이 0.3초 멈춘 순간"에만 검색 API가 나가게 만든다.
// 비유   : 엘리베이터 닫힘 버튼. 사람이 계속 타는 동안(입력이 계속되는 동안)은
//          문이 안 닫히고, 0.3초간 아무도 안 타면 그제서야 닫힌다(값 확정).
// (4.react/lessons/04_custom_hooks 의 useDebounce.js를 그대로 재사용 — 기능 1 검색어에 적용)
// ═══════════════════════════════════════════════════════════════════
import { useState, useEffect } from 'react'

// [useDebounce] 실시간 입력값(value)과 지연시간(delay, 기본 300ms = 0.3초)을 인자로 받는 훅
export function useDebounce(value, delay = 300) {
    // const [debouncedValue, setDebouncedValue] = useState(value) 를 쪼개보면:
    //   debouncedValue    → "확정된 최종값" (읽기 전용. 직접 = 로 바꾸면 안 됨)
    //   setDebouncedValue → 그 값을 바꿔달라고 React에 요청하는 전용 함수 (리모컨 버튼)
    //   useState(value)   → 괄호 안은 초깃값. 처음엔 입력값을 그대로 초깃값으로 씀
    const [debouncedValue, setDebouncedValue] = useState(value)

    useEffect(() => {
        // [setTimeout] "delay(0.3초) 뒤에 setDebouncedValue(value)를 실행해줘"라고 예약.
        // timer 변수에는 그 예약의 "취소용 번호표"가 담긴다.
        const timer = setTimeout(() => setDebouncedValue(value), delay)

        // [Cleanup 함수] 0.3초가 지나기 전에 사용자가 또 키보드를 치면 (value가 바뀌면)
        // React가 다음 effect를 실행하기 "직전"에 이 함수를 먼저 불러준다.
        // → 이전에 예약해둔 타이머를 취소(clearTimeout)해서
        //   옛날 글자로 값이 확정되는 것을 방지함! (디바운스의 핵심!)
        return () => clearTimeout(timer)

    }, [value, delay]) // 의존성 배열: 입력값(value)이나 지연시간(delay)이 바뀔 때마다 위 effect 재실행

    // 0.3초 동안 타이핑이 멈춘 후 최종 확정된 값을 밖으로 리턴.
    // 사용하는 쪽: const debouncedQuery = useDebounce(query, 300)
    //   → query는 실시간으로 바뀌고, debouncedQuery는 0.3초 늦게 따라온다.
    return debouncedValue
}
