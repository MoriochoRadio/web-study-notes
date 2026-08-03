// ═══════════════════════════════════════════════════════════════════
// 📄 market.js — 미국 주식시장이 지금 열려있는지 판단하는 유틸 함수
// ───────────────────────────────────────────────────────────────────
// 역할   : 현재 시각(뉴욕 기준)이 정규장(월~금 09:30~16:00)에 해당하는지 true/false 반환
// 쓰는 곳: api/stock/[symbol]/chart/route.js — 장이 닫혀있으면 더미 데이터로 대체
// 포인트 : 서버/클라이언트 어느 쪽에서 불러도 동작하는 순수 함수 (React와 무관)
// ⚠️ 공휴일은 고려하지 않은 학습용 단순 버전.
// ═══════════════════════════════════════════════════════════════════

// 정규장: 월~금 09:30~16:00 (미국 동부시간). 서머타임은 Intl 타임존이 자동 처리.
export function isUSMarketOpen(date = new Date()) {
    // Intl.DateTimeFormat: 브라우저/Node에 내장된 국제화 도구.
    // timeZone: 'America/New_York' 를 주면 "지금 뉴욕은 몇 시인지"를 알아서 계산해준다
    // (한국 시간에서 13~14시간을 직접 빼고 서머타임까지 챙기는 것보다 훨씬 안전!)
    // formatToParts는 결과를 통문자열이 아니라
    // [{type:'weekday', value:'Mon'}, {type:'hour', value:'09'}, ...] 조각 배열로 준다.
    const parts = new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/New_York',
        weekday: 'short',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false, // 24시간제 (오전/오후 없이 0~23시)
    }).formatToParts(date)

    // 조각 배열에서 원하는 type의 value만 꺼내는 미니 헬퍼.
    // find(...)?.value 의 ?. : 못 찾으면 에러 대신 undefined
    const pick = (type) => parts.find((p) => p.type === type)?.value

    const weekday = pick('weekday')
    let hour = parseInt(pick('hour'), 10)   // '09' 같은 문자열 → 9 숫자로
    const minute = parseInt(pick('minute'), 10)

    if (weekday === 'Sat' || weekday === 'Sun') return false // 주말은 무조건 휴장
    if (hour === 24) hour = 0 // 일부 환경이 자정을 '24'로 주는 특이 케이스 보정

    // "분 단위 숫자"로 바꿔서 비교하면 시:분 비교가 한 줄로 끝난다.
    // 예) 09:30 → 570분, 16:00 → 960분, 지금 10:15 → 615분 → 570 ≤ 615 < 960 → 개장 중
    const now = hour * 60 + minute
    return now >= 9 * 60 + 30 && now < 16 * 60
}
