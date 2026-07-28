// ── STEP 3-1: 정렬 기준 Context 만들기 ──
// [설명]
// Context는 복잡한 데이터 정렬 로직을 직접 수행하는 것이 아니라,
// 여러 컴포넌트가 함께 공유해야 하는 "상태(값)"를 담아두는 공유 서랍장입니다.
//
// 여기서는 "현재 어떤 기준으로 정렬 중인가?" ('symbol' | 'price' | 'change')
// 문자열 값(sortBy)과 이 값을 변경하는 함수(setSortBy)를 보관하고 공유합니다.

import { createContext, useState, useContext } from 'react'

// 1. 빈 Context 상자 생성 (기본값 null)
const SortContext = createContext(null)

// 2. SortProvider 컴포넌트 정의
// 앱의 하위 컴포넌트들에게 정렬 상태와 변경 함수를 공급(Provide)합니다.
export function SortProvider({ children }) {
  // sortBy 상태: 'symbol' (종목명 순), 'price' (가격 순), 'change' (변동률 순)
  // 기본 정렬 기준은 'symbol'로 시작합니다.
  const [sortBy, setSortBy] = useState('symbol')

  return (
    <SortContext.Provider value={{ sortBy, setSortBy }}>
      {children}
    </SortContext.Provider>
  )
}

// 3. useSort 커스텀 훅 정의
// 다른 컴포넌트에서 useContext(SortContext) 대신 useSort()로 간편하게 꺼내 쓰기 위한 훅입니다.
export function useSort() {
  const ctx = useContext(SortContext)
  // SortProvider로 감싸지 않은 곳에서 사용할 경우 친절한 에러 메시지를 띄웁니다.
  if (!ctx) {
    throw new Error('useSort는 SortProvider 내부에서 사용해야 합니다.')
  }
  return ctx
}
