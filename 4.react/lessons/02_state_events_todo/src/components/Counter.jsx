// ── STEP 1: useState 로 '상태' 다루기 ── (빈칸 채우기)
// 개념: useState, 이벤트 핸들러
// 막히면 정답 참고: lessons_edu/02_state_events_todo/src/components/Counter.jsx
import { useState } from 'react'

function Counter() {
    // TODO: STEP 1 — count 상태와 setCount 함수를 useState로 만드세요. (초기값 0)
    //const count = 0 // ← useState로 교체하세요
    // 1. useState: [현재상태값, 상태변경함수] = useState(초기값)
    // - setCount로 상태를 바꾸면 Counter 컴포넌트 전체가 다시 실행(리렌더링)됩니다.
    const [count, setCount] = useState(0);

    // 2. 동적 스타일 함수
    // - count 상태가 바뀔 때마다 컴포넌트가 재실행되므로, getColor()도 새로운 count 값을 기준으로 재평가됩니다.
    const getColor = () => {
        if (count > 0) return '#185fa5' // 양수일 때 파란색
        if (count < 0) return '#a32d2d' // 음수일 때 붉은색
        return '#1a1a18'                // 0일 때 검은색
    }

    // 3. JS 객체 형태의 스타일 정의
    // - JS 객체: { padding: '10px 24px' } (Key 따옴표 생략 가능, JS 코드 내 사용)
    // - JSON 문자열: '{"padding": "10px 24px"}' (Key 필수 큰따옴표, 서버 전송/저장용)
    const btnStyle = {
        padding: '10px 24px', fontSize: '1.2rem', margin: '0 8px', cursor: 'pointer',
        borderRadius: '8px', border: '1px solid #ddd', background: '#fff',
    }

    return (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
            {/* 리렌더링 시 getColor()가 실행되어 새로운 색상 문자열을 h1의 style에 적용함 */}
            <h1 style={{ fontSize: '4rem', color: getColor(), margin: '0 0 1rem', transition: 'color .2s' }}>
                {count}
            </h1>
            <div>
                {/* 
                  * 이벤트 핸들러 팁:
                  * - () => setCount(...) 화살표 함수로 감싸서 넘기는 이유:
                  *   onClick={setCount(count - 1)} 이라 쓰면 렌더링되자마자 즉시 실행되어 무한 루프 에러 발생!
                  *   따라서 "클릭했을 때 실행해줘" 라는 미니 함수를 새로 만들어서 전달함.
                */}
                <button style={btnStyle} onClick={() => setCount(count - 1)}>−</button>
                <button style={btnStyle} onClick={() => setCount(0)}>초기화</button>
                <button style={btnStyle} onClick={() => setCount(count + 1)}>+</button>
            </div>
            <p style={{ marginTop: '1.2rem', color: '#888' }}>
                {/* 삼항 연산자를 이용한 조건부 텍스트 출력 */}
                {count > 0 ? '양수입니다 😊' : count < 0 ? '음수입니다 😅' : '0입니다 😐'}
            </p>
        </div>
    )
}

export default Counter