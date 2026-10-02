# 2026-10-01 ~ 10-02 수업 반영과 검증 기록

## 반영 근거

- 로컬 수업 워크스페이스의 `08_answerboard_springMVC`에서 9/30 반영 이후 바뀐 파일 17개(새 파일 5: `Paging.java`·`LogExecute.java`·`LogExecuteNoXML.java`·`aop-context.xml`·`resources/img/arrow.png`, 바뀐 파일 12).
- 41일차(10/1)와 42일차(10/2)의 구분은 **파일 수정 시각**으로 나눴다. 10/1: `index.jsp`·`Paging.java`·`boardInsertForm.jsp`·`boardDetail.jsp`·`BoardMapper.xml`·`AnsDao.java`·`servlet-context.xml`. 10/2: `AnsController.java`·`AnsService.java`·`arrow.png`·`boardList.jsp`·`LogExecute.java`·`log4j.xml`·`aop-context.xml`·`root-context.xml`·`web.xml`·`LogExecuteNoXML.java`. Controller·Service는 10/2 오전에 마지막으로 고쳐져, 답글 요청을 연결한 날이 10/1인지 10/2인지는 파일로 가를 수 없다.
- `Downloads`에 9/30 이후 새 코딩테스트 오답노트가 없어 코딩테스트는 반영하지 않았다.

## 이번 반영

- [41일차](index.html#class-day41)·[42일차](index.html#class-day42), 웹 개념 57~61, 학습 여정 24단계, 시험 문제 6개(w50~w55). 40일차의 "아직 남은 것"([web-56](index.html#web-56))에 이후 진도 링크를 달았다.
- 08 소스 17개 파일을 복사한 뒤 원본과 바이트 단위로 같은지 대조했다. 실제 `db.properties`, `WEB-INF/lib` JAR, 빌드 산출물, Eclipse 설정은 이번에도 제외했다. [08 README](web_edu_project/08_answerboard_springMVC/README.md)를 10/2 기준으로 다시 썼다.
- 대시보드 헤더·통계·메뉴 숫자와 시험 탭 설명(웹 55 · 총 187문항)을 실제 수에 맞췄다.

## 실행 확인

| 대상 | 확인한 범위 | 결과 |
|---|---|---|
| 08 Java 컴파일 | 7개 파일, JDK 21, Tomcat 10.1 lib + Eclipse 배포본 `WEB-INF/lib` | `-parameters` 없이 성공 |
| `Paging.pagingValue` | 08 소스를 그대로 컴파일해 (pcount, pnum) 13가지 경우 호출 | 8쪽/14쪽 → 6~10, 이전 5, 다음 11. 마지막 묶음의 다음은 마지막 쪽, 첫 묶음의 이전은 1. pcount 0이면 번호 없음·다음 0 |
| 답글 SQL | `BoardMapper.xml`에서 `boardInsert`·`replyUpdate`·`replyInsert`·`boardList`·`getPcount`를 그대로 꺼내 Node 내장 SQLite 3.53(메모리 DB)에 실행. `#{x}`는 바인딩 표기로, SQLite의 정수 나눗셈 때문에 `/10` → `/10.0`만 바꿈. `SYSDATE()`·`nvl()`은 같은 이름의 함수 등록 | 같은 글의 답글은 나중 것이 위, 답글의 답글은 바로 아래 한 칸 안쪽. 같은 refer 안 step 중복 없음. UPDATE만 실행되면 step 1 자리가 비는 것도 재현. 23개 → 3쪽 |
| 트랜잭션 | 08의 Controller·Service·DAO와 `aop-context.xml` 원본, `root-context.xml`의 트랜잭션·스캔 설정을 그대로 쓰고, DB 연결과 `SqlSessionTemplate`만 호출을 기록하는 가짜로 바꿔 부모(root)·자식(servlet) 컨텍스트를 띄움 | 42일차 설정: `setAutoCommit(false)` → 활성 true → `commit()`. INSERT 실패: `rollback()`. 자식이 `com.hk.ansboard` 전체 스캔: 자식에 AnsService가 따로 생기고 활성 false, commit·rollback 없음, AOP 로그도 없음 |
| AOP | 위 실행에서 `LogExecute` 출력 | before·afterReturning·daoError가 DAO 메서드마다 찍힘. 로거 이름이 `class com.hk.ansboard.dao.AnsDao`(앞에 `class `) |
| 로그 폴더 | 워크스페이스 `src/main/resources/log/` | 10/2 현재도 비어 있음 |
| HTML 구조 · 앵커 | 대시보드 | 문서 내 앵커 485개 모두 존재, 태그 짝 일치 |
| 인벤토리 | 백엔드 실제 카드 수·통계 | 일치 (수업 41 · 웹 61 · 학습 여정 24) |
| 시험 문제은행 | JavaScript로 실제 평가 | 187문항, id 중복·정답 범위 오류 없음. "배운 데까지" 148 → 154, w50~w55 모두 포함 |
| 브라우저 | 로컬 정적 서버로 대시보드를 열어 확인 | 콘솔 오류 없음, 5분 복습 덱 226 → 233장(새 카드 7장 모두 포함) |

트랜잭션 재현의 출력 모양은 검증용 `logback-test.xml`로 스프링 내부 로그만 줄인 것이다. 로컬 MariaDB 접속 정보는 이번에도 쓰지 않았다.

## 범위의 한계

- **톰캣과 실제 DB로 페이지 이동·글쓰기·답글을 실행하지 않았다.** 트랜잭션은 "스프링이 언제 commit·rollback을 부르는지"까지 확인했고, MariaDB가 실제로 되돌리는 것을 본 것은 아니다.
- 다음은 소스로 따진 결과이며 실행 확인이 아니다: 상세·수정·삭제·답글의 `@RequestParam("pnum")`이 필수라 pnum 없이 주소를 열면 400이 난다는 것, `LogExecuteNoXML`을 켜려면 `aop:aspectj-autoproxy`와 aop 패키지 스캔이 필요하다는 것, `return "error.jsp"` 문제.
- `replyUpdate`처럼 UPDATE가 같은 테이블을 서브쿼리로 읽는 문장은 MariaDB 10.3.2 이상(이 PC는 12.3)에서 허용되고 MySQL에서는 1093 오류가 난다는 것은 문서 기준이다. SQLite에서는 실행된다.
- SQL은 SQLite로 확인했으며 MySQL·MariaDB와 규칙이 같은 부분만 본다.
