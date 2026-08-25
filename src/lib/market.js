
export function isUSMarketOpen(date = new Date()) {
    const parts = new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/New_York',
        weekday: 'short',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    }).formatToParts(date)

    const pick = (type) => parts.find((p) => p.type === type)?.value

    const weekday = pick('weekday')
    let hour = parseInt(pick('hour'), 10)
    const minute = parseInt(pick('minute'), 10)

    if (weekday === 'Sat' || weekday === 'Sun') return false
    if (hour === 24) hour = 0

    const now = hour * 60 + minute
    return now >= 9 * 60 + 30 && now < 16 * 60
}
