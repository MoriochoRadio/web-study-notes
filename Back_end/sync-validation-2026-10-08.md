# 2026-10-08 수업 반영과 검증 기록 (2026-10-12 반영)

## 반영 근거

- 수업 워크스페이스 `C:\Users\neo62\dev\workspace-boot`에서 10-07 반영 이후 바뀐 것: 새 폴더 `login_board_springboot10`(파일 대부분 10/8 01:12 — 선생님 레포에서 받은 시각), `application.properties`(10/8 11:11), `upload/`의 이미지 1개(13:16), `MemberController.java`(13:40). `hkboard_springboot09`는 저장소 사본과 같다(비밀번호 줄 제외).
- **선생님 GitHub 확인** — 사용자가 "선생님 레포가 더 최신일 것"이라고 해서 `git ls-remote`와 GitHub API로 원격을 직접 봤다. 마지막 push는 **10/7 16:01**(`security 의존성 주석처리`, 09 프로젝트)이고 10/8 수업분은 없다. `login_board_springboot10`은 **10/6(`f3a0ab1 로그인,보드프로젝트업로드`)에 완성본**으로 올라와 있었다. 줄바꿈을 무시하고 대조하면 실습 폴더와 다른 곳은 `MemberController.java`(Lombok 생성자 주입 — 내 수정)와 `application.properties`의 DB 계정 줄뿐이다. 09도 선생님 버전과 줄바꿈·주석·DTO 애너테이션 정도만 다르다. 그래서 실습 폴더는 덮어쓰지 않았다(덮어쓰면 내 수정이 사라진다).
- 10/9는 한글날이라 수업이 없다. 45일차 = 10/8.
- 사용자 제공 `코딩테스트오답노트23_김태경.docx`: 23회차(2026.10.08), Java 0 PASS · 2 FAIL, SQL 1 PASS · 1 FAIL. FAIL 세 문제는 제출 코드 칸이 비어 있어 정답 풀이만 옮겼다. 원문의 수식(int 범위)은 변환 과정에서 숫자가 빠져 다시 적었다. [23회차 기록](coding-tests/2026-10-08/README.md)

## 이번 반영

- 대시보드: [45일차](index.html#class-day45), 웹 개념 [69 BCrypt와 로그인](index.html#web-69) · [70 Command와 @Validated](index.html#web-70) · [71 파일 업로드·다운로드](index.html#web-71) · [72 resultMap과 collection](index.html#web-72) · [73 레이아웃·인터셉터·예외 처리](index.html#web-73), 코딩테스트 55~58, 📘 개념서 [39장](index.html#book-be-39)(38장 끝맺음도 고침), 학습 여정 27단계, 시험 문제 w68~w73(보기별 해설, 정답 위치를 섞음).
- 🗺️ 큰 그림: 타임라인(10/7 완료, 10/8~ 지금 = 로그인 게시판, 예정에서 파일 업로드 제거, 마지막 예정 = Security 켜기), 예제 프로젝트 표 10 행과 10 카드(09는 완료, 09의 "앞으로" 문구를 실제 진행에 맞게), 단계 10(웹 5)에 45일차 내용·면접 질문 추가, "앞으로 배울 것"의 파일 업로드 · Spring Security 칸, 헷갈리는 말 표(Command / DTO, resultType / resultMap).
- 새 프로젝트 [`10_login_board_springboot`](web_edu_project/10_login_board_springboot/): `target/` · `upload/` · `debug.log` · `.vscode/` · 래퍼 jar를 뺀 45개 파일을 복사하고 원본과 바이트 단위로 대조했다. 예외는 `application.properties`의 비밀번호 줄(`YOUR_DB_PASSWORD`). 프로젝트 README를 새로 썼다.
- 헤더·통계·메뉴 숫자: 수업 45일차, 카드 319장, 시험 205문항(웹 73), 코딩테스트 58, 웹 73, 학습 여정 27, 개념서 39장. README 4종과 첫 화면(개념 173항목)도 맞췄다.

## 실행 확인

검증용 사본(저장소 밖)에서만 바꾼 것: DB를 H2 메모리 DB(`MODE=MariaDB`)로, 포트 9191 · `127.0.0.1`, `schema.sql`로 `member` · `testboard` · `fileinfo`(워크스페이스의 `sql/login_board_springboot10.sql`과 같은 컬럼 순서), H2가 모르는 `sysdate()`를 사본의 Mapper에서만 `CURRENT_DATE`로. 설정 파일은 수업 파일을 복사하지 않고 새로 썼다. 테스트 계정은 사본 안에서만 만든 값이다.

| 대상 | 확인한 범위 | 결과 |
|---|---|---|
| 빌드 | Maven Wrapper `package` (Boot 4.1.1 · Security 7.1.1 · Thymeleaf 3.1.5 · layout-dialect 4.0.1 · MyBatis 3.5.19 · JDK 21) | 성공 |
| 인터셉터 | 로그인 전 `/board/boardList` · `/board/boardDetail` | 302 → `/user/login` |
| 회원가입 · 중복 확인 | 빈칸 · 올바른 값 · 같은 아이디 | 메시지 5개 / 302 / 302 → `/user/addUser`. `idChk` `{"id":null}` → `{"id":"tester01"}` |
| 로그인 · 로그아웃 | 짧은 비밀번호 · 틀린 비밀번호 · 없는 아이디 · 맞는 값 · GET/POST 로그아웃 | 메시지 3종 / 302 → `/`, HOME에 `USER tester01` / GET 로그아웃은 200 오류 화면, POST는 302. 로그인 전후 세션 ID 같음 |
| BCrypt | `spring-security-crypto-7.1.1`로 같은 비밀번호 두 번 encode | 해시 다름, `matches` 둘 다 true, 틀린 값 false, 10번 약 0.5초 |
| 글쓰기 · 파일 | 빈칸 · 파일 2개(한글·공백 이름) · 빈 파일 칸(브라우저 형식) · 파일 칸 없음 · 확장자 없는 파일 · `a.b.png` | 메시지 / 302 + UUID 이름 2개 / 302, 상세 "파일 1 · 첨부파일없음" / 200 오류 화면(NullPointerException) / 200 오류 화면 + 글 롤백(번호 건너뜀) / 저장 이름 `….b.png` |
| 작성자 | tester01 세션으로 hidden `id=tester02` | 302, 목록에 작성자 tester02 |
| 다운로드 | `file_seq=2` · 로그인 없이 `/upload/저장이름` · 없는 파일 | `application/octet-stream`, `attachment; fileName=%EB%B3%B4%EA%B3%A0%EC%84%9C+1.txt`, 내용 일치 / 200 / 200 오류 화면 |
| 수정 · 삭제 | 제목 빈칸 · 올바른 수정 · 체크 없이 삭제 · GET 삭제 · POST 여러 글 삭제 | 메시지 / 302 / "최소 하나 이상 체크해야 합니다." / 302 / 302. 논리 삭제한 글도 주소로 상세가 열림 |
| 잘못된 요청 | `board_seq` 없음 · 없는 글 · 없는 주소 | 200 오류 화면 / 500 오류 화면(템플릿 처리 실패) / 200 오류 화면 |
| Thymeleaf | 상세의 `th:onclick`(숫자 `${dto.board_seq}`를 넣은 주소) | `onclick="location.href='/board/mulDel?seq=1'"`로 출력 |
| 콜라츠 추측 | 공식 예제 + 1 이상 8,000,000 미만 전부 | 통과. int로 계산하면 25,051개 다름(626331 → 488), 정확히 500번째에 1이 되는 수 5개 |
| 같은 숫자는 싫어 | 공식 예제 + 무작위 20,000개 + 길이 1,000,000 | 통과, 약 10ms. `Integer` 1000끼리 `!=` → true |
| 23회차 SQL | SQL 파일 두 개를 그대로 읽어 SQLite 3.53(메모리 DB)에 실행, 10개 항목 | 통과. `= NULL` 0, `COUNT(AGE)` 0, DISTINCT로 2·4번 두 줄, WHERE로 3·5번 사라짐 |
| HTML 구조 · 앵커 | 대시보드 | 문서 내 앵커 1205개 모두 존재, 태그 짝 일치. 새 경고는 코드 예시 글자 속 id·주소와 실제로 있는 파일을 가리키는 `view.html?f=` 링크로, 전과 같은 오탐 |
| 인벤토리 | 백엔드 실제 카드 수·통계 | 일치(수업 44 · 코딩테스트 58 · 웹 73 · 학습 여정 27) |
| 시험 문제은행 | JavaScript로 실제 평가 | 205문항, id 중복·정답 범위 오류 없음. w68~w73 모두 "배운 데까지" 포함(181 → 187) |

로컬 MariaDB 접속 정보와 수업 워크스페이스의 실제 비밀번호는 읽거나 쓰지 않았다.

## 범위의 한계

- **실제 MariaDB와 Antigravity, 실제 브라우저에서 실행하지 않았다.** 결과는 H2 사본 기준이다. `upload/`의 이미지로 보아 수업 중 실제로 업로드해 본 것 같지만 기록으로 확인하지 못했다.
- 사용자가 놓쳤다는 10/8 마지막 1~2교시에 선생님이 코드를 더 바꿨더라도 GitHub에 올라오지 않아 반영할 수 없었다. 다음에 push되면 다시 대조한다.
- 문서 기준이며 실행하지 않은 것: `BindingResult` 순서를 바꿨을 때의 예외, `notNullColumn`으로 빈 FileBoardDto를 없애는 방법, `enctype`을 뺐을 때의 전송 형식, 무한 redirect, DATETIME 경계.
- Java·SQL 로컬 검증은 프로그래머스 재채점이 아니다.
