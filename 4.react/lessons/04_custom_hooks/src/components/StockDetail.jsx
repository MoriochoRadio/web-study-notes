// ── STEP 5: 네 개의 커스텀 훅을 '조합'한 컴포넌트 ──
// 개념: 직접 만든 커스텀 훅들(useStockData, useDebounce, useInterval, useLocalStorage)을 레고 블록처럼 조합하여 주식 상세 페이지 완성.
import { useState } from 'react'
import { useStockData } from '../hooks/useStockData'
import { useDebounce } from '../hooks/useDebounce'
import { useInterval } from '../hooks/useInterval'
import { useLocalStorage } from '../hooks/useLocalStorage'

// useLocalStorage : 마지막에 조회한 종목을 저장하고 가져오는 기능
// useDebounce : 사용자가 타이핑하는 동안에는 기다렸다가 300ms(0.3초) 지연된 안정적인 입력값을 생성
// useInterval : autoRefresh 체크박스가 켜지면(true) 5초마다 refetch 실행, 꺼지면(false) null을 전달하여 타이머 일시정지!
// useStockData : 300ms 디바운스된 종목 코드로 주식 데이터(data), 로딩상태(loading), 에러(error), 수동재로딩(refetch)을 가져옴

export default function StockDetail() {
    // 1. [useLocalStorage] 사용자가 입력한 종목 코드를 브라우저 저장소에 'lastSymbol' 키로 자동 저장 및 복원 (기본값 'AAPL')
    const [inputSymbol, setInputSymbol] = useLocalStorage('lastSymbol', 'AAPL')

    // 2. [useState] 5초마다 자동 갱신(체크박스)할지 여부를 관리하는 토글 상태 (true / false)
    const [autoRefresh, setAutoRefresh] = useState(false)

    // 3. [useDebounce] 사용자가 타이핑하는 동안에는 기다렸다가 300ms(0.3초) 지연된 안정적인 입력값을 생성
    const debouncedSymbol = useDebounce(inputSymbol, 300)

    // 4. [useStockData] 300ms 디바운스된 종목 코드로 주식 데이터(data), 로딩상태(loading), 에러(error), 수동재로딩(refetch)을 가져옴
    const { data, loading, error, refetch } = useStockData(debouncedSymbol)

    // 5. [useInterval] autoRefresh 체크박스가 켜지면(true) 5초마다 refetch 실행, 꺼지면(false) null을 전달하여 타이머 일시정지!
    useInterval(refetch, autoRefresh ? 5000 : null)

    return (
        <div style={{ padding: '1.5rem', maxWidth: '480px' }}>
            <h2>종목 상세 조회</h2>

            {/* 종목 입력창 및 수동 새로고침 버튼 영역 */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem' }}>
                <input
                    value={inputSymbol}
                    // e.target.value.toUpperCase(): 입력한 글자를 자동으로 대문자(예: aapl -> AAPL)로 변환
                    onChange={(e) => setInputSymbol(e.target.value.toUpperCase())}
                    placeholder="종목 코드 (ERROR 입력 시 에러)"
                    style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid #ddd' }}
                />
                {/* 버튼 클릭 시 refetch 실행 / 로딩 중일 때는 클릭 못하게 disabled 처리 */}
                <button onClick={refetch} disabled={loading}>{loading ? '로딩 중...' : '새로고침'}</button>
            </div>

            {/* 5초마다 자동 갱신 체크박스 영역 */}
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={autoRefresh} onChange={(e) => setAutoRefresh(e.target.checked)} />
                <span style={{ fontSize: '13px' }}>5초마다 자동 갱신</span>
                {/* autoRefresh가 true일 때만 녹색 '● 활성' 문구 표시 */}
                {autoRefresh && <span style={{ fontSize: '12px', color: '#16a34a' }}>● 활성</span>}
            </label>

            {/* [로딩 상태 렌더링] loading이 true일 때만 로딩 스피너 표시 */}
            {loading && <div style={{ padding: '2rem', textAlign: 'center', border: '1px solid #eee', borderRadius: '8px', color: '#888' }}>⏳ {debouncedSymbol} 로딩 중...</div>}

            {/* [에러 상태 렌더링] error가 존재할 때만 빨간색 에러 상자 표시 */}
            {error && (
                <div style={{ padding: '1rem', borderRadius: '8px', background: '#fff0f0', border: '1px solid #ffcdd2', color: '#c62828' }}>
                    <strong>❌ 오류</strong>
                    <p style={{ margin: '4px 0 0', fontSize: '13px' }}>{error}</p>
                    <button onClick={refetch} style={{ marginTop: '8px', fontSize: '12px' }}>다시 시도</button>
                </div>
            )}

            {/* [데이터 성공 렌더링] data가 존재하고 로딩 중이 아닐 때 주식 상세 정보 카드 표시 */}
            {data && !loading && (
                <div style={{ padding: '1.25rem', borderRadius: '8px', border: '1px solid #e0e0e0', background: '#fafafa' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '20px' }}>{data.symbol}</h3>
                            <p style={{ margin: '4px 0', fontSize: '12px', color: '#888' }}>업데이트: {data.updatedAt}</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>${data.price.toFixed(2)}</div>
                            {/* 변동폭이 양수면 파란색(+), 음수면 빨간색 표시 */}
                            <div style={{ color: data.change >= 0 ? 'blue' : 'red', fontWeight: 'bold' }}>{data.change >= 0 ? '+' : ''}{data.change}%</div>
                        </div>
                    </div>
                    <div style={{ marginTop: '12px', fontSize: '13px', color: '#666' }}>거래량: {data.volume.toLocaleString()}</div>
                </div>
            )}
        </div>
    )
}