# web_edu_project — 웹 개발 수업 실습 소스

취업아카데미 백엔드 과정의 **웹 개발(JSP · Servlet) 수업** 실습 프로젝트입니다.
2026-09-10(28일차)부터 **Eclipse JEE + Tomcat 10.1** 환경에서 진행하고 있습니다.

정리된 학습 노트는 대시보드의 **🖥️ 웹 개발** 탭에서 볼 수 있습니다
→ https://moriochoradio.github.io/web-study-notes/Back_end/#web-01

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

## 프로젝트: 01_userboard_sepa

이름 끝의 `sepa`는 **separation(분리)** 입니다.
데이터를 담는 일 · DB에 접근하는 일 · 실행해 보는 일을 각각 다른 패키지로 나눴습니다.

```
01_userboard_sepa/
├─ src/main/java/com/hk/board/
│   ├─ dto/userDto.java      데이터를 담아 나르는 객체 (무엇을)
│   ├─ dao/UserDao.java      DB 접근을 전담하는 객체 (어디서)
│   └─ main/UserMain.java    시켜 보고 결과를 확인 (누가)
└─ src/main/webapp/
    ├─ index.jsp
    └─ WEB-INF/
        ├─ web.xml           배포 서술자 (Jakarta EE 6.0)
        └─ lib/              ← JDBC 드라이버 jar 를 여기에 (저장소에는 미포함)
```

| 클래스 | 하는 일 |
|---|---|
| `userDto` | 회원 한 명의 정보를 담는 상자. 멤버필드 8개 + 생성자 + getter/setter + `toString()`. `Serializable` 구현. |
| `UserDao` | 생성자에서 드라이버를 로딩하고, `getAllUser()`로 목록을 조회하고 `insertUser(dto)`로 등록한다. |
| `UserMain` | `dao.getAllUser()`를 불러 결과를 출력하는 테스트용 실행 클래스. **SQL도 커넥션도 모른다.** |

두 메서드가 **자원 반납 방식이 서로 달라서** 비교하기 좋습니다.

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

INSERT INTO userTbl VALUES
  ('LSG','이승기',1987,'서울','011','11111111',182,'2008-8-8'),
  ('KBS','김범수',1979,'경남','011','22222222',173,'2012-4-4'),
  ('KKH','김경호',1971,'전남','019','33333333',177,'2007-7-7');
```

### 2) JDBC 드라이버 넣기

용량 때문에 저장소에 넣지 않았습니다. [MariaDB Connector/J](https://mariadb.com/downloads/connectors/)에서
`mariadb-java-client-3.3.3.jar`(또는 그 이상)를 받아 아래 위치에 둡니다.

```
src/main/webapp/WEB-INF/lib/mariadb-java-client-3.3.3.jar
```

`WEB-INF/lib`의 jar는 **서버가 자동으로 클래스패스에 넣어 주므로** 따로 설정할 필요가 없습니다.

### 3) DB 비밀번호 채우기

**공개 저장소라서 비밀번호를 뺐습니다.** `UserDao.java`의 두 곳을 채워야 동작합니다.

```java
String password = "";   // ← 여기에 DB 비밀번호
```

> 원래는 이렇게 소스에 직접 적지 않고 **`WEB-INF` 안의 설정 파일로 빼는 것**이 맞습니다.
> `WEB-INF` 안은 브라우저가 URL로 직접 요청할 수 없어서, 설정 파일을 숨기는 자리로 쓰입니다.
> 수업 진도가 나가면 그렇게 바꿀 예정입니다.

### 4) 실행

Eclipse에서 `UserMain.java` → 우클릭 → Run As → Java Application.

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

## 저장소에 포함하지 않은 것

| 제외 | 이유 |
|---|---|
| `src/main/webapp/WEB-INF/lib/*.jar` | 배포처에서 받으면 되는 라이브러리 |
| `build/` (`.class`) | 소스에서 다시 만들어지는 산출물 |
| 워크스페이스의 `.metadata/`, `Servers/` | 이클립스 개인 설정 |
| DB 비밀번호 | 공개 저장소라 값을 비워 뒀습니다 |

## 앞으로

교육자료 기준 다음 진도입니다.

1. **JSP 문법** — 실행 환경 · 구성요소 · Tag · Action Tag · 기본 객체
2. **MVC1** — 기본 게시판, 회원 관리
3. **MVC2** — Servlet · JSTL · EL · MyBatis
4. **심화** — 답변형 게시판, Connection Pool
