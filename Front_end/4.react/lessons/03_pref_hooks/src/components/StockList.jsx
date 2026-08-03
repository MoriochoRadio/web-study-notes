// ── STEP 4: useMemo(연산 캐싱) + useCallback(함수 캐싱) ──
// [컴포넌트 서열]: 2위 (App의 자식이면서, StockRow의 부모인 중간 연출가 컴포넌트)
// 🎬 [3幕 시나리오 중심지]: 별(★) 클릭 시 useMemo와 useCallback이 결합하여 헛수고를 방지하는 무대
import { useState, useMemo, useCallback } from 'react'
import { STOCKS } from '../data/stocks'
import StockRow from './StockRow'

export default function StockList() {
    // 💡 1. 상태(State) 관리 영역
    const [filter, setFilter] = useState('all')     // 'all'(전체) | 'up'(상승) | 'down'(하락)
    const [sortBy, setSortBy] = useState('symbol')   // 'symbol'(종목명) | 'price'(가격) | 'change'(등락률)
    const [favorites, setFavorites] = useState([])  // 즐겨찾기(★) 등록된 주식 심볼 배열 (예: ['AAPL', 'TSLA'])

    /**
     * 💡 2. useMemo (무거운 필터/정렬 연산 결과 캐싱)
     * - [동작 시나리오]:
     *   - 사용자가 별(★) 버튼을 클릭하여 setFavorites가 실행되면, 이 컴포넌트(StockList)가 다시 그려집니다.
     *   - 이때 리액트는 의존성 배열인 [filter, sortBy]를 확인합니다:
     *     "어? 필터버튼이나 정렬버튼은 안 눌렀네? filter랑 sortBy는 이전이랑 100% 똑같다!"
     *   - ➔ 아래 10개 주식의 필터링/정렬(localeCompare) 연산 코드를 전면 100% 생략(스킵)합니다!
     *   - ➔ 아까 보관해둔 이전 processedStocks 배열을 바로 꺼내서 재사용합니다. (콘솔 로그 멈춤!)
     */
    const processedStocks = useMemo(() => {
        console.log('정렬/필터 재계산!')
        let result = [...STOCKS] // 원본 데이터 훼손 방지를 위해 안전하게 얕은 복사

        // 필터링: 상승 / 하락 주식 걸러내기
        if (filter === 'up') result = result.filter((s) => s.change >= 0)
        if (filter === 'down') result = result.filter((s) => s.change < 0)

        // 정렬: 가격순 / 등락률순 / 종목명(알파벳)순 줄 세우기
        result.sort((a, b) => {
            if (sortBy === 'price') return b.price - a.price
            if (sortBy === 'change') return b.change - a.change
            // 글자(문자열)끼리는 뺄셈이 안 되므로 localeCompare로 사전순 비교! (-1, 0, 1 반환)
            return a.symbol.localeCompare(b.symbol)
        })

        return result
    }, [filter, sortBy]) // 👈 filter나 sortBy가 직접 클릭되어 바뀔 때만 연산을 새로 수행함!

    /**
     * 💡 3. useCallback (자식 자물쇠: 함수 고정 및 메모리 주소 보존)
     * - [동작 시나리오]:
     *   - useCallback이 없으면 부모가 다시 그려질 때마다 toggleFavorite 함수가 새로 생성됩니다 (주소 변경).
     *   - 함수 주소가 달라지면 자식(StockRow)의 React.memo가 "어? 함수가 새 걸로 바뀌었네?" 하고 뚫려버립니다.
     *   - useCallback((...) => ..., []) 빈 배열을 주면 "처음 마운트할 때 만든 그 함수 주소(#1001)를 영원히 고정"합니다.
     *   - 결과적으로 자식(StockRow)의 React.memo 방어막이 뚫리지 않고 안전하게 유지됩니다!
     */
    const toggleFavorite = useCallback((symbol) => {
        setFavorites((prev) =>
            prev.includes(symbol) ? prev.filter((s) => s !== symbol) : [...prev, symbol]
        )
    }, []) // 👈 [] 빈 배열: 컴포넌트가 처음 생성될 때 1번 만들어진 이 함수 참조를 고정함

    /**
     * 💡 4. chipStyle: 버튼 활성화 여부(active)에 따라 검은색/흰색 스타일 객체를 반환하는 도우미 함수
     */
    const chipStyle = (active) => ({
        marginLeft: '4px', padding: '4px 10px', borderRadius: '12px', border: '1px solid #ddd', cursor: 'pointer',
        background: active ? '#1a1a18' : '#fff', color: active ? '#fff' : '#333',
    })

    return (
        <div style={{ padding: '1rem', maxWidth: '600px' }}>
            {/* 📌 필터 & 정렬 버튼 영역 */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem', flexWrap: 'wrap' }}>
                <div>
                    <label style={{ fontSize: '12px', color: '#666' }}>필터: </label>
                    {['all', 'up', 'down'].map((f) => (
                        <button key={f} onClick={() => setFilter(f)} style={chipStyle(filter === f)}>
                            {f === 'all' ? '전체' : f === 'up' ? '▲ 상승' : '▼ 하락'}
                        </button>
                    ))}
                </div>
                <div>
                    <label style={{ fontSize: '12px', color: '#666' }}>정렬: </label>
                    {[['symbol', '종목명'], ['price', '가격'], ['change', '등락률']].map(([val, label]) => (
                        <button key={val} onClick={() => setSortBy(val)} style={chipStyle(sortBy === val)}>
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            <p style={{ fontSize: '13px', color: '#666', marginBottom: '8px' }}>
                표시 중: {processedStocks.length}개 종목
            </p>

            {/* 📌 5. 자식 컴포넌트(StockRow) 출산 및 반환(return) 영역 */}
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {processedStocks.map((stock) => (
                    // 가공된 주식(processedStocks) 개수만큼 <StockRow /> 자식 태그를 찍어내어 부모가 return에 품어냄
                    // 자식에게 4가지 보따리(key, stock 데이터, 즐겨찾기 상태, 클릭 이벤트 함수)를 전달함
                    <StockRow
                        key={stock.id}                                // 리액트가 항목을 식별하는 고유 번호표
                        stock={stock}                                  // 주식 개별 정보 객체 (티커, 이름, 가격 등)
                        isFavorite={favorites.includes(stock.symbol)}  // 즐겨찾기(★) 여부 (true/false)
                        onToggleFavorite={toggleFavorite}              // 별 클릭 시 실행할 고정된 함수 참조 (#1001)
                    />
                ))}
            </ul>
        </div>
    )
}