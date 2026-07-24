// 커스텀 훅 조합 데모를 렌더링
import StockDetail from './components/StockDetail'

function App() {
  return (
    <div style={{ maxWidth: '560px', margin: '0 auto', padding: '1.5rem', fontFamily: 'sans-serif' }}>
      <h1>🪝 커스텀 훅 실습</h1>
      <p style={{ color: '#666', fontSize: '14px' }}>
        하나의 컴포넌트가 4개의 커스텀 훅(데이터·디바운스·인터벌·로컬스토리지)을 조합해 동작합니다.
      </p>
      <StockDetail />
    </div>
  )
}

export default App