// ═══════════════════════════════════════════════════════════════════
// 📄 useStockData.js — 종목 하나의 시세를 서버에서 가져오는 커스텀 훅
// ───────────────────────────────────────────────────────────────────
// 역할   : symbol을 받아 /api/quote 를 호출하고,
//          { data(시세), loading(로딩중?), error(에러문구), refetch(다시불러오기) } 를 돌려준다.
// 쓰는 곳: StockQuoteCard.jsx — 카드가 이 훅 하나만 부르면 시세/로딩/에러가 다 해결됨
// 데이터 흐름: symbol 변경 → useEffect가 load() 실행 → fetch → setState → 카드 리렌더링
// ═══════════════════════════════════════════════════════════════════
import { useState, useEffect, useCallback } from 'react'

export function useStockData(symbol) {
    // 상태 3개(data/loading/error)를 객체 하나로 묶어서 관리한다.
    //   state    → { data: 시세객체 or null, loading: true/false, error: 문구 or null }
    //   setState → 이 객체를 통째로 갈아끼우는 리모컨 버튼
    // 초깃값 loading: true — "처음엔 아직 로딩 중"으로 시작해야 첫 화면에 스켈레톤이 뜬다
    const [state, setState] = useState({ data: null, loading: true, error: null })

    // useCallback(함수, [symbol]) 을 쪼개보면:
    //   "이 함수(load)를 매 렌더링마다 새로 만들지 말고, symbol이 바뀔 때만 새로 만들어줘"
    //   왜 필요? 아래 useEffect가 [load]를 의존성으로 쓰는데, load가 매번 새 함수면
    //   effect도 매번 다시 돌아 무한 fetch가 될 수 있다. useCallback이 그걸 막는다.
    const load = useCallback(() => {
        // 함수형 업데이트 setState((prev) => ...) : prev = 바꾸기 직전 상태.
        // "기존 상태를 복사(...prev)하되 loading/error만 바꿔줘" → 재요청 시 로딩 화면으로 전환
        setState((prev) => ({ ...prev, loading: true, error: null }))

        // 여기가 04강에서 fakeFetch(symbol) 이었던 자리 — 지금은 진짜 API를 부른다.
        // fetch 체이닝 순서:
        //   ① fetch(...)            → 서버에 요청. 돌아오는 건 "데이터"가 아니라 Response 객체
        //   ② .then(res => ...)     → res.ok(200번대인지) 확인. 실패면 에러 본문을 꺼내 throw
        //                             (throw하면 아래 .then들을 건너뛰고 .catch로 점프!)
        //   ③ res.json()            → Response 껍데기를 열어 진짜 JSON 데이터로 변환 (이것도 await 필요)
        //   ④ .then(data => ...)    → 성공: 시세를 state에 저장, 로딩 종료
        //   ⑤ .catch(err => ...)    → 실패(네트워크 에러, 위의 throw 포함): 에러 문구 저장
        fetch('/api/quote?symbol=' + symbol)
            .then(async (res) => {
                if (!res.ok) {
                    const body = await res.json()
                    throw new Error(body.error)
                }
                return res.json()
            })
            .then(data => setState({ data, loading: false, error: null }))
            .catch(err => setState({ data: null, loading: false, error: err.message }))

    }, [symbol])

    useEffect(() => {
        // symbol이 없으면(아직 종목 미선택) fetch하지 않고 "빈 상태"로 초기화만 하고 종료.
        // loading: false로 두는 게 포인트 — 안 그러면 스켈레톤이 영원히 떠 있게 된다.
        if (!symbol) {
            setState({ data: null, loading: false, error: null })
            return
        }
        load()
    }, [load]) // load는 useCallback 덕분에 symbol이 바뀔 때만 새로워짐 → 사실상 "symbol 바뀔 때 재실행"

    // { ...state } 로 data/loading/error를 펼쳐서 내보내고,
    // refetch라는 이름으로 load 함수도 같이 내보낸다 (밖에서 "다시 불러오기" 버튼 등에 쓸 수 있게)
    return { ...state, refetch: load }
}
