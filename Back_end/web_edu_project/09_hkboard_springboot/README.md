# 09_hkboard_springboot — 스프링 부트 게시판 (Boot · Mapper 인터페이스 · Thymeleaf)

2026-10-07(44일차) 수업의 로컬 소스다. 07의 게시판(목록 · 글쓰기 · 상세 · 수정 · 여러 글 삭제)을 **스프링 부트**로 다시 만들었다. XML 설정 파일은 하나도 없고, DAO 클래스 대신 `@Mapper` 인터페이스, JSP 대신 Thymeleaf, 손으로 쓴 생성자 대신 Lombok을 쓴다. 수업 도구도 이클립스에서 **Antigravity**(VS Code 계열)로 바뀌었다.
[44일차](../../index.html#class-day44) · [개념 카드 65~68](../../index.html#web-65) · [개념서 38장](../../index.html#book-be-38)

## 현재 구현 범위 (2026-10-07)

| 구간 | 상태 |
|---|---|
| 첫 화면 `GET /` | `HomeController` → `home.html` (게시판 링크) |
| 목록 `GET /thboard/boardlist` | `th:each`로 표 그리기, 날짜는 `#dates.format`, 체크박스로 여러 글 선택 |
| 글쓰기 `GET /thboard/insertboardform` → `POST /thboard/insertboard` | 연결. 성공하면 목록으로 redirect, 실패하면 `error` |
| 상세 `GET /thboard/boarddetail?seq=` | 연결 |
| 수정 `GET /thboard/boardupdateform?seq=` → `POST /thboard/boardupdate` | 연결. 끝나면 상세로 redirect |
| 삭제 `/thboard/muldel` | `@RequestMapping`이라 **GET · POST 모두** 받는다. `String[] chk`를 Map에 담아 `foreach`로 `IN (…)` |
| 실패 시 화면 | `return "error"` — `templates/error.html`이 없어 부트 기본 Whitelabel 화면이 상태 200으로 나온다 |
| 테스트 | `HkboardSpringboot09ApplicationTests.contextLoads`는 `@Test`가 주석이라 실행되지 않는다 |
| Spring Security | pom에 스타터가 **주석**으로 남아 있다(`thymeleaf-extras-springsecurity6`만 켜져 있음) |

## 07에서 바뀐 것

| 항목 | 07 (Spring MVC) | 09 (Spring Boot) |
|---|---|---|
| 설정 | `web.xml` · `root-context.xml` · `servlet-context.xml` | `application.properties` 몇 줄 + 자동 설정 |
| 실행 | 톰캣에 war 배포 | `main()` 실행 → 내장 톰캣(포트 9090), 배포는 jar 하나 |
| 의존성 | 라이브러리마다 버전 | 스타터(`spring-boot-starter-webmvc` 등) + 부모 pom이 버전 관리 |
| DB 접근 | DAO 클래스가 `SqlSessionTemplate`에 `"namespace.id"` 문자열 | `@Mapper` 인터페이스 — namespace = 인터페이스 이름, id = 메서드 이름 |
| 성공 여부 | DAO가 `count > 0` | Mapper 메서드 반환형 `boolean` |
| 화면 | JSP + EL/JSTL (`WEB-INF/views`) | Thymeleaf (`resources/templates`) |
| 주입 | `@Autowired` 필드 | Lombok `@RequiredArgsConstructor` + `final` |
| DTO | getter·setter 직접 | `@Getter @Setter @ToString @NoArgsConstructor @AllArgsConstructor @Builder` |
| 주소 | 메서드마다 `/boardList.do` | 클래스에 `@RequestMapping("/thboard")` + 메서드에 `/boardlist` |
| 매개변수 이름 | `-parameters` 없이 컴파일하면 이름을 모름 | 부트 부모 pom이 `-parameters`로 컴파일 |

## 구조

```
09_hkboard_springboot/
├─ pom.xml                         Boot 4.1.1 · Java 21 · mybatis-spring-boot-starter 4.1.0
├─ src/main/java/com/hk/board/
│   ├─ HkboardSpringboot09Application.java   @SpringBootApplication + main()
│   ├─ controller/HomeController.java        GET / → home
│   ├─ controller/HkController.java          /thboard/* 게시판 요청
│   ├─ service/HkService.java                Mapper를 부르는 서비스
│   ├─ mapper/BoardMapper.java               @Mapper 인터페이스
│   └─ dtos/HkDto.java                       Lombok DTO
├─ src/main/resources/
│   ├─ application.properties      포트 · Thymeleaf · DB · MyBatis 위치
│   ├─ mybatis/BoardMapper.xml     namespace = com.hk.board.mapper.BoardMapper
│   └─ templates/*.html            home · boardlist · insertboardform · boarddetail · boardupdateform
└─ src/test/java/…/HkboardSpringboot09ApplicationTests.java
```

DB는 07과 같은 `hk` 데이터베이스의 `HKBOARD` 테이블(SEQ · ID · TITLE · CONTENT · REGDATE)을 쓴다.

## 실행하기

1. MariaDB에 `hk` 데이터베이스와 `HKBOARD` 테이블을 준비한다([실습 DB 준비 SQL](../../../setup/bootstrap-hk.sql)).
2. `src/main/resources/application.properties`의 `spring.datasource.password=YOUR_DB_PASSWORD`를 **자기 PC의 값으로** 바꾼다(저장소에는 넣지 않는다).
3. IDE에서 `HkboardSpringboot09Application`을 실행하거나, 이 폴더에서 `mvnw spring-boot:run`.
4. 브라우저로 `http://localhost:9090/` → 게시판 링크.

jar로 실행하려면 `mvnw package` 뒤 `java -jar target/hkboard_springboot09-0.0.1-SNAPSHOT.jar`. **이때 아래 "뷰 이름의 /" 문제로 글쓰기 · 상세 · 수정 화면이 500이 난다.**

## 정리하며 확인한 것

실제 MariaDB와 Antigravity로는 실행하지 않았다. 대신 **DB만 H2 메모리 DB(MariaDB 모드)로 바꾼 사본**을 만들어 폴더(`target/classes`) 실행과 jar 실행을 모두 해 봤다. H2에는 `SYSDATE()`가 없어 사본의 Mapper XML에서만 `CURRENT_TIMESTAMP`로 바꿨고, 저장소의 소스는 수업 그대로다.

| 요청 | 폴더에서 | jar로 |
|---|---|---|
| `GET /` · `GET /thboard/boardlist` | 200 | 200 |
| `GET /thboard/insertboardform` | 200 | **500** `Error resolving template [/insertboardform]` |
| `GET /thboard/boarddetail?seq=4` | 200 | **500** (같은 이유) |
| `GET /thboard/boardupdateform?seq=4` | 200 | **500** (같은 이유) |
| `POST /thboard/insertboard` · `POST /thboard/boardupdate` | 302 | 302 |
| `GET /thboard/muldel?chk=4` | 302 — **GET으로도 지워진다** | 302 |
| `GET /thboard/boarddetail` (seq 없음) | 500 — 기본형 `int`에 null을 넣을 수 없음 | 500 |
| `GET /thboard/boarddetail?seq=999` | 500 — 없는 글이라 `dto.id`에서 SpEL 오류 | 500 |
| `POST /thboard/boardupdate` (없는 seq) | 200 Whitelabel (`return "error"`) | 200 |

- **뷰 이름 앞의 `/`** — `return "/boarddetail";`은 `templates//boarddetail.html`이 된다. 폴더에서는 `//`를 너그럽게 읽지만 jar 안에는 그런 경로가 없다. `return "boarddetail";`로 쓰면 두 방식 모두 된다. redirect 주소(`redirect:/thboard/boardlist`)의 `/`는 괜찮다.
- **`-parameters`** — `javap`로 `MethodParameters`가 들어 있는 것을 확인했다. 그래서 08까지와 달리 `int seq`처럼 이름만 적어도 요청 값이 들어간다.
- **`th:onclick`** — Thymeleaf 3.1은 `th:on*` 속성에 숫자 · 참거짓만 허용한다. 문자열을 넘기려면 `data-*` 속성에 넣고 JS에서 읽는다.
- **Security 없이 `thymeleaf-extras-springsecurity6`** — 스타터가 주석이어도 앱은 정상으로 뜬다.

## 저장소에 포함하지 않은 것

| 제외 | 이유 |
|---|---|
| `target/` | 빌드 산출물 |
| `.mvn/wrapper/maven-wrapper.jar` | 래퍼가 처음 실행할 때 내려받는다 |
| `.vscode/` | 개인 IDE 설정 |
| DB 비밀번호 | `YOUR_DB_PASSWORD`로 바꿔 두었다. 나머지 줄은 수업 파일과 같다 |
