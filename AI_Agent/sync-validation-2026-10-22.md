# 2026-10-22 반영 기록 — Day 5 보충(DB 연동)과 Day 6~7 LangChain

[AI Agent 노트](index.html) · [db_main.py](python_agent/day05/db_main.py) · [day0607_실습.ipynb](python_agent/day06/) · [전날 기록](sync-validation-2026-10-21.md)

오전에는 어제 만든 상품 CRUD를 MariaDB에 잇는 `db_main.py`를 선생님의 개발 요청서(`dev_prompt.md`)대로 만들었고, 오후에는 교안 Day 6~7 합본(LangChain)과 개념 추가본(LLM · Agent)을 나갔다. 이날 코딩테스트 오답노트는 다운로드 폴더에 없다.

## 비밀값 처리

| 대상 | 처리 |
|---|---|
| 실습 폴더 `.env`(10/22 11:18, OpenAI API 키로 보임) | **열지 않았고 저장소에 올리지 않았다.** 루트 `.gitignore`에 `.env` · `.env.*`를 넣었다(이미 추적 중인 파일 중 걸리는 것 없음) |
| `day05/db_main.py`의 DB 비밀번호 | 접속 주소(`DATABASE_URL`) 2줄과 그 위 주석 2줄, 모두 4곳을 `YOUR_DB_PASSWORD`로 바꿔 복사했다. 원본에서 모은 비밀번호 값이 사본에 하나도 없음을 값을 출력하지 않고 프로그램으로 확인했다 |
| 노트북 출력 | 실습 · 선생님 노트북 모두 키 모양 문자열(`sk-…`) 0개. 실습 노트북은 키가 있는지만 `True`로 찍는다 |
| 선생님 `db_main.py` · `dev_prompt.md` | DB 계정 정보가 적혀 있어 이 저장소에 옮기지 않았다. 비교는 가린 상태로만 했다 |

## 근거로 쓴 자료

| 자료 | 위치 | 쓴 곳 |
|---|---|---|
| `Day6-Day7_강의자료.pptx`(18쪽) · `Day6_강의자료_개념추가.pptx`(본문 10쪽 추출) | 선생님 배포 자료(저장소에 올리지 않음) | 개념 카드 py-22~26, 실습 카드 문제, 시험 |
| 실습 폴더 `day05/db_main.py` · `main.py`(주석 추가) · `day06/day0607_실습.ipynb` · `day0607_실습예제.md` (10/22 09:34~15:21) | `AI_Agent/python_agent/` | 수업 카드 ai-day04, 개념 py-21, 실습 lab-28~34 |
| 선생님 레포 10/22 커밋 5개(09:36~15:19) | GitHub `kang99king3/back_end_edu_20260629` | "선생님 풀이와 비교" |

## 확인한 것

| 항목 | 방법 | 결과 |
|---|---|---|
| `db_main.py` CRUD | 접속 주소만 SQLite(`sqlite:///./test.db`) + SQLite 스레드 옵션 한 줄을 바꾼 저장소 밖 사본을 uvicorn으로 띄우고 요청 15개 | POST 201(재고 기본 0), 음수 가격 · 101자 이름 · 이름 빠짐 422, 목록 최신순, 없는 상품 404, PUT 200 · 필수 누락 422 · 없는 id 404, DELETE 200 → 두 번째 404. SQL 로그의 UPDATE는 바뀐 열만 |
| 요청서 대비 | `dev_prompt.md`(가린 상태)와 대조 | 테이블 · 엔드포인트 · 상태 코드 · 스키마 분리 · `Depends(get_db)` · 테이블 자동 생성 · 단독 실행 모두 충족 |
| LangChain(LLM 없이) | 키 환경변수를 지운 저장소 밖 폴더에서 `FakeListChatModel`로 | `@tool` → `StructuredTool`, `.args`, 잘못된 인자 `ValidationError`, docstring 없으면 `ValueError`, `eval`이 `__import__('platform')…` 식도 실행, `ast` 계산기는 막음. 틀 변수 누락 `KeyError`, parser 없으면 `AIMessage`(`upper()` 없음), parser 있으면 문자열(`str` 상속 `TextAccessor`). history 메시지 구성 · 길이 2 → 4, 두 번째 호출에 앞 대화가 실림. 13쪽 예제 칸을 새 이름 공간에서 실행하면 `NameError: HumanMessage`. 키 없이 `ChatOpenAI(...)` → `OpenAIError: Missing credentials` |
| 실습예제 md 확인용 값 | 도구 · 계산만 실행 | 섭씨 100 → 212.0, "36.5" → 97.7, "랭체인" → "인체랭", 12000 + 4500 = 16500, + 5000 = 21500 |
| 노트북 상태 | 칸별 실행 번호 · 저장된 출력 대조 | 1번 실습 칸(실행 번호 없음)의 첫 출력이 지금 코드의 질문과 다름. 13쪽 예제 칸은 아래 칸의 import에 기대어 실행됨 |

## 확인하지 않은 것

- 실제 MariaDB 연결(접속 정보를 쓰지 않음), 실제 OpenAI 호출(사용자 키 · 요금 — 노트북의 LLM 답은 그때 받은 그대로이며 내용의 사실 여부도 확인하지 않음).
- 15쪽 Memory 실습과 실습예제 md는 노트북에 풀이가 없다(참고 풀이는 가짜 모델로 메시지 흐름만 확인).
- 노트북 1번 실습 칸의 저장된 출력 첫 줄에 개인(수업 강사) 이름이 들어간 LLM 답이 있어, 사용자 요청으로 **저장소 사본에서 그 한 줄만 지웠다**(10/22 후속 커밋). 실습 폴더 원본은 그대로다. 앞 커밋(8469b94)의 이력에는 남아 있다.
