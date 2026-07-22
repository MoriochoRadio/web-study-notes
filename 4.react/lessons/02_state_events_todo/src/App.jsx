// STEP 4: 두 컴포넌트 조합 (이 파일은 이미 완성 — 채울 것 없음)
import Counter from './components/Counter.jsx'
import TodoApp from './components/TodoApp'

function App() {
  return (
    <div style={{ fontFamily: 'sans-serif' }}>
      <Counter />
      <hr style={{ maxWidth: 480, margin: '0 auto', border: 'none', borderTop: '1px solid #eee' }} />
      <TodoApp />
    </div>
  )
}

export default App