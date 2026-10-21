# 2026-10-21 반영 기록 — AI Agent 과정 셋째 날(Day 5 FastAPI)

[AI Agent 노트](index.html) · [실습 파일 day05/main.py](python_agent/day05/main.py) · [전날 기록](sync-validation-2026-10-20.md)

교안 Day 5(FastAPI로 나만의 API 서버 만들기) 하나를 나간 날이다. 실습은 노트북이 아니라 서버 코드 `day05/main.py` 한 파일에 다섯 개를 이어 풀었다. 이날 코딩테스트 오답노트는 다운로드 폴더에 없다(마지막은 10/20의 28회차).

## 근거로 쓴 자료

| 자료 | 위치 | 쓴 곳 |
|---|---|---|
| `Day5_강의자료.pptx`(18쪽) | 선생님 배포 자료(저장소에 올리지 않음) | 개념 카드 py-16~20, 실습 카드의 문제 문장, 시험 문제 |
| 실습 폴더 `workspace-boot/python_agent/day05/main.py` (10/21 09:41 폴더 생성 ~ 13:50 저장) | 저장소 사본 `AI_Agent/python_agent/day05/main.py`(`__pycache__` 제외) | 수업 진도 카드 ai-day03, 실습 카드 lab-23~27 |
| 선생님 레포 `python_agent_20261019/Day05/main.py` (10/21 09:57~13:50 커밋 5개) | GitHub `kang99king3/back_end_edu_20260629` | 실습 카드의 "선생님 풀이와 비교" |

## 바꾼 것

| 위치 | 내용 |
|---|---|
| `AI_Agent/index.html` | 수업 카드 ai-day03, 개념 카드 py-16~20(☕ 스프링으로는 칸), 실습 카드 lab-23~27, 시험 10문제(Day 5 버튼). 개요 지도(Day 5 완료, Day 6 다음), 큰 그림(흐름 표 Day 5 ✅, 큰 생각 "들어온 값은 믿지 않고 검사한다", 5번 "스프링 REST API → FastAPI" 표), 강의자료 탭 |
| `AI_Agent/python_agent/` | `day05/main.py` 복사, README 갱신 |
| `view.html` | 확장자 `.py`를 파이썬으로 색칠(highlight.js 언어 목록에 `py` 추가) |
| 대시보드 · 문서 | 백엔드 · 프런트 큰 그림의 AI 과정 단계 설명, 백엔드 12번 프로젝트 카드 "다음으로", 첫 화면 숫자, README 2종 |

## 확인한 것

| 항목 | 방법 | 결과 |
|---|---|---|
| 내 `main.py` | 저장소 밖 사본을 `python -m uvicorn main:app`으로 띄우고 Node `fetch`로 요청 29개 | 실습 23 · 24 · 26과 PUT · DELETE는 문제대로. `GET /products/{product_id}`는 실습 25의 첫 함수가 응답 — `show_tax` 무시, `/products/99` 200, PUT 후 GET에 반영 안 됨. 서버 경고 `Duplicate Operation ID`, `/openapi.json`에 GET 1개 |
| 선생님 `main.py` | 같은 방법 · 같은 요청 | CRUD는 `/products17/…`에서 정상. `/courses/popular` 422(고정 경로를 `pupular`로 오타), `show_tax` 키는 `tax_include` |
| 고친 사본 | 실습 25 두 함수의 경로만 `/shop/…` · `/shop-tax/…`로 바꿈 | CRUD 정상(200 → 404 → PUT 반영 → DELETE 후 404), `tax_included` 정상, 경고 없음, `/docs` 200 |
| 17쪽 GET을 위로 옮긴 사본 | 등록 순서만 바꿈 | CRUD GET은 정상이 되고 대신 실습 25 함수가 불리지 않음, 경고는 그대로 |
| 개념 카드의 동작 | 확인용 앱 두 개를 띄워 요청 | 경로 순서를 거꾸로 쓰면 `/me` 422, 필수 쿼리 누락 422, bool 쿼리(`1`·`yes`·`on` 참, `0`·`no`·`off` 거짓, `maybe` 422), 빈 쿼리 값 `""`, `status_code=201` → 201 Created, 모델에 없는 필드는 버림, 폼 형식 본문 422, POST 전용 경로에 GET 405, `return HTTPException` → 200 + 객체 본문, `/redoc` 200, `.dict()` → `PydanticDeprecatedSince20` 경고 |
| 버전 | `import` 후 `__version__` | FastAPI 0.156.4 · Pydantic 2.14.1 · uvicorn 0.54.0 · Starlette 1.9.0(파이썬 3.15 시스템 설치). 422 상태 줄 이름은 `Unprocessable Content` |

## 확인하지 않은 것

- 가상환경을 새로 만들어 `pip install fastapi uvicorn`부터 하는 과정, VS Code 터미널 · 브라우저 `/docs` 화면(요청은 Node `fetch`로 보냄). 테스트용 `httpx`는 시스템 파이썬에 없어 설치하지 않았다.
- 오후 수업이 Day 5 실습 말고 다른 내용(예: Day 6 개념)을 다뤘는지 — 실습 폴더 · 선생님 레포에 Day 5 말고는 올라온 것이 없다.
- 스프링 쪽 비교(타입 변환 실패 · 필수 파라미터 누락 400, 같은 매핑 두 번이면 Ambiguous mapping으로 서버가 안 뜸)는 스프링의 일반 동작 설명이며 이번에 실행하지 않았다.
