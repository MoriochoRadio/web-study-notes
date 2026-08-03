// ── STEP 1: 백엔드 검색 API Route (GET /api/search?q=...) ──
// [역할 설명]
// Next.js App Router에서 app/api/search/route.js 파일은
// 브라우저 화면(UI)을 보여주는 곳이 아니라, 데이터를 주고받는 "백엔드 API 서버" 역할을 합니다.

const STOCKS = [
    { symbol: 'AAPL', name: 'Apple Inc.', exchange: 'NASDAQ' },
    { symbol: 'TSLA', name: 'Tesla Inc.', exchange: 'NASDAQ' },
    { symbol: 'MSFT', name: 'Microsoft Corp.', exchange: 'NASDAQ' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', exchange: 'NASDAQ' },
    { symbol: 'AMZN', name: 'Amazon.com Inc.', exchange: 'NASDAQ' },
    { symbol: 'NVDA', name: 'NVIDIA Corp.', exchange: 'NASDAQ' },
    { symbol: 'META', name: 'Meta Platforms Inc.', exchange: 'NASDAQ' },
    { symbol: 'JPM', name: 'JPMorgan Chase & Co.', exchange: 'NYSE' },
    { symbol: 'V', name: 'Visa Inc.', exchange: 'NYSE' },
    { symbol: 'JNJ', name: 'Johnson & Johnson', exchange: 'NYSE' },
]

// 클라이언트(프론트엔드)에서 GET 방식으로 /api/search?q=... 요청을 보내면 자동 실행됩니다.
export async function GET(request) {
    // 📌 1) URL에서 쿼리파라미터(?q=...) 읽어오기
    // new URL(request.url)은 전달받은 전체 주소에서 searchParams(쿼리파라미터 사물함)를 추출합니다.
    const { searchParams } = new URL(request.url)

    // 📌 2) ?q= 뒤의 실제 값 안전하게 꺼내기
    // - searchParams.get('q'): 'q=' 뒤의 값을 읽음
    // - ?. (옵셔널체이닝): q가 없을 때 null 에러로 서버가 터지지 않게 방지
    // - .toLowerCase(): 대소문자 구분 없이 검색하기 위해 소문자로 통일
    // - || '': 값이 없으면 빈 문자열('')로 안전하게 처리
    const q = searchParams.get('q')?.toLowerCase() || ''

    // 📌 3) 조기 리턴 (Early Return)
    // 검색어 q가 비어있다면, 아래의 필터링 로직을 수행하지 않고 즉시 빈 결과를 응답하고 종료합니다.
    if (!q) return Response.json({ results: [] })

    // 📌 4) 배열 데이터 필터링
    // symbol(종목코드) 또는 name(회사명)에 검색어 q가 포함된 항목을 최대 5개까지 걸러냅니다.
    const results = STOCKS.filter(
        (s) => s.symbol.toLowerCase().includes(q) || s.name.toLowerCase().includes(q)
    ).slice(0, 5)

    // 📌 5) JSON 형태로 프론트엔드에 응답
    // Response.json()은 자바스크립트 객체를 브라우저가 이해할 수 있는 JSON 전송 포맷으로 응답합니다.
    return Response.json({ results })
}
