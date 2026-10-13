# 10_login_board_springboot — 로그인 게시판 (Boot · BCrypt · @Validated · 파일 업로드)

2026-10-08(45일차) 수업의 로컬 소스에 **2026-10-12(46일차) 개선 과제**를 반영한 것이다. 선생님이 10/6에 레포(`kang99king3/back_end_edu_20260629`의 `web_edu_20260910/login_board_springboot10`)에 올린 **완성본**을 받아 실행하며 따라갔다. 회원가입·로그인(비밀번호 BCrypt), Command 객체 입력값 검사(`@Validated`), 글에 여러 파일 첨부·다운로드, Thymeleaf 레이아웃, 부트 방식 인터셉터와 전역 예외 처리를 다룬다. 46일차에는 선생님이 준 개선사항 표 5개(첨부파일 수정 · 작성자 본인 확인 · 업로드 경로 설정 분리 · 생성자 주입 통일 · `println` → SLF4J)를 고쳤다.
[45일차](../../index.html#class-day45) · [46일차](../../index.html#class-day46) · [개념 카드 69~77](../../index.html#web-69) · [개념서 39~40장](../../index.html#book-be-39)

## 46일차 개선 과제 (2026-10-12)

선생님이 "직접 해 보라"며 준 표다. 쉬운 것부터 ④ → ⑤ → ③ → ② → ① 순서로 했다. ④는 내가 직접, 나머지는 Claude와 함께 바꾸며 단계마다 설명을 들었다.

| 번호 | 과제 | 바꾼 것 |
|---|---|---|
| ① | 수정할 때 첨부파일 교체·개별 삭제·추가 | 수정 폼 `multipart/form-data` + 파일마다 삭제 체크박스(`delFileSeq`) + 새 파일 칸. `UpdateBoardCommand`에 `int[] delFileSeq` · `List<MultipartFile> filename`. `BoardService.updateBoard`가 한 트랜잭션에서 제목·내용 → 체크한 파일이 **이 글의 파일인지** 확인 후 DB 기록 삭제 → 새 파일 저장 → **마지막에** 디스크 삭제. 글쓰기와 같은 저장 코드는 `saveFiles`로 분리. `FileMapper.deleteFile` 추가 |
| ② | 수정·삭제할 때 작성자 본인 확인 | `BoardService.isWriter(글번호, 로그인아이디)` — DB의 작성자와 세션 `mdto`의 아이디를 `equals`로 비교. `boardUpdate` · `mulDel` 맨 앞에서 확인(여러 글 삭제는 하나라도 남의 글이면 전부 취소) + `log.warn`. 글쓰기 작성자도 hidden 칸 대신 세션에서. 상세 화면 버튼·체크박스·파일 칸은 본인 글일 때만(`th:if`, 편의) |
| ③ | 업로드 경로 외부 설정 분리 | `file.upload-dir=${user.dir}/upload` 한 줄. `BoardService`(저장) · `WebMvcConfig`(`/upload/**`) · `FileService`(다운로드, 표에 없던 곳)가 `@Value("${file.upload-dir}")`로 읽는다. `@Value` 필드는 `final` 없이 |
| ④ | `BoardService` 생성자 주입 통일 | `BoardService` · `FileService` · `MemberService` · `BoardController`의 `@Autowired` 필드 → `private final` + `@RequiredArgsConstructor` |
| ⑤ | `System.out.println` → SLF4J | 6개 클래스 21곳을 `@Slf4j` + `log.debug/info/warn/error`로. `logging.level.com.hk.board=debug` · `logging.file.name=logs/app.log` |

표에 없던 수정: 첨부 없는 글이 상세에 "파일 1"로 나오던 것을 이름이 있는 파일만 세도록(`boardDetail.html`), 파일 칸이 아예 없는 요청의 `NullPointerException`을 `saveFiles`의 null 확인으로 막았다.

## 선생님 원본과 다른 점

10/8에는 `MemberController`(`@RequiredArgsConstructor` + `final`, 내 수정)와 `application.properties`의 DB 계정 줄만 달랐다. 10/12 개선 과제로 12개 파일이 더 바뀌었다 — `command/UpdateBoardCommand` · `config/LoginInterceptor` · `config/WebMvcConfig` · `controller/BoardController` · `controller/MemberController` · `mapper/FileMapper` · `service/BoardService` · `service/FileService` · `service/MemberService` · `application.properties` · `mybatis/FileMapper.xml` · `templates/board/boardDetail.html`. 저장소 사본은 실습 폴더(`workspace-boot/login_board_springboot10`)와 바이트 단위로 같고, `application.properties`의 비밀번호 줄만 `YOUR_DB_PASSWORD`다.

2026-10-12에 선생님 레포를 원격에서 다시 확인했다. 마지막 push는 10/7 16:01(09 프로젝트)이고, 10/8 수업분과 개선 과제 풀이는 올라와 있지 않다.

## 현재 구현 범위 (2026-10-12)

| 구간 | 상태 |
|---|---|
| 첫 화면 `GET /` | 로그인 전 SignIn·SignUp, 로그인 후 등급·아이디·로그아웃(POST) |
| 회원가입 `GET/POST /user/addUser` | `AddUserCommand` 검사(`@NotBlank` · `@Length(8~16)`), 비밀번호 `BCryptPasswordEncoder.encode`, 등급 `USER`. 같은 아이디는 DB `UNIQUE` 오류 → 폼으로 redirect |
| 아이디 중복 확인 `GET /user/idChk?id=` | jQuery ajax, `@ResponseBody Map` → `{"id":…}` |
| 로그인 `GET/POST /user/login` | `matches`로 비교, 성공하면 세션 `mdto` + `redirect:/`. 실패 메시지 두 가지(아이디 / 패스워드) |
| 로그아웃 `POST /user/logout` | `session.invalidate()`. GET은 받지 않는다 |
| 게시판 `/board/**` | `LoginInterceptor`가 세션 `mdto` 없으면 `/user/login`으로 |
| 글쓰기 `GET/POST /board/boardInsert` | `multipart/form-data`, `List<MultipartFile>`, UUID 이름으로 `file.upload-dir`(기본 `user.dir/upload/`), `FILEINFO`에 이름 정보. 작성자는 세션에서. `@Transactional(rollbackFor = Exception.class)` |
| 상세 `GET /board/boardDetail?board_seq=` | `LEFT OUTER JOIN` + `resultMap`의 `collection` |
| 수정 `POST /board/boardUpdate` | 본인 글만. 제목·내용 + 첨부파일 삭제(체크)·추가를 한 트랜잭션으로. 남의 글 파일 번호를 섞으면 전부 롤백 |
| 다운로드 `GET /board/download?file_seq=` · 삭제 `/board/mulDel` | 삭제는 본인 글만, `DELFLAG='Y'` 논리 삭제, GET·POST 모두 받음 |
| Spring Security | 의존성은 있지만 `SecurityFilterChain`이 `anyRequest().permitAll()` — `PasswordEncoder` 빈만 쓴다. "쓸 경우" 설정은 주석 |
| 예외 | `@ControllerAdvice` `@ExceptionHandler(Exception.class)` → `templates/error.html` |
| 로그 | `@Slf4j`. `com.hk.board`는 debug부터(MyBatis SQL 포함), 콘솔 + `logs/app.log` |

## 구조

```
10_login_board_springboot/
├─ pom.xml                     Boot 4.1.1 · security · thymeleaf · thymeleaf-layout-dialect · validation · MyBatis 4.1.0
├─ src/main/java/com/hk/board/
│   ├─ command/   AddUser · Login · InsertBoard · UpdateBoard · DelBoard  (화면 입력 + 검사 규칙)
│   ├─ config/    SecurityConfig · WebMvcConfig · LoginInterceptor · ExceptionHandle
│   ├─ controller/ Home · Member(/user) · Board(/board)
│   ├─ dtos/      MemberDto · BoardDto(+ List<FileBoardDto>) · FileBoardDto   (@Alias)
│   ├─ mapper/    MemberMapper · BoardMapper · FileMapper                    (@Mapper)
│   ├─ service/   MemberService · BoardService · FileService
│   └─ status/RoleStatus.java  enum ADMIN, USER
└─ src/main/resources/
    ├─ application.properties  포트 9090 · DB · MyBatis · 업로드 크기 100MB · 로그 · file.upload-dir
    ├─ mybatis/*.xml
    ├─ static/css/layout.css
    └─ templates/  layouts/layout · fragments/header·footer · home · error · member/* · board/*
```

테이블은 `hk` DB의 `member`(memberid · id · password · name · email · address · role), `testboard`(board_seq · id · title · content · regdate · delflag), `fileinfo`(file_seq · board_seq · origin_filename · stored_filename). `MemberMapper.xml`이 `VALUES(NULL,id,password,name,email,address,role)`처럼 **위치 기반**으로 넣으므로 컬럼 순서가 이와 같아야 한다.

## 실행하기

1. 위 세 테이블을 만든다(수업 자료의 DDL, 컬럼 순서 주의).
2. `application.properties`의 `spring.datasource.username` · `password`를 자기 PC 값으로 바꾼다(저장소에는 넣지 않는다).
3. `LoginBoardSpringboot10Application` 실행 또는 `mvnw spring-boot:run` → `http://localhost:9090/`.
4. 업로드 파일은 `file.upload-dir`(기본값: **실행한 폴더** 아래 `upload/`)에, 로그는 실행한 폴더의 `logs/app.log`에 생긴다. 업로드 폴더를 옮기려면 이 한 줄만 바꾼다.

## 개선 과제 확인 (2026-10-12)

저장소 사본을 저장소 밖에 복사해 `127.0.0.1:9098`로 실행하고, **로컬 MariaDB**(`hk`, 실습용 계정)에 임시 회원 `zztest_a` · `zztest_b`를 만들어 요청을 보냈다. 끝난 뒤 테스트 행은 모두 지웠다(남은 행 0). 21개 항목 통과.

- **확인함** — 기동(생성자 주입 · `@Value` 값), 시작 로그 `INFO … WebMvcConfig : 업로드 폴더: …/upload`, `/upload/저장이름`이 설정 폴더의 파일을 보여 줌.
- **확인함** — 글쓰기 hidden `id`를 다른 회원으로 바꿔 보내도 작성자는 로그인한 회원. 파일 칸이 없는 요청도 저장됨. 첨부 없는 글은 "파일 0".
- **확인함** — B가 A의 글 번호로 `mulDel` · `boardUpdate`(파일 삭제 체크 포함)를 보내면 목록으로 돌아가고 글·파일 그대로, WARN 로그. B가 본 A 글 상세에는 삭제 체크박스·파일 칸이 없음.
- **확인함** — A가 f1 삭제 체크 + f3 추가 → 남은 파일 f2 · f3, f1은 디스크에서도 삭제. 새 파일 다운로드 내용 일치. 빈 파일 칸으로 수정하면 파일 그대로.
- **확인함** — A가 자기 다른 글의 파일 번호를 끼워 수정하면 오류 화면, **제목 수정까지 롤백**, 그 파일은 디스크에 남음.
- **확인함** — DEBUG 로그에 MyBatis SQL(`==>  Preparing:`)이 보이고 `logs/app.log`가 생김.
- **확인함(10/13, 일부러 고장 낸 사본)** — `uploadDir`에 `final`을 붙이면 `Parameter 3 of constructor in com.hk.board.service.BoardService required a bean of type 'java.lang.String'`로 기동 실패, 키 이름을 틀리면 `Could not resolve placeholder`로 기동 실패.
- **확인하지 않음** — Antigravity에서 실행, 실제 브라우저로 누른 화면, 확장자 없는 파일 업로드(`FileService.uploadFiles`는 그대로라 10/8과 같은 오류가 날 것으로 보인다).

## 10/8에 확인한 것

10/8에는 실제 MariaDB와 Antigravity로는 실행하지 않았다. 저장소 밖 사본에서 **DB만 H2 메모리 DB(MariaDB 모드)**로 바꾸고(H2가 `sysdate()`를 몰라 사본의 Mapper만 `CURRENT_DATE`), jar로 실행해 요청을 보냈다.

- **확인함** — 가입 → 로그인 → 글쓰기(파일 2개) → 상세 → 다운로드 → 수정 → 삭제 → 로그아웃이 모두 동작. 로그인 전 `/board/**`는 `/user/login`으로 302.
- **확인함** — 같은 비밀번호를 두 번 `encode`하면 해시가 다르고 `matches`는 둘 다 true(spring-security-crypto 7.1.1).
- **확인함** — 작성자를 폼의 hidden `id`에서 받아, 로그인한 채 `id`만 다른 회원으로 바꿔 보내면 **그 회원 이름으로 글이 저장**된다. → 10/12에 고침
- **확인함** — 첨부 없는 글도 상세에 "파일 1"(빈 FileBoardDto 1개, 화면은 "첨부파일없음") → 10/12에 "파일 0"으로 고침. 확장자 없는 파일은 `substring(-1)` 예외 → 오류 화면, 글은 롤백(그대로). `a.b.png`는 저장 이름이 `….b.png`. 파일 칸이 아예 없는 요청은 `files.get(0)` NullPointerException → 10/12에 고침.
- **확인함** — 다운로드 헤더 `fileName=%EB%B3%B4%EA%B3%A0%EC%84%9C+1.txt`(공백이 `+`). `/upload/저장이름`은 로그인 없이 열린다.
- **확인함** — 없는 주소·GET 로그아웃·`board_seq` 없는 상세는 오류 화면이 **상태 200**, 없는 글 번호 상세는 500. 로그인 전후 세션 ID가 같다. `mulDel`은 GET으로도 지운다(10/12부터는 본인 글만). 논리 삭제한 글도 주소로 상세가 열린다.
- **확인하지 않음** — 실제 MariaDB · Antigravity · 실제 브라우저로 누른 화면, Security 설정을 켰을 때의 동작.

## 저장소에 포함하지 않은 것

| 제외 | 이유 |
|---|---|
| `target/` · `debug.log` · `logs/` | 빌드 산출물·빌드 로그 · 실행 로그(`logs/app.log`) |
| `upload/` | 수업 중 올린 파일(실행할 때 생긴다) |
| `.mvn/wrapper/maven-wrapper.jar` · `.vscode/` | 래퍼가 내려받는 파일 · 개인 IDE 설정 |
| DB 비밀번호 | `YOUR_DB_PASSWORD`로 바꿔 두었다 |
