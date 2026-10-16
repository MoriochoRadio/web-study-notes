# 12 — REST API 게시판 (백엔드) + React 화면 (프런트엔드)

2026-10-16(50일차) 수업의 로컬 소스다. 같은 hkboard 게시판을 **둘로 나눴다** — 이 폴더(`12_backend_hkboard_restAPI`, 포트 8085)는 화면 없이 JSON만 주고받는 REST API이고, 화면은 [`../12_frontend_hkboard_react`](../12_frontend_hkboard_react/)(Next.js, 포트 8086)가 `fetch`로 이 API를 불러 그린다. 교안은 「REST API 구현하기」.
[50일차](../../index.html#class-day50) · [개념 카드 85~87](../../index.html#web-85) · [개념서 44장](../../index.html#book-be-44)

## 구현 범위 (2026-10-16)

| 구간 | 상태 |
|---|---|
| `BoardController2` — `/api/boards` (화면이 쓰는 쪽) | `GET /api/boards` 목록(200 `{"list":[…]}`) · `POST /api/boards` 추가(201 `{"count":1}`) · `GET /api/boards/{seq}` 상세(200 `{"dto":{…}}`) · `PUT /api/boards/{seq}` 수정(주소의 `seq`를 DTO에 덮어씀) · `DELETE /api/boards` 여러 개 삭제(본문 `["1","2"]`) |
| `BoardController` — `/api/board` (비교용 옛 방식) | `/boardlist` · `/insert` · `/detail/{seq}` · `/updateform/{seq}` · `/update` · `/muldel` — 행위가 주소에 들어 있다. 한 개 삭제(`/delete/{seq}`)는 주석 |
| JSON | `@RestController`가 Map · DTO를 JSON으로. `HkDto.regdate`는 `@JsonFormat(pattern = "yyyy-MM-dd")` |
| CORS | `config/WebConfigCors` — `/api/**`에 `http://localhost:8086` · `8087`, GET · POST · PUT · DELETE, 헤더 전부, 쿠키 없음, `maxAge(3600)`. `BoardController`의 `@CrossOrigin`은 주석 |
| DB | MariaDB `hk`의 `hkboard`(seq · id · title · content · regdate) — `BoardMapper.xml` |
| 실패 처리 | 없는 글은 200 `{"dto":null}`, 빈 JSON `{}`도 201로 저장(검사 없음). 404 · 400은 직접 정하지 않았다 |
| 그 밖 | Spring Boot **3.5.7**(09~11은 4.1.1), MyBatis 스타터 3.0.5, Java 21. `HkService.deleteBoard`는 자기 자신을 다시 부르는 코드라 불리면 StackOverflowError(지금은 쓰는 곳 없음) |

## 구조

```
12_backend_hkboard_restAPI/                     ← 이 폴더 (8085)
├─ pom.xml                 Boot 3.5.7 · web · mybatis 3.0.5 · mariadb · h2 · lombok …
└─ src/main/
    ├─ java/com/hk/board/
    │   ├─ Application.java
    │   ├─ config/WebConfigCors.java          addCorsMappings
    │   ├─ controller/BoardController.java    /api/board  (옛 방식)
    │   ├─ controller/BoardController2.java   /api/boards (REST)
    │   ├─ dtos/HkDto.java                    @Alias("hkDto") · @JsonFormat
    │   ├─ mapper/BoardMapper.java
    │   └─ service/HkService.java
    └─ resources/
        ├─ application.properties             포트 8085 · DB · MyBatis · 인코딩
        └─ mybatis/BoardMapper.xml

12_frontend_hkboard_react/                       ← 화면 (8086)
├─ package.json            next 16.4.0 · react 19.3.0 · "dev": "next dev -p 8086"
└─ src/
    ├─ api/boardApi.js     fetchWrapper + getList · getDetail · insert · update · deleteMultiple
    └─ app/
        ├─ page.js         목록 · 체크박스 선택 삭제
        ├─ write/page.js   글쓰기
        └─ detail/[seq]/page.js   상세 ↔ 수정 (isEditMode)
```

## 실행하기

1. MariaDB `hk`에 `hkboard` 테이블을 준비한다(07 · 09 프로젝트와 같은 테이블).
2. `src/main/resources/application.properties`의 `spring.datasource.password=YOUR_DB_PASSWORD`를 자기 PC의 값으로 바꾼다(저장소에는 넣지 않는다).
3. 백엔드: 이 폴더에서 `mvnw.cmd spring-boot:run` → `http://localhost:8085/api/boards`(JSON이 보이면 성공).
4. 프런트: `../12_frontend_hkboard_react`에서 `npm ci`(처음 한 번) → `npm run dev` → `http://localhost:8086`.

## 선생님 레포(10/16)와 다른 점

`kang99king3/back_end_edu_20260629`의 `web_edu_20260910/backend_hkboard_springboot_restAPI12` · `frontend_hkboard_react12`(10/16 10:40 `f1a141f` "12번예제 추가", 14:34 `4554be5` "수정"은 lock 파일과 10 프로젝트의 import 한 줄)와 대조했다. 코드는 같고, 실습 폴더의 `application.properties`는 DB 계정만 다르다(이 저장소에는 비밀번호를 `YOUR_DB_PASSWORD`로 가림). 프런트의 `AGENTS.md`는 `next dev`가 스스로 만드는 파일이라 넣지 않았다. `node_modules` · `.next`도 넣지 않았다.

## 정리하며 확인한 것

실제 MariaDB와 Antigravity로는 실행하지 않았다. 저장소 밖 사본에서 **백엔드 DB만 H2 메모리 DB**로 바꾸고(설정 파일은 새로 씀, `SYSDATE()`는 사본의 Mapper에서만 `CURRENT_TIMESTAMP`) jar로 실행했고, 프런트 사본을 `next dev -p 8086`으로 띄웠다.

- **확인함(API)** — 목록 200 · 추가 201 · 상세 200 · 수정 200(본문의 `seq`보다 주소의 `seq`가 우선) · 여러 개 삭제 200 `{"count":2}`. `/api/boards/abc` 400, 폼 형식 POST 415, 없는 글 200 `{"dto":null}`, 빈 JSON 201(빈 글 저장). 옛 방식 `/api/board/…`도 같은 서비스로 동작.
- **확인함(CORS)** — Origin 8086의 사전 요청(OPTIONS, PUT) 200 + 허락 헤더(`GET,POST,PUT,DELETE`, Max-Age 3600), Origin 3000은 사전 요청 · 본 요청 모두 403, PATCH 사전 요청 403.
- **확인함(화면)** — 헤드리스 Edge로 8086에서 목록 → 글쓰기 → 상세 → 수정 → 선택 삭제까지 통과. 없는 글 상세(`/detail/999`)는 `dto`가 `null`이라 "This page couldn't load"(콘솔 TypeError).
- **확인하지 않음** — 실제 DB · Antigravity 실행, 프런트 `next build`, 404 · `@Valid`로 고친 코드.

## 저장소에 포함하지 않은 것

| 제외 | 이유 |
|---|---|
| `target/` · 프런트 `node_modules/` · `.next/` | 빌드 산출물 · 내려받는 의존성 |
| `.vscode/` · `.mvn/wrapper/maven-wrapper.jar` · 프런트 `AGENTS.md` | 개인 IDE 설정 · 래퍼가 내려받는 파일 · `next dev`가 만드는 파일 |
| DB 비밀번호 | `YOUR_DB_PASSWORD`로 바꿔 두었다 |
