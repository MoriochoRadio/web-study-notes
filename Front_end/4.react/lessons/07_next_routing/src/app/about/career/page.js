// ── 중첩 라우트 (Nested Route) 페이지 ──
// [개념] app/about/career/page.js 폴더 구조만으로 자동으로 "http://localhost:3000/about/career" 주소가 생성됩니다.

export default function Career() {
    return (
        <div>
            <h1>경력 사항</h1>
            <p>Next.js의 폴더 기반 중첩 라우팅 테스트 페이지입니다.</p>
        </div>
    )
}