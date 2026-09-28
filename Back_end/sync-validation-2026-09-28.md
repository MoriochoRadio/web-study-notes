# 2026-09-28 수업 반영과 검증 기록

## 반영 근거

- 로컬 수업 워크스페이스의 `07_hkboard_springMVC`. 9월 23일 반영 이후 오늘 수정된 파일은 7개다 — `BoardController.java`, `HkService.java`, `HkDao.java`, `BoardMapper.xml`, `boardlist.jsp`, `boardDetail.jsp`, `boardInsertForm.jsp`.
- 사용자 제공 `코딩테스트오답노트19_김태경.docx`: 19회차, Java 1 PASS · 1 FAIL, SQL 2 PASS.
- 크레인 인형뽑기(FAIL)의 제출 코드 칸은 비어 있다. 정답 풀이만 파일로 옮겼고 실패 원인을 단정하지 않았다.
- SQL 1번은 원문 제목이 "이름이 있는 동물의 아이디"이지만 제출 코드가 "어린 동물 찾기"(59037)의 요구사항과 정확히 일치한다. 같은 제목의 문제를 18회차에 이미 풀었다. 공식 문제명을 쓰고 원문 제목을 함께 적었다.
- 공식 문제 원문 링크는 [19회차 기록](coding-tests/2026-09-28/README.md)에 있다.

## 이번 반영

- [38일차](index.html#class-day38), 웹 개념 47~51, 코딩테스트 39~42, 학습 여정 22단계, 시험 문제 5개(w39~w43).
- 07의 오늘 수정 파일 7개를 복사한 뒤 수업 원본과 바이트 단위로 대조했다. 이후 레포의 07 소스 전체가 워크스페이스와 같다(줄바꿈 정규화 제외). 수업 코드를 새 기능으로 바꾸지 않았다.
- 실제 `db.properties`, IDE 개인 설정, 라이브러리 JAR, 빌드 산출물은 제외했다. `db.properties`는 `.gitignore`의 `**/db.properties`로 제외되는 것을 확인했다.
- 대시보드 헤더·통계·메뉴 숫자를 실제 카드 수에 맞췄다. 시험 탭 설명이 9월 23일 이후 "웹 32문항 · 총 164문항"으로 남아 있던 것을 실제 수(웹 43 · 총 175)로 고쳤다.

## 실행 확인

| 대상 | 확인한 범위 | 결과 |
|---|---|---|
| 07 Java 컴파일 | 오늘 소스 6개 파일, JDK 21, Tomcat 10.1 lib + Eclipse 배포본의 의존성 JAR | `-parameters` 유무 모두 성공 |
| `home.do` 매개변수 해석 | 사용자 환경과 같게 `-parameters` 없이 컴파일한 `BoardController`를 스프링 `RequestParamMethodArgumentResolver`에 직접 넣음 | `IllegalArgumentException` 재현. `-parameters`로 컴파일하면 정상 |
| 사용자 빌드 설정 | Eclipse JDT 설정, `pom.xml`, Eclipse가 배포한 `BoardController.class`의 `MethodParameters` 속성 | 옵션 없음, 속성 0건 |
| 나머지가 1이 되는 수 | 3~50,000 전수 + 무작위 20,000 + 최악 20개 = 70,020개. 기댓값은 에라토스테네스 체 | 통과 |
| 크레인 인형뽑기 | 공식 예제 + 무작위 보드 20,000개. 기댓값은 열별 덱을 쓰는 별도 구현 | 통과 |
| SQL 두 문제 | 제출 SQL 파일을 그대로 읽어 Node 내장 SQLite 3.53(메모리 DB)에 실행, 10개 항목 | 통과 |
| HTML 구조 | 대시보드와 19회차 페이지 | 중복 id·끊긴 앵커·미지 요소·태그 짝 문제 없음 |
| 인벤토리 | 백엔드 실제 카드 수·통계 대조 | 일치 |
| 시험 문제은행 | 문제은행을 JavaScript로 실제 평가, id 중복·정답 범위 검사 | 175문항 정상 |

SQL 검증에 SQLite를 쓴 이유는 로컬 MariaDB 접속 정보를 쓰지 않기 위해서다. 사용한 문법(`<>`, `IS NULL`, `LEFT/RIGHT JOIN`, `NOT EXISTS`, `ORDER BY`)과 NULL 비교 규칙은 MySQL·MariaDB와 같으며, 대소문자 비교·문자셋처럼 DB마다 다른 부분은 검사하지 않았다.

## 범위의 한계

- **07의 CRUD를 톰캣과 실제 DB로 실행하지 않았다.** 별도 포트의 임시 톰캣으로 확인하려 했으나, 그 과정에서 DB 접속 정보를 다루게 되어 중단했다. 사용자의 8080 서버와 Eclipse 배포본은 건드리지 않았다. 오늘 추가된 요청이 "연결되어 있다"는 것은 코드로 확인한 사실이고, "동작한다"는 것은 확인하지 않았다.
- `redirect:error.jsp`가 화면을 찾지 못한다는 설명과 `${param}`이 EL 내장 객체를 가리킨다는 설명은 파일 위치와 JSP 규칙으로 따진 결과다. 실행 확인이 아니다.
- Java·SQL 로컬 검증은 프로그래머스 재채점이나 FAIL 제출 코드의 재현이 아니다. GitHub Pages는 학습 HTML을 제공하며 JSP 서버를 실행하지 않는다.
