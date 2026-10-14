# 11_schedule_springboot — 일정관리(캘린더) 게시판 (Boot · Calendar · Thymeleaf)

2026-10-13(47일차) 수업의 로컬 소스다. 새 스프링 부트 프로젝트로 **일정관리 게시판**을 시작했다. 첫날은 달력 한 장까지 — 서버가 `java.util.Calendar`로 그 달 1일의 요일과 마지막 날을 구하고, Thymeleaf가 빈 칸 + 날짜 칸을 찍는다. 일정 SQL(`CalMapper.xml`)은 미리 써 두었지만 아직 부르는 코드는 없다.
[47일차](../../index.html#class-day47) · [개념 카드 78~79](../../index.html#web-78) · [개념서 41장](../../index.html#book-be-41)

## 현재 구현 범위 (2026-10-13)

| 구간 | 상태 |
|---|---|
| 첫 화면 `GET /` | `HomeController` → `index.html`("일정보기" 링크, 레이아웃 없음) |
| 달력 `GET /schedule/calendar?year=&month=` | `CalController` → `CalServiceImp.makeCalendar` → `calboard/calendar.html`. 값이 없으면 오늘 기준. 이전·다음 달(연) 링크 |
| 넘친 월 | `month=0` → 지난해 12월, `month=13` → 다음 해 1월(`Calendar` 자동 보정 + 보정된 값을 다시 읽음) |
| 잘못된 값 | `year=abc` · 빈 문자열은 `Integer.parseInt`에서 500(예외 처리 없음) |
| 일정 SQL | `insertCalBoard` · `calBoardList`(회원 `id` + `MDATE LIKE CONCAT(#{yyyyMMdd}, '%')`) · `calBoardDetail` · `calBoardUpdate` · `calMulDel` — **부르는 곳 없음** |
| 날짜 칸 | `<a href="#" class="d">` — 다음 단계(그날의 일정) 자리 |
| Spring Security | pom에서 스타터가 **주석** — 로그인 없이 열린다 |
| 테스트 | `contextLoads`의 `@Test`가 주석 |

## 구조

```
11_schedule_springboot/
├─ pom.xml                         Boot 4.1.1 · thymeleaf · layout-dialect · validation · MyBatis 4.1.0 · modelmapper 3.2.0(아직 안 씀)
├─ src/main/java/com/hk/board/
│   ├─ ScheduleSpringboot11Application.java
│   ├─ controller/HomeController.java       GET /
│   ├─ controller/CalController.java        GET /schedule/calendar
│   ├─ service/CalServiceImp.java           makeCalendar(year, month) → year · month · dayOfWeek · lastDay
│   ├─ mapper/CalMapper.java                @Mapper (일정 SQL 5개)
│   └─ dtos/CalDto.java                     seq · id · title · content · mdate(문자열) · regdate — Lombok
└─ src/main/resources/
    ├─ application.properties      포트 9090 · DB · MyBatis
    ├─ mybatis/CalMapper.xml
    ├─ static/css/layout.css       달력 칸 140px · 줄 1100px (7칸마다 줄 바꿈)
    └─ templates/  index · layouts/layout · fragments/header·footer · calboard/calendar
```

`calboard` 테이블을 만드는 SQL은 수업 자료에서 찾지 못했다. `INSERT INTO calboard VALUES(NULL,#{id},#{title},#{content},#{mdate},SYSDATE())`로 보면 컬럼 순서는 seq · id · title · content · mdate · regdate다.

## 선생님 레포(10/13)와 다른 점

`kang99king3/back_end_edu_20260629`의 `web_edu_20260910/schedule_springboot11`(10/13 13:53~15:44 커밋 6개)과 줄바꿈 · 공백을 무시하고 대조했다. 선생님 버전에 있는 것은 실습 폴더에 모두 있고, 실습 폴더에 더 있는 것:

| 파일 | 실습 폴더 | 선생님 레포 |
|---|---|---|
| `calendar.html` | 이전·다음 달(연) 링크 연결 | `href="#"` |
| `CalServiceImp` | `set` 뒤에 보정된 연·월을 다시 읽음 | 다시 읽지 않음(0월·13월이면 제목이 그대로) |
| `CalMapper.xml` | `AND`, DTD `-//mybatis.org//DTD Mapper 3.0//EN` | `ADN`(SQL 오타 — 아직 실행되지 않아 드러나지 않음), `//…DTD Config 3.0//EN` |
| `CalDto` | `lombok.ToString` · `java.sql.Date` | `groovy.transform.ToString` · `java.util.Date` |
| `pom.xml` | modelmapper 3.2.0 | 3.2.6 |
| `application.properties` | 포트 9090 · 실습 계정 | 포트 9080 |

선생님 `CalDto`의 `groovy.transform.ToString`은 `thymeleaf-layout-dialect`가 Groovy를 함께 가져와 컴파일은 되지만, 자바 컴파일러에서는 아무 일도 하지 않아 `toString()`이 만들어지지 않는다(두 버전을 컴파일해 `CalDto@7ba4f24f` / `CalDto(seq=0, id=null, title=회의, …)`로 확인).

## 실행하기

1. MariaDB `hk`에 `calboard` 테이블을 준비한다(위 컬럼 순서). 달력 화면만 볼 때는 SQL을 부르지 않는다.
2. `application.properties`의 `spring.datasource.password=YOUR_DB_PASSWORD`를 자기 PC의 값으로 바꾼다(저장소에는 넣지 않는다).
3. `ScheduleSpringboot11Application` 실행 또는 `mvnw spring-boot:run` → `http://localhost:9090/` → "일정보기".

## 정리하며 확인한 것

실제 MariaDB와 Antigravity로는 실행하지 않았다. 저장소 밖 사본에서 **DB만 H2 메모리 DB**로 바꾸고(설정 파일은 새로 씀) jar로 실행했다.

- **확인함** — 2000~2030년 372개월의 빈 칸 수 · 날짜 수가 JavaScript `Date` 계산과 모두 같다. `month=0` · `13` · `-11` · `25` 자동 보정, `year=abc` · 빈 값은 500.
- **확인함** — 폭 1500px 브라우저에서 칸 위치를 재면 2026년 10월 5줄, 2월(일요일 시작) 4줄, 8월(토요일 시작) 6줄. 머리줄(일~토) 1줄.
- **확인함** — Thymeleaf 3.1.5 `#numbers.sequence(1, 0)` = `[1, 0]` — 일요일 시작 달에는 `th:if` 가드가 필요하다.
- **확인하지 않음** — 실제 DB · Antigravity 실행, 일정 SQL(부르는 코드가 아직 없다).

## 저장소에 포함하지 않은 것

| 제외 | 이유 |
|---|---|
| `target/` | 빌드 산출물 |
| `.vscode/` · `.mvn/wrapper/maven-wrapper.jar` | 개인 IDE 설정 · 래퍼가 내려받는 파일 |
| DB 비밀번호 | `YOUR_DB_PASSWORD`로 바꿔 두었다. 나머지 줄은 수업 파일과 같다 |
