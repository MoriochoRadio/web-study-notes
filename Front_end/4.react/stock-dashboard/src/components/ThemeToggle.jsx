// ═══════════════════════════════════════════════════════════════════
// 📄 ThemeToggle.jsx — 헤더 오른쪽의 라이트/다크 전환 스위치 버튼
// ───────────────────────────────────────────────────────────────────
// 역할   : 클릭하면 스토어의 toggleTheme()을 호출 → theme이 뒤집힘 →
//          ThemeWrapper가 감지해서 화면색이 바뀐다. (이 컴포넌트는 "버튼 UI"만 담당)
// 디자인 : 알약 모양 트랙 안에서 동그란 손잡이(☀️/🌙)가 좌우로 미끄러지는 스위치
// ═══════════════════════════════════════════════════════════════════
'use client'
import { useWatchlistStore } from '@/store/useWatchlistStore'

export default function ThemeToggle() {
    // 스토어에서 필요한 값 2개를 각각 선택자로 구독
    // theme       → 현재 테마 문자열 ('dark' 또는 'light') — 읽기용
    // toggleTheme → 테마를 뒤집는 액션 함수 — onClick에 연결
    const theme = useWatchlistStore((s) => s.theme)
    const toggleTheme = useWatchlistStore((s) => s.toggleTheme)

    // 매번 theme === 'dark'를 반복해서 쓰지 않도록 미리 계산해둔 파생 값
    const isDark = theme === 'dark'

    return (
        <button
            onClick={toggleTheme}
            aria-label="테마 전환"      // 아이콘뿐인 버튼이라 스크린리더용 이름을 따로 제공
            aria-pressed={isDark}       // "눌린 상태인가?"를 보조기기에 알려줌 (토글 버튼 관례)
            // 트랙(바깥 알약) 클래스: h-8 w-16 = 가로로 긴 알약, px-1 = 손잡이가 붙는 안쪽 여백
            // focus-visible:ring-2 = 키보드로 포커스했을 때만 하늘색 링 표시
            className="group relative inline-flex h-8 w-16 items-center rounded-full border border-gray-300 bg-gray-100 px-1
                       transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-stock-cyan/60
                       dark:border-stock-border dark:bg-stock-card"
        >
            {/* 손잡이(움직이는 동그라미):
                isDark면 translate-x-8(오른쪽으로 32px 이동), 아니면 제자리(0).
                transition-transform duration-300 덕분에 순간이동이 아니라 미끄러진다 */}
            <span
                className={`flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs shadow-md transition-transform duration-300 ease-out
                    dark:bg-stock-bg ${isDark ? 'translate-x-8' : 'translate-x-0'}`}
            >
                {isDark ? '🌙' : '☀️'}
            </span>
        </button>
    )
}
