// ── STEP 1: 루트 레이아웃 (공통 뼈대) ──
// [개념 1] layout.js는 모든 페이지의 공통 겉 틀(상단 헤더 + 하단 푸터)입니다.
// [개념 2] {children} 은 유저가 접속한 주소의 실제 페이지(page.js)가 쏙 꽂히는 '사진 액자의 알맹이 자물쇠' 위치입니다.
// 
// 💡 핵심 공부 노트:
// 1. Link vs <a> 태그:
//    - <a>: 페이지 전체를 새로고침하여 리액트 State(상태 데이터)를 전부 리셋(초기화)시킴.
//    - <Link>: 새로고침 없이 주소만 살짝 바꾼 뒤, {children} 부분만 부드럽게 교체 (SPA 방식 + 초고속 프리패칭).
// 2. 서버 컴포넌트 (Next.js 기본값):
//    - 서버에서 미리 HTML을 만들어 내보내므로 빠른 초기 로딩과 SEO에 좋음.
//    - 단, useState, useEffect, Context API 등의 브라우저 전용 훅 사용 불가! (필요 시 파일 최상단에 'use client' 선언)

import './globals.css'
import Link from 'next/link'

export const metadata = { title: '나의 블로그' }

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body style={{ margin: 0, fontFamily: 'sans-serif' }}>
        {/* 상단 공통 헤더 (모든 페이지에서 고정됨) */}
        <header style={{ borderBottom: '1px solid #eee', padding: '1rem 2rem', display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <strong style={{ fontSize: '1.2rem' }}>📝 나의 블로그</strong>
          <nav style={{ display: 'flex', gap: '1.5rem' }}>
            {/* Link를 사용해 새로고침 없이 상단 메뉴를 부드럽게 이동 */}
            <Link href="/">홈</Link>
            <Link href="/about">소개</Link>
            <Link href="/blog">블로그</Link>
          </nav>
        </header>

        {/* 메인 알맹이 영역: 현재 URL 주소에 맞는 page.js 가 {children} 자리에 쏙 꽂힙니다! */}
        <main style={{ maxWidth: '780px', margin: '0 auto', padding: '2rem' }}>
          {children}
        </main>

        {/* 하단 공통 푸터 */}
        <footer style={{ borderTop: '1px solid #eee', padding: '1.5rem 2rem', textAlign: 'center', color: '#aaa', fontSize: '14px' }}>
          © 2025 나의 블로그
        </footer>
      </body>
    </html>
  )
}