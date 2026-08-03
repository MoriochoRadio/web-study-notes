// ── STEP 1: 테마 Context ── (빈칸 채우기)
// 개념: createContext(상자) → Provider(값 담기) → useContext(꺼내기)
// 막히면 정답 참고: lessons_edu/06_context_api/src/context/ThemeContext.jsx
import { createContext, useState, useContext } from 'react'

// 1) 빈 Context 상자 생성 (제공됨)
//createContext()로 상자를 만들고, 기본값은 null로 설정
const ThemeContext = createContext(null)


export function ThemeProvider({ children }) {
    const [isDark, setIsDark] = useState(false)

    const theme = {
        isDark,
        toggle: () => setIsDark((d) => !d),
        bg: isDark ? '#1a1a2e' : '#ffffff',
        cardBg: isDark ? '#0d2137' : '#f8f9fa',
        text: isDark ? '#ccd6f6' : '#1a1a18',
        muted: isDark ? '#8892b0' : '#6c757d',
        border: isDark ? '#0f3460' : '#dee2e6',
        primary: isDark ? '#61dafb' : '#0066cc',
    }

    // TODO: STEP 1 — theme 값을 하위 트리에 공급하도록 ThemeContext.Provider로 감싸세요.
    //   (아래 <div>를 <ThemeContext.Provider value={theme}>로 감싸면 됩니다)
    return (
        <ThemeContext.Provider value={theme}>
            <div style={{ background: theme.bg, color: theme.text, minHeight: '100vh' }}>
                {children}
            </div>
        </ThemeContext.Provider>
    )
}

// 3) 커스텀 훅
// useContext 구현하고, 에러발생을 알려줌
// 임포트 간소화: ThemeContext와 useContext 임포트 작업을 간소화
export function useTheme() {
    // TODO: STEP 1 — useContext로 ThemeContext 값을 꺼내 ctx에 담으세요.
    const ctx = useContext(ThemeContext) // ← useContext(ThemeContext)로 교체
    if (!ctx) throw new Error('useTheme은 ThemeProvider 안에서 사용하세요')
    return ctx
}