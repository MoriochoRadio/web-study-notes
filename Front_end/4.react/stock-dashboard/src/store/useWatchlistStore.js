// ═══════════════════════════════════════════════════════════════════
// 📄 useWatchlistStore.js — 앱 전체가 공유하는 "전역 상태 보관함" (Zustand)
// ───────────────────────────────────────────────────────────────────
// 역할   : ① 관심 종목 목록(watchlist)  ② 다크모드 테마(theme) 를 전역으로 보관
// 쓰는 곳: StockQuoteCard(★ 버튼), WatchlistPanel(칩 목록), ThemeToggle/ThemeWrapper(테마)
// 특징   : persist 미들웨어 덕분에 새로고침해도 localStorage에서 값이 복원됨
//
// 💡 useState와 뭐가 다른가?
//    useState는 "그 컴포넌트 안"에서만 쓰는 상태. Zustand 스토어는 어느 컴포넌트든
//    useWatchlistStore()를 부르면 같은 값을 읽고 쓸 수 있는 "공용 창고"다.
//    props를 여러 단계 내려보낼 필요가 없어진다.
// ═══════════════════════════════════════════════════════════════════
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// create( persist( 상태정의함수, 저장옵션 ) ) 구조를 쪼개보면:
//   create(...)  → "스토어(훅)를 만들어줘"  → 결과물이 useWatchlistStore 훅
//   persist(...) → "상태가 바뀔 때마다 localStorage에 자동 저장해줘" 라는 포장지
//   (set, get)   → set: 상태를 바꾸는 함수 / get: 현재 상태를 읽는 함수
//                  (useState의 setX와 비슷하지만, 스토어 전체를 다루는 버전)
export const useWatchlistStore = create(
    persist(
        (set, get) => ({
            watchlist: [], // 관심 종목 심볼 배열, 예: ['AAPL', 'TSLA']

            // ── 관심 종목 추가 ──
            // set((state) => ({...})) 를 쪼개보면:
            //   state        → 바꾸기 직전의 현재 상태 (여기서 watchlist를 읽음)
            //   리턴한 객체  → "이 부분만 이렇게 바꿔줘"라는 변경 요청서
            // includes로 이미 있는지 검사해서, 있으면 그대로 두고(중복 방지)
            // 없으면 [...기존배열, 새심볼] 로 "복사 + 추가" (원본 배열을 직접 push하지 않음!
            // React/Zustand는 "새 객체/배열"이어야 변경을 감지하기 때문)
            addSymbol: (symbol) => set((state) => ({
                watchlist: state.watchlist.includes(symbol)
                    ? state.watchlist
                    : [...state.watchlist, symbol]
            })),

            // ── 관심 종목 제거 ──
            // filter는 "조건에 맞는 것만 남긴 새 배열"을 만든다.
            // (s) => s !== symbol → 지우려는 심볼만 빼고 전부 남김
            removeSymbol: (symbol) => set((state) => ({
                watchlist: state.watchlist.filter((s) => s !== symbol),
            })),

            // ── 이 심볼이 관심 종목인가? (읽기 전용 헬퍼) ──
            // set이 아니라 get()을 쓴다 — 상태를 바꾸지 않고 현재 값만 확인
            isWatched: (symbol) => get().watchlist.includes(symbol),

            // 다크모드 토글 (12강 패턴: 전역 상태로 테마를 두고 persist로 저장)
            // 'dark' ↔ 'light' 를 삼항 연산자로 뒤집는다.
            // 실제로 화면색이 바뀌는 원리는 ThemeWrapper.jsx 참고 (html에 .dark 클래스 부착)
            theme: 'dark',
            toggleTheme: () => set((state) => ({
                theme: state.theme === 'dark' ? 'light' : 'dark',
            })),
        }),
        {
            // localStorage에 저장될 때 쓰이는 키 이름.
            // 개발자도구 → Application → Local Storage에서 이 이름으로 확인 가능
            name: 'watchlist-storage',
        }
    )
)
