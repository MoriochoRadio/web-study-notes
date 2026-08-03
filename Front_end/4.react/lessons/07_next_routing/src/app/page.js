// ── STEP 2: 홈 페이지 → URL "/" ──
// app/page.js 는 루트 경로("/")에 매핑된다. (폴더 구조 = URL)
import Link from 'next/link'

export default function Home() {
  return (
    <div>
      <h1>안녕하세요! 👋</h1>
      <p style={{ color: '#666', lineHeight: 1.7 }}>
        Next.js App Router로 만든 블로그입니다.<br />
        다양한 개발 이야기를 공유합니다.
      </p>
      <Link
        href="/blog"
        style={{
          display: 'inline-block', marginTop: '1rem', padding: '10px 20px',
          background: '#1a1a18', color: '#fff', borderRadius: '8px', textDecoration: 'none',
        }}
      >
        블로그 보러가기 →
      </Link>
    </div>
  )
}