// 브라우저(클라이언트) 전용 컴포넌트 선언 
// (useEffect, document 등 브라우저 전역 객체와 상태 관리를 다루기 위해 필수)
'use client'

import { useEffect } from 'react'
import useStockStore from '@/app/store/useStockStore'

// ThemeWrapper: 감싸고 있는 자식 컴포넌트(children)를 그대로 렌더링하면서,
// 뒤에서 브라우저 <html> 태그의 다크모드 스위치를 조작해 주는 래퍼(Wrapper) 컴포넌트
export default function ThemeWrapper({ children }) {
  // Zustand 전역 스토어에서 현재 테마 상태('dark' 또는 'light')를 실시간 구독(추적)
  const theme = useStockStore((s) => s.theme)

  // useEffect: theme 값이 바뀔 때마다 브라우저 최상단 <html> 태그를 직접 조작하는 사이드 이펙트 실행
  useEffect(() => {
    // document: 자바스크립트 브라우저 전역 객체 (import 불필요, 웹 페이지 전체를 뜻함)
    // document.documentElement: 웹 페이지의 가장 최상단 태그인 <html> 요소를 직접 가리킴
    const root = document.documentElement

    // 현재 테마가 'dark'이면 <html class="dark">로 만들어 하위의 모든 dark:... Tailwind 스타일 활성화
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      // 라이트 모드이면 'dark' 클래스를 제거하여 원래 기본 라이트 스타일로 복구
      root.classList.remove('dark')
    }
  }, [theme]) // 의존성 배열 [theme]: Zustand의 theme 상태가 변경될 때마다 이 useEffect가 작동함

  // 자신이 직접 HTML 태그(div 등)를 생성하지 않고, 감싸고 있던 자식 컴포넌트들(children)을 그대로 화면에 반환
  return children
}

