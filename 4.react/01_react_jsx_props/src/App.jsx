// =========================================================================
// [부모 컴포넌트: App.jsx]
// - 이 파일은 우리 애플리케이션의 '전체 레이아웃'과 '데이터'를 가지고 있습니다.
// - 여기에서 정의된 데이터(team 배열)를 자식 컴포넌트(ProfileCard)에게 전달하여 화면을 채웁니다.
// =========================================================================

import './App.css'
// 💡 우리가 직접 만든 자식 컴포넌트인 ProfileCard를 가져옵니다.
import ProfileCard from './components/ProfileCard'

// [팀원 정보 데이터]
// - 각 멤버의 고유 정보들이 객체(Object) 형태로 배열에 담겨 있습니다.
// - 이 데이터를 바탕으로 화면에 카드를 동적으로 그려낼 것입니다.
const team = [
  { id: 1, name: '김민준', job: '프론트엔드', emoji: '👨‍💻', bgColor: '#e6f1fb', isOnline: true, isLead: true },
  { id: 2, name: '이서연', job: '디자이너', emoji: '🎨', bgColor: '#eaf3de', isOnline: true, isLead: false },
  { id: 3, name: '박지호', job: '백엔드', emoji: '🔧', bgColor: '#faeeda', isOnline: false, isLead: false },
  { id: 4, name: '최수아', job: '기획자', emoji: '📋', bgColor: '#f3e6fb', isOnline: false, isLead: false },
]

// 💡 컴포넌트 = "JSX를 반환하는 함수". 이름은 반드시 대문자로 시작해야 React가 컴포넌트로 인식합니다.
function App() {
  // 💡 React 컴포넌트(함수)는 반드시 하나의 큰 부모 태그(여기서는 <div>)로 감싸진 JSX를 리턴해야 합니다.
  //    - return (<div/><div/>) 처럼 형제 요소 2개를 나란히 반환하면 에러 (X)
  //    - <div>...</div> 하나로 감싸거나, 태그가 싫으면 빈 태그 <>...</> (Fragment)를 사용 (O)
  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      {/* 💡 JSX 안에서 중괄호 { }를 열면 자바스크립트 표현식을 그대로 쓸 수 있습니다. */}
      <h1>우리 팀 소개 ({team.length}명)</h1>

      <div>
        {/* 
          💡 [개념: 리스트 렌더링 - map() 함수]
          - 자바스크립트의 .map() 메소드를 사용해 team 배열의 데이터 하나하나를 
            ProfileCard 컴포넌트 형태로 변환(렌더링)합니다.
          
          - key={member.id}: React가 어떤 항목이 변경, 추가, 삭제되었는지 식별할 수 있도록
            고유한 ID값을 주는 식별표입니다. (리액트 리스트 출력 시 필수!)
            ⚠️ 배열 순서(index)를 key로 쓰면 항목 순서가 바뀔 때 React가 엉뚱한 항목을
            재사용해 버그가 생길 수 있으므로, 데이터 고유의 id를 쓰는 것이 안전합니다.
            key를 아예 빼면 콘솔에 "unique key prop" 경고가 뜹니다.
            
          - name, job, emoji... : 자식(ProfileCard)에게 전달할 데이터들입니다. (이것을 Props라고 부릅니다)
        */}
        {team.map((member) => (
          <ProfileCard
            key={member.id}
            name={member.name}
            job={member.job}
            emoji={member.emoji}
            bgColor={member.bgColor}
            isOnline={member.isOnline}
            isLead={member.isLead}
          />
        ))}

      </div>
    </div>
  )
}

// 💡 다른 파일(main.jsx)에서 import App 으로 가져다 쓸 수 있게 내보냅니다.
export default App