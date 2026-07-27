// ── STEP 5: 동적 라우트 상세 페이지 → "/blog/[id]" ──
// [개념 1] URL 경로의 [id] 자리값(예: /blog/1)을 읽어와 해당하는 글의 상세 본문을 보여주는 컴포넌트입니다.
// 
// 💡 핵심 공부 노트:
// 1. async / await 문법:
//    - `async`: 이 함수 안에 비동기(시간이 걸려 기다려야 하는) 작업이 포함되어 있음을 선언합니다.
//    - `await`: 데이터 처리가 완료될 때까지 아래 코드 줄로 넘어가지 않고 일시정지하여 기다립니다.
// 2. Next.js 15+ 에서의 `params`:
//    - `params`는 Promise(비동기 객체)이므로 반드시 `await params`를 해줘야 합니다.
//    - `await params`는 `{ id: '1' }` 형태의 객체를 반환하므로, `const { id } = await params`처럼 중괄호 `{ id }`로 구조 분해를 해주어야 문자열 `'1'`만 깔끔하게 추출됩니다!
// 3. `notFound()` 함수:
//    - 찾으려는 글이 존재하지 않을 때(!post) 호출하면, 표준 HTTP 404 응답을 내보내며 `not-found.js` 404 화면을 표시합니다.

import Link from 'next/link'
import { posts, tagStyle } from '../posts'
import { notFound } from 'next/navigation' // 404 페이지로 연결해주는 Next.js 내장 함수

export default async function BlogPost({ params }) {
    // 1. params 객체에서 id 속성값('1', '2' 등)을 await로 대기해서 꺼냅니다.
    const { id } = await params 

    // 2. URL의 id(문자열)를 Number()로 숫자로 바꿔서 posts 배열에서 일치하는 글 찾기
    const post = posts.find((p) => p.id === Number(id))

    // 3. 해당 글을 찾지 못했으면 바로 not-found.js 404 에러 화면으로 이동시킨다!
    if (!post) {
        notFound()
    }

    // 4. 글이 정상적으로 존재하면 상세 본문 HTML 출력
    return (
        <article>
            <Link href="/blog" style={{ color: '#888', textDecoration: 'none', fontSize: '14px' }}>← 목록으로</Link>
            <span style={{ ...tagStyle(post.tag), marginTop: '1rem', display: 'block', width: 'fit-content' }}>{post.tag}</span>
            <h1 style={{ margin: '0.75rem 0 0.25rem' }}>{post.title}</h1>
            <p style={{ color: '#aaa', fontSize: '13px', marginBottom: '2rem' }}>{post.date}</p>
            <p style={{ lineHeight: 1.9, color: '#444', whiteSpace: 'pre-line' }}>{post.content}</p>
        </article>
    )
}