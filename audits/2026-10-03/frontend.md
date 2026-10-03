# 프런트엔드 카드 점검 상세 — 2026-10-03

> **2026-10-04 갱신:** 아래 중·하 항목도 모두 처리했다(이미 해결된 것은 확인 후 건너뜀). 처리 요약은 [card-audit-2026-10-03.md](../../card-audit-2026-10-03.md)의 "2026-10-04" 절에 있다.

[요약 보고서](../../card-audit-2026-10-03.md)의 프런트엔드 부분 상세 목록이다. 형식은 `카드 — 문제 → 고칠 방향`이다. **상** 항목은 2026-10-03에 모두 고쳤다(✅). 중·하는 아직 남아 있다.

## HTML · CSS · JavaScript (html-01~07, css-01~12, js-01~18)

### 상 — 모두 고침
- ✅ css-06 — `::after`(z-index:0)가 position 없는 글자 위에 그려지는데 "글 뒤로"라고 설명함, TIP의 z-index 적용 조건도 틀림
- ✅ css-04 — `font-family: "맑은 고딕" 굴림;` 쉼표 누락으로 선언 전체가 무효인데 대체 글꼴이 된다고 설명함
- ✅ css-07 — "274px로 맞춰야 같아진다"고 했지만 마지막 규칙 때문에 실제로는 300 대 274
- ✅ css-02 — `#sub_title1>b`, `h1 b`는 대상이 없음. 주석은 CSS에 없는 `p b`/`p>b`를 설명함
- ✅ css-03 TIP — "#c 뒤 형제 p가 하나뿐"은 틀림(2개). 두 규칙이 같은 색이라 차이도 안 보임
- ✅ js-07 strTest03 — substring 인덱스가 뒤집혀 split 결과가 1개, `splitVal[1]`에서 TypeError
- ✅ js-08 — 대입 = 얕은 복사, slice·spread = 깊은 복사라고 잘못 정의함 → 참조 공유 / 얕은 복사 / 깊은 복사 3단계로 정리
- ✅ html-06 — 쉽게 말하면·스스로 확인이 카드에 없는 폼(input·label) 이야기
- ✅ html-03 — 아직 안 배운 JS(onload·querySelectorAll)로 만든 아코디언이 본문이고, 펼치기만 됨
- ✅ js-06 — `jsonObj` 정의가 없고 `closureTest2_1`은 호출하지 않음
- ✅ js-10 — "4종" 목록이 위치마다 다르고, TIP이 오류라고 밝힌 `for (const key in object)`가 그대로 남음
- ✅ css-10 — 제목·박스가 내용(inline-block, font-size:0)과 다르고, 예제에 같은 id를 두 번 씀
- ✅ CSS 전체 — 구체성(specificity) 점수 규칙이 한 번도 설명되지 않음 → css-03에 추가

### 상 외에 같이 고친 사실 오류
- ✅ js-05 — parseInt 설명이 반대("abc12"는 NaN, "12px"는 12)
- ✅ js-04 — getElementsByName은 NodeList(forEach 가능)
- ✅ css-09 — row-reverse는 주축 시작점이 오른쪽으로 바뀜
- ✅ js-18 — file://로 열면 CORS로 막힌다는 안내 추가

### 중 — 남음
- js-01 — "언어 자체는 CORE·BOM·DOM" → BOM·DOM은 브라우저 API. document를 BOM 목록에 넣은 것도 정리
- html-05 — 쉽게 말하면이 blockquote를 말하지만 코드는 `q`
- html-06 — `rowspan="6"`인데 행이 4개만 보임 → "2행 생략" 주석
- html-07 — 쉽게 말하면은 rowspan, 카드는 colspan만. 스스로 확인의 caption·scope는 코드에 없음
- css-03 — 쉽게 말하면은 "구체적인 게 이긴다", 스스로 확인은 :hover·::before(css-12 내용)
- css-02·css-12 — css02.css 하나가 세 카드에 흩어짐, css-12가 css-01·02를 반복
- css-04·05 — font 축약형 순서 표기가 제각각
- css-05 — letter-spacing은 코드에 없고, "결과 동일"도 틀림(sans-serif 추가, line-height 초기화)
- css-09 — 쉽게 말하면의 justify-content·align-items와 #container2 코드가 카드에 없음
- css-11 — 쉽게 말하면은 "글꼴·배경·박스 종합", 내용은 flex뿐. 스스로 확인(CSS 변수)은 무관
- js-03 — TDZ를 설명 없이 씀, let/const도 호이스팅된다는 사실 빠짐
- js-04 searchId — textContent 결과를 바로 innerHTML이 덮어써서 차이가 안 보임
- js-04 — `p:last-child > span`을 설명 없이 씀
- js-05 — `intTest(int1)`처럼 id가 전역 변수가 되는 레거시 동작을 규칙처럼 가르침
- js-08 — 함수 이름이 sliceTest인데 slice() 호출이 없고, `for (i = 0; …)`에 선언이 빠짐
- js-09 — 두 번째 코드 블록이 정의 안 된 변수 투성이, 3개 파일을 한 카드에 몰아넣음
- js-12 — window.open 두 번째 인자는 "제목"이 아니라 창 이름(target)
- js-14 — 카드 코드에 주석을 추가해 childNodes 수가 원본과 달라짐, parentNode 설명 부정확
- js-15 — createAttribute/setAttributeNode를 "정석"이라 부름(레거시). innerHTML 성능 설명이 본문과 스스로 확인에서 반대

### 하 — 남음
- html-01 — 플레이그라운드 안내가 엉뚱한 블록에 있고, `</html>` 뒤에 태그가 이어짐
- html-02 — "형태가 없음" 미설명, "반드시 블록 내부"는 과장
- css-08 — fixed 기준은 body가 아니라 뷰포트, "빨간 원" 코드 생략
- css-09 — flex-shrink로 줄어드는 동작 미설명
- css-10 — width/height가 없는데 "border-box라 크기 유지"
- css-06 — 쉽게 말하면의 attachment가 코드에 없음
- js-02 — "항상 문자열" 직후 null 반환 설명, typeof null 보충
- js-06 — "화살표 함수는 메서드에 부적합"인데 코드는 생성자 안에서 화살표 메서드 사용
- js-07 — prompt 취소 시 null.match TypeError
- js-08 — 쉽게 말하면의 unshift/splice가 코드에 없음
- js-11 — `new Date("YYYY-MM-DD")`는 UTC로 해석돼 D-Day가 하루 어긋날 수 있음
- js-12 — "부모가 팝업 변수로 제어"하는데 반환값을 받지 않음
- js-04·14·15 — 스스로 확인에서 innerHTML vs textContent를 세 번 반복
- js-16 — 쉽게 말하면은 "개수만큼 렌더링", 실제로는 클릭 한 번에 한 행
- js-17 — expires 없으면 세션 쿠키, domain은 범위를 넓히는 옵션
- js-18 — 서버 응답을 innerHTML에 넣음(XSS 경고와 어긋남)

## React · Next.js · 기초 개념 사전 (react-01~14, react-capstone, concept-*)

### 상 — 모두 고침
- ✅ 번호 체계 — "N단계"(카드 번호), "N강"(레슨 폴더 번호)이 섞임 → react-09~14, 졸업 과제, concept 카드의 참조를 카드 링크로 통일(약 40곳)
- ✅ react-14 — cleanup에서 `ws.close()`가 if 안에 있어 연결 중에는 소켓이 안 닫힘. 폴링 폴백 누락, "과거 60개"는 더미 경로에서만 맞음
- ✅ react-04 TIP — useMemo를 지우면 "재계산!" 로그만 늘고, useCallback을 지워야 모든 행이 다시 찍힘
- ✅ react-03·concept-useeffect — 의존성 배열 규칙에 "첫 마운트에 1번"이 빠짐
- ✅ concept-useeffect — 본문에 cleanup 설명이 없음

### 상 외에 같이 고친 것
- ✅ concept-rerender — "오직 셋"에 Context 값 변경·외부 store 구독 추가
- ✅ concept-file-routing — `params.id` → `const { id } = await params`(Next 15+)
- ✅ react-07 — 같은 문단의 "리렌더링 없이" / "함께 리렌더링" 모순
- ✅ concept-qna-websocket-env — NEXT_PUBLIC_ 키 설명이 본문과 스스로 확인에서 반대
- ✅ concept-qna-darkmode — "질문 5개" → 3개

### 중 — 남음
- react-08·concept-server-client — 'use client'는 그 파일이 import하는 모듈까지 경계에 포함, 클라이언트 컴포넌트도 첫 HTML은 서버가 만든다(SSR)는 설명 없음
- react-11 — "하이드레이션 불일치", `skipHydration`이 정의 없이 나옴
- react-12 — "스트리밍" 미설명, "symbol 전달은 다음 실습"이 회수되지 않음
- memo·useCallback "항상 짝"(react-04·06, concept-react-memo) → "함수·객체 props를 넘길 때만 짝"으로 범위 좁히기
- concept-usememo-usecallback — useEffect 의존성용 useCallback이 본문에 없음
- concept-strictmode — 이중 렌더 / effect 재마운트 / 업데이터 이중 호출이 섞임 → 표로 구분
- react-04·06 — StrictMode 개발 모드에서 로그·renderCount가 2배로 보인다는 주석 필요
- concept-js-modules — `@/` 별칭(jsconfig paths) 설명 없음
- concept-js-scope — const 비유("내용물 못 바꿈")가 `arr.push` 가능과 모순, 스스로 확인에 호이스팅·TDZ·클로저가 설명 없이 출제
- concept-zustand — "순수 함수에서 상태 갱신" 표현 → `getState()/setState()`로 React 밖에서 읽고 쓰기
- 프런트 개념 사전 그룹 순서 A→B→D→C→E, 그룹 B에 Tailwind·WebSocket·persist가 섞임
- concept-strictmode-effect-bug — 실행 순서 인과가 흐림, "운영에서 터진다"는 과장
- concept-stale-closure — 예시에서 현상이 보이지 않음 → setInterval 예시
- Tailwind v4 다크 모드 — 공식 표기는 `@custom-variant dark (…)`, 카드는 `@variant` 
- react-11 — Promise.all로 여러 요청이 loading 하나를 같이 써서 첫 응답에 false가 됨
- react-05 — "2026-07-27 빈칸 5곳" 같은 수업 일지 문장
- react-capstone — "인터리빙·레이스 컨디션·Hooks 규칙 위반 2건"이 설명 없이 나열, 버그 개수 6 vs 7 불일치, 보관 정책 메모
- react-03 — "선생님이 보여주신 다른 방식"과 concept-strictmode-effect-bug의 해결책이 다름
- react-10 — 검색 입력마다 fetch, debounce·응답 순서 처리와 연결 없음
- concept-jsx — ".jsx 확장자 필요" → Next에서는 .js에도 씀
- concept-js-arrow-function — this·arguments·new가 본문 설명 없이 스스로 확인에 나옴

### 하 — 남음
- react-01 — React 19 프로젝트인데 "React 18의 createRoot"
- react-02 — 스스로 확인의 className이 카드에 없음, "자식이 수정하면 에러"는 범위가 넓음
- react-03 — "setState는 왜 비동기인가"가 배칭 개념 없이 나옴
- react-05 — "localStorage 읽기는 무거운 연산" 과장
- react-06 — 개발 서버에서는 청크가 아니라 개별 모듈 요청
- react-08 — layout이 유지하는 것은 스크롤 위치가 아니라 state
- react-10 — "3단계"인데 본문은 "네 조각"
- react-13·concept-tailwind — `px-3`은 좌우 패딩만, ThemeWrapper의 첫 화면 번쩍임(FOUC) 언급 없음
- concept-js-array-methods — "매개변수 4개"인데 3개만 설명
- concept-component — 소문자 태그는 콘솔 경고가 뜸
- concept-qna-websocket-env — 미국장 시간의 서머타임 차이
