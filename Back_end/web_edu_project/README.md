# web_edu_project — 웹 개발 수업 실습 소스

> 최신 상태: 2026-09-22(36일차) 기준. 01 회원·구매, 02 MVC1 게시판,
> 03 Servlet 기초, 04 MVC2 전환, 05 EL·JSTL, 06 스프링 MVC 프로젝트를 포함한다.
> [소스 대조 기록](../teacher-sync-2026-09-18.md) · [최신 수업 노트](../index.html#class-day36)
> 아래 날짜별 기록은 당시의 상태다. 현재 다중 삭제와 error.jsp는 추가되었다.
> 04와 05의 차이는 [05 섹션](#05_hkboard_mvc2_jstl--el--jstl로-스크립틀릿-걷어내기)에,
> 05에서 06으로 넘어가며 무엇이 사라졌는지는 [06 섹션](#06_spring_template--스프링-mvc-첫-프로젝트)에 정리했다.


🛠️ 새 컴퓨터라면 **[개발환경 준비 안내](https://moriochoradio.github.io/web-study-notes/setup/#java-web)**부터 진행하세요. Eclipse Import · JDK/Tomcat 연결 · [실습 DB 준비 SQL](../../setup/bootstrap-hk.sql) · JDBC 설정을 한 순서로 정리했습니다.

취업아카데미 백엔드 과정의 **웹 개발(JSP · Servlet) 수업** 실습 프로젝트입니다.
2026-09-10(28일차)부터 **Eclipse JEE + Tomcat 10.1** 환경에서 진행하고 있습니다.

정리된 학습 노트는 대시보드의 **🖥️ 웹 개발** 탭에서 볼 수 있습니다
→ https://moriochoradio.github.io/web-study-notes/Back_end/#web-01

## 프로젝트 목록

| 폴더 | 무엇을 다루나 | 노트 |
|---|---|---|
| [`01_userboard_sepa`](01_userboard_sepa) | DTO·DAO·JDBC 6단계, JSP로 회원·구매 CRUD 화면 만들기 (파일 하나 = 화면 하나) | web-01~16 |
| [`02_hkboard_MVC1`](02_hkboard_MVC1) | 상속으로 DAO 접속 코드 중복 없애기, `command` 파라미터로 분기하는 첫 컨트롤러 | web-17~18 |
| [`03_hello_servlet`](03_hello_servlet) | Servlet 기초 — 요청 처리와 생명주기, `@WebServlet` 매핑, DB 없이 동작 확인 | web-26~28 |
| [`04_hkboard_MVC2`](04_hkboard_MVC2) | 요청 분기를 JSP에서 Servlet으로. `*.board` URL 매핑 + `getRequestURI()`, Filter로 UTF-8 처리 | web-29~31 |
| [`05_hkboard_MVC2_JSTL`](05_hkboard_MVC2_JSTL) | **04를 복사해 화면만 EL·JSTL로 교체.** 자바 코드는 그대로 두고 스크립틀릿을 걷어낸다 | web-32~37 |
| [`06_spring_template`](06_spring_template) | **스프링 MVC 첫 프로젝트.** Maven·DispatcherServlet·ViewResolver — 직접 짜던 분기 코드가 사라진다 | web-38~40 |

## 개발 환경

| 항목 | 버전 |
|---|---|
| WAS | Apache Tomcat 10.1 (Servlet 6.0 / JSP 3.1) |
| JDK | 21 |
| IDE | Eclipse IDE for Enterprise Java and Web Developers (2026-03) |
| DB | MariaDB 12.3 |
| JDBC 드라이버 | mariadb-java-client 3.3.3 |

> **Tomcat 10부터 패키지가 `javax.servlet` → `jakarta.servlet`으로 바뀌었습니다.**
> 인터넷 예제에 `import javax.servlet.*`이 있으면 Tomcat 9 이하 기준이라 그대로는 컴파일되지 않습니다.

## 01_userboard_sepa — 회원·구매 관리

이름 끝의 `sepa`는 **separation(분리)** 입니다.
데이터를 담는 일 · DB에 접근하는 일 · 실행해 보는 일을 각각 다른 패키지로 나눴습니다.

```
01_userboard_sepa/
├─ src/main/java/com/hk/board/
│   ├─ dto/userDto.java      회원 한 명을 담는 상자
│   ├─ dto/BuyDto.java       구매 한 건을 담는 상자
│   ├─ dao/UserDao.java      회원 CRUD 5종
│   ├─ dao/BuyDao.java       구매 CRUD 5종
│   └─ main/UserMain.java    화면 없이 DAO 를 시켜 보는 테스트 클래스
└─ src/main/webapp/
    ├─ index.jsp             메인 — 회원 / 구매 두 갈래
    ├─ userList.jsp          회원 목록 (이름 클릭 → 상세, 삭제 링크)
    ├─ userDetail.jsp        회원 상세 + 수정 폼
    ├─ userUpdate.jsp        수정 처리        (화면 없음)
    ├─ userDel.jsp           삭제 처리        (화면 없음)
    ├─ userInsertFrom.jsp    신규 회원 입력 폼
    ├─ userInsert.jsp        등록 처리        (화면 없음)
    ├─ buyList.jsp           구매 목록
    ├─ buyDetail.jsp         구매 상세 + 수정 폼
    ├─ buyUpdate.jsp         구매 수정 처리   (화면 없음)
    ├─ buyDel.jsp            구매 삭제 처리   (화면 없음)
    ├─ buyInsertForm.jsp     구매 등록 폼
    ├─ buyInsert.jsp         구매 등록 처리   (화면 없음)
    ├─ error.jsp             공통 에러 화면
    └─ WEB-INF/
        ├─ web.xml           배포 서술자 (Jakarta EE 6.0)
        └─ lib/              ← JDBC 드라이버 jar 를 여기에 (저장소에는 미포함)
```

화면을 그리는 JSP와 **일만 하고 화면이 없는 처리 JSP**가 섞여 있습니다.
이 구조를 **MVC1**이라 부르고, 다음 진도인 MVC2에서는 처리 부분이 **서블릿(컨트롤러)** 으로 빠집니다.

| 클래스 | 하는 일 |
|---|---|
| `userDto` | 회원 한 명의 정보를 담는 상자. 멤버필드 8개 + `toString()` + `Serializable`. 수정 화면용 **5개짜리 생성자**를 오버로딩해 두었다. |
| `BuyDto` | 구매 한 건(`num`·`userId`·`proudName`·`groupName`·`price`·`amount`). |
| `UserDao` | `getAllUser` · `getUser` · `insertUser` · `updateUser` · `deleteUser` |
| `BuyDao` | `getAllBuy` · `getBuy` · `insertBuy` · `updateBuy` · `deleteBuy` |
| `UserMain` | DAO 를 불러 결과를 출력하는 테스트용 실행 클래스. **SQL도 커넥션도 모른다.** |

`UserDao`의 두 메서드는 **자원 반납 방식이 서로 달라서** 비교하기 좋습니다.

- `getAllUser()` — `finally`에서 직접 `close()`. JDBC 6단계를 `println`으로 하나씩 찍는다.
- `insertUser()` — **try-with-resources**. `close()`를 쓴 곳이 없어 "6단계" 메시지도 없지만, 자바가 자동으로 닫아 준다.

## 실행하기

### 1) 실습 DB 만들기

교육자료의 `userTbl` 스키마 그대로입니다.

```sql
CREATE DATABASE IF NOT EXISTS hk;
USE hk;

CREATE TABLE userTbl (
  userId    CHAR(8)     NOT NULL PRIMARY KEY,
  name      VARCHAR(10) NOT NULL,
  birthYear INT         NOT NULL,
  addr      CHAR(2)     NOT NULL,
  mobile1   CHAR(3),
  mobile2   CHAR(8),
  height    SMALLINT,
  mDate     DATE
);

CREATE TABLE buyTbl (
  num       INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
  userID    CHAR(8)  NOT NULL,
  prodName  CHAR(6)  NOT NULL,
  groupName CHAR(4),
  price     INT      NOT NULL,
  amount    SMALLINT NOT NULL,
  FOREIGN KEY (userID) REFERENCES userTbl(userID)   -- 이 제약이 삭제를 막는다
);

INSERT INTO userTbl VALUES
  ('LSG','이승기',1987,'서울','011','11111111',182,'2008-8-8'),
  ('KBS','김범수',1979,'경남','011','22222222',173,'2012-4-4'),
  ('KKH','김경호',1971,'전남','019','33333333',177,'2007-7-7');

INSERT INTO buyTbl VALUES
  (NULL,'KBS','운동화',NULL,   30, 2),
  (NULL,'KBS','노트북','전자',1000,1),
  (NULL,'LSG','모니터','전자', 200,1);
```

> **외래키를 걸어 두었기 때문에**, 구매 이력이 있는 `KBS`는 화면에서 삭제하려 하면 거부됩니다
> (`Cannot delete or update a parent row`). 이력이 없는 `KKH`는 정상적으로 지워집니다.
> 의도된 동작이니 에러가 아니라 **DB가 데이터를 지켜 준 것**으로 읽으면 됩니다.

### 2) JDBC 드라이버 넣기

용량 때문에 저장소에 넣지 않았습니다. [MariaDB Connector/J](https://mariadb.com/downloads/connectors/)에서
`mariadb-java-client-3.3.3.jar`(또는 그 이상)를 받아 아래 위치에 둡니다.

```
src/main/webapp/WEB-INF/lib/mariadb-java-client-3.3.3.jar
```

`WEB-INF/lib`의 jar는 **서버가 자동으로 클래스패스에 넣어 주므로** 따로 설정할 필요가 없습니다.

### 3) DB 비밀번호 채우기

**공개 저장소라서 비밀번호를 뺐습니다.** `UserDao.java`와 `BuyDao.java`의 **CRUD 메서드마다 한 곳씩, 모두 10곳**을 채워야 동작합니다.

```java
String password = "";   // ← 여기에 DB 비밀번호
```

> 원래는 이렇게 소스에 직접 적지 않고 **`WEB-INF` 안의 설정 파일로 빼는 것**이 맞습니다.
> `WEB-INF` 안은 브라우저가 URL로 직접 요청할 수 없어서, 설정 파일을 숨기는 자리로 쓰입니다.
> 수업 진도가 나가면 그렇게 바꿀 예정입니다.

### 4) 실행

**화면 없이 DAO 만 확인**하려면 `UserMain.java` → 우클릭 → Run As → Java Application.

```
1단계: 드라이버 로딩 성공
2단계: DB연결 성공
3단계: 쿼리준비 성공
4단계: 쿼리실행 성공
5단계: 쿼리결과 받기 성공
6단계: DB닫기 성공
userDto [userId=KBS, name=김범수, birthYear=1979, addr=경남, ...]
userDto [userId=LSG, name=이승기, birthYear=1987, addr=서울, ...]
userDto [userId=KKH, name=김경호, birthYear=1971, addr=전남, ...]
```

단계마다 출력을 찍어 둔 덕분에 **실패하면 몇 단계에서 막혔는지** 바로 보입니다.
2단계에서 멈추면 접속 정보나 DB 기동 문제, 4단계에서 멈추면 SQL 문제입니다.

**브라우저에서 쓰려면** 프로젝트 우클릭 → Run As → Run on Server (Tomcat v10.1) 후
`http://localhost:8080/01_userboard_sepa/` 로 접속합니다.

## 저장소에 포함하지 않은 것

| 제외 | 이유 |
|---|---|
| `src/main/webapp/WEB-INF/lib/*.jar` | 배포처에서 받으면 되는 라이브러리 |
| `build/` (`.class`) | 소스에서 다시 만들어지는 산출물 |
| 워크스페이스의 `.metadata/`, `Servers/` | 이클립스 개인 설정 |
| DB 비밀번호 | 공개 저장소라 값을 비워 뒀습니다 |

## 앞으로

교육자료 기준 다음 진도입니다.

1. ~~**JSP 문법** — Tag · 기본 객체~~ (28~30일차에 진행)
2. ~~**MVC1** — 회원 관리 · 구매 목록~~ (30일차에 진행 — 지금 이 프로젝트)
3. **MVC2** — Servlet · JSTL · EL · MyBatis ← 다음
4. **심화** — 답변형 게시판, Connection Pool

## 고친 것 · 남긴 것

이 프로젝트는 수업에서 만든 그대로이지만, **평범하게 쓰다가 자바 에러 화면(HTTP 500)이
뜨던 곳은 고쳐 두었습니다.** 공부하다 막히지 않기 위해서입니다.

### 고친 것

| 위치 | 증상 | 조치 |
|---|---|---|
| `userDetail.jsp` | 없는(삭제된) 회원의 상세 주소를 열면 `NullPointerException` → 500 | `dto == null` 이면 `error.jsp` 로 |
| `buyDetail.jsp` | 없는 구매번호·숫자 아닌 `num` → `NullPointerException` / `NumberFormatException` | 파라미터 검사 + `dto == null` 검사 |
| `buyDel.jsp` | 숫자가 아닌 `num` → `NumberFormatException` | 파라미터 검사 |
| `userInsert.jsp` | 짝 없이 남은 `%>` 가 화면에 그대로 찍힘 | 삭제 |
| `userList.jsp` | 헤더 `<tr>` 미닫음으로 표가 중첩됨 / 4열인데 `colspan="5"` | `</tr>` 추가, `colspan="4"` |

톰캣 10.1에 배포해 **정상 경로 8개(전부 200)와 실패 경로 8개(전부 302 → `error.jsp`)** 를
확인했고, 회원·구매 CRUD를 한 바퀴 돌려 DB 반영까지 확인했습니다.

### 일부러 남긴 것

다음 진도에서 배울 내용이라, **지금 고치면 그 수업의 의미가 없어지는** 것들입니다.
설명은 대시보드의 [🖥️ 16. MVC1의 한계](https://moriochoradio.github.io/web-study-notes/Back_end/#web-16) 카드에 있습니다.

| 남긴 것 | 어디서 다루나 |
|---|---|
| `buyList.jsp` 의 `groupName` 이 NULL 일 때 `null` 이라는 글자가 나옴 | EL `${...}` 은 빈칸을 찍는다 — **EL·JSTL** |
| 실패 사유(외래키 위반·중복·연결 실패)가 전부 `error.jsp` 로 뭉뚱그려짐 | **예외 설계** |
| 처리 전용 JSP 가 `<html><body>` 껍데기를 갖고 있음 | 컨트롤러로 분리 — **MVC2** |
| `buyInsertForm.jsp` 에서 `num`(AUTO_INCREMENT) 을 손으로 입력받음 | 중복 입력 시 등록 실패. 설계를 바꿀지는 수업 진행에 맞춰 판단 |

> **JSP 주석의 함정** — 스크립틀릿 안 `//` 주석에 `%>` 를 쓰면 **거기서 자바 영역이 끝나 버립니다.**
> JSP 는 주석인지 따지지 않고 `%>` 만 찾기 때문입니다. 이 수정 작업 중에 실제로 한 번 걸렸습니다.

---

## 02_hkboard_MVC1 — 게시판, 컨트롤러 패턴의 시작

2026-09-15(31일차)부터 시작한 두 번째 프로젝트입니다. **01의 두 가지 불편함**을
바로 이어서 개선했습니다 — DAO마다 반복되던 접속 코드, 그리고 기능마다 파일을 새로 만들던 구조.

```
02_hkboard_MVC1/
├─ src/main/java/com/hk/board/
│   ├─ datasource/DataBase.java   DB 연결 전담 부모 클래스 (JDBC 1·2단계만)
│   ├─ dao/HkDao.java             DataBase 를 상속받아 CRUD (지금은 조회·등록만)
│   ├─ dto/HkDto.java             게시글 한 건을 담는 상자 (생성자 3종 오버로딩)
│   └─ test/MainTest.java         화면 없이 DAO 를 시켜 보는 테스트 클래스
└─ src/main/webapp/
    ├─ index.jsp                  메인 — 게시판목록 링크 하나
    ├─ boardController.jsp        요청을 command 파라미터로 분기하는 첫 컨트롤러
    ├─ boardlist.jsp              글 목록 화면 (컨트롤러가 forward 로 넘겨준다)
    └─ WEB-INF/web.xml
```

### 핵심 변화 두 가지

**1) DAO끼리 반복되던 접속 정보를 부모 클래스로 뺐다.**
어제(`01_userboard_sepa`)는 DAO 메서드마다 `url`·`user`·`password`를 반복해서 썼고,
비밀번호가 소스에 **10곳** 등장했습니다. 오늘은 `DataBase`라는 부모 클래스가
드라이버 로딩(1단계)과 연결(2단계)을 전담하고, `HkDao extends DataBase`로 물려받아
`getConnection()` 한 줄만 씁니다. 비밀번호가 등장하는 곳도 **1곳**으로 줄었습니다.

**2) 여러 화면의 창구 역할을 하는 컨트롤러가 등장했다.**
어제는 파일 하나가 화면 하나였습니다(`userList.jsp`, `userDetail.jsp`...).
오늘은 `boardController.jsp` 하나가 `command` 파라미터로 "무엇을 할지" 정하고,
실제 화면(`boardlist.jsp`)에는 `request.setAttribute` + `pageContext.forward`로
값을 넘깁니다. `sendRedirect`(브라우저가 새로 요청 — 주소창이 바뀜)와 달리
`forward`는 서버 안에서만 넘어가는 같은 요청이라 **주소창이 안 바뀝니다.**

### 실습 DB — `hk.hkboard`

```sql
USE hk;

CREATE TABLE hkboard (
  seq     INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
  id      VARCHAR(20)  NOT NULL,
  title   VARCHAR(100) NOT NULL,
  content TEXT,
  regdate DATE
);
```

> 수업 파일에는 스키마가 따로 없어서, `HkDto`·`HkDao`의 컬럼 구성(`SEQ, ID, TITLE, CONTENT, REGDATE`)과
> 어제 `userTbl`의 관례를 참고해 위와 같이 만들어 검증했습니다. 실제 수업에서 만든 스키마와
> 컬럼 길이가 다를 수 있습니다 — 다를 경우 이 파일을 알려 주시면 맞춰서 반영하겠습니다.

### 고친 것

| 위치 | 증상 | 조치 |
|---|---|---|
| `boardController.jsp` | `command` 파라미터 없이 열면(주소 오타 등) `NullPointerException` → 500 | `command == null` 이면 빈 문자열로 — 미구현 분기와 같은 방식으로 조용히 통과 |

### 9월 15일 기준 진행 상태

`command`가 `boardinsertform`·`boardinsert`일 때의 분기는 **코드 없이 주석만** 있습니다.
진행 중인 수업 코드라 자연스러운 상태이고, **다음 수업에서 이어서 채울 부분**이라 건드리지 않았습니다.


## 2026-09-16 오전 시점 — 글쓰기 폼과 강조 개념 (아래 수업 후 상태로 갱신)

- boardlist.jsp: 글쓰기 화면을 요청하는 JavaScript 함수와 표 스타일 추가.
- boardController.jsp: boardinsertform 분기에서 boardInsertForm.jsp로 redirect.
- boardInsertForm.jsp: POST form, hidden command, 작성자·제목 입력칸, 글내용 textarea 추가. **textarea의 name·제출 버튼·등록 분기는 아직 미구현**.
- 목록의 글추가 버튼에는 아직 이벤트가 연결되지 않았다. 함수 선언만으로 버튼이 동작하지 않는다.
- SQL 원본 5개는 저장소와 동일. Java 실행 코드는 비밀번호 제거·안내 주석 차이를 제외하고 동일.
- [강조 개념 19~24번](https://moriochoradio.github.io/web-study-notes/Back_end/#web-19):
  JSP 실행과 문법, 구현 패턴, scope, 파라미터와 객체 전달, 화면 이동, Web Server/WAS.
- 개념 예시는 수업 코드의 현재 구현 상태와 구별한다. 빈 기능을 완성된 것으로 표시하지 않는다.


## 2026-09-16 수업 후 — 게시판 CRUD와 전체 선택

- HkDao: getBoard(seq), updateBoard(dto), deleteBoard(dto) 추가.
- Controller: 등록 후 목록 재조회, 상세 dto 전달, 수정·단일 삭제 분기 추가.
- boardInsertForm.jsp: content name, 제출 버튼 추가. 목록의 글추가 이벤트 연결.
- boardDetail.jsp: 상세·수정 form, seq hidden, 단일 삭제 확인창.
- boardlist.jsp: 제목의 상세 링크, this.checked로 전체 선택/해제.
- 다중 삭제는 미구현: 목록 글삭제 버튼에 form·서버 다중 삭제 처리가 연결되지 않았다.
- 원본 보존: 수업 소스 동기화이며 다음 사항은 해결된 것으로 표시하지 않는다.
  getBoard의 미조회 결과가 빈 DTO여서 null 방어가 동작하지 않음, seq 숫자 검증 부재,
  수정 성공 script 두 번 출력, POST 인코딩 설정 확인 필요, 02 프로젝트 error.jsp 부재.
- DB 비밀번호는 공개본에서 계속 제외한다. Eclipse 원본은 이번에 수정하지 않았다.
- 코딩테스트 15회차 파일: 전화번호 가리기(PASS), 중고거래 상태 CASE(FAIL).
  SQL 표의 날짜/회차는 2026.09.14/14회차로 남아 있어 웹에 기록 불일치를 명시했다.

### 이번 갱신의 검증 범위

- 02 프로젝트 Java 소스 전체를 JDK 21로 컴파일했다. Tomcat에서 CRUD 전체를 다시 실행한 것은 아니다.
- 전화번호 제출 코드와 개선 코드를 길이 4~20의 17개 입력으로 비교했다.
- CASE 풀이를 별도 임시 MariaDB에서 세 상태·날짜 제외·ID 역순으로 확인했다. 수업 DB에는 접근하지 않았다.
- 학습 웹의 카드 이동·답안 펼치기·390px/1280px 가로 폭과 로컬 검사 6개를 확인했다.

## 2026-09-17~18 보충 — 실행 안내

- Eclipse에서 03_hello_servlet, 04_hkboard_MVC2를 Existing Projects로 불러온다. JDK 21, Tomcat 10.1을 사용한다.
- 03: `/03_hello_servlet/HelloServlet.do?param=hello`로 기본 요청을 확인한다. DB가 필요하지 않다.
- 04: Connector/J를 WEB-INF/lib에 둔다. DB는 기존 `hk.hkboard`를 공유한다.
- 04의 실행 프로세스에 `STUDY_DB_USER`, `STUDY_DB_PASSWORD`를 전달한다. `STUDY_DB_URL`을 생략하면 로컬 hk에 연결한다. 실제 값은 소스나 저장소에 적지 않는다.
- 04 시작 주소: `/04_hkboard_MVC2/boardlist.board`. 목록·등록까지 Servlet 전환 상태이며 상세·수정·삭제에는 기존 JSP 경로가 남아 있다.
- GitHub Pages는 학습 노트만 제공한다. JSP 실행은 로컬 Tomcat에서 확인한다.

### 검증 기록

최종 실행 결과는 [검증 기록](../sync-validation-2026-09-20.md)에 정리한다. 컴파일 통과와 기능 전체 완료를 구분한다.


## 05_hkboard_MVC2_JSTL — EL · JSTL로 스크립틀릿 걷어내기

2026-09-21(35일차). **04를 그대로 복사해 화면 그리는 방법만 바꾼 프로젝트**다.
기능이 늘지 않았기 때문에, 04와 나란히 놓으면 EL·JSTL이 무엇을 대신해 주는지가 그대로 드러난다.

### 먼저 확인해 둘 것 — 자바 코드는 바뀌지 않았다

`BoardController` · `HkDao` · `HkDto` · `EncodeFilter`를 04와 05에서 각각 컴파일해
클래스 파일을 바이트 단위로 비교했더니 **다섯 개 모두 동일**했다.
05에서 늘어난 것은 `WEB-INF/lib`의 JSTL jar 2개뿐이다.

즉 **05는 View 계층만 손댄 리팩터링**이고, 04와의 차이는 전부 `.jsp` 안에 있다.

### 04 ↔ 05 비교

| 관점 | 04_hkboard_MVC2 | 05_hkboard_MVC2_JSTL |
|---|---|---|
| Scope에서 값 꺼내기 | `<% HkDto dto=(HkDto)request.getAttribute("dto"); %>` | `${dto.title}` — 선언도 형변환도 없음 |
| 값 출력 | `<%= dto.getTitle() %>` | `${dto.title}` (내부적으로 `getTitle()` 호출) |
| 목록 반복 | `<% for(HkDto dto : list){ %> … <% } %>` | `<c:forEach items="${list}" var="dto"> … </c:forEach>` |
| 조건 분기 | 스크립틀릿 `if` | `<c:choose>` · `<c:when>` · `<c:otherwise>` |
| `import` 지시자 | `<%@page import="...HkDto"%>` 필요 | 불필요 |
| 필요한 라이브러리 | 없음 | JSTL **API + 구현** jar 2개 |
| 값이 `null`일 때 | 화면에 `null`이라고 찍힘 | 아무것도 출력하지 않음 |
| `list`가 `null`일 때 | `for`에서 NullPointerException | `<c:forEach>`가 0번 반복하고 지나감 |
| 태그 짝 확인 | `<% } %>`가 어느 블록을 닫는지 안 보임 | HTML과 같은 모양이라 중첩이 보임 |

### 핵심 학습 포인트 넷

**1. EL의 `${이름}`은 Scope를 순서대로 뒤진다**
page → request → session → application 순으로 찾고, 없으면 예외 대신 빈 문자열이다.
`${requestScope.dto.seq}`처럼 스코프를 직접 지정할 수도 있다.
Controller가 `request.setAttribute("list", …)`로 담은 **이름**이 화면 연결의 전부다.

**2. `${dto.title}`은 필드가 아니라 `getTitle()`을 부른다**
DTO의 getter 이름 규칙이 그대로 화면 문법이 된다. getter가 없으면 값을 읽지 못한다.

**3. JSTL은 표준이지만 Tomcat에 들어 있지 않다**

```
src/main/webapp/WEB-INF/lib/
  jakarta.servlet.jsp.jstl-api-3.0.1.jar   ← 규격(API)
  jakarta.servlet.jsp.jstl-3.0.1.jar       ← 구현체
```

```jsp
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
```

Tomcat 10부터 `javax` → `jakarta`로 바뀐 여파가 taglib URI에도 온다.
인터넷 예제의 `http://java.sun.com/jsp/jstl/core`를 그대로 쓰면 태그를 찾지 못한다.
**API jar만 넣으면 실행 시점에 구현이 없어 실패**하므로 두 개를 함께 넣는다.

**4. `<c:when>`·`<c:otherwise>`는 `<c:choose>`의 직속 자식이어야 한다**

```jsp
<c:choose>
    <c:when test="${empty list}">
        <tr><td colspan="5">--작성된 글이 없습니다.--</td></tr>
    </c:when>
    <c:otherwise>
        <c:forEach items="${list}" var="dto"> … </c:forEach>
    </c:otherwise>
</c:choose>
```

`</c:choose>`를 `<c:otherwise>`보다 먼저 닫으면
`Illegal use of <when>-style tag without <choose> as its direct parent` 예외로 500이 난다.
`empty`는 null · 빈 문자열 · 빈 컬렉션을 모두 true로 본다.

### 자주 걸리는 곳

- 이클립스 편집기에 `Unknown tag (c:forEach)` 표시가 남는 것은 **검증기가 jar를 아직 못 읽은 것**이다. 프로젝트 Refresh · Clean 으로 없어지며 실제 실행과는 별개다.
- `<c:forEach>`가 조용히 0번 반복하기 때문에, 목록이 비어 보일 때 **DB가 비었는지 Scope 이름이 틀렸는지**를 따로 확인해야 한다.

### 아직 남아 있는 것 (2026-09-21 시점)

"EL·JSTL로 바꿨다"와 "스크립틀릿이 한 줄도 없다"는 다른 이야기다. 현재 상태를 그대로 적어 둔다.

- `boardDetail.jsp` 맨 위에 `<%@page import="…HkDto"%>`와 `HkDto dto = (HkDto)request.getAttribute("dto");`가 아직 살아 있다. 본문은 이미 `${requestScope.dto.*}`로 바꿔서 **이 선언은 쓰이지 않는다.** 두 줄을 지우면 이 파일에서도 자바가 완전히 빠진다.
- `boardlist.jsp`의 같은 선언은 주석 처리되어 있고, `import` 지시자 두 줄이 남아 있다. 마찬가지로 지울 수 있다.
- `index.jsp`에 선언해 둔 `fmt` 태그 라이브러리는 아직 쓰지 않는다.

### 실행하기

01~04와 같다. `WEB-INF/lib`에 Connector/J와 JSTL jar 2개를 넣고, DB는 기존 `hk.hkboard`를 쓴다.
실행 프로세스에 `STUDY_DB_USER` · `STUDY_DB_PASSWORD`를 전달한다(`STUDY_DB_URL`을 생략하면 로컬 `hk`).
시작 주소는 `/05_hkboard_MVC2_JSTL/boardlist.board`.


## 2026-09-21 기록 — 조용히 실패하던 것들

같은 날 실행이 막혔던 원인과 조치다. **JSTL과는 무관한 문제였다.**

- **글쓰기가 계속 `error.jsp`로 튕겼다.** 같은 요청을 04에도 보내 보니 04도 똑같이 실패했다. 바뀐 쪽과 안 바뀐 쪽을 같이 돌려 보는 것으로 "05 코드 문제가 아니다"가 그 자리에서 갈렸다.
- 원인은 **DB 비밀번호 환경변수 부재**였다. 이클립스를 실행기 대신 탐색기에서 직접 켜면 `STUDY_DB_PASSWORD`가 프로세스에 없고, Tomcat은 이클립스의 환경을 물려받는다.
- `System.getenv("내가쓰는비밀번호")`처럼 이름 자리에 **값**을 적어 둔 코드가 있었다. `getenv`는 **환경변수 이름**으로 찾으므로 언제나 `null`이다. 01·02·04·05를 모두 `System.getenv("STUDY_DB_PASSWORD")`로 맞췄다.
- **DAO가 `SQLException`을 `printStackTrace()`로만 삼키고 있었다.** 그래서 "조회 실패"와 "글 0건"이 화면상 구분되지 않았다. `DataBase.printSqlError(step, e)`를 만들어 작업 이름 · SQLState · 벤더 오류코드 · 메시지를 한 줄로 남기도록 DAO의 catch 7곳을 바꿨다.
- `INSERT INTO HKBOARD VALUES(NULL,?,?,?,SYSDATE())`처럼 컬럼 목록을 생략하면 테이블이 바뀌는 순간 깨진다. `INSERT INTO HKBOARD(ID, TITLE, CONTENT, REGDATE) VALUES(?,?,?,SYSDATE())`로 명시하고 AUTO_INCREMENT인 `SEQ`는 DB에 맡겼다.
- `<c:choose>` 중첩 오류로 목록 화면이 500이었다. `</c:choose>`의 위치를 바로잡았다.

### 이번 갱신의 검증 범위

- 05의 Java 소스 전체를 **JDK 21로 컴파일**했다.
- 로컬 Tomcat 10.1에서 **목록 · 상세 · 글쓰기 폼 · 메인 페이지의 응답 코드와 렌더링 결과를 확인**했다. 글 3건이 표에 출력되는 것까지 확인했다.
- **수정 · 단일 삭제 · 다중 삭제는 이번에 실행으로 확인하지 않았다.** 04에서 동작하던 코드가 그대로이고 화면만 바뀌었지만, 실행 확인과 코드 동일성은 구분해 둔다.
- 04와 05의 클래스 파일 동일성은 컴파일 산출물 비교로 확인했다.
- 저장소 공개본에는 비밀번호를 적지 않는다. 로컬에서만 쓸 기본값이 필요하면 `getOrDefault`의 두 번째 인자로 두되, 공개 저장소에 올리지 않는다.


## 06_spring_template — 스프링 MVC 첫 프로젝트

2026-09-22(36일차)에 만든 **Maven 기반 스프링 웹 프로젝트**다. 게시판 기능은 아직 없고,
`/home.do` 요청 하나가 화면까지 도달하는 **최소 경로**만 갖춘 상태다.

```
06_spring_template/
├─ pom.xml                                   의존성 선언 (jar를 직접 넣지 않는다)
└─ src/main/
    ├─ java/com/hk/board/controller/
    │   └─ HomeController.java               @Controller + @RequestMapping
    └─ webapp/
        ├─ index.jsp                          home.do 로 가는 링크 한 줄
        └─ WEB-INF/
            ├─ web.xml                        리스너 · DispatcherServlet · 인코딩 필터
            ├─ spring/root-context.xml        전역 설정 (아직 비어 있다 — DB 자리)
            ├─ spring/appServlet/servlet-context.xml   component-scan · ViewResolver
            └─ views/home.jsp                 브라우저가 직접 열 수 없는 위치
```

### 05에서 06으로 — 내가 하던 일 중 무엇이 사라졌나

| 하던 일 | 05까지 | 06부터 |
|---|---|---|
| 라이브러리 챙기기 | jar를 받아 `WEB-INF/lib`에 직접 복사 | `pom.xml`에 **선언만** (의존성의 의존성까지 따라온다) |
| 요청 분기 | 내가 만든 `BoardController` 서블릿 + `getRequestURI()` + 조건문 | 스프링의 `DispatcherServlet` + `@RequestMapping` **표시** |
| 화면 이동 | `getRequestDispatcher("boardlist.jsp").forward(…)` — 경로를 직접 | `return "home"` — **이름만**, 경로는 ViewResolver가 조립 |
| 객체 생성 | 필요할 때 `new` | 컨테이너가 만들어 보관 (`@Controller` + `component-scan`) |
| 한글 인코딩 | 직접 작성한 `EncodeFilter` | 스프링의 `CharacterEncodingFilter`를 `web.xml`에 등록 |

DAO·DTO는 아직 그대로다. **바뀐 것은 "요청을 받아 화면까지 넘기는" 구간뿐**이다.

### 설정이 두 벌인 이유

`web.xml`이 XML 두 개를 가리킨다. 나누는 기준은 **"화면과 상관있는가"** 다.

- `root-context.xml` — `ContextLoaderListener`가 읽는다. DB·서비스처럼 **애플리케이션 전체**가 쓰는 것. 지금은 `<beans>` 껍데기만 있다.
- `servlet-context.xml` — `DispatcherServlet`이 읽는다. Controller·ViewResolver처럼 **화면에 딸린 것**.

`servlet-context.xml`의 네 줄이 각각 하는 일:

| 설정 | 하는 일 |
|---|---|
| `<mvc:annotation-driven/>` | `@Controller` 애너테이션 방식을 쓰겠다는 선언 |
| `<mvc:resources location="/resources/" mapping="/**"/>` | 정적 파일(js·css·img) 경로 |
| `InternalResourceViewResolver` | `prefix` + 이름 + `suffix` → `/WEB-INF/views/home.jsp` |
| `<context:component-scan base-package="com.hk.board"/>` | 이 패키지에서 `@Controller`를 찾아 컨테이너에 등록 |

`@Controller`는 **"등록해 달라"는 표시**일 뿐이고, 실제로 찾아 등록하는 것은 `component-scan`이다.
둘 중 하나만 있으면 동작하지 않는다.

### 눈여겨볼 것 두 가지

- **`/WEB-INF/views/` 아래의 JSP는 브라우저가 직접 열 수 없다.** 01~05에서는 JSP가 webapp 바로 아래에 있어 주소창에 쳐서 열 수 있었는데, 06부터는 **반드시 Controller를 거치도록** 구조가 강제한다.
- **`<scope>provided</scope>`** 는 "컴파일할 때는 필요하지만 서버가 이미 갖고 있으니 war에 넣지 말라"는 뜻이다. 서블릿·JSP API가 여기 해당하고, 넣으면 톰캣 것과 충돌한다.

### 아직인 것 (2026-09-22 시점)

수업 진도 그대로 두고, 무엇이 왜 미완인지만 적어 둔다.

- **`main.do`는 화면을 찾지 못한다.** `HomeController.main()`이 `"main"`을 돌려주도록 작성돼 있는데 `/WEB-INF/views/main.jsp`가 없다. "이름만 돌려주면 된다"의 뒷면으로, **이름과 파일이 어긋나도 컴파일 시점에는 아무도 알려 주지 않는다.**
- **`root-context.xml`이 비어 있다.** 반면 `pom.xml`에는 MyBatis·spring-jdbc·commons-dbcp2·MariaDB 드라이버가 이미 들어 있다 — **다음 진도가 DB 연동**이라는 예고다.
- **`<mvc:resources>`의 `mapping`이 `/**` 다.** 보통은 `/resources/**`처럼 좁게 잡는다. 지금은 매핑이 `*.do`뿐이고 핸들러 매핑이 먼저 조회되어 문제가 없지만, 범위를 좁히는 편이 의도가 분명하다.

### 실행하기

01~05와 달리 **Maven 프로젝트**라 `WEB-INF/lib`에 jar를 넣지 않는다. Eclipse에서 Import 후
`Maven > Update Project`로 의존성을 받고, Tomcat 10.1에 올린 뒤 `/06_spring_template/home.do`로 연다.
DB를 쓰지 않으므로 `STUDY_DB_*` 환경변수도 필요 없다.

### 이번 갱신의 검증 범위

- **확인함** — 이클립스 m2e가 `pom.xml`의 의존성을 내려받아 `HomeController`를 컴파일했다(`target/classes`에 `.class` 생성). 저장소에 넣은 소스 7개는 워크스페이스 원본과 동일하다.
- **확인하지 않음** — 톰캣에 배포해 `/home.do`를 브라우저로 열어 본 기록은 이번 정리에 없다. 위 설명은 **설정을 읽고 따진 결과**다.
- `target/`은 빌드 산출물이라 저장소에 넣지 않는다(`.gitignore`에 추가).
