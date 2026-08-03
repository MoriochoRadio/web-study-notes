// ── STEP 4: localStorage 연동 커스텀 훅 ──
// 개념: useState처럼 [값, 변경함수]를 돌려주되, 브라우저 저장소(localStorage)에 자동으로 저장하고 읽어옴.
import { useState, useEffect } from 'react'

// [useLocalStorage] key: 저장소에 사용할 이름(예: 'lastSymbol') / initialValue: 저장소에 없을 때 쓸 기본값(예: 'AAPL')
export function useLocalStorage(key, initialValue) {

    // [useState(() => ...)] 게으른 초기화 (Lazy Initialization)
    // 💡 왜 useState() 안에 바로 값을 안 넣고 함수 (() => { ... }) 형태로 넣나요?
    // - localStorage에서 값을 읽어오고 문자열을 변환(JSON.parse)하는 작업은 무거운 연산입니다.
    // - useState(() => ...) 처럼 함수를 넣으면, 리액트가 이 읽기 작업을 "맨 처음 렌더링될 때 딱 1번만" 수행합니다!
    const [value, setValue] = useState(() => {
        try {
            // 1. [localStorage.getItem(key)] 브라우저 저장소에서 지정한 key 이름으로 저장된 글자(데이터)를 꺼내옴
            const item = localStorage.getItem(key)

            // 2. [삼항 연산자] 저장된 데이터(item)가 존재하면?
            //    - JSON.parse(item): 글자 형태의 데이터를 진짜 자바스크립트 데이터(객체/문자열)로 다시 변환해서 리턴!
            //    - 없으면? 준비해둔 기본값(initialValue)을 리턴!
            return item ? JSON.parse(item) : initialValue

        } catch (err) {
            // 3. [try-catch] 브라우저 저장소 읽기 실패 시(보안 제한 등), 경고를 출력하고 안전하게 기본값(initialValue) 리턴
            console.warn('localStorage 읽기 실패:', err)
            return initialValue
        }
    })

    // [useEffect] value(값)나 key가 변경될 때마다 브라우저 저장소에 자동으로 저장해주는 감시 장치
    useEffect(() => {
        try {
            // 1. [JSON.stringify(value)] 저장소에 보관할 수 있도록 자바스크립트 값(value)을 글자(문자열) 형태로 변환
            // 2. [localStorage.setItem(key, ...)] 브라우저 저장소에 key 이름으로 글자 데이터를 최종 저장!
            localStorage.setItem(key, JSON.stringify(value))
        } catch (err) {
            // 저장 용량 초과 등의 이유로 쓰기 실패 시 경고 출력
            console.warn('localStorage 쓰기 실패:', err)
        }
    }, [value, key]) // [value, key] 변수의 값이 바뀔 때마다 이 저장 로직이 자동으로 실행됨

    // 일반 useState처럼 똑같이 [현재값, 값변경함수] 세트를 배열 형태로 밖으로 리턴!
    return [value, setValue]
}