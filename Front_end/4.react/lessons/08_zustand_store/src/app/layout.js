import './globals.css'

export const metadata = { title: 'StockDash — 주식 대시보드' }

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body style={{ margin: 0, background: '#1a1a2e', color: '#ccd6f6', minHeight: '100vh' }}>
        {children}
      </body>
    </html>
  )
}