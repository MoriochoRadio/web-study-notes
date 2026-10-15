# 2026-10-15 수업 반영과 검증 기록

## 반영 근거

- 수업 워크스페이스 `C:\Users\neo62\dev\workspace-boot\schedule_springboot11`(10/15 10:58 ~ 16:45). 이날은 코딩테스트 오답노트가 없다(다운로드 폴더의 최신은 25회차). 같은 날 받은 `포트폴리오-…zip`은 이번 범위가 아니다.
- **선생님 GitHub 확인** — 10/15 커밋 9개(09:51 `901d447` 일정목록서비스추가 ~ 15:49 `8152dc9` 상세보기 완료). 10:52 `fbce63a` "코드수정"에서 `CalMapper.xml`의 `ADN`이 `AND`로 고쳐졌다. 줄바꿈 · 공백을 무시하고 대조하면 실습 폴더와 다른 곳은
  - 이 PC용: `application.properties`의 포트 · DB 계정(비밀번호 줄을 거른 출력으로만 비교), `CalDto`의 `lombok.ToString`(선생님은 `groovy.transform.ToString`), `CalMapper.xml`의 DTD 이름
  - 선생님 마지막 push 뒤 실습 폴더에 더해진 것(16:17 ~ 16:45): **일정 수정**(`CalController.calBoardUpdate` · `CalServiceImp.calBoardUpdate`), **달력 칸 미리 보기**(`CalMapper`의 `calViewList` · `makeCalendar`의 `clist` · `Util.getCalView` · `calendar.html`). 선생님 `Util`에는 "파리미터(list객체, 해당 일(date))" 주석만 있다. 이 두 가지를 쓴 Claude 세션 기록은 없다(세션 검색).
  - 나머지는 줄 정리뿐이다.
- 48일차 과제 풀이 코드(`defaultValue = "hk"`, 값이 없으면 오늘)는 선생님 코드(`@RequestParam Map`)로 바뀌었다. 10/14 코드는 커밋 `1ed4a76`, 풀이 노트 `과제풀이_일정목록조회.md`는 프로젝트 폴더에 그대로 있다.

## 이번 반영

- 대시보드: [49일차](index.html#class-day49), 웹 개념 [82 목록과 여러 개 삭제](index.html#web-82) · [83 상세보기와 수정](index.html#web-83) · [84 달력 칸에 일정 3개](index.html#web-84), 📘 개념서 [43장](index.html#book-be-43)(42장 "다음 장으로"에 실제 다음 수업을 더함), 학습 여정 31단계, 시험 문제 w90~w94(보기별 해설, 정답 위치를 섞음).
- 앞 카드 후속 안내: [48일차](index.html#class-day48) 실습 파일 안내(10/14 코드는 `1ed4a76`), [web-81](index.html#web-81)(과제 풀이가 선생님 코드로 바뀜), 47일차 실습 파일 안내(49일차까지 진행한 상태).
- 🗺️ 큰 그림(백엔드): 타임라인(49 — 삭제 · 상세 · 수정 · 미리 보기, 남은 것은 로그인), 프로젝트 표 11 행 · 11 카드(한 일 47~49일차 6줄 · 배운 것 +2 · 다음으로), 단계 "웹 6"(꼭 알 것 6 · 헷갈리는 것 6), 큰 생각 ⑥에 "화면에 다시 찍는 사용자 글자", 헷갈리는 말에 `th:text` / `th:utext` · `@Component` / `@Bean`. 학습 여정 안내 문장(30 → 31단계, "현재는 …" 10/15). 웹 탭 머리말(카드 01~84).
- 🗺️ 큰 그림(프런트엔드): 타임라인 문장(이스케이프 — React의 `dangerouslySetInnerHTML`과 같은 자리), 머리말 점검일.
- 프로젝트 사본 [`11_schedule_springboot`](web_edu_project/11_schedule_springboot/): 새 파일 5개(`DeleteCalCommand` · `UpdateCalCommand` · `WebConfig` · `Util` · `calboarddetail.html`)와 바뀐 파일을 복사하고 원본과 바이트 단위로 대조했다. 예외는 `application.properties`의 비밀번호 줄(`YOUR_DB_PASSWORD`). 프로젝트 README의 구현 범위 · 구조 · 선생님 레포와 다른 점 · 확인 목록을 고쳤다.
- 헤더 · 통계 · 메뉴: 수업 49일차(카드 48장), 카드 342장, 시험 226문항(웹 94), 웹 84, 학습 여정 31, 개념서 43장. README 4종과 첫 화면(개념 184항목)도 맞췄다.

## 실행 확인

검증용 사본(저장소 밖)에서만 바꾼 것: pom에 H2, 설정 파일은 수업 파일을 복사하지 않고 새로 씀(H2 메모리 DB `MODE=MariaDB`, 127.0.0.1:9192), `schema.sql`로 `calboard`, Mapper의 `SYSDATE()` → `CURRENT_TIMESTAMP`(H2에 없음). Java 코드 · 템플릿 · CSS는 실습 폴더 그대로다. 요청은 Node `fetch`, 화면은 헤드리스 Edge(폭 1500px)로 그렸다.

| 대상 | 확인한 범위 | 결과 |
|---|---|---|
| 빌드 · 기동 | Maven Wrapper `package`(Boot 4.1.1 · JDK 21) → `java -jar` | 성공. 서버 로그 ERROR는 아래 500 세 종류뿐 |
| 목록 | 10/15(일정 4개), 값 없음 · `date=` · `date` 빠짐 | 시간순 4줄(`2026.10.15 09:00` 모양) / 500 · 500 · 500(`isTwo(null)` NPE · `parseInt("")`) |
| 여러 개 삭제 | 체크 0개 · 11개 · 10개 | 메시지 "삭제하려면 최소 하나 이상 체크하세요"와 같은 목록 / "한번에 최대 10개까지만…"과 같은 목록 11줄 / 302 그날 목록 · 1줄 남음 |
| 상세보기 | `seq=2`, `seq=999`, `seq` 없이 | 제목 · 내용 · 셀렉트 2026/10/15/12/30 / 500 · 500(`source cannot be null`) |
| 수정 | 10/15 12:30 → 10/16 13:00, 빈칸, 폼의 아이디를 `other`로 | 302 10/16 목록에만 보임 / 메시지 2개 / 302 · 저장된 아이디는 `hk` 그대로 |
| 달력 칸 미리 보기 | 같은 날 4개 · 11개, 긴 제목, 다른 달 | 칸마다 3개, "점심 약속입...", 11월 일정은 11월 달력에만 |
| 미리 보기 이스케이프 | 제목 `<!--`(10/22) · `<b>굵게`(10/23) | 23일 칸이 사라짐(날짜 31개 중 30개만), 그 뒤 날짜가 모두 굵게 — 스크린샷으로 확인 |
| `Util.toDates` | `LocalDateTime.parse("202609311200", yyyyMMddHHmm)` 등 직접 실행 | 9/31 → 2026.09.30, 2/30 → 2026.02.28, 9/32 · 13월 → 예외 |
| HTML · 앵커 · 인벤토리 · 시험 | 백엔드 · 프런트엔드 대시보드, 전체 링크 | 태그 짝 일치, 문서 내 앵커 · 뷰어 링크 모두 존재, 카드 수 = 통계, 226문항 · id 중복 없음 · w90~w94 "배운 데까지" 포함 |

로컬 MariaDB 접속 정보는 쓰지 않았다. `application.properties`는 비밀번호 줄을 거른 출력으로만 대조했다.

## 범위의 한계

- **실제 MariaDB와 Antigravity에서 실행하지 않았다.** 결과는 H2 사본 기준이다.
- 고치는 법(`HtmlUtils.htmlEscape`, `th:each` + `th:text`, `ResolverStyle.STRICT` + `uuuu`)은 설명만 했고 바꾼 코드를 실행하지 않았다. 실습 폴더 코드는 고치지 않았다.
- 카드의 "`mdateToYMDHM`을 빼면 상세 화면 오류", "`@Size(max = 10)`로도 된다", "ModelMapper를 빈으로 두는 이유"는 코드 · 규칙으로 따진 답이며 실행하지 않았다.
- 교안 183쪽의 `[(${@util.getCalViewList(i,clist)})]`는 다른 세션이 옮겨 적은 메모로만 봤다.
