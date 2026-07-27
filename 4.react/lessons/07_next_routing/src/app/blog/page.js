// ── STEP 4: 블로그 목록 페이지 → "/blog" ──
// [개념 1] posts 배열 데이터를 map() 함수로 순회하면서 글 목록(<li>)을 자동으로 생성합니다.
// [개념 2] 각 글의 제목을 눌렀을 때 동적 경로(/blog/1, /blog/2 ...)로 이동하도록 <Link>를 연결합니다.
// 
// 💡 핵심 공부 노트:
// 1. map() 함수란?
//    - 배열 안의 데이터들을 하나씩 꺼내어 내가 원하는 모양(JSX 태그)으로 변환해주는 붕어빵 틀!
// 2. 화살표 함수에서 소괄호 () vs 중괄호 {}:
//    - `(post) => ( <li.../> )` : 소괄호 () 사용 시 return 생략 가능 (암시적 반환 / 바로 HTML 렌더링).
//    - `(post) => { return <li.../> }` : 중괄호 {} 사용 시 반드시 return을 명시해야 함! (없으면 undefined 반환되어 화면 안 보임).

import Link from 'next/link'
import { posts, tagStyle } from './posts'

export default function BlogList() {
    return (
        <div>
            <h1>블로그 ({posts.length}개)</h1>
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {/* map() 함수를 돌려 posts 배열의 4개 데이터 ➔ <li> 목록 4개로 일괄 변환 */}
                {posts.map((post) => (
                    <li key={post.id} style={{ borderBottom: '1px solid #eee', padding: '1.25rem 0' }}>
                        {/* 카테고리 태그 */}
                        <span style={tagStyle(post.tag)}>
                            {post.tag}
                        </span>

                        {/* 글 제목 & 동적 세그먼트 링크 (`/blog/${post.id}`) */}
                        <h2 style={{ margin: '6px 0 4px', fontSize: '1.1rem' }}>
                            <Link 
                                href={`/blog/${post.id}`}
                                style={{ textDecoration: 'none', color: '#1a1a18' }}
                            >
                                {post.title}
                            </Link>
                        </h2>

                        {/* 작성 날짜 */}
                        <p style={{ color: '#aaa', fontSize: '13px', margin: 0 }}>{post.date}</p>
                    </li>
                ))}
            </ul>
        </div>
    )
}