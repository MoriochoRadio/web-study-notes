// ── STEP 1: 데이터 패칭 커스텀 훅 ── (빈칸 채우기)
// 개념: 종목코드를 넣으면 { data, loading, error, refetch }를 돌려주는 훅.
// 막히면 정답 참고: lessons_edu/04_custom_hooks/src/hooks/useStockData.js
import { useState, useEffect, useCallback } from 'react'

// (헬퍼는 제공됩니다) 더미 API — Promise로 비동기 결과를 돌려준다.
// [function] 함수 정의 / [symbol] 전달받는 주식 종목 코드
function fakeFetch(symbol) {
    // [Promise] 비동기 처리를 위한 객체 반환 (resolve: 성공 알림 함수, reject: 실패 알림 함수)
    return new Promise((resolve, reject) => {
        // [setTimeout] 실제 네트워크 통신처럼 0.8초~1.2초 지연(로딩)을 흉내냄
        setTimeout(() => {
            // symbol이 'ERROR'인 경우 실패(reject) 상태 흉내
            if (symbol === 'ERROR') {
                reject(new Error('종목을 찾을 수 없습니다.')) // 에러 전달
                return // 함수 실행 중단
            }

            // 주요 종목의 기본 주가 정의 객체
            const base = { AAPL: 182.52, TSLA: 248.5, MSFT: 378.85 }

            // [resolve] 비동기 작업 성공 알림 및 결과 데이터 객체 반환
            resolve({
                symbol, // 단축 속성명 (symbol: symbol 과 동일)
                price: base[symbol] || Math.random() * 200 + 100, // 기본가 또는 100~300 사이 랜덤 주가
                change: (Math.random() * 6 - 3).toFixed(2) * 1, // -3~+3 소수점 2자리 반올림 후 숫자 타입 변환 (* 1)
                volume: Math.floor(Math.random() * 10_000_000), // 0~1천만 사이 정수(Math.floor) 거래량
                updatedAt: new Date().toLocaleTimeString(), // 현재 시간을 현지 시각 문자열로 변환
            })
        }, 800 + Math.random() * 400) // 800ms + (0~400ms) = 0.8초~1.2초 지연
    })
}

export function useStockData(symbol) {
    // 1. [useState] 주식 데이터(data), 로딩 여부(loading), 에러 정보(error)를 한 객체로 관리하는 상태
    const [state, setState] = useState({ data: null, loading: true, error: null })

    // 2. [useCallback & load] load 함수를 useCallback으로 감싸 symbol이 바뀔 때만 새로 생성되도록 메모이제이션
    // 핵심: load 함수를 useCallback으로 감싸지 않으면 컴포넌트가 렌더링될 때마다 매번 새로운 load 함수 객체가 만들어집니다.
    // 이 상태에서 useEffect 의존성 배열에 [load]를 넣으면 무한 재실행(무한 루프)이 발생하고, [load]를 빠뜨리면 ESLint 의존성 경고가 남습니다.
    // useCallback(..., [symbol])로 감싸면 symbol이 바뀔 때만 load 함수가 새로 생성되므로, useEffect([load])처럼 정직하게 전달해도 무한 루프 없이 의존성 경고까지 해결됩니다.
    const load = useCallback(() => {
        // [시작 전] 먼저 로딩 상태를 true로 만들고 에러를 리셋함 (화면에 '로딩 중...' 표시)
        setState((prev) => ({ ...prev, loading: true, error: null }))

        // [비동기 데이터 요청] fakeFetch(symbol) 실행
        fakeFetch(symbol)
            // [성공 시 .then] 데이터 도착! data 세팅, loading: false로 로딩 종료
            .then((data) => setState((prev) => ({ ...prev, data, loading: false, error: null })))
            // [실패 시 .catch] 에러 발생! 에러 메시지 세팅, loading: false로 로딩 종료
            .catch((err) => setState({ data: null, loading: false, error: err.message }))
    }, [symbol]) // symbol이 바뀔 때만 load 함수를 재생성

    // 3. [useEffect] load 함수 참조(즉, symbol)가 변경될 때마다 실행되는 감시 장치
    useEffect(() => {
        // [검색어 초기화 처리] symbol이 빈 값일 경우 (검색어를 다 지운 경우)
        if (!symbol) {
            setState({ data: null, loading: false, error: null }) // 데이터 리셋
            return // 데이터 요청(load)을 하지 않고 함수 즉시 종료
        }

        // symbol이 잘 존재하면 주식 데이터 로딩 함수 실행!
        load()
    }, [load]) // load 함수가 useCallback으로 메모이제이션되어 있어 [load]를 의존성 배열에 정직하게 넣어도 안전함!

    // 4. [리턴값] 현재 상태 객체({ data, loading, error })를 펼쳐서 반환하고, 수동 새로고침 함수(refetch: load)도 함께 밖으로 반환!
    return { ...state, refetch: load }
}