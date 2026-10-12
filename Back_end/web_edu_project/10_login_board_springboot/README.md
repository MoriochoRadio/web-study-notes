# 10_login_board_springboot — 로그인 게시판 (Boot · BCrypt · @Validated · 파일 업로드)

2026-10-08(45일차) 수업의 로컬 소스다. 선생님이 10/6에 레포(`kang99king3/back_end_edu_20260629`의 `web_edu_20260910/login_board_springboot10`)에 올린 **완성본**을 받아 실행하며 따라갔다. 회원가입·로그인(비밀번호 BCrypt), Command 객체 입력값 검사(`@Validated`), 글에 여러 파일 첨부·다운로드, Thymeleaf 레이아웃, 부트 방식 인터셉터와 전역 예외 처리를 다룬다.
[45일차](../../index.html#class-day45) · [개념 카드 69~73](../../index.html#web-69) · [개념서 39장](../../index.html#book-be-39)

## 선생님 원본과 다른 점

줄바꿈을 무시하고 대조한 결과 두 파일만 다르다.

| 파일 | 차이 |
|---|---|
| `controller/MemberController.java` | `@Autowired` 필드 → `@RequiredArgsConstructor` + `private final MemberService` (내 수정, 10/8 13:40). 나머지는 줄 정리 |
| `application.properties` | DB 계정 줄. 저장소에는 비밀번호를 `YOUR_DB_PASSWORD`로 바꿔 두었다 |

2026-10-12에 선생님 레포를 원격에서 다시 확인했다. 마지막 push는 10/7 16:01(09 프로젝트)이고, 10/8 수업분은 올라와 있지 않다.

## 현재 구현 범위

| 구간 | 상태 |
|---|---|
| 첫 화면 `GET /` | 로그인 전 SignIn·SignUp, 로그인 후 등급·아이디·로그아웃(POST) |
| 회원가입 `GET/POST /user/addUser` | `AddUserCommand` 검사(`@NotBlank` · `@Length(8~16)`), 비밀번호 `BCryptPasswordEncoder.encode`, 등급 `USER`. 같은 아이디는 DB `UNIQUE` 오류 → 폼으로 redirect |
| 아이디 중복 확인 `GET /user/idChk?id=` | jQuery ajax, `@ResponseBody Map` → `{"id":…}` |
| 로그인 `GET/POST /user/login` | `matches`로 비교, 성공하면 세션 `mdto` + `redirect:/`. 실패 메시지 두 가지(아이디 / 패스워드) |
| 로그아웃 `POST /user/logout` | `session.invalidate()`. GET은 받지 않는다 |
| 게시판 `/board/**` | `LoginInterceptor`가 세션 `mdto` 없으면 `/user/login`으로 |
| 글쓰기 `GET/POST /board/boardInsert` | `multipart/form-data`, `List<MultipartFile>`, UUID 이름으로 `user.dir/upload/`, `FILEINFO`에 이름 정보. `@Transactional(rollbackFor = Exception.class)` |
| 상세 `GET /board/boardDetail?board_seq=` | `LEFT OUTER JOIN` + `resultMap`의 `collection` |
| 수정 `POST /board/boardUpdate` · 다운로드 `GET /board/download?file_seq=` · 삭제 `/board/mulDel` | 삭제는 `DELFLAG='Y'` 논리 삭제, GET·POST 모두 받음 |
| Spring Security | 의존성은 있지만 `SecurityFilterChain`이 `anyRequest().permitAll()` — `PasswordEncoder` 빈만 쓴다. "쓸 경우" 설정은 주석 |
| 예외 | `@ControllerAdvice` `@ExceptionHandler(Exception.class)` → `templates/error.html` |

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
    ├─ application.properties  포트 9090 · DB · MyBatis · 업로드 크기 100MB
    ├─ mybatis/*.xml
    ├─ static/css/layout.css
    └─ templates/  layouts/layout · fragments/header·footer · home · error · member/* · board/*
```

테이블은 `hk` DB의 `member`(memberid · id · password · name · email · address · role), `testboard`(board_seq · id · title · content · regdate · delflag), `fileinfo`(file_seq · board_seq · origin_filename · stored_filename). `MemberMapper.xml`이 `VALUES(NULL,id,password,name,email,address,role)`처럼 **위치 기반**으로 넣으므로 컬럼 순서가 이와 같아야 한다.

## 실행하기

1. 위 세 테이블을 만든다(수업 자료의 DDL, 컬럼 순서 주의).
2. `application.properties`의 `spring.datasource.username` · `password`를 자기 PC 값으로 바꾼다(저장소에는 넣지 않는다).
3. `LoginBoardSpringboot10Application` 실행 또는 `mvnw spring-boot:run` → `http://localhost:9090/`.
4. 업로드 파일은 **실행한 폴더**(`user.dir`) 아래 `upload/`에 생긴다.

## 정리하며 확인한 것

실제 MariaDB와 Antigravity로는 실행하지 않았다. 저장소 밖 사본에서 **DB만 H2 메모리 DB(MariaDB 모드)**로 바꾸고(H2가 `sysdate()`를 몰라 사본의 Mapper만 `CURRENT_DATE`), jar로 실행해 요청을 보냈다.

- **확인함** — 가입 → 로그인 → 글쓰기(파일 2개) → 상세 → 다운로드 → 수정 → 삭제 → 로그아웃이 모두 동작. 로그인 전 `/board/**`는 `/user/login`으로 302.
- **확인함** — 같은 비밀번호를 두 번 `encode`하면 해시가 다르고 `matches`는 둘 다 true(spring-security-crypto 7.1.1).
- **확인함** — 작성자를 폼의 hidden `id`에서 받아, 로그인한 채 `id`만 다른 회원으로 바꿔 보내면 **그 회원 이름으로 글이 저장**된다.
- **확인함** — 첨부 없는 글도 상세에 "파일 1"(빈 FileBoardDto 1개, 화면은 "첨부파일없음"). 확장자 없는 파일은 `substring(-1)` 예외 → 오류 화면, 글은 롤백. `a.b.png`는 저장 이름이 `….b.png`. 파일 칸이 아예 없는 요청은 `files.get(0)` NullPointerException.
- **확인함** — 다운로드 헤더 `fileName=%EB%B3%B4%EA%B3%A0%EC%84%9C+1.txt`(공백이 `+`). `/upload/저장이름`은 로그인 없이 열린다.
- **확인함** — 없는 주소·GET 로그아웃·`board_seq` 없는 상세는 오류 화면이 **상태 200**, 없는 글 번호 상세는 500. 로그인 전후 세션 ID가 같다. `mulDel`은 GET으로도 지운다. 논리 삭제한 글도 주소로 상세가 열린다.
- **확인하지 않음** — 실제 MariaDB · Antigravity · 실제 브라우저로 누른 화면, Security 설정을 켰을 때의 동작.

## 저장소에 포함하지 않은 것

| 제외 | 이유 |
|---|---|
| `target/` · `debug.log` | 빌드 산출물·빌드 로그 |
| `upload/` | 수업 중 올린 파일(실행할 때 생긴다) |
| `.mvn/wrapper/maven-wrapper.jar` · `.vscode/` | 래퍼가 내려받는 파일 · 개인 IDE 설정 |
| DB 비밀번호 | `YOUR_DB_PASSWORD`로 바꿔 두었다 |
