# 08_answerboard_springMVC — 답변형 게시판 (Spring MVC · MyBatis)

2026-09-29(39일차)에 07을 바탕으로 시작해 2026-09-30(40일차)까지 이어진 수업의 로컬 소스다. 답글을 같은 테이블에 줄 세우기 위한 refer·step·depth 구조, 페이지 단위 목록, 조회수, 논리 삭제, 공통 화면(header·footer)과 Bootstrap, 로거(SLF4J)를 다뤘다. [39일차](../../index.html#class-day39) · [40일차](../../index.html#class-day40) · [개념 카드 52~56](../../index.html#web-52)

## 현재 구현 범위 (2026-09-30)

| 구간 | 상태 |
|---|---|
| 목록 `GET /boardList.do?pnum=` | 10개씩 페이지 SQL 연결. **화면의 페이지 번호 링크는 아직 자리만 있다** |
| 글쓰기 `GET /boardInsertForm.do` → `POST /boardInsert.do` | 연결. 새 글은 `refer = MAX(refer)+1`, `step·depth = 0` |
| 상세 `GET /boardDetail.do?seq=&review=y` | 연결. `review=y`일 때만 조회수를 올리고 redirect |
| 수정 `POST /boardUpdate.do` | 연결. 끝나면 상세로 redirect |
| 삭제 `POST /mulDel.do` | 연결. `DELETE`가 아니라 `delflag='Y'`로 바꾸는 논리 삭제 |
| 답글 달기 | **미구현** — Mapper에 `<!-- 답글달기 -->` 주석 자리만 있다 |
| 실패 시 화면 | `return "error.jsp"`는 뷰 이름으로 해석되어 `/WEB-INF/views/error.jsp.jsp`를 찾고, 08에는 `error.jsp`가 없다 (파일로 따진 결과) |
| 로그 | 코드는 SLF4J, 구현체는 Logback. **설정 파일 `log4j.xml`은 읽히지 않는다** — 아래 참고 |
| 실제 실행 | 이번 정리에서 톰캣·DB로 목록·글쓰기·상세·수정·삭제를 눌러 보지 않았다 |

수업 당시 상태를 그대로 보존했다. 코드에 요청이 연결된 것과 실제로 실행해 확인한 것을 구분해 적는다.

## 07에서 바뀐 것

| 항목 | 07 | 08 |
|---|---|---|
| 패키지 · `component-scan` | `com.hk.board` | `com.hk.ansboard` |
| MariaDB Connector/J · MyBatis | 2.6.2 · 3.5.6 | 3.3.3 · 3.5.16 |
| 로깅 | — | slf4j-api 2.0.13 · jcl-over-slf4j · logback-classic 1.5.6 |
| AOP · 트랜잭션 | — | aspectjrt · aspectjweaver 1.9.22.1 · spring-tx (아직 쓰는 코드 없음) |
| Service · DAO | 인터페이스 + 구현 | `@Service AnsService` · `@Repository AnsDao` 클래스 |
| DTO | seq·id·title·content·regDate | + refer·step·depth·readCount·delflag |
| 화면 | JSP마다 전체 HTML | `header.jsp`·`footer.jsp`를 `<jsp:include>`, Bootstrap 5.3 CDN |
| 상세의 삭제 버튼 | `location.href='mulDel.do?seq='` (GET) | 숨은 폼을 POST로 제출. `mulDel`도 POST만 받음 |

`root-context.xml`·`web.xml`은 07과 사실상 같다(이름·빈 줄만 다름). DB 접속 정보는 `classpath:properties/db.properties`에서 읽는다.

## 로그 설정이 적용되지 않는 이유

코드는 `LoggerFactory.getLogger(...)`(SLF4J)로 로그를 남기고, 주석에는 "log4j(실제 출력작업)"라고 적혀 있다. 그러나 `pom.xml`의 구현체는 **Logback**이고 Log4j 라이브러리는 없다. Logback은 `logback-test.xml` → `logback.xml`을 찾으며 **Log4j 1.x 형식의 `log4j.xml`은 읽지 않는다.**

08과 같은 라이브러리(Eclipse 배포본의 `WEB-INF/lib`)로 로거를 만들어 확인한 결과:

```
실제 로깅 구현체 : ch.qos.logback.classic.LoggerContext
클래스패스에 log4j.xml 있음? true / logback.xml 있음? false
Could NOT find resource [logback-test.xml]
Could NOT find resource [logback.xml]
Setting up default configuration.        ← 콘솔 출력 · 전체 DEBUG
log4j.xml의 날짜별 파일 생겼나? false
```

그래서 출력 모양은 `log4j.xml`의 `%-5p: %c - %m%n`이 아니라 Logback 기본 형식이고, 스프링 내부 로그까지 DEBUG로 나오며, 날짜별 로그 파일은 생기지 않는다. 워크스페이스의 `src/main/resources/log/` 폴더(9/29 생성)도 비어 있었다. Logback을 쓸 거라면 같은 뜻을 `logback.xml`로 옮겨야 한다([예시](../../index.html#web-53)). 이 소스에는 수업 상태 그대로 `log4j.xml`만 남겨 두었다.

## 답변형 게시판의 데이터

`INSERT` 문의 `VALUES(NULL, id, title, content, SYSDATE(), refer, 0, 0, 0, 'N')` 순서로 보면 `answerboard` 테이블의 컬럼 순서는 다음과 같다. 테이블을 만드는 SQL은 수업 자료에 없어 여기 싣지 않았다.

`seq`(자동 증가) · `id` · `title` · `content` · `regdate` · `refer` · `step` · `depth` · `readcount` · `delflag`

| 컬럼 | 뜻 |
|---|---|
| `refer` | 글 묶음 번호. 원글과 그 답글들이 같은 값 |
| `step` | 묶음 안의 줄 순서 |
| `depth` | 들여쓰기 단계 |
| `readcount` | 조회수 |
| `delflag` | `'N'` 보통 · `'Y'` 삭제된 글 |

목록은 `ORDER BY refer DESC, step ASC`로 세우고 `ROW_NUMBER()`로 번호를 붙여 `ceil(rn/10) = pnum`으로 10개씩 자른다.

## 실행

1. JDK 21, Tomcat 10.1, MariaDB와 `answerboard` 테이블을 준비한다.
2. `src/main/resources/properties/db.properties.example`을 같은 폴더의 `db.properties`로 복사해 본인 DB 계정을 채운다. 실제 파일은 Git에서 제외된다.
3. Eclipse에서 **Import → Existing Maven Projects**, **Maven → Update Project** 후 Tomcat 10.1에 올린다.
4. `http://localhost:8080/08_answerboard_springMVC/boardList.do`를 연다. 다음 쪽은 지금은 주소에 `?pnum=2`를 직접 붙인다.

## 확인한 것과 남은 것

- 수업 원본 소스(Java 4 · JSP 7 · XML 6 · pom)를 복사한 뒤 줄바꿈을 빼고 원본과 같은지 대조했다. 실제 `db.properties`, 빌드 산출물, JAR, Eclipse 설정은 제외했다.
- Java 4개 파일이 JDK 21로, 이 PC처럼 `-parameters` 없이 컴파일된다. 단순 타입 매개변수는 모두 `@RequestParam("이름")`으로 이름을 적어 9/28의 `home.do` 같은 문제가 없다.
- 로그 설정이 읽히지 않는 것은 위처럼 재현했다.
- 목록·글쓰기·상세·수정·삭제를 톰캣과 실제 DB로 실행하지는 않았다. 새 글의 `MAX(refer)+1` 방식은 동시에 두 명이 쓰면 같은 번호가 나올 수 있는 수업용 단순화다.
- 헤더·푸터 조각이 각각 완전한 HTML 문서라 결과 화면에 `<html>`·`<body>`가 겹친다(소스로 따진 결과). 페이지 번호 링크와 답글 달기는 다음 수업 범위다.
