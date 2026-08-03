export async function GET(request) {


    ///// request 의 url 받아서 검색쿼리(q)를 추출하는 부분 /////
    const { searchParams } = new URL(request.url)
    //url은 /api/search?q=AAPL 형태임
    const q = searchParams.get('q')?.toLowerCase().trim() || ''
    //?. 은 정상값이면 toLowerCase() 실행 / 만약 q가 없으면 에러 대신 undefined 리턴하고 뒤에 || ''이 실행됨
    if (!q) return Response.json({ results: [] }) //q없으면 걍 반환시킴

    ///// 이제 서버에서 q값 가져와야함. /////
    const apiKey = process.env.FINNHUB_API_KEY
    const APISTOCK = await fetch(
        `https://finnhub.io/api/v1/search?q=${q}&token=${apiKey}`,
        { cache: 'no-store' }
    ) //아직 json으로 안바꿨음
    const data = await APISTOCK.json() //json으로 바꿔도 아직 배열이 아님

    const STOCKS = data.result //배열로 바꿈

    const results = STOCKS
        .map((s) => ({ symbol: s.displaySymbol, name: s.description, type: s.type }))
        .slice(0, 5) //이름만 나중에 쉽게 쓰려고 바꾸고, 5개 잘라서 리턴

    return Response.json({ results })
}