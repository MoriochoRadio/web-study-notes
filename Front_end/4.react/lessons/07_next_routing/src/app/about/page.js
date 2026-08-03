// ── STEP 3: 정적 라우트 → URL "/about" ──
// app/about/page.js 폴더를 만들면 자동으로 "/about" 경로가 생긴다. (별도 설정 불필요)
export default function About() {
    return (
        <div>
            <h1>소개</h1>
            <p style={{ color: '#666', lineHeight: 1.8 }}>
                안녕하세요, 프론트엔드 개발을 공부하고 있는 홍길동입니다.<br />
                React와 Next.js를 배우며 성장하고 있습니다.
            </p>
            <ul style={{ color: '#555', lineHeight: 2 }}>
                <li>📍 서울</li>
                <li>💻 React, Next.js, JavaScript</li>
                <li>🎯 풀스택 개발자를 목표로 공부 중</li>
            </ul>
        </div>
    )
}