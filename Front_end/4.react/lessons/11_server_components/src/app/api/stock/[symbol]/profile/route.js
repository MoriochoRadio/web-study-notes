export async function GET(request, { params }) {
    const { symbol } = await params
    const apiKey = process.env.FINNHUB_API_KEY
    // 키가 없으면 더미 데이터 반환
    if (!apiKey) {
        return Response.json({
            name: symbol,
            exchange: 'NASDAQ',
            industry: 'Technology',
            marketCap: 3000000,
            description: `${symbol}은 글로벌 기업으로 혁신적인 제품과 서비스를 제공합니다.`
        })
    }
    try {
        // Company Profile 2 API 호출
        const res = await fetch(`https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${apiKey}`, { cache: 'no-store' })

        if (!res.ok) throw new Error('프로필 조회 실패')

        const data = await res.json()

        // 필요한 데이터만 골라서 반환
        return Response.json({
            name: data.name,
            exchange: data.exchange,
            industry: data.finnhubIndustry, // Finnhub은 업종을 이 키값으로 줍니다
            marketCap: data.marketCapitalization,
            description: `${data.name}은(는) ${data.finnhubIndustry} 섹터에 속한 기업입니다.` // 간략한 설명
        })
    } catch (err) {
        return Response.json({ error: err.message }, { status: 500 })
    }
}
