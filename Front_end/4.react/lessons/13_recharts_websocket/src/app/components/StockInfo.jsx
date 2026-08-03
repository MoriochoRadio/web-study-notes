// ── STEP 4e: 서버 컴포넌트 (Tailwind) ──
// 11강 서버 컴포넌트 그대로, 스타일만 Tailwind + dark: 변형.
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function getStockProfile(symbol) {
  await delay(2000)
  const names = { AAPL: 'Apple Inc.', TSLA: 'Tesla Inc.', MSFT: 'Microsoft Corp.' }
  return {
    name: names[symbol] || symbol,
    exchange: 'NASDAQ',
    industry: '기술',
    marketCap: '2.8T',
    description: `${symbol}은 글로벌 기업으로 혁신적인 제품과 서비스를 제공합니다.`,
  }
}

export default async function StockInfo({ symbol }) {
  const profile = await getStockProfile(symbol)
  return (
    <div className="p-5 rounded-xl border border-gray-200 bg-white dark:border-stock-border dark:bg-stock-card">
      <h3 className="mb-2 font-semibold text-stock-cyan">{profile.name} ({symbol})</h3>
      <div className="grid grid-cols-2 gap-2 text-[13px]">
        {[
          ['거래소', profile.exchange],
          ['업종', profile.industry],
          ['시가총액', profile.marketCap],
        ].map(([label, value]) => (
          <div key={label}>
            <span className="text-gray-500 dark:text-stock-muted">{label}: </span>
            <span className="text-gray-800 dark:text-stock-light">{value}</span>
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs leading-relaxed text-gray-500 dark:text-stock-muted">{profile.description}</p>
    </div>
  )
}
