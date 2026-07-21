// =========================================================================
// [자식 컴포넌트: ProfileCard.jsx]
// - 이 컴포넌트는 오직 부모(App.jsx)가 건네주는 '데이터(Props)'를 받아와서 
//   화면에 예쁘게 프로필 카드를 그려내는 역할(UI 렌더링)만 담당합니다.
// =========================================================================

// 💡 [개념: Props 구조분해 할당 (Destructuring)]
// - 원래 매개변수로 'props' 객체를 통째로 받아서 'props.name', 'props.job' 형태로 써야 하지만,
//   자바스크립트 문법 `{ name, job, ... }`을 활용해 객체 내부 값을 즉시 낱개 변수로 꺼내 사용합니다.
// ⚠️ Props는 '읽기 전용' — 데이터는 항상 부모(App)가 소유하고 위→아래 한 방향으로만 흐르며,
//    자식이 받은 props를 직접 수정하면 에러가 발생합니다.
function ProfileCard({ name, job, emoji, bgColor, isOnline, isLead }) {
    return (
        <div
            // 💡 [개념: React에서 인라인 스타일 사용법]
            // - HTML의 style="border: 1px" 방식과 달리, 
            //   JSX 안에서는 style={{ property: 'value' }} 형태의 '자바스크립트 객체'로 작성합니다.
            // - 속성 이름은 카멜 케이스(camelCase)를 사용해야 합니다. (예: backgroundColor)
            style={{
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                padding: '20px',
                margin: '10px',
                display: 'inline-block',
                backgroundColor: bgColor || '#fff', // 만약 bgColor가 전달되지 않았다면 기본값으로 흰색('#fff')을 사용합니다.
                minWidth: '160px',
                textAlign: 'center',
                verticalAlign: 'top',
            }}
        >
            {/* 
              💡 [개념: 조건부 렌더링 1 - 논리 연산자 (&&)]
              - '조건 && JSX' 형식으로 작성합니다.
              - 왼쪽의 조건(isLead)이 true일 때만 오른쪽의 <div>태그가 화면에 그려집니다. (리더인 팀원에게만 별표 표시)
            */}
            {isLead && <div style={{ fontSize: '0.85rem', color: 'orange' }}>⭐ 팀 리더</div>}
            
            <div style={{ fontSize: '2.5rem' }}>{emoji}</div>
            <h2 style={{ margin: '10px 0 4px', fontSize: '1.1rem' }}>{name}</h2>
            <p style={{ color: '#888', fontSize: '0.9rem', margin: 0 }}>{job}</p>

            {/* 
              💡 [개념: 조건부 렌더링 2 - 삼항 연산자 (? :)]
              - '조건 ? 참일때_JSX : 거짓일때_JSX' 형식으로 작성합니다.
              - 온라인 상태에 따라 초록색 🟢텍스트 또는 회색 ⚪텍스트를 골라서 화면에 띄웁니다.
            */}
            <p style={{ margin: '8px 0 0', fontSize: '0.8rem' }}>
                {isOnline 
                  ? <span style={{ color: 'green' }}>🟢 온라인</span>
                  : <span style={{ color: 'gray' }}>⚪ 오프라인</span>
                }
            </p>
        </div>
    )
}

export default ProfileCard