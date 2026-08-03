# 🔍 AI 코드 리뷰 & 디버깅 일지 (CODE_REVIEW.md)

> 제출 가이드: AI가 생성한 코드를 그대로 쓰지 않고, React 개념에 기반하여 직접 검증하고
> 수정한 사례를 기록합니다. 기능을 만들면서 실제로 발견한 문제를 그때그때 이 문서에 추가합니다.

---

## AI 코드의 한계/오류 분석 (최소 1건)

### 사례 1: `next/font/google`이 네트워크 제한 환경에서 빌드를 깨뜨림

**AI가 준 코드 (Before)** — `create-next-app` 기본 템플릿
```jsx
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

**문제점**: `next/font/google`은 빌드 시점에 Google Fonts 서버에서 폰트 파일을
실제로 다운로드한다. 이 프로젝트가 만들어진 개발 환경(클라우드 샌드박스)은 외부
네트워크가 제한돼 있어서 `npm run build`가 `Failed to fetch 'Geist' from Google Fonts`
에러로 실패했다. 또한 13강까지의 레슨 코드들은 애초에 커스텀 웹폰트를 쓰지 않고
시스템 폰트만 사용해왔기 때문에, 이 프로젝트에서도 불필요한 외부 의존성이었다.

**내가 수정한 코드 (After)**
```jsx
// next/font의 Google Fonts 자동 다운로드는 일부러 쓰지 않음
import './globals.css'

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-white text-gray-900 dark:bg-stock-bg dark:text-stock-light">
        {children}
      </body>
    </html>
  )
}
```

**수정 이유 (개념 기반 설명)**: `next/font`는 빌드 타임에 폰트를 최적화해서 번들에
포함시키는 기능이지만, 이는 성능 최적화 옵션이지 앱 동작에 필수인 로직이 아니다.
외부 네트워크 요청이라는 실패 지점을 하나 없애는 게 안정성 면에서 더 낫다고 판단했고,
13강까지 배운 프로젝트 전체의 스타일 일관성(시스템 폰트 + Tailwind 유틸리티 클래스)도
그대로 유지할 수 있었다.

---

### 사례 2: [기능 1] 백엔드 `route.js` — 직접 작성한 코드를 AI 리뷰로 3단계에 걸쳐 검증·수정

> 이번 사례는 "AI가 준 코드에서 오류를 찾은 것"이 아니라 **"내가 직접 짠 코드를 AI에게
> 리뷰받으며 원인만 설명 듣고 스스로 고친"** 과정입니다. 정답을 바로 받지 않고 각 라운드마다
> "왜 틀렸는지"만 질문했기 때문에, 최종 코드는 100% 직접 작성했습니다.

**1라운드 — 미선언 변수 참조 (Before)**
```js
const APISTOCK = await fetch(
    `https://finnhub.io/api/v1/search?q=${symbol}&token=${apiKey}`,
    { cache: 'no-store' }
)
```
**문제점**: `symbol`, `apiKey` 둘 다 이 함수 안에서 `const`로 선언한 적이 없는 변수였다.
검색어는 이미 위에서 `q`로 추출해뒀는데 엉뚱한 이름(`symbol`)을 썼고, API 키는 아예
읽어오는 코드 자체가 없었다. 자바스크립트는 선언되지 않은 변수를 참조하면 그 즉시
`ReferenceError`를 던지고 실행을 멈춘다.

**1라운드 수정 (After)**
```js
const apiKey = process.env.FINNHUB_API_KEY
const APISTOCK = await fetch(
    `https://finnhub.io/api/v1/search?q=${q}&token=${apiKey}`,
    { cache: 'no-store' }
)
```
**수정 이유**: 검색어는 위에서 이미 추출해둔 `q`를 그대로 재사용해야 하고, 서버 전용
비밀 키는 `.env.local`에 저장해둔 값을 `process.env.FINNHUB_API_KEY`로 읽어와야
브라우저에 노출되지 않으면서도 Finnhub 인증에 쓸 수 있다.

**2라운드 — `fetch()`가 돌려주는 값을 데이터로 착각 (Before)**
```js
const results = APISTOCK.filter(
    (s) => s.symbol.toLowerCase().includes(q) || s.name.toLowerCase().includes(q)
).slice(0, 5)
```
**문제점**: `fetch()`가 리턴하는 건 실제 데이터가 아니라 `Response` 객체(포장 상자)다.
`Response`에는 `.filter()`라는 메서드 자체가 없어서 이 코드는 바로 타입 에러로 죽는다.

**2라운드 수정 (After)**
```js
const data = await APISTOCK.json()
const results = data.filter(...)   // ← 아직 완전하진 않음, 3라운드에서 추가 수정
```
**수정 이유**: `Response` 안의 진짜 JSON 본문을 꺼내려면 `.json()`을 한 번 더 호출해서
`await`해야 한다. 다만 이 시점엔 `data` 자체가 아직 배열이 아니라 `{ count, result }`
형태의 객체라는 걸 놓치고 있었고, `s.name`이라는 존재하지 않는 필드도 그대로 남아있었다
— `||`가 단락 평가되는 항목만 우연히 안 죽고, symbol에 검색어가 없는 항목을 만나는
순간 `undefined.toLowerCase()`로 크래시할 잠재 버그였다.

**3라운드 — 응답 구조·필드명 최종 교정 (After, 최종본)**
```js
const STOCKS = data.result   // 진짜 배열은 한 겹 더 안에 있었다
const results = STOCKS
    .map((s) => ({ symbol: s.displaySymbol, name: s.description, type: s.type }))
    .slice(0, 5)
```
**수정 이유 (개념 기반 설명)**: Finnhub 검색 API는 우리가 보낸 `q`로 **이미 서버 쪽에서
필터링**을 끝내고 결과를 준다. 그런데도 클라이언트(프록시 route)에서 `symbol`/`description`
문자열에 `q`가 포함되는지 다시 검사하면, Finnhub가 별칭·유사종목 로직으로 매칭시킨
결과를 우리 단순 `.includes()` 검사가 오히려 걸러내 버릴 위험이 있다. 그래서 다시
필터링하지 않고, Finnhub의 실제 필드명(`displaySymbol`, `description`)을 프로젝트
전체에서 통일해온 이름(`symbol`, `name`)으로 **모양만 바꿔주는** `.map()`으로 교체했다.
실제로 `/api/search?q=apple` 호출 결과 AAPL, APLE 등 5개 종목이 `{symbol, name, type}`
형태로 정상 반환되는 것을 브라우저에서 직접 확인했다.

---

## Before & After 코드 비교 및 수정 이유 — 추가 사례는 기능 구현마다 여기 이어서 기록

---

*이 문서는 기능을 추가할 때마다 계속 갱신됩니다. 특히 "AI가 처음 준 코드에 내가
문제를 제기하고 함께 고친" 순간이 생기면 반드시 여기에 남깁니다.*
