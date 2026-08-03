// ── STEP 2: 미국장 개장 여부 판단 (서버/클라 공용) ──
// 정규장: 월~금 09:30~16:00 (미국 동부시간). 서머타임은 Intl 타임존이 자동 처리.
// ⚠️ 공휴일은 고려하지 않은 학습용 단순 버전.
export function isUSMarketOpen(date = new Date()) {
  // 1. 접속한 기기의 시간대가 한국이든 어디든 상관없이,
  // '미국 뉴욕' 시간대로 변환해서 날짜/시간 정보를 추출합니다.
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York', // 뉴욕 기준 시간 (서머타임 자동 적용됨)
    weekday: 'short',             // 요일 (짧은 형태: 'Mon', 'Tue' 등)
    hour: '2-digit',              // 시간 (두 자리: 00~23)
    minute: '2-digit',            // 분 (두 자리: 00~59)
    hour12: false,                // 24시간제로 표시 (오전/오후 구분 안함)
  }).formatToParts(date) // 결과를 [{type: 'weekday', value: 'Mon'}, ...] 형태의 배열로 반환

  // 2. parts 배열에서 원하는 정보(type)의 값(value)만 쏙 뽑아주는 헬퍼 함수
  const pick = (type) => parts.find((p) => p.type === type)?.value

  // 3. 뉴욕 시간 기준의 요일, 시간, 분을 가져옴
  const weekday = pick('weekday')
  let hour = parseInt(pick('hour'), 10)
  const minute = parseInt(pick('minute'), 10)

  // 4. 주말(토, 일)이면 무조건 장이 닫혀 있으므로 false 반환
  if (weekday === 'Sat' || weekday === 'Sun') return false

  // 5. 간혹 자정(밤 12시)을 24로 표기하는 환경이 있을 수 있어 0시로 보정
  if (hour === 24) hour = 0

  // 6. 개장/폐장 시간을 비교하기 쉽게 '오늘 자정부터 몇 분이 지났는지' (분 단위)로 환산
  // 예: 오전 9시 30분 -> 9 * 60 + 30 = 570분
  // 예: 오후 4시 00분 -> 16 * 60 = 960분
  const now = hour * 60 + minute

  // 7. 현재 시간이 9시 30분(570분) 이상이고 16시(960분) 미만인지 확인
  return now >= 9 * 60 + 30 && now < 16 * 60
}
