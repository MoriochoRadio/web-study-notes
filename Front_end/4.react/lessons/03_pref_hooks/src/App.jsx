// ── STEP 5: 최상위 Root 부모 컴포넌트 ──
// [컴포넌트 서열]: 1위 (모든 자식 컴포넌트들의 전체 연극 무대를 총괄하는 최상위 부모)
// 🎬 [1幕 시나리오 무대]: 앱이 켜질 때 독자적인 자식 2개(StockSearch, StockList)를 출산하여 배치함
import StockSearch from './components/StockSearch'
import StockList from './components/StockList'

function App() {
  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', padding: '1.5rem', fontFamily: 'sans-serif' }}>
      <h1>⚡ 성능 훅 실습</h1>

      {/* 
        💡 자식 1: StockSearch (useRef 연습용 독립 자식 컴포넌트)
        - [2幕 시나리오]: 타자를 칠 때 StockSearch 내부에서만 setQuery가 동작하여 이 부품만 따로 리렌더링됨
      */}
      <h2 style={{ fontSize: '1.1rem', color: '#374151' }}>1) useRef — 검색창 포커스 & 렌더 횟수</h2>
      <StockSearch />

      <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '1.5rem 0' }} />

      {/* 
        💡 자식 2: StockList (useMemo · useCallback · React.memo 최적화 연습용 중간 대장 컴포넌트)
        - [3幕 시나리오]: 별(★)을 누르면 StockList가 리렌더링되나, useMemo/useCallback/memo 3총사의 공조로
          정렬 연산을 스킵하고 9개의 StockRow 자식 렌더링을 완전히 막아냄!
      */}
      <h2 style={{ fontSize: '1.1rem', color: '#374151' }}>2) useMemo · useCallback · memo — 목록 최적화</h2>
      <StockList />
    </div>
  )
}

export default App