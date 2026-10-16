# 2026-10-16 수업 반영과 검증 기록

## 반영 근거

- 교안 `REST API 구현하기.pptx`(11쪽, 10/16 10:45 받음) — REST의 뜻 · 제약 조건 · URL과 메서드 설계 규칙 · `ResponseEntity` · CORS 허용 세 가지.
- 코딩테스트 `코딩테스트오답노트26_김태경.docx`(10/16 15:46) — 4문제, Java 1 PASS · 1 FAIL, SQL 1 PASS · 1 FAIL.
- 실습 워크스페이스 `C:\Users\neo62\dev\workspace-boot`
  - `backend_hkboard_springboot_restAPI12` · `frontend_hkboard_react12`(10/16 10:41~10:42) — 12번 예제.
  - `schedule_springboot11`(10/16 10:02) — 선생님 최종본으로 다시 맞추고 파일마다 설명 주석을 더한 상태. 주석을 쓴 Claude 세션 기록은 찾지 못했다(세션 검색).
  - `total_project`(10/16 15:54~16:14, 08 · 10 · 11 통합) — 수업 코드가 아니고 만드는 중이라 이번 반영에 넣지 않았다. 그 안의 안내 문서에는 DB 비밀번호가 평문으로 적혀 있어, 공개 저장소에 그대로 올리면 안 된다. 그 값은 어디에도 옮기지 않았다.
  - `08_answerboard_springMVC`(14:27) · `sql/total_project.sql` · `Run-12.cmd`는 위 작업용이라 넣지 않았다.
- **선생님 GitHub 확인** — 커밋 3개.
  - 10/15 17:05 `2dd4acc` "일정목록표시추가": 달력 칸 미리 보기(`ROW_NUMBER() OVER(PARTITION BY substr(mdate,1,8))`), `@ControllerAdvice` `Exceptionhandle`, `error.html`, `img/pen.png`.
  - 10/16 10:40 `f1a141f` "12번예제 추가": 12 백엔드 · 프런트, 그리고 11의 두 줄.
  - 10/16 14:34 `4554be5` "수정": 프런트 lock 파일, 10 프로젝트 `WebMvcConfig`의 import 한 줄.
- 대조(줄바꿈 · 공백 무시, `application.properties`는 비밀번호 줄을 거른 출력으로만)
  - 12 백엔드 · 프런트: 코드가 같다. 백엔드는 DB 계정만 다르다. 프런트의 `AGENTS.md`는 `next dev`가 만든 파일이다.
  - 11: 주석 줄을 빼면 선생님 최종본과 같다. 다른 곳은 이 PC용 맞춤(`lombok.ToString` · DTD · 포트 · 계정 · 설정 파일 주석)뿐이다. 49일차 실습 폴더에만 있던 수정 · 미리 보기는 선생님 버전으로 바뀌었다(10/15 코드는 커밋 `4cd2578`).

## 이번 반영

- 대시보드:
  - [50일차](index.html#class-day50)
  - 웹 개념 [85 REST API](index.html#web-85) · [86 CORS](index.html#web-86) · [87 React에서 API 부르기](index.html#web-87) · [88 일정관리 마무리](index.html#web-88)
  - 코딩테스트 [67~70](index.html#ct-67)([26회차 기록](coding-tests/2026-10-16/))
  - 📘 개념서 [44장](index.html#book-be-44)(교안 표현 바로잡기 포함, 43장 "다음 장으로"에 실제 다음 수업을 더함)
  - 학습 여정 32단계, 시험 문제 w95~w99
- 앞 카드 후속 안내: 47 · 48 · 49일차 실습 파일 안내(50일차 상태), web-83(선생님 최종본에도 수정 메서드), web-84(미리 보기가 SQL 방식으로 바뀜, 10/15 코드 `4cd2578`).
- 🗺️ 큰 그림(백엔드):
  - 지도: 화살표에 HTML · JSON, 설명에 12번부터 JSON만.
  - 타임라인: 일정관리 10/13~10/15 완료, 10/16~ REST API + React 지금.
  - 예제 프로젝트: 01~12, 표 12 행, 11 카드 완료(한 일 · 다음으로), 12 카드 새로.
  - 단계: "웹 6" 완료, 새 단계 12 "웹 7 — REST API와 React 프런트"(꼭 알 것 5 · 헷갈리는 것 5 · 실무 · 면접 2). "앞으로"는 13번.
  - 큰 생각 ① · ④, 헷갈리는 말에 `@Controller` / `@RestController` · 폼 / `@RequestBody`, 면접 답변.
  - 학습 여정 문장(32단계, "현재는 …" 10/16), 웹 탭 머리말(카드 01~88, 프로젝트 ~12).
- 🗺️ 큰 그림(프런트엔드): 타임라인(일정관리 완료, 10/16~ REST API + React — 백엔드가 이 탭의 React로 돌아옴), 지도 화살표 · 설명(백엔드 web-87 링크), 큰 생각 ④, 머리말 점검일.
- 프로젝트 사본:
  - 새 [`12_backend_hkboard_restAPI`](web_edu_project/12_backend_hkboard_restAPI/)(README 새로 씀)와 [`12_frontend_hkboard_react`](web_edu_project/12_frontend_hkboard_react/)(선생님 README 그대로)를 넣었다.
  - [`11_schedule_springboot`](web_edu_project/11_schedule_springboot/)는 26개 파일을 바꾸고 README를 고쳤다.
  - 모두 원본과 바이트 단위로 같다. 예외는 `application.properties`의 비밀번호 줄(`YOUR_DB_PASSWORD`)이다.
- 헤더 · 통계 · 메뉴: 수업 50일차(카드 49장), 카드 351장, 시험 231문항(웹 99), 웹 88, 코딩테스트 70, 학습 여정 32, 개념서 44장. README 4종과 첫 화면(개념 188항목)도 맞췄다.

## 실행 확인

검증용 사본은 모두 저장소 밖이다. 설정 파일은 수업 파일을 복사하지 않고 새로 썼다(H2 메모리 DB `MODE=MariaDB`, 127.0.0.1).
- 사본에서만 바꾼 것: Mapper의 `SYSDATE()` → `CURRENT_TIMESTAMP`, 11의 `'rn'` → `rn`.
- 12 백엔드는 pom에 H2가 이미 있다.
- 프런트 사본은 실습 폴더의 `node_modules`를 복사해 `next dev -p 8086`으로 띄웠고, 검증 뒤 지웠다.

| 대상 | 확인한 범위 | 결과 |
|---|---|---|
| 12 백엔드 빌드 · 기동 | Maven Wrapper `package`(Boot 3.5.7 · JDK 21) → `java -jar`(8085) | 성공, 서버 로그 ERROR 0 |
| REST API | `/api/boards` GET · POST · GET `/{seq}` · PUT `/{seq}` · DELETE(본문 배열) | 200 · 201 · 200 · 200 · 200 `{"count":2}`. PUT은 본문 `seq=1`보다 주소의 3이 우선 |
| 오류 모양 | 없는 글 · 글자 번호 · 폼 형식 POST · 빈 JSON | 200 `{"dto":null}` · 400 · 415 · 201(빈 글 저장) |
| 옛 방식 | `/api/board/boardlist` · `/detail/3` · `/insert` | 200 (같은 서비스) |
| CORS | OPTIONS(PUT) Origin 8086 / 3000, PATCH, GET Origin 3000 | 200 + `Allow-Origin 8086` · `GET,POST,PUT,DELETE` · `Max-Age 3600` / 403 / 403 / 403 |
| 12 화면 | 헤드리스 Edge(1280px)로 8086 — 목록 → 글쓰기 → 상세 → 수정하기 · 수정완료 → 선택 삭제 | 모두 통과(alert · confirm은 테스트에서 자동 확인) |
| 12 화면 실패 | `/detail/999` | "This page couldn't load", 콘솔 `TypeError: Cannot read properties of null (reading 'id')` |
| 11 최종본 | 빌드 · 기동(9192), 별칭 `'rn'` 그대로 | 달력 요청이 200 "페이지 오류"(H2 문법 오류를 `@ControllerAdvice`가 잡음) |
| 11 최종본(사본에서 `rn`) | 같은 날 일정 4개, 긴 제목, `<!--` · `<b>` 제목 | 시간순 3개, 7글자 + `..`, HTML 그대로 들어감 |
| 11 오류 화면 | 값 없는 목록 · 없는 번호 상세 · 글자 연도 · 없는 주소 | 모두 200 "페이지 오류"(예외 메시지 노출: `source cannot be null`, `For input string`) |
| 코딩테스트 Java | `CodingTest26Test.java` | 없는 숫자 — 1,022개 전수. 타겟 넘버 — 무작위 2,000개를 2^n 비트 전수와 비교, 20개 2.6ms, 같은 객체 재호출 5 → 10 |
| 코딩테스트 SQL | `verify-sql26.mjs`(Node 내장 SQLite 3.53) | 20개 통과 — IN · 다중 정렬 · OR/AND 우선순위, NTILE · PERCENT_RANK · CUME_DIST가 4 · 8 · 12 · 20개에서 같은 답, `DESC` 빠짐 · `CUME_DIST <` 함정 |
| 문제 번호 | 프로그래머스 문제 페이지 4개 | 86051 · 43165 · 132203 · 301649, 조건 일치 |
| HTML · 앵커 · 인벤토리 · 시험 | 백엔드 · 프런트엔드 대시보드, 전체 링크 | 태그 짝 일치, 문서 내 앵커 모두 존재, 카드 수 = 통계, 231문항 · id 중복 없음 · w95~w99 "배운 데까지" 포함 |

로컬 MariaDB 접속 정보는 쓰지 않았다. 검증용 서버(8085 · 8086 · 9192)와 헤드리스 Edge는 끝난 뒤 모두 껐다. `next dev`는 실행 중 같은 네트워크(192.168.0.x)에서도 열리는 주소를 띄웠다.

## 범위의 한계

- **실제 MariaDB와 Antigravity에서 실행하지 않았다.** H2 사본 기준이다. 11의 `'rn'` 별칭이 MariaDB에서 통한다는 것은 문법 규칙으로 따진 것이다.
- 프런트 `next build`(배포용 빌드)는 하지 않았다.
- 실행하지 않고 규칙으로 따진 답:
  - 404 · `@Valid`로 고치는 방법, Next.js `rewrites()` 프록시.
  - `@RestController`를 `@Controller`로 바꿨을 때, `HkService.deleteBoard` 재귀.
  - 카드의 스스로 확인 일부(각 카드 메모에 표시).
- 타겟 넘버의 제출 코드 칸 코드가 시험 시간 안의 제출본인지는 알 수 없다.
