# 2026-09-29 ~ 09-30 수업 반영과 검증 기록

## 반영 근거

- 로컬 수업 워크스페이스의 새 프로젝트 `08_answerboard_springMVC`. 07을 복사해 시작했다(`root-context.xml`·`home.jsp`의 수정 시각이 9/22~23로 남아 있음).
- 39일차(9/29)와 40일차(9/30)의 구분은 **파일 수정 시각**으로 나눴다. 9/29: `pom.xml`·`web.xml`·`servlet-context.xml`·`Configuration.xml`·`AnsDto`·`index.jsp`·`log4j.xml`. 9/30: `header`·`footer`·목록·글쓰기·상세 JSP, `BoardMapper.xml`, Service·DAO·Controller. 9/29에 만들고 9/30에 고친 파일은 40일차 쪽에 들어가 있을 수 있다.
- 사용자 제공 `코딩테스트오답노트20_김태경.docx`: 20회차, Java 1 PASS · 1 FAIL, SQL 1 PASS · 1 FAIL.
- 숫자 문자열과 영단어(FAIL)는 제출 코드 칸이 비어 있어 정답 풀이만 파일로 옮겼다. 대여 기록 자동차(FAIL)는 제출 코드와 정답 풀이가 모두 있어 그대로 보존했다.
- 공식 문제 원문 링크는 [20회차 기록](coding-tests/2026-09-30/README.md)에 있다.

## 이번 반영

- [39일차](index.html#class-day39)·[40일차](index.html#class-day40), 웹 개념 52~56, 코딩테스트 43~46, 학습 여정 23단계, 시험 문제 6개(w44~w49).
- 08 소스(Java 4 · JSP 7 · XML 6 · `pom.xml`)를 복사한 뒤 줄바꿈을 빼고 원본과 같은지 대조했다. 실제 `db.properties`, `WEB-INF/lib` JAR, 빌드 산출물, Eclipse 설정은 제외했고 07과 같은 `db.properties.example`과 [README](web_edu_project/08_answerboard_springMVC/README.md)를 더했다.
- 대시보드 헤더·통계·메뉴 숫자와 시험 탭 설명(웹 49 · 총 181문항)을 실제 수에 맞췄다.

## 실행 확인

| 대상 | 확인한 범위 | 결과 |
|---|---|---|
| 08 Java 컴파일 | 4개 파일, JDK 21, Tomcat 10.1 lib + Eclipse 배포본 `WEB-INF/lib` | `-parameters` 없이 성공 |
| 매개변수 이름 | Controller의 단순 타입 매개변수 | 모두 `@RequestParam("이름")` — 38일차 `home.do` 같은 문제 없음 |
| 로그 설정 | 08과 같은 slf4j-api·logback-classic 1.5.6과 같은 `log4j.xml` 위치로 로거를 만들어 실행(임시 폴더) | Logback이 `logback.xml`을 못 찾아 기본 설정(콘솔·root DEBUG)으로 동작. `log4j.xml` 무시, 날짜별 로그 파일 생성 안 됨 |
| 워크스페이스 로그 폴더 | `src/main/resources/log/` (9/29 14:12 생성) | 비어 있음 |
| x만큼 간격 | 경계 x 6개 × n 1~1000 + 무작위 20,000 = 26,000개. 기댓값은 `(long) x * (i+1)` | 통과. `int` 곱셈이 100억을 1,410,065,408로 넘치는 것도 출력 |
| 숫자 문자열과 영단어 | 공식 예제 4 + 문제의 인코딩 방식대로 만든 무작위 50,000 + 경계 4 | 통과 |
| SQL 두 문제 | 세 SQL 파일을 그대로 읽어 Node 내장 SQLite 3.53(메모리 DB)에 실행, 7개 항목. `MONTH()`는 같은 이름의 함수를 등록 | 통과. 제출 코드 `3, 3, 3, 1` / 정답 `3, 1` |
| HTML 구조 | 대시보드와 20회차 페이지 | 중복 id·끊긴 앵커·미지 요소·태그 짝 문제 없음 |
| 인벤토리 | 백엔드 실제 카드 수·통계 | 일치 |
| 시험 문제은행 | JavaScript로 실제 평가, id 중복·정답 범위, 새 문제의 "배운 데까지" 포함 여부 | 181문항 정상, w44~w49 모두 포함 |

로컬 MariaDB 접속 정보는 이번에도 쓰지 않았다.

## 범위의 한계

- **08의 목록·글쓰기·상세·수정·삭제를 톰캣과 실제 DB로 실행하지 않았다.** 요청이 코드에 연결돼 있다는 것은 확인했고, 동작한다는 것은 확인하지 않았다.
- 다음은 소스와 파일 배치로 따진 결과이며 실행 확인이 아니다: 실패 시 `return "error.jsp"`가 `/WEB-INF/views/error.jsp.jsp`를 찾는다는 것, 08에 `error.jsp`가 없다는 것, header·footer가 완전한 HTML 문서라 결과 화면에 `<html>`·`<body>`가 겹친다는 것.
- `answerboard` 테이블을 만드는 SQL은 수업 자료에 없어 싣지 않았다. README의 컬럼 순서는 `INSERT` 문에서 읽은 것이다.
- Java·SQL 로컬 검증은 프로그래머스 재채점이나 FAIL 제출 코드의 재현이 아니다. SQL은 SQLite로 확인했으며 MySQL과 규칙이 같은 부분만 본다.
