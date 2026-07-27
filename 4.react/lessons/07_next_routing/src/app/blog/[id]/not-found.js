// ── STEP 6: 404 페이지 → "/blog/[id]/not-found.js" ──
// [개념] notFound() 함수가 실행되면 Next.js가 자동으로 감지해 이 not-found.js 화면을 보여줍니다.
// HTTP 404 에러 상태 코드와 함께 깔끔한 에러 안내 페이지를 사용자에게 제공합니다.

import Link from 'next/link'

export default function NotFound() {
    return (
        <div style={{ textAlign: 'center', padding: '3rem 0' }}>
            <h2>❌ 존재하지 않는 블로그 글입니다!</h2>
            <p style={{ color: '#666' }}>주소가 잘못되었거나 삭제된 글입니다.</p>
            <Link href="/blog" style={{ color: '#0066cc' }}>
                ← 블로그 목록으로 돌아가기
            </Link>
        </div>
    )
}

