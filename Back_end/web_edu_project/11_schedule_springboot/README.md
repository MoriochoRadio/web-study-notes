# 11_schedule_springboot — 일정관리(캘린더) 게시판 (Boot · Calendar · Thymeleaf)

2026-10-13(47일차)~10-14(48일차) 수업의 로컬 소스다. 새 스프링 부트 프로젝트로 **일정관리 게시판**을 만들고 있다. 47일차에는 달력 한 장(서버가 `java.util.Calendar`로 그 달 1일의 요일과 마지막 날을 구하고, Thymeleaf가 빈 칸 + 날짜 칸을 찍는다), 48일차에는 날짜 칸에서 **일정 추가**와 선생님 과제 **그날의 일정 목록**을 만들었다.
[47일차](../../index.html#class-day47) · [48일차](../../index.html#class-day48) · [개념 카드 78~81](../../index.html#web-78) · [개념서 41~42장](../../index.html#book-be-41)

## 현재 구현 범위 (2026-10-14)

| 구간 | 상태 |
|---|---|
| 첫 화면 `GET /` | `HomeController` → `index.html`("일정보기" 링크, 레이아웃 없음) |
| 달력 `GET /schedule/calendar?year=&month=` | `CalController` → `CalServiceImp.makeCalendar` → `calboard/calendar.html`. 값이 없으면 오늘 기준. 이전·다음 달(연) 링크 |
| 넘친 월 | `if (month > 12) { month = 1; year++; }` · `if (month < 1) { month = 12; year--; }` — 화면 링크(±1)용. `month=25`는 2027년 1월(한 번만 고침) |
| 일정 추가 폼 `GET /schedule/addcalboardform?year=&month=&date=` | 쿼리스트링이 `InsertCalCommand`에 바인딩되어 연·월·일 셀렉트가 미리 골라짐, 시·분은 `LocalTime.now()` |
| 일정 저장 `POST /schedule/addcalboard` | `@Validated` + `BindingResult`(아이디·제목·내용 `@NotBlank`, 연·월·일·시·분 `@NotNull`) → `insertCalBoard`가 `isTwo`로 12자리 `mdate`(`yyyyMMddHHmm`) → `RedirectAttributes`로 `/schedule/calendar?year=&month=` |
| 그날의 일정 목록 `GET /schedule/calboardlist?year=&month=&date=` (과제) | 값이 없으면 오늘, 회원 아이디는 로그인 전이라 `@RequestParam(defaultValue = "hk")` → 8자리 `yyyyMMdd` + Map → `calBoardList`(`MDATE LIKE CONCAT(#{yyyyMMdd}, '%')`) → `calboardlist.html`(체크박스 · 일정 시간 · 제목 · 작성일, 전체 선택) |
| 아직 부르지 않는 SQL | `calBoardDetail` · `calBoardUpdate` · `calMulDel`(목록 체크박스의 `seq`로 이어질 예정) |
| 잘못된 값 | 달력 `year=abc` · 빈 문자열은 `Integer.parseInt`에서 500. 추가 폼을 값 없이 열면 500(연도 셀렉트의 `year - 5`가 `null`). 목록 `date=`(빈 값)는 1~9일 일정이 섞임 |
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
│   ├─ mapper/CalMapper.java                @Mapper (일정 SQL 5개)
│   └─ dtos/CalDto.java                     seq · id · title · content · mdate(문자열) · regdate — Lombok
└─ src/main/resources/
    ├─ application.properties      포트 9090 · DB · MyBatis
    ├─ mybatis/CalMapper.xml
    ├─ static/css/layout.css       달력 칸 140px · 줄 1100px (7칸마다 줄 바꿈)
    └─ templates/  index · layouts/layout · fragments/header·footer · calboard/calendar · addcalboardform · calboardlist
```

`calboard` 테이블을 만드는 SQL은 수업 자료에서 찾지 못했다. `INSERT INTO calboard VALUES(NULL,#{id},#{title},#{content},#{mdate},SYSDATE())`로 보면 컬럼 순서는 seq · id · title · content · mdate(12자리 문자열) · regdate다.

## 선생님 레포(10/14)와 다른 점

10/14 아침 실습 폴더를 `kang99king3/back_end_edu_20260629`의 `web_edu_20260910/schedule_springboot11` 그대로 받고, 이 PC용으로 네 곳을 다시 맞췄다(15:25 push까지 따라잡음). 그래서 47일차 실습 폴더에만 있던 "보정된 연·월을 다시 읽는 두 줄"은 선생님의 `if` 보정으로 바뀌었다 — 10/13 그대로의 코드는 이 저장소의 커밋 `48116a8`에 있다. 줄바꿈 · 공백을 무시하고 대조한 차이:

| 파일 | 실습 폴더 | 선생님 레포 |
|---|---|---|
| `application.properties` | 포트 9090 · 실습 계정 | 포트 9080 · `root` |
| `CalDto` | `lombok.ToString` | `groovy.transform.ToString` — 컴파일은 되지만 자바에서는 `toString()`이 만들어지지 않음 |
| `CalMapper.xml` | `AND`, DTD `-//mybatis.org//DTD Mapper 3.0//EN` | `ADN`(목록 SQL 오타 — 선생님 코드는 아직 이 SQL을 부르지 않지만, 과제처럼 연결하면 SQL 문법 오류가 난다. SQL 문법으로 따진 결과), `//…DTD Config 3.0//EN` |
| 과제 풀이 | `calendar.html` 날짜 링크, `CalController` · `CalServiceImp`의 `calBoardList`, `calboardlist.html` 완성, 풀이 노트 | 주석 세 줄과 "목록 내용: checkbox, mdate, title, regdate" 한 줄 |

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
- **확인하지 않음** — 실제 DB · Antigravity 실행. 풀이 노트의 "로컬 MariaDB로 확인" 표는 노트를 쓸 때의 기록이며 이번 정리에서 다시 확인하지 않았다.

## 저장소에 포함하지 않은 것

| 제외 | 이유 |
|---|---|
| `target/` | 빌드 산출물 |
| `.vscode/` · `.mvn/wrapper/maven-wrapper.jar` | 개인 IDE 설정 · 래퍼가 내려받는 파일 |
| DB 비밀번호 | `YOUR_DB_PASSWORD`로 바꿔 두었다. 나머지 줄은 수업 파일과 같다 |
