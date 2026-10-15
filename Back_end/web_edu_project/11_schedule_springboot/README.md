# 11_schedule_springboot — 일정관리(캘린더) 게시판 (Boot · Calendar · Thymeleaf)

2026-10-13(47일차)~10-15(49일차) 수업의 로컬 소스다. 새 스프링 부트 프로젝트로 **일정관리 게시판**을 만들고 있다. 47일차에는 달력 한 장(서버가 `java.util.Calendar`로 그 달 1일의 요일과 마지막 날을 구하고, Thymeleaf가 빈 칸 + 날짜 칸을 찍는다), 48일차에는 날짜 칸에서 **일정 추가**와 선생님 과제 **그날의 일정 목록**을, 49일차에는 **여러 개 삭제 · 상세보기 · 수정**과 **달력 칸마다 일정 3개 미리 보기**를 만들었다.
[47일차](../../index.html#class-day47) · [48일차](../../index.html#class-day48) · [49일차](../../index.html#class-day49) · [개념 카드 78~84](../../index.html#web-78) · [개념서 41~43장](../../index.html#book-be-41)

## 현재 구현 범위 (2026-10-15)

| 구간 | 상태 |
|---|---|
| 첫 화면 `GET /` | `HomeController` → `index.html`("일정보기" 링크, 레이아웃 없음) |
| 달력 `GET /schedule/calendar?year=&month=` | `CalController` → `CalServiceImp.makeCalendar` → `calboard/calendar.html`. 값이 없으면 오늘 기준. 이전·다음 달(연) 링크 |
| 넘친 월 | `if (month > 12) { month = 1; year++; }` · `if (month < 1) { month = 12; year--; }` — 화면 링크(±1)용. `month=25`는 2027년 1월(한 번만 고침) |
| 일정 추가 폼 `GET /schedule/addcalboardform?year=&month=&date=` | 쿼리스트링이 `InsertCalCommand`에 바인딩되어 연·월·일 셀렉트가 미리 골라짐, 시·분은 `LocalTime.now()` |
| 일정 저장 `POST /schedule/addcalboard` | `@Validated` + `BindingResult`(아이디·제목·내용 `@NotBlank`, 연·월·일·시·분 `@NotNull`) → `insertCalBoard`가 `isTwo`로 12자리 `mdate`(`yyyyMMddHHmm`) → `RedirectAttributes`로 `/schedule/calendar?year=&month=` |
| 그날의 일정 목록 `GET /schedule/calboardlist?year=&month=&date=` | `@RequestParam Map`으로 받아 `"%04d%02d%02d".formatted`로 8자리 → `calBoardList`(`MDATE LIKE CONCAT(#{yyyyMMdd}, '%')`), 회원 아이디는 Controller의 `"hk"`(로그인 전). 날짜는 `${@util.toDates(dto.mdate,'yyyy.MM.dd HH:mm')}`. 48일차 과제 풀이(`defaultValue = "hk"`, 값이 없으면 오늘)는 49일차에 선생님 코드로 바뀌었다 — 10/14 코드는 커밋 `1ed4a76` |
| 여러 개 삭제 `POST /schedule/calmuldel` | 체크박스 `seq` → `DeleteCalCommand`(`String[]` · `@NotEmpty`), 10개 초과는 `result.rejectValue`, `calMulDel`(`foreach` → `IN (…)`), 숨은 칸 `year · month · date`로 그날 목록에 redirect |
| 상세보기 `GET /schedule/calboarddetail?seq=` | `WebConfig`의 `@Bean ModelMapper`로 `CalDto` → `UpdateCalCommand`, `mdate`는 `mdateToYMDHM`으로 연·월·일·시·분. 화면이 곧 수정 폼 |
| 수정 `POST /schedule/calboardupdate` | 선생님 마지막 push(10/15 15:49) 뒤 실습 폴더에 더해짐 — `@Validated` → 12자리로 합쳐 `UPDATE`(`id`는 바꾸지 않음) → 수정한 날짜의 목록으로 redirect |
| 달력 칸 미리 보기 | 실습 폴더에 더해짐 — `makeCalendar`가 `calViewList`(`MDATE LIKE 'yyyyMM%'`)로 그 달 일정을 한 번에 `clist`로, `Util.getCalView`가 칸마다 3개까지 `<p>` 문자열을 조립해 `th:utext`. **제목을 이스케이프하지 않는다**(아래 확인 참고) |
| 잘못된 값 | 달력 `year=abc` · 빈 문자열은 500. 목록을 값 없이 · 빈 값으로 열면 500. 상세를 없는 번호 · 번호 없이 열면 500(`source cannot be null`). 추가 폼을 값 없이 열면 500 |
| Spring Security | pom에서 스타터가 **주석** — 로그인 없이 열린다 |
| 테스트 | `contextLoads`의 `@Test`가 주석 |

## 구조

```
11_schedule_springboot/
├─ pom.xml                         Boot 4.1.1 · thymeleaf · layout-dialect · validation · MyBatis 4.1.0 · modelmapper 3.2.6(아직 안 씀)
├─ 과제풀이_일정목록조회.md          과제(일정 목록 조회) 풀이 노트 — 흐름 · 파일별 설명 · 확인 표 · 스스로 확인
├─ src/main/java/com/hk/board/
│   ├─ ScheduleSpringboot11Application.java
│   ├─ controller/HomeController.java       GET /
│   ├─ controller/CalController.java        GET calendar · GET addcalboardform · POST addcalboard · GET calboardlist(과제)
│   ├─ service/CalServiceImp.java           makeCalendar · insertCalBoard · calBoardList(과제) · isTwo
│   ├─ command/InsertCalCommand.java        일정 입력폼: id · title · content · year · month · date · hour · min (검사 애너테이션)
│   ├─ command/DeleteCalCommand.java        여러 개 삭제: String[] seq (@NotEmpty)
│   ├─ command/UpdateCalCommand.java        수정 폼 + mdateToYMDHM
│   ├─ config/WebConfig.java                @Bean ModelMapper
│   ├─ utils/Util.java                      @Component("util") — toDates · getCalView (템플릿에서 @util)
│   ├─ mapper/CalMapper.java                @Mapper (일정 SQL 5개)
│   └─ dtos/CalDto.java                     seq · id · title · content · mdate(문자열) · regdate — Lombok
└─ src/main/resources/
    ├─ application.properties      포트 9090 · DB · MyBatis
    ├─ mybatis/CalMapper.xml
    ├─ static/css/layout.css       달력 칸 140px · 줄 1100px (7칸마다 줄 바꿈)
    └─ templates/  index · layouts/layout · fragments/header·footer · calboard/calendar · addcalboardform · calboardlist · calboarddetail
```

`calboard` 테이블을 만드는 SQL은 수업 자료에서 찾지 못했다. `INSERT INTO calboard VALUES(NULL,#{id},#{title},#{content},#{mdate},SYSDATE())`로 보면 컬럼 순서는 seq · id · title · content · mdate(12자리 문자열) · regdate다.

## 선생님 레포(10/15)와 다른 점

10/14 아침부터 실습 폴더를 `kang99king3/back_end_edu_20260629`의 `web_edu_20260910/schedule_springboot11` 그대로 받고, 이 PC용으로 다시 맞췄다(10/15 15:49 push까지 따라잡음). 선생님이 10/15 10:52에 `ADN` 오타를 고쳐, 지금 다른 곳은 아래 표와 같다. 그 뒤 실습 폴더에 **일정 수정**(`CalController` · `CalServiceImp`의 `calBoardUpdate`)과 **달력 칸 미리 보기**(`CalMapper`의 `calViewList` · `makeCalendar`의 `clist` · `Util.getCalView` · `calendar.html`)가 더해졌다(선생님 `Util`에는 "파리미터(list객체, 해당 일(date))" 주석만 있다). 그래서 47일차 실습 폴더에만 있던 "보정된 연·월을 다시 읽는 두 줄"은 선생님의 `if` 보정으로 바뀌었다 — 10/13 그대로의 코드는 이 저장소의 커밋 `48116a8`에 있다. 줄바꿈 · 공백을 무시하고 대조한 차이:

| 파일 | 실습 폴더 | 선생님 레포 |
|---|---|---|
| `application.properties` | 포트 9090 · 실습 계정 | 포트 9080 · `root` |
| `CalDto` | `lombok.ToString` | `groovy.transform.ToString` — 컴파일은 되지만 자바에서는 `toString()`이 만들어지지 않음 |
| `CalMapper.xml` | DTD `-//mybatis.org//DTD Mapper 3.0//EN` | `//…DTD Config 3.0//EN`(`ADN` 오타는 10/15 10:52 커밋 "코드수정"에서 `AND`로 고침) |
| 수정 · 달력 미리 보기 | 위 두 가지 | 수정 폼의 `th:action`과 SQL만 있고 Controller · Service 없음, 미리 보기 자리는 주석 |
| 풀이 노트 | `과제풀이_일정목록조회.md`(48일차 과제 풀이 — 설명하는 코드는 49일차에 선생님 코드로 바뀜) | 없음 |

선생님 `CalDto`의 `groovy.transform.ToString`은 `thymeleaf-layout-dialect`가 Groovy를 함께 가져와 컴파일은 되지만 아무 일도 하지 않는다(10/13에 두 버전을 컴파일해 `CalDto@7ba4f24f` / `CalDto(seq=0, id=null, title=회의, …)`로 확인).

## 실행하기

1. MariaDB `hk`에 `calboard` 테이블을 준비한다(위 컬럼 순서, `seq`는 자동 증가).
2. `application.properties`의 `spring.datasource.password=YOUR_DB_PASSWORD`를 자기 PC의 값으로 바꾼다(저장소에는 넣지 않는다).
3. `ScheduleSpringboot11Application` 실행 또는 `mvnw spring-boot:run` → `http://localhost:9090/` → "일정보기" → 날짜 칸의 "추가"로 일정을 넣고, 날짜 숫자를 눌러 그날의 목록을 본다.

## 정리하며 확인한 것

실제 MariaDB와 Antigravity로는 실행하지 않았다. 저장소 밖 사본에서 **DB만 H2 메모리 DB**로 바꾸고(설정 파일은 새로 씀, `calboard`는 `schema.sql`로 만듦, H2에 없는 `SYSDATE()`는 사본의 Mapper에서만 `CURRENT_TIMESTAMP`) jar로 실행했다.

- **확인함(47일차)** — 2000~2030년 372개월의 빈 칸 수 · 날짜 수가 JavaScript `Date` 계산과 모두 같다. 폭 1500px 브라우저에서 2026년 10월 5줄, 2월 4줄, 8월 6줄. Thymeleaf 3.1.5 `#numbers.sequence(1, 0)` = `[1, 0]`.
- **확인함(48일차)** — 달력의 날짜 31칸에 목록 · 추가 링크, `month=13` · `0` · `25` · `-11` → 2027-1 · 2025-12 · 2027-1 · 2025-12. 추가 폼 기본값(연 셀렉트 11개, 월 · 일이 링크 값), 빈칸 저장은 같은 폼 + 메시지 3개, 정상 저장은 302로 그 달 달력 · `mdate 202610140905`. 목록은 시간순, 한 자리 월 · 일(9/5), 없는 날("등록된 일정이 없습니다."), 값 없음(오늘), `?id=other`. 내장 브라우저로 날짜 클릭 → 목록, 전체 선택 · 해제.
- **확인함(48일차, 구멍)** — 목록 `date=`(빈 값)는 `isTwo("")` = `"0"`이라 `LIKE '2026100%'` → 10월 3일 일정이 나왔다. 9월 31일도 저장된다(일 셀렉트가 늘 1~31).
- **확인함(49일차)** — 목록 시간순(`2026.10.15 09:00` 모양), 삭제 0개 · 11개는 메시지와 같은 목록, 10개는 성공 후 그날 목록, 상세 셀렉트 2026/10/15/12/30, 수정으로 날짜를 옮기면 새 날 목록에만 보임, 빈칸 수정은 메시지 2개, 폼의 아이디를 바꿔 보내도 저장된 아이디는 그대로(`UPDATE`가 `id`를 안 바꿈 — 대신 누구의 일정이든 번호만 알면 고칠 수 있다). 달력 칸에는 4개 중 3개, 6글자 넘는 제목은 `…`, 다른 달 일정은 빠짐.
- **확인함(49일차, 구멍)** — 미리 보기가 제목을 그대로 HTML에 넣어(`th:utext`) 제목 `<!--` 하나로 다음 날(23일) 칸이 사라지고, `<b>굵게`는 그 뒤 날짜를 모두 굵게 만든다(헤드리스 Edge로 그려 확인). 고치려면 `HtmlUtils.htmlEscape(title)` 또는 목록을 넘겨 `th:each` + `th:text`. `toDates`는 9월 31일을 9월 30일로 바꿔 보여 준다(`LocalDateTime.parse` 기본 `ResolverStyle.SMART`).
- **확인하지 않음** — 실제 DB · Antigravity 실행, 위 고치는 법으로 바꾼 코드. 풀이 노트의 "로컬 MariaDB로 확인" 표는 노트를 쓸 때의 기록이며 이번 정리에서 다시 확인하지 않았다.

## 저장소에 포함하지 않은 것

| 제외 | 이유 |
|---|---|
| `target/` | 빌드 산출물 |
| `.vscode/` · `.mvn/wrapper/maven-wrapper.jar` | 개인 IDE 설정 · 래퍼가 내려받는 파일 |
| DB 비밀번호 | `YOUR_DB_PASSWORD`로 바꿔 두었다. 나머지 줄은 수업 파일과 같다 |
