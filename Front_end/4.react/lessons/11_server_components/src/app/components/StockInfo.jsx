// ── STEP 1: async 서버 컴포넌트 ── (빈칸 채우기)
// 개념: 'use client' 없음 = 서버 컴포넌트. 함수 자체를 async로 만들고 안에서 await 가능.
// 막히면 정답 참고: lessons_edu/11_server_components/app/components/StockInfo.jsx

// (헬퍼는 제공됨) 느린 API 흉내 (Suspense fallback 확인용)
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function getStockProfile(symbol) {
  await delay(2000)
  // 서버 컴포넌트의 fetch는 브라우저가 아니라 서버에서 직접 실행되므로 상대경로가 아닌
  // 절대 URL이 필요합니다. dev 서버 기본 포트(3000)에 맞춰뒀으니, 다른 포트로 실행 중이면 맞춰 바꾸세요.
  const res = await fetch(`http://localhost:3000/api/stock/${symbol}/profile`)
  const data = await res.json()
  return data
}

// TODO: STEP 1 — 이 컴포넌트를 async로 만들고, 안에서 getStockProfile을 await로 가져와 profile에 담으세요.
export default async function StockInfo({ symbol }) {
  // const profile = { name: symbol, exchange: '-', industry: '-', marketCap: '-', description: '' } // ← await getStockProfile(symbol)로 교체
  const profile = await getStockProfile(symbol);
  return (
    <div style={{ padding: '1.25rem', borderRadius: '12px', border: '1px solid #0f3460', background: '#0d2137' }}>
      <h3 style={{ color: '#61dafb', marginTop: 0, marginBottom: '0.5rem' }}>{profile.name} ({symbol})</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '13px' }}>
        {[
          ['거래소', profile.exchange],
          ['업종', profile.industry],
          ['시가총액', profile.marketCap],
        ].map(([label, value]) => (
          <div key={label}>
            <span style={{ color: '#8892b0' }}>{label}: </span>
            <span style={{ color: '#ccd6f6' }}>{value}</span>
          </div>
        ))}
      </div>
      <p style={{ color: '#8892b0', fontSize: '12px', marginTop: '0.75rem', lineHeight: 1.6 }}>{profile.description}</p>
    </div>
  )
}