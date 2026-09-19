# 수업 자료 대조 — 2026-09-18 진도

대조일: 2026-09-20. 기준: [강사 저장소](https://github.com/kang99king3/back_end_edu_20260629/tree/323b3ef18f9ed0c1403982da46f7977361774f5b), 커밋 `323b3ef`. 기존 저장소의 9월 16일 기록 이후 변경분을 확인했다. 수업 참여 기록을 소급 작성한 것이 아니라 누락 자료를 보충한 기록이다.

## 반영 항목

| 대상 | 기존 상태 | 반영 내용 |
|---|---|---|
| 02_hkboard_MVC1 | CRUD와 체크박스 전체 선택 | `mulDel`, JDBC batch/transaction, 다중 삭제 요청, 선택 검증, error.jsp |
| 03_hello_servlet | 없음 | Servlet 요청 처리·생명주기, ServletConfig/Context, Session, UTF-8 Filter |
| 04_hkboard_MVC2 | 없음 | `*.board` Servlet 컨트롤러, 목록·등록 경로, Filter와 기존 MVC1 화면 |
| Java 카드 게임 | 개인 실습 있음 | 강사 `day13_1`의 역할 분리 예제 6개를 별도 패키지로 보충 |
| Java 채팅 | `D3_Chat*` 예제 있음 | 대화명을 먼저 전송하는 `D4_ChatClient2/Server2` 예제 추가 |
| 코딩테스트 | 15회차까지 기록 | [16회차 보충 풀이](coding-tests/2026-09-18/README.md) 2문제 |

## 파일명이 달라 누락처럼 보였던 항목

| 강사 경로·이름 | 기존 개인 저장소 대응 |
|---|---|
| `front_end_20260706/2.CSS` | `Front_end/2-css` |
| React `03_perf_hooks` | `03_pref_hooks` |
| `D4_ConstructorMain` | `D1_ConstructioMain` |
| `D3_SingletonMain/Test` | `D3_SingletomTest`, `D3_Singleton` |
| `D2_StringMethodMain` | `D2_StringMethonMain` |
| `AntQuiz` | `D1_Ant` |
| `day11_2` 마방진 | `day11/day11_2`와 변경된 클래스명 |
| `D1_ExceptionTest`, `D1_LambdaTest` | `D1_Exception`, `D1_LabdaTest` |
| `userInsertForm.jsp` | 기존 `userInsertFrom.jsp`; 링크도 기존 이름 사용 |
| React `AppProviders.jsx` | 기존 App.jsx에서 Provider 3개를 직접 중첩 |

프런트엔드와 초기 Java는 개인 풀이·주석·파일명 차이가 많다. 동일 주제의 개인 풀이를 강사 코드로 덮어쓰지 않았다. 강사의 CHALLENGE·과제 설명은 [원본 저장소](https://github.com/kang99king3/back_end_edu_20260629/tree/323b3ef18f9ed0c1403982da46f7977361774f5b)에서 연결해 볼 수 있다. 생성된 IO 파일, 이미지 출력물, Servers 설정, 라이브러리, API 키 안내 파일은 동기화 대상에서 제외했다. 이 대조는 모든 기존 예제의 동작이 동일하다는 검증은 아니다.

## 출처와 조정 사항

새 Servlet/MVC2·Java 보충 예제와 MVC1 다중 삭제 부분은 강사 수업 코드를 바탕으로 반영했다. 개인 풀이와 구분하기 위해 이 문서에 기준 커밋·경로를 남긴다. 강사 저장소에 별도 라이선스가 표시되지 않아 해당 코드에 새로운 라이선스를 부여하지 않는다.

- MVC1에는 기존 개인 코드와 null command 방어를 유지하고 새 진도만 합쳤다.
- 새 MVC2의 DB 설정은 `STUDY_DB_USER`, `STUDY_DB_PASSWORD`, 선택적 `STUDY_DB_URL` 환경 변수로 받는다. 비밀번호는 포함하지 않는다.
- 새 프로젝트에 기존과 같은 Java 21·Tomcat 10.1 Eclipse 메타데이터를 추가했다.
- 채팅 서버는 이 노트북 내부 실습용으로 loopback에만 바인딩하도록 바꿨다.
- 새 예제의 주석은 수업 당시 표현이다. 생명주기 등 정확한 설명은 웹 보충 카드에 정리했다.

## 최신 코드에도 남은 사항

1. MVC2의 Servlet URL 전환은 목록·입력 폼·등록까지다. 상세·수정·삭제·다중 삭제는 JSP 컨트롤러 경로가 남아 있다. MVC2 전체 완료로 표시하지 않는다.
2. `mulDel`은 SQL 예외에 rollback하지만 영향 행 수를 commit 뒤에 확인한다. 없는 번호가 섞였을 때의 “전부 성공 아니면 취소”를 보장하지 않는다. 값 검증도 브라우저에만 있어 서버 검증 보완이 필요하다.
3. 기존 MVC1의 seq 숫자 검증·빈 DTO·수정 알림 중복은 이번 진도 추가와 별개다. error.jsp 부재는 이번에 해소되었다.
4. Servlet의 `init(ServletConfig)` 예제는 `super.init(config)`를 생략한다. 매개변수 config 직접 사용은 되지만 상속받은 `getServletConfig()`·`getServletContext()`를 이후 쓸 때 문제가 된다. 초기화 메서드의 호출 관계와 함께 복습한다.
5. 카드 예제는 문자열 `==` 비교, 인원 범위 검사, 일부 공동 1위 처리가 보완 대상이다. 참고 예제를 정답 구현으로 표시하지 않는다.

공개 웹은 정적 학습 노트다. JSP/Servlet의 실행은 로컬 Tomcat에서 한다.
