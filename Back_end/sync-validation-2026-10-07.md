# 2026-10-07 수업 반영과 검증 기록

## 반영 근거

- 44일차부터 수업 도구가 Antigravity로 바뀌고 워크스페이스도 새로 생겼다(`C:\Users\neo62\dev\workspace-boot`). 그 안의 `hkboard_springboot09` 프로젝트가 이날 수업 소스다.
- 이날은 코딩테스트 오답노트가 없다. 코딩테스트 카드는 54장 그대로다.
- 카드는 10-03~04 재작성 형식(한 줄 요약 · 쉽게 말하면 · 개념 · 코드 · 실행 결과 · 핵심 정리 · 스스로 확인 · 실무 · 접힌 정리 작업 메모, 태그는 주제어)을 따랐다.

## 이번 반영

- 대시보드: [44일차](index.html#class-day44), 웹 개념 [65 스프링 부트 프로젝트](index.html#web-65) · [66 Mapper 인터페이스](index.html#web-66) · [67 Thymeleaf](index.html#web-67) · [68 Lombok과 부트의 Controller](index.html#web-68), 📘 개념서 [38장](index.html#book-be-38)(새 7부 · 스프링 부트, 37장 끝맺음도 38장으로 이어지게 수정), 학습 여정 26단계, 시험 문제 w62~w67(보기별 해설 포함).
- 🗺️ 큰 그림: 타임라인(10/6 완료, 10/7~ 지금 = 스프링 부트 · Thymeleaf · Mapper 인터페이스, 마지막 예정은 Spring Security · 로그인 게시판 종합으로), 예제 프로젝트 표 09 행과 09 카드(08은 완료로), 단계 10 "웹 5 — 스프링 부트"(꼭 알 것 · 헷갈리는 것 · 실무 · 면접 질문 3개) 추가와 "앞으로 배울 것"을 11로, 그 안의 Spring Boot · Thymeleaf 칸을 "44일차에 시작"으로, 헷갈리는 말 표(JSP+JSTL / Thymeleaf, DAO 클래스 / @Mapper 인터페이스).
- 새 프로젝트 [`09_hkboard_springboot`](web_edu_project/09_hkboard_springboot/): 수업 프로젝트에서 `target/` · `.vscode/` · 래퍼 jar를 뺀 22개 파일을 복사한 뒤 원본과 바이트 단위로 같은지 대조했다. 예외는 `application.properties` 한 줄로, 비밀번호 값을 `YOUR_DB_PASSWORD`로 바꿨다(나머지 줄은 같다). 프로젝트 [README](web_edu_project/09_hkboard_springboot/README.md)를 새로 썼다.
- 헤더·통계·메뉴 숫자: 수업 44일차, 카드 309장, 시험 199문항(웹 67), 웹 68, 학습 여정 26, 개념서 38장. README 4종과 첫 화면(개념 168항목)도 맞췄다.

## 실행 확인

검증용 사본(저장소 밖)에서만 바꾼 것: DB를 H2 메모리 DB(`MODE=MariaDB`)로, 포트를 9190으로, `schema.sql`로 `HKBOARD`와 글 3개를 만들고, H2에 없는 `SYSDATE()`를 사본의 Mapper XML에서만 `CURRENT_TIMESTAMP`로. Java 코드와 템플릿은 수업 그대로다.

| 대상 | 확인한 범위 | 결과 |
|---|---|---|
| 빌드 | Maven Wrapper로 사본 `package` (Boot 4.1.1 · JDK 21) | 성공 |
| 폴더 실행 | `target/classes`에서 `main()` 실행 후 curl로 모든 요청 | 목록 · 글쓰기 폼 · 상세 · 수정 폼 200, 글쓰기 · 수정 · 삭제 302 |
| jar 실행 | `java -jar`로 같은 요청 | 목록 200, **글쓰기 폼 · 상세 · 수정 폼 500** `Error resolving template [/…]` — Controller가 뷰 이름 앞에 `/`를 붙인 세 곳. 경로가 `templates//….html`로 찍힘 |
| 삭제 방식 | `GET /thboard/muldel?chk=4` | 302 → 목록, 글이 지워짐(`@RequestMapping`이라 GET도 받음) |
| 잘못된 요청 | seq 없는 상세 · 없는 seq 상세 · 없는 seq 수정 | 500(기본형 `int`에 null) · 500(SpEL `dto.id`) · 200 Whitelabel(`return "error"`, `error.html` 없음) |
| 매개변수 이름 | `javap -v`로 `HkController.class` | `MethodParameters` 있음 — 부트 부모 pom이 `-parameters`로 컴파일 |
| Thymeleaf 규칙 | `SpringTemplateEngine`으로 `th:onclick`에 문자열 · 숫자를 넣은 템플릿 처리 | 문자열은 거부, 숫자 · 참거짓만 허용(Thymeleaf 3.1) |
| Security 의존성 | `thymeleaf-extras-springsecurity6`만 있고 Security 스타터는 주석인 상태로 기동 | 정상 기동 |
| HTML 구조 · 앵커 | 대시보드 | 문서 내 앵커 1148개 모두 존재, 태그 짝 일치. 새 경고 13건은 코드 예시 글자 속 id·주소와 실제로 있는 파일을 가리키는 `view.html?f=` 링크로, 전과 같은 오탐 |
| 인벤토리 | 백엔드 실제 카드 수·통계 | 일치(수업 43 · 코딩테스트 54 · 웹 68 · 학습 여정 26) |
| 시험 문제은행 | JavaScript로 실제 평가 | 199문항, id 중복·정답 범위 오류 없음. w62~w67 모두 "배운 데까지" 포함(175 → 181) |
| 브라우저 | 로컬 서버로 44일차 · 웹 65~68 · 38장 · 여정 26 · 큰 그림, 폭 375px 포함 | 콘솔 오류 없음, 가로 넘침 없음 |

로컬 MariaDB 접속 정보와 수업 워크스페이스의 실제 비밀번호는 읽거나 쓰지 않았다.

## 범위의 한계

- **실제 MariaDB와 Antigravity에서 실행하지 않았다.** 위 결과는 H2 사본 기준이며, `SYSDATE()`는 MariaDB에서 정상인 함수다.
- 선생님 안내 문서와 비교해 DTO 애너테이션(`@Data` 하나 vs 여러 개) 같은 차이는 카드에 적었지만, 선생님 레포의 부트 프로젝트를 실행해 보지는 않았다.
- `contextLoads` 테스트는 `@Test`가 주석이라 실행 대상이 아니다.
