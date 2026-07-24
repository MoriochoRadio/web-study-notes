// ── STEP 3: lazy + Suspense 로 코드 분할 & 로딩 처리 ──
// 개념: lazy(() => import(...))로 필요할 때 다운로드(코드 분할), Suspense fallback으로 다운로드되는 동안 보여줄 스피너 지정.
import { lazy, Suspense, useState } from 'react'
import MemoComparison from './components/MemoComparison'

// 💡 [lazyWithDelay 헬퍼] 
// 원래 lazy는 네트워크가 너무 빠르면 로딩 스피너가 눈 깜빡할 사이에 지나가서 잘 안 보입니다.
// 실습 시 로딩 스피너(Suspense fallback)를 눈으로 확실히 확인하기 위해 1초 강제 지연시간을 추가한 함수입니다.
const lazyWithDelay = (factory) =>
  lazy(() => new Promise((resolve) => setTimeout(() => resolve(factory()), 1000)))

// 💡 [React.lazy (지연 로딩)]
// - 처음 웹페이지에 들어왔을 때 HeavyChart, HeavyReport의 번들 코드를 다운로드받지 않습니다!
// - 사용자가 해당 탭을 클릭하는 순간 비로소 네트워크로 지연 다운로드받아 옵니다. (초기 로딩 속도 최적화!)
const HeavyChart = lazyWithDelay(() => import('./components/HeavyChart'))
const HeavyReport = lazyWithDelay(() => import('./components/HeavyReport'))

// 컴포넌트를 인터넷에서 받아오는 동안 화면에 띄워둘 로딩 표시 UI 컴포넌트
function LoadingSpinner({ label }) {
  return <div style={{ padding: '3rem', textAlign: 'center', border: '1px dashed #ddd', borderRadius: '8px', color: '#888' }}>⏳ {label || '로딩 중'}...</div>
}

export default function App() {
  // 현재 선택된 탭 상태 ('memo', 'chart', 'report')
  const [tab, setTab] = useState('memo')
  
  // 탭 목록 데이터
  const tabs = [
    { id: 'memo', label: '⚡ memo 비교' },
    { id: 'chart', label: '📈 차트 (lazy)' },
    { id: 'report', label: '📑 리포트 (lazy)' },
  ]

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', padding: '1.5rem', fontFamily: 'sans-serif' }}>
      <h1>🧩 React.memo · lazy/Suspense 실습</h1>

      {/* 탭 버튼 메뉴 영역 */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '1.5rem' }}>
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: '8px 16px', borderRadius: '20px', border: '1px solid #ddd', cursor: 'pointer', background: tab === t.id ? '#1a1a18' : '#fff', color: tab === t.id ? '#fff' : '#333' }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* 💡 [<Suspense>] 울타리 
          - 내부에 있는 lazy 컴포넌트(HeavyChart, HeavyReport)가 네트워크로 로드되는 동안
          - fallback={...} 에 지정된 LoadingSpinner UI를 화면에 대신 띄워줍니다.
          - 로드가 끝나면 자동으로 본래 컴포넌트를 보여줍니다. */}
      <Suspense fallback={<LoadingSpinner label={"컴포넌트 로딩"} />}>
        {tab === 'memo' && <MemoComparison />}
        {tab === 'chart' && <HeavyChart />}
        {tab === 'report' && <HeavyReport />}
      </Suspense>
    </div>
  )
}