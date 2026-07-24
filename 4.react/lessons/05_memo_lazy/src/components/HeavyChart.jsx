// ── STEP 2a: lazy로 지연 로딩될 무거운 컴포넌트 ──
// 💡 [코드 분할 (Code Splitting)]
// - 처음 웹 사이트에 접속했을 때 사용자가 차트 탭을 안 누를 수도 있습니다.
// - 굳이 안 보는 차트 코드까지 처음부터 전부 다운로드하면 웹사이트 초기 화면 접속이 늦어집니다!
// - 이 컴포넌트를 React.lazy()로 감싸두면, 사용자가 '📈 차트' 탭을 처음 누르는 그 순간에만 네트워크를 통해 이 코드가 지연 다운로드됩니다.
export default function HeavyChart() {
    return (
        <div style={{ padding: '1.5rem', border: '1px solid #dbeafe', borderRadius: '8px', background: '#eff6ff' }}>
            <h3 style={{ marginTop: 0 }}>📈 차트 패널 (무겁다고 가정)</h3>
            <p style={{ color: '#555', fontSize: '14px' }}>
                이 컴포넌트는 lazy로 분할되어, 이 탭을 처음 눌렀을 때만 로드됩니다. (첫 로드 시 Suspense fallback이 잠깐 보임)
            </p>
        </div>
    )
}