# 07_hkboard_springMVC — Spring과 MyBatis로 게시판 목록 연결

2026-09-23, 37일차 수업의 로컬 소스다. 전날 만든 Spring MVC 뼈대에 Service·DAO·MyBatis를 연결해 실제 게시판 목록을 JSP에 표시했다. [37일차 학습 카드](../../index.html#class-day37) · [개념 카드 41~46](../../index.html#web-41)

## 현재 구현 범위

| 구간 | 상태 |
|---|---|
| index.jsp → boardlist.do → 목록 JSP | 로컬 Tomcat에서 HTTP 200 확인 |
| Controller | GET /boardlist.do 메서드 1개 |
| Service·DAO | 목록·등록·상세·수정·삭제·다중 삭제 메서드 작성 |
| MyBatis Mapper | 위 6개 statement 작성 |
| 등록·상세·수정·삭제 요청 | Controller 연결 전. 완성된 CRUD가 아님 |
| JSP의 나머지 링크 | 이전 .board 및 boardController.jsp 경로가 남아 있음 |

수업 당시 진행 상태를 보존했다. 목록 이외 버튼이 동작한다고 가정하지 않는다. 브라우저에서 WEB-INF 아래 JSP를 직접 여는 것도 지원되지 않는다.

## 한 번의 목록 요청

```text
GET /07_hkboard_springMVC/boardlist.do
  → web.xml의 *.do → DispatcherServlet
  → BoardController.boardList(Model)
  → IHKService / HkService.getAllList()
  → IHkDao / HkDao.getAllList()
  → SqlSessionTemplate.selectList("com.hk.board.dao.boardList")
  → BoardMapper.xml → HKBOARD 조회 → List<HkDto>
  → model.addAttribute("list", list)
  → return "boardlist"
  → /WEB-INF/views/boardlist.jsp → c:forEach
```

Controller·Service·DAO는 `servlet-context.xml`의 `com.hk.board` 스캔으로 자식 컨텍스트에 등록된다. 이 빈들은 부모 root-context에 등록된 DB 빈을 참조한다. `IHKService`와 `IHkDao`라는 인터페이스 이름의 대소문자도 원본 그대로다.

## 파일 역할

- `src/main/java/com/hk/board/controller/BoardController.java`: 요청과 Model, 뷰 이름.
- `service/IHKService.java`, `service/HkService.java`: 기능 계약과 DAO 호출.
- `daos/IHkDao.java`, `daos/HkDao.java`: MyBatis statement 호출.
- `dtos/HkDto.java`: seq·id·title·content·regDate와 getter/setter.
- `src/main/resources/sqls/Configuration.xml`: DTO 별칭과 Mapper 등록.
- `src/main/resources/sqls/BoardMapper.xml`: SQL과 foreach.
- `src/main/webapp/WEB-INF/spring/root-context.xml`: properties → DataSource → SqlSessionFactory → SqlSessionTemplate.
- `pom.xml`: Java 21, Spring 6.1.13, MyBatis 3.5.6, mybatis-spring 3.0.3, DBCP2 2.12.0, MariaDB Connector/J 2.6.2.

DAO의 Java 패키지는 `daos`, XML namespace는 `com.hk.board.dao`다. 현재는 문자열로 statement를 호출하므로 Java 패키지와 같을 필요는 없다. DAO가 만드는 전체 이름과 XML의 `namespace.id`가 맞아야 한다.

## 실행

1. JDK 21, Tomcat 10.1, MariaDB와 [HKBOARD 실습 테이블](../../../setup/bootstrap-hk.sql)을 준비한다. 기존 DB가 있으면 테이블 준비 SQL부터 다시 실행하지 말고 현재 스키마를 먼저 확인한다.
2. `src/main/resources/properties/db.properties.example`을 같은 폴더의 `db.properties`로 복사한다. 본인 DB 계정·비밀번호와 URL을 채운다. 실제 파일은 Git에서 제외된다.
3. Eclipse에서 **Import → Existing Maven Projects**로 이 폴더를 가져온다. **Maven → Update Project** 후 JDK 21·Tomcat 10.1을 연결한다.
4. Run on Server 후 `http://localhost:8080/07_hkboard_springMVC/` 또는 `/07_hkboard_springMVC/boardlist.do`를 연다. CLI에서는 `mvn package`로 WAR를 만들 수 있다.

GitHub Pages는 HTML 학습 노트만 제공한다. 이 Java 서버를 Pages에서 실행할 수는 없다.

## 9월 23일 수정한 실행 환경 문제

- Maven Dependencies와 resources 경로가 빠져 Spring·MyBatis·JSTL을 못 찾던 Eclipse 설정을 복구했다. 저장소에는 컴퓨터별 IDE 설정을 가져오지 않고 Maven import로 재생성하도록 안내한다.
- 메인 링크 `boardlist.board`를 실제 요청 매핑인 `boardlist.do`로 고쳤다. 이 수정은 보존한 소스에도 포함된다.
- 로컬 DB의 root 인증 실패를 접속 가능한 수업용 계정으로 해결했다. 공개본에는 계정 비밀값이 없는 예제 설정만 있다.
- 파일 복사 후 예전 수정 시각 때문에 리소스가 갱신되지 않은 경우를 확인했고, 빌드·배포본을 다시 맞춘 뒤 검증했다.

## 확인한 것과 남은 것

- 원본 07의 Java 6개 파일을 컴파일했고 Maven WAR 빌드가 성공했다.
- 로컬 Tomcat 10.1 임시 서버에서 메인과 `/boardlist.do`가 모두 HTTP 200을 반환했다. 실제 DB 조회 결과가 목록 JSP에 전달되는 경로를 확인했다.
- 게시판 쓰기·수정·삭제는 이번 검증에서 실행하지 않았다. Controller에 아직 해당 요청이 없다.
- `defaultAutoCommit=false`만으로 Spring 트랜잭션이 구성되지는 않는다. 현재 TransactionManager·`@Transactional` 설정은 없으며, MyBatis-Spring의 트랜잭션 밖 호출은 개별적으로 커밋된다.
- `<foreach>`의 빈 배열 처리와 요청값 검증은 요청을 연결할 때 추가로 확인할 내용이다.

원본과의 차이는 실제 `db.properties`, 빌드 결과, 라이브러리 JAR, Eclipse 개인 설정을 공개본에서 제외하고 이 안내와 설정 예제를 추가한 것이다. DAO나 아직 남아 있는 JSP 링크를 학습 기록 작성 과정에서 임의로 완성하지 않았다.
