// ── STEP 2·3: 배열 상태·불변성 업데이트 + useEffect·localStorage ──
import { useState, useEffect } from 'react'

function TodoApp() {
    // =========================================================================
    // 📌 [1. 상태(State) 정의 영역]
    // 리액트에서 상태(State)가 바뀌면 컴포넌트 함수 전체(TodoApp)가 재실행되어 화면이 새로 그려집니다!
    // =========================================================================

    // 💡 1-1. todos (할 일 목록 배열)
    // - useState(() => { ... }) 게으른 초기화 패턴:
    //   앱이 처음 켜질 때 딱 1번만 로컬스토리지에서 데이터를 읽어와서 todos의 첫 시작값으로 삼습니다.
    //   (화살표 함수 () => 로 감싸야 타자 칠 때마다 무겁게 로컬스토리지를 다시 읽는 일을 방지함!)
    const [todos, setTodos] = useState(() => {
        const saved = localStorage.getItem('todos')
        return saved ? JSON.parse(saved) : [] // 로컬스토리지에 저장된 JSON 글자가 있으면 객체/배열로 변환(parse), 없으면 빈 배열 []
    })

    // 💡 1-2. priority (선택된 우선순위 텍스트)
    // - 'high'(높음) | 'normal'(보통) | 'low'(낮음) 중 하나를 기억하는 상태 (기본값: 'normal')
    const [priority, setPriority] = useState('normal')

    // 💡 1-3. input (입력창에 타자 친 텍스트)
    const [input, setInput] = useState('')

    // 💡 1-4. filter (현재 선택된 탭)
    // - 'all'(전체) | 'active'(진행중) | 'done'(완료)
    const [filter, setFilter] = useState('all')

    // =========================================================================
    // 📌 [2. useEffect 감시기 (부작용/후속작업 처리 영역)]
    // =========================================================================
    // 💡 자동 저장 useEffect:
    // - 두 번째 인자 [todos]를 지정해두면, 리액트가 todos 배열이 바뀔 때만(추가/삭제/토글) 
    //   화면을 다 그린 후 이 코드를 '자동으로' 가동하여 최신 todos 목록을 로컬스토리지에 저장(stringify)합니다.
    useEffect(() => {
        localStorage.setItem('todos', JSON.stringify(todos))
    }, [todos])

    // =========================================================================
    // 📌 [3. 상태 변경 이벤트 핸들러 함수 영역]
    // =========================================================================

    // 💡 3-1. 할 일 추가 함수 (배열 불변성 추가 패턴)
    const addTodo = () => {
        // .trim()으로 양쪽 공백을 없앤 뒤 내용이 빈 칸이면 아무것도 안 하고 종료!
        if (!input.trim()) return

        // [...todos, 새객체]: 기존 todos 배열 원본을 건드리지 않고, 
        // 쫘악 펼쳐서 복사해온 뒤 끝에 새 할 일 객체를 붙인 '새로운 배열'을 만들어 setTodos에 넘김!
        setTodos([...todos, { id: Date.now(), text: input, done: false, priority }])

        // 추가 후 입력창에 쳐놓은 글자 지우기
        setInput('');
    }

    // 💡 3-2. 할 일 삭제 함수 (배열 filter 걸러내기 패턴)
    const removeTodo = (id) => {
        // filter(): 배열을 순회하며 조건이 true인 것만 남긴 '새로운 배열'을 생성함.
        // t.id !== id ➔ "삭제하려는 id와 같지 않은 항목들만 남겨라!" (해당 id만 쏙 빠짐)
        setTodos(todos.filter((t) => t.id !== id));
    }

    // 💡 3-3. 완료 여부 토글 함수 (배열 map + 객체 스프레드 패턴)
    const toggleTodo = (id) => {
        // map(): 배열 항목을 1:1로 변환한 '새로운 배열' 생성
        // t.id === id ? { ...t, done: !t.done } : t
        // ➔ 클릭한 id 항목이면 원본 t를 복사하고 done속성만 반대로(!false -> true) 덮어쓴 새 객체 반환, 아니면 원래 t 유지!
        setTodos(todos.map((t) => t.id === id ? { ...t, done: !t.done } : t))
    }

    // 💡 3-4. 완료 항목 전체 삭제 함수 (배열 filter 패턴)
    // - t.done이 false(완료되지 않은 것)인 항목만 모아서 새 배열로 만들어 setTodos 교체!
    const clearCompleted = () => {
        setTodos(todos.filter((t) => !t.done))
    }

    // =========================================================================
    // 📌 [4. 화면 계산 및 스타일 가공 영역]
    // =========================================================================

    // 💡 4-1. 탭 필터링 (전체 / 진행중 / 완료에 따라 화면에 보여줄 목록만 걸러냄)
    const filtered = todos.filter((t) => {
        if (filter === 'active') return !t.done  // 진행 중인 것만 (done이 false)
        if (filter === 'done') return t.done      // 완료된 것만 (done이 true)
        return true                              // 전체인 경우 모두 보여줌
    })

    // 💡 4-2. 우선순위 텍스트 ➔ 실제 색상 코드(HEX) 매핑 사전
    const priorityColors = {
        high: '#ef4444',   // 높음 (빨간색 🔴)
        normal: '#f59e0b', // 보통 (주황색 🟡)
        low: '#10b981'     // 낮음 (초록색 🟢)
    }

    // 💡 4-3. 필터 버튼 칩 스타일 함수 (현재 선택된 탭이면 검은 배경, 아니면 흰 배경)
    const chipStyle = (active) => ({
        padding: '6px 14px', borderRadius: '20px', border: '1px solid #ddd', cursor: 'pointer',
        backgroundColor: active ? '#1a1a18' : '#fff', color: active ? '#fff' : '#333',
        fontSize: '13px', marginRight: '6px',
    })

    // =========================================================================
    // 📌 [5. JSX 화면 출력(렌더링) 영역]
    // =========================================================================
    return (
        <div style={{ maxWidth: '480px', margin: '2rem auto', padding: '1.5rem' }}>
            <h1 style={{ marginBottom: '1rem' }}>📝 할 일 목록</h1>

            {/* ── 입력 상자 및 드롭다운 영역 ── */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem' }}>
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addTodo()}
                    placeholder="할 일을 입력하세요..."
                    style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px' }}
                />

                <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', cursor: 'pointer' }}
                >
                    <option value="high">높음</option>
                    <option value="normal">보통</option>
                    <option value="low">낮음</option>
                </select>

                {/* 
                  * 추가 버튼 (<button>):
                  * - disabled={!input.trim()}: 입력창에 공백을 제외한 글자가 없을 때(!input.trim()) 버튼을 클릭 불가능(비활성화)하게 만듦!
                  * - onClick={addTodo}: 클릭 시 바로 addTodo 함수를 실행하도록 함수 이름만 전달
                */}
                <button
                    onClick={addTodo}
                    disabled={!input.trim()}
                    style={{
                        padding: '10px 18px',
                        borderRadius: '8px',
                        background: !input.trim() ? '#ccc' : '#1a1a18', // 비활성화일 때 회색(#ccc), 활성화일 때 검은색(#1a1a18)
                        color: '#fff',
                        border: 'none',
                        cursor: !input.trim() ? 'not-allowed' : 'pointer' // 비활성화일 때 금지 아이콘 커서
                    }}
                >
                    추가
                </button>
            </div>

            {/* ── 필터 탭 버튼 및 완료 전체 삭제 버튼 영역 ── */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                {/* 각 버튼 클릭 시 setFilter('all' | 'active' | 'done') 호출하여 filter 상태 갱신 */}
                <button style={chipStyle(filter === 'all')} onClick={() => setFilter('all')}>전체</button>
                <button style={chipStyle(filter === 'active')} onClick={() => setFilter('active')}>진행중</button>
                <button style={chipStyle(filter === 'done')} onClick={() => setFilter('done')}>완료</button>

                {/* 
                  * 💡 완료 전체 삭제 버튼 (조건부 렌더링):
                  * - todos.some((t) => t.done) ➔ 완료된 것(done === true)이 1개라도 있을 때만 && 우측의 삭제 버튼을 화면에 표시!
                  * - 클릭 시 clearCompleted 함수가 동작하여 완료된 항목을 일괄 삭제합니다.
                */}
                {todos.some((t) => t.done) && (
                    <button
                        onClick={clearCompleted}
                        style={{
                            padding: '6px 14px',
                            borderRadius: '20px',
                            border: '1px solid #ef4444',
                            color: '#ef4444',
                            backgroundColor: '#fff',
                            cursor: 'pointer',
                            fontSize: '13px',
                            marginLeft: 'auto'
                        }}
                    >
                        완료 전체 삭제
                    </button>
                )}
            </div>

            {/* ── 실제 할 일 목록 리스트 출력 영역 ── */}
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {/* filtered 데이터 개수만큼 map으로 <li> 줄 태그 묶음을 반복해서 화면에 출력! */}
                {filtered.map((todo) => (
                    // React에서 배열 항목을 출력할 때는 고유 식별용 key 속성이 필수! (key={todo.id})
                    <li key={todo.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', marginBottom: '8px', borderRadius: '8px', border: '1px solid #eee', backgroundColor: todo.done ? '#f9f9f9' : '#fff' }}>

                        {/* 1. 완료 체크박스: 클릭 시 해당 항목의 id를 인자로 전달하기 위해 () => toggleTodo(todo.id) 형태 사용 */}
                        <input type="checkbox" checked={todo.done} onChange={() => toggleTodo(todo.id)} style={{ width: '18px', height: '18px', cursor: 'pointer' }} />

                        {/* 2. 우선순위 색상 동그라미 점(●): priorityColors 사전에서 색상을 찾아 배경색으로 지정 (기존 데이터 대비 todo.priority || 'normal' 예외처리) */}
                        <span
                            title={`우선순위: ${todo.priority || 'normal'}`}
                            style={{
                                width: '10px',
                                height: '10px',
                                borderRadius: '50%',
                                backgroundColor: priorityColors[todo.priority || 'normal'],
                                display: 'inline-block',
                                flexShrink: 0
                            }}
                        />

                        {/* 3. 할 일 글자 텍스트: todo.done 이 true 이면 취소선(line-through) 및 연한 글자색 적용 */}
                        <span style={{ flex: 1, textDecoration: todo.done ? 'line-through' : 'none', color: todo.done ? '#aaa' : '#333' }}>
                            {todo.text}
                        </span>

                        {/* 4. 삭제 ✕ 버튼: 클릭 시 해당 todo.id를 removeTodo 함수에 넘겨 삭제 */}
                        <button onClick={() => removeTodo(todo.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ccc', fontSize: '18px' }}>✕</button>
                    </li>
                ))}
            </ul>

            {/* ── 하단 개수 요약 정보 ── */}
            {todos.length > 0 && (
                <p style={{ color: '#aaa', fontSize: '13px', textAlign: 'right' }}>
                    전체 {todos.length}개 | 완료 {todos.filter((t) => t.done).length}개
                </p>
            )}
        </div>
    )
}

export default TodoApp