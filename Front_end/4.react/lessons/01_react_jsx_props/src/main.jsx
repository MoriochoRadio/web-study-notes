// ── STEP 1: 앱의 진입점(entry point) ──
// 브라우저의 index.html 안 <div id="root"></div> 에 React 앱을 붙입니다.
// 여기서는 손댈 게 거의 없고, 실제 학습은 App.jsx / ProfileCard.jsx에서 진행합니다.
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// createRoot: React 18부터 도입된 렌더링 진입 API
// - 예전 방식: ReactDOM.render(<App />, document.getElementById('root')) → 동시성 기능 지원 안 됨
// - createRoot(대상 DOM).render(<컴포넌트 />) 형태로 사용
// StrictMode: 개발 중 잠재적 문제(부작용, 낡은 API 사용 등)를 잡아주는 검사용 래퍼
// - 개발 모드에서만 동작하며 실제 배포 화면에는 아무 영향 없음
// - 개발 중에는 컴포넌트를 일부러 2번 렌더링해서 부작용을 드러나게 함 (console.log가 2번 찍히는 이유)
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
