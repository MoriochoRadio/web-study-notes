// ── STEP 2b: lazy로 지연 로딩될 무거운 컴포넌트 (예시 2) ──
// 💡 HeavyChart와 마찬가지로, 이 리포트 패널 코드는 처음부터 다운받지 않고 
//    '📑 리포트' 탭을 사용자가 클릭하는 순간 독립된 별도의 번들 조각(청크)으로 다운로드됩니다.
export default function HeavyReport() {
    return (
        <div style={{ padding: '1.5rem', border: '1px solid #dcfce7', borderRadius: '8px', background: '#f0fdf4' }}>
            <h3 style={{ marginTop: 0 }}>📑 리포트 패널 (무겁다고 가정)</h3>
            <p style={{ color: '#555', fontSize: '14px' }}>
                HeavyChart와 마찬가지로 별도 청크로 분리됩니다. 필요할 때만 네트워크로 받아오죠.
            </p>
        </div>
    )
}