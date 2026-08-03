// 블로그 글 데이터 (실제 프로젝트에서는 DB/API에서 가져옴)
// 목록(page.js)과 상세(page.js in [id])가 '같은 데이터'를 공유하도록 한 곳에 둡니다.
export const posts = [
    {
        id: 1,
        title: 'Next.js App Router 시작하기',
        date: '2025-01-10',
        tag: 'Next.js',
        content: `Next.js 13 이후 App Router가 기본이 되었습니다.
pages/ 폴더 대신 app/ 폴더를 사용하며, 파일 구조가 곧 URL 구조가 됩니다.
가장 큰 변화는 Server Component입니다. 기본적으로 모든 컴포넌트는 서버에서 실행되며,
클라이언트 기능이 필요한 경우에만 'use client'를 선언합니다.`,
    },
    {
        id: 2,
        title: '컴포넌트 설계 베스트 프랙티스',
        date: '2025-01-15',
        tag: 'React',
        content: `좋은 컴포넌트는 단일 책임 원칙을 따릅니다.
하나의 컴포넌트는 하나의 역할만 수행해야 합니다.
Props는 최소한으로, 재사용성은 최대한으로 설계하는 것이 핵심입니다.`,
    },
    {
        id: 3,
        title: 'useState 완벽 이해하기',
        date: '2025-01-20',
        tag: 'React',
        content: `useState는 React에서 가장 많이 사용하는 Hook입니다.
컴포넌트가 기억해야 하는 값을 관리합니다.
state가 변경되면 React는 해당 컴포넌트를 자동으로 리렌더링합니다.`,
    },
    {
        id: 4,
        title: '파일 기반 라우팅의 모든 것',
        date: '2025-01-25',
        tag: 'Next.js',
        content: `Next.js App Router에서는 폴더 구조가 곧 URL입니다.
[id]와 같은 동적 세그먼트로 무한한 URL을 하나의 파일로 처리합니다.
layout.js로 공통 UI를 손쉽게 적용할 수 있습니다.`,
    },
]

// 태그 색상 (목록/상세에서 재사용)
export const tagStyle = (tag) => ({
    fontSize: '12px', padding: '2px 8px', borderRadius: '12px', display: 'inline-block',
    background: tag === 'Next.js' ? '#e6f1fb' : '#eaf3de',
    color: tag === 'Next.js' ? '#0c447c' : '#3b6d11',
})