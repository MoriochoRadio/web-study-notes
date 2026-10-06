# 2026-10-06 수업 반영과 검증 기록

## 반영 근거

- 로컬 수업 워크스페이스(`C:\Users\neo62\dev\workspace-class`)의 `08_answerboard_springMVC`에서 10-02 반영 이후 바뀐 파일 8개. 새 파일: `interceptor/LoginChkInterceptor.java`(10:55), `src/test/java`의 `AnsDaoTest`(13:51) · `AnsServiceTest`(14:28) · `AnsControllerTest`(14:54). 바뀐 파일: `log4j.xml`(11:28), `servlet-context.xml`(13:24), `pom.xml`(13:26), `.classpath`(13:26, Eclipse 설정이라 제외).
- 10-05는 개천절 대체공휴일이라 워크스페이스 변경이 없다. 43일차 = 10-06.
- 사용자 제공 `코딩테스트오답노트22_김태경.docx`: 22회차, Java 1 PASS · 1 FAIL, SQL 1 PASS · 1 FAIL. FAIL 두 문제는 제출 코드 칸이 비어 있어 정답 풀이만 옮겼다. 마지막 문제 제목 '도서 판매량 집계'는 공식 문제명(카테고리 별 도서 판매량 집계하기)으로 적었다. [22회차 기록](coding-tests/2026-10-06/README.md)
- 다른 PC에서 10-03~04에 한 대시보드 재작성(큰 그림·개념서 탭, 카드 형식 통일 — [점검 보고서](../card-audit-2026-10-03.md))을 받아, 새 카드는 그 형식(한 줄 요약 · 쉽게 말하면 · 개념 · 코드 · 실행 결과 · 핵심 정리 · 스스로 확인 · 실무 · 접힌 정리 작업 메모, 태그는 주제어)을 따랐다.

## 이번 반영

- 대시보드: [43일차](index.html#class-day43), 웹 개념 [62 인터셉터](index.html#web-62) · [63 JUnit 5와 스프링 테스트](index.html#web-63) · [64 MockMvc](index.html#web-64), 코딩테스트 51~54, 📘 개념서 [37장](index.html#book-be-37)(36장 끝맺음도 37장으로 이어지게 수정), 학습 여정 25단계, 시험 문제 w56~w61(보기별 해설 포함).
- 🗺️ 큰 그림: 타임라인(9/29~10/2 완료, 10/6~ 지금 = 인터셉터 · 단위 테스트, 예정에서 JUnit 제거), 예제 프로젝트 표와 08 카드(한 일 · 배운 것 · 앞으로 · 링크), 단계별 핵심 09(꼭 알 것 · 헷갈리는 것 · 면접 질문 2개), 앞으로 배울 것의 JUnit 칸, 헷갈리는 말 표(Filter / Interceptor, 단위 / 통합 테스트).
- 08 소스 7개 파일(인터셉터 1 · 테스트 3 · `log4j.xml` · `servlet-context.xml` · `pom.xml`)을 복사한 뒤 원본과 바이트 단위로 같은지 대조했다. 이번부터 수업 테스트(`src/test`)도 보존한다. 실제 `db.properties`, `.classpath`, 빌드 산출물은 제외.
- 헤더·통계·메뉴 숫자: 수업 43일차, 카드 304장, 시험 193문항(웹 61), 코딩테스트 54, 웹 64, 학습 여정 25, 개념서 37장. README 4종과 첫 화면도 맞췄다.

## 실행 확인

| 대상 | 확인한 범위 | 결과 |
|---|---|---|
| 08 컴파일 | main 8개 + test 3개, JDK 21, Eclipse 배포본 `WEB-INF/lib` + Tomcat 10.1 lib + 로컬 Maven 저장소의 JUnit 5.10.2 · JUnit Platform 1.10.2 · spring-test 6.1.13 | 성공 |
| 수업 테스트 원본 그대로 | JUnit Platform 런처로 3개 클래스 18개 테스트. `db.properties`는 검증 폴더에 연결되지 않는 가짜 값을 따로 둠 | 통과 0 · 실패 18 — 16개 `Not yet implemented`, 2개 `ConnectException`(DAO 목록 · Controller 목록) |
| 테스트 컨테이너 | 같은 실행의 로그 | `file:…/spring/**/*.xml`이 root(빈 11) · aop(6) · servlet(31)을 **한 컨테이너**로 읽음. 세 클래스가 컨테이너를 한 번만 만들어 함께 씀. Controller 테스트 중 AOP `daoError` 로그가 찍힘 |
| DB 자리에 가짜 | `root-context.xml`의 DB 연결부만 가짜 `SqlSessionTemplate`(목록 10건)으로 바꾼 설정 | `AnsControllerTest.testBoardList` 통과(status 200) |
| 인터셉터 | `servlet-context.xml`의 등록 블록 주석만 벗긴 설정 + MockMvc(수업 테스트와 같은 애너테이션 구성) | `boardList.do` 200 · 로그인 없는 `boardDetail.do`·`home.do`·`boardInsertForm.do` 302 → `index.jsp` · `MockHttpSession`에 `id=hk`면 `boardDetail.do` 200. "로그인이 필요함" 3번, postHandle·afterCompletion은 통과한 요청에서만 1번씩. 응답 본문은 모두 0자(JSP를 그리지 않음) |
| 경로 패턴 | spring-webmvc 6.1.13의 `PathPatternParser` · `MappedInterceptor` 직접 호출 | `/**/*.do`·`/**/boardList.do`는 PathPattern 해석 실패, `/*.do`·`/**`·`/resources/**`는 OK. `MappedInterceptor`는 예전 방식으로 비교해 boardList·리소스 제외, boardDetail·home 적용 |
| 로그인 기능 유무 | 08 소스 검색 | 세션에 `id`를 넣는 코드·로그인 화면 없음(소스로 따진 결과) |
| 서울에서 김서방 찾기 | 공식 예제 + 무작위 20,000개 | 통과. `new String("Kim") == "Kim"` false, `equals` true |
| 체육복 | 공식 예제 3 + n 2~8의 가능한 입력 전부 86,367개(도난당한 여벌 학생 77,539개, `lost` 순서 섞음). 기댓값은 모든 대여 방법을 시도하는 별도 코드 | 통과. 반례: 뒤 번호부터 빌리면 n=4, lost=[2,4], reserve=[1,3]에서 4 → 3, 도난당한 여벌을 무시하면 n=2, lost=[1], reserve=[1]에서 2 → 1 |
| 22회차 SQL | SQL 파일 두 개를 그대로 읽어 Node 내장 SQLite 3.53(메모리 DB)에 실행, 8개 항목. `YEAR()`·`MONTH()`는 MySQL 비교 결과와 같도록 문자열을 돌려주는 같은 이름 함수로 등록 | 통과. 제출 코드 `경제|5, 생활|1, 인문|5`, COUNT로 바꾸면 `2, 1, 2`, LIKE·범위 비교도 같은 결과 |
| HTML 구조 · 앵커 | 대시보드 | 문서 내 앵커 모두 존재, 태그 짝 일치. 중복 id 경고 15건은 코드 예시 글자 속 id로 반영 전과 같음 |
| 인벤토리 | 백엔드 실제 카드 수·통계 | 일치(수업 42 · 코딩테스트 54 · 웹 64 · 학습 여정 25) |
| 시험 문제은행 | JavaScript로 실제 평가 | 193문항, id 중복·정답 범위 오류 없음, 해설 193개 전부. w56~w61 모두 "배운 데까지" 포함(169 → 175) |

로컬 MariaDB 접속 정보는 이번에도 쓰지 않았다.

## 범위의 한계

- **실제 MariaDB로 수업 테스트를 돌리지 않았다.** `AnsDaoTest`·`testBoardList`가 실제 DB에서 통과하는지는 확인하지 않았다(1쪽 글 10개라는 데이터 조건도 확인 안 함).
- **톰캣에서 인터셉터를 켠 화면을 눌러 보지 않았다.** 인터셉터 동작은 MockMvc로만 확인했다.
- 소스로 따진 결과이며 실행 확인이 아닌 것: 로그인 기능이 없다는 것, `sendRedirect("index.jsp")`가 하위 경로 주소에서는 상대 경로로 해석된다는 것, `AnsServiceTest`가 `AnsDao`를 주입받는다는 것, pom의 JUnit 4가 쓰이지 않는다는 것.
- 스프링 테스트에서 `@Transactional`이 기본 rollback이라는 것, MySQL이 `'01'`을 숫자로 바꿔 비교한다는 것은 문서 기준이다.
- Java·SQL 로컬 검증은 프로그래머스 재채점이 아니다. SQL은 SQLite로 확인했으며 MySQL과 규칙이 같은 부분만 본다.
