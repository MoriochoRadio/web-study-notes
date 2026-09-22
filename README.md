# 웹 개발 학습 기록 (취업아카데미)


**2026-09-22 갱신 (2):** 대시보드를 **복습하러 왔을 때 바로 시작되는 화면**으로 바꿨다. [🔁 복습 탭](https://moriochoradio.github.io/web-study-notes/Back_end/)이 첫 화면이 되어 "뭐부터 볼까"에 한 줄로 답하고, 버튼 하나로 5분 플래시카드가 시작된다. 흩어져 있던 복습 기능(떠다니는 버튼 · 통계 벽 아래 묻힌 추천 목록 · 진도 바)을 한곳에 모았고, '개요' 탭이 모든 섹션을 한꺼번에 펼쳐 화면이 끝없이 길던 것도 탭 하나당 섹션 하나로 바로잡았다. 플래시카드에서 빠져 있던 SQL·웹 카드 66장도 넣었다.

**2026-09-22 갱신:** 36일차 스프링 MVC 진도를 반영했다. [`06_spring_template`](Back_end/web_edu_project/06_spring_template) 추가 — Maven으로 의존성을 선언하고, 직접 짜던 URL 분기·forward 경로·객체 생성을 각각 `@RequestMapping`·ViewResolver·컨테이너가 대신한다. [05에서 무엇이 사라졌는지](Back_end/web_edu_project/README.md#06_spring_template--스프링-mvc-첫-프로젝트)를 표로 정리했다. [17회차 코딩테스트](Back_end/coding-tests/2026-09-21/) 4문제(3 PASS · 1 FAIL)를 추가했고, FAIL 한 문제는 **제출본의 실패를 실제로 재현해** 원인 셋으로 나눴다. SQL 두 문제는 **제출한 쿼리를 임시 테이블 픽스처에 그대로 돌려** 결과를 확인했다(MariaDB 12.3, 8개 항목 통과 — 그중 한 검사는 처음에 실패해 픽스처를 고쳤다). 16회차는 이후 직접 풀어 제출해 PASS 한 기록으로 보정했다. 대시보드에 수업 36일차 · 웹 개발 카드 3개 · 코딩테스트 카드 4개 · 학습 여정 20단계를 반영했다.

**2026-09-21 갱신:** 35일차 EL·JSTL 진도를 반영했다. [`05_hkboard_MVC2_JSTL`](Back_end/web_edu_project/05_hkboard_MVC2_JSTL) 추가 — 04를 복사해 화면만 EL·JSTL로 바꾼 프로젝트라 [04와의 차이](Back_end/web_edu_project/README.md)가 그대로 학습 포인트가 된다. 대시보드에 수업 35일차 · 웹 개발 카드 6개 · 학습 여정 19단계 · 시험 대비 4문항을 추가했다.

**2026-09-20 갱신:** [9월 17~18일 수업 보충](Back_end/teacher-sync-2026-09-18.md) · [16회차 코딩테스트 보충 풀이](Back_end/coding-tests/2026-09-18/). MVC1 다중 삭제, Servlet·Filter·Session, MVC2 목록·등록 진도를 반영했다.

🇰🇷 한국어 · 🇬🇧 [English](README.en.md)

취업아카데미 과정에서 작성한 실습 코드와, 다시 학습할 때 바로 이해할 수 있도록 재구성한 복습 노트를 함께 관리하는 저장소입니다. 2026-08부터 프론트엔드와 백엔드 과정을 분리했으며, 각 과정은 원본 실습 코드·대시보드·과정별 안내 문서로 구성됩니다.

👉 **[학습 정리 대시보드 바로가기](https://moriochoradio.github.io/web-study-notes/)**

🛠️ **[새 노트북에서 수업 시작하기 — 개발환경 준비](https://moriochoradio.github.io/web-study-notes/setup/)**

JDK 21 · Eclipse · Tomcat 10.1 · MariaDB · Node 설치, 프로젝트 불러오기, DB 준비와 첫 실행을 과목별로 안내합니다. [점검 도구와 실습 SQL](setup/README.md)도 함께 제공합니다.

## ❓ 왜 만들었나

수업에서 실습한 코드는 그날그날 폴더에 쌓이는데, **한 달 뒤에 열어 보면 뭘 했는지 기억나지 않았다.** 파일명만 보고는 어느 개념을 연습한 것인지 알 수 없고, 커리큘럼 어디쯤 와 있는지도 감이 안 왔다.

그래서 두 가지를 같이 두기로 했다 — **실습 코드 원본**과, **다시 열었을 때 바로 이해되도록 재구성한 노트**. 여기에 진도 대시보드를 붙여 "배운 것과 앞으로 배울 것"을 한눈에 보게 했다.

프레임워크는 일부러 쓰지 않았다. 수업이 순수 HTML·CSS·JavaScript를 다루는 과정이라, **도구가 가려 주는 것 없이 기초를 그대로 남기는 것**이 목적이었다.

## 🧪 한계

- **수업 진도를 따라가는 아카이브다.** 체계적인 커리큘럼이 아니라 배운 순서대로 쌓인다.
- **실습 코드는 당시 수준 그대로 둔다.** 나중에 더 나은 방법을 알게 돼도 고치지 않는다. 그때 무엇을 이해하고 있었는지가 기록의 목적이기 때문이다.
- **교안 원본은 재배포하지 않는다.** 개인 실습·노트와 출처를 표시한 수업 예제를 구분한다. 강사 코드의 반영 범위는 대조 기록에 남긴다.

## 학습 범위 및 최신 점검

2026-08-13 저장소 점검 기준으로 프런트엔드 커리큘럼은 실습 코드와 대시보드 노트에 모두 반영되어 있습니다. 백엔드는 수업 진행에 맞춰 날짜별 실습과 복습 자료를 이어서 누적합니다.

| 과정 | 반영 범위 | 상태 |
| --- | --- | --- |
| 프런트엔드 | HTML 7 · CSS 12 · JavaScript 18(AJAX까지) · React/Next.js 14단원 · StockDash 졸업 과제 | ✅ 완료 |
| 백엔드 | Java 날짜별 수업 실습 36일차 · 개념 카드 · 실습과제 12문제 · SQL 46항목 · 웹 개발 40항목(JSP·Servlet·MVC2·EL/JSTL·스프링 입문) · 코딩테스트 34문제 · 시험 대비 102문제 | 🔄 진행 중 (2026-08-03 시작) |
| 저장소 위생 | 의존성·Next.js 빌드 캐시·환경 변수·IDE 파일 제외 규칙 적용 | ✅ 점검 완료 |

> **노트 작성 원칙:** 모든 학습 카드는 “한 줄 요약 → 쉽게 말하면 → 개념 → 주석 달린 코드 → 핵심 정리”의 순서로 구성합니다. 실행 가능한 원본 코드는 단원 폴더에 남기고, 대시보드는 개념과 코드 흐름을 빠르게 복습하는 용도로 사용합니다.

## 복습과 검증 방식

백엔드 대시보드는 **🔁 복습 탭**으로 열립니다 — "뭐부터 볼까"에 한 줄로 답하고 버튼 하나로 5분 플래시카드를 시작합니다(헷갈린다고 표시한 카드가 있으면 그것부터). 그 밖에 검색, 접기/펼치기, 다크 모드, 진도 체크, 오답 노트를 지원해 필요한 내용을 다시 찾는 시간을 줄입니다. 과목별 안내 문서에는 현재 범위와 폴더 구조를 기록하고, 수업 후에는 원본 코드와 복습 카드가 같은 단원을 가리키는지 함께 확인합니다.

| 대상 | 확인 방법 | 기록 위치 |
| --- | --- | --- |
| Java 실습 | `javac` 컴파일 및 실행 결과 확인 | `Back_end/` 코드와 백엔드 대시보드 |
| SQL 풀이 | 세션 임시 테이블 픽스처에 쿼리를 그대로 돌려 결과 대조 (수업 데이터는 건드리지 않음) | `Back_end/coding-tests/*/verify-*.sql` |
| React·Next.js 실습 | 의존성 설치 후 `npm run lint`, `npm run build`, 로컬 렌더링 확인 | `Front_end/4.react/lessons/` |
| 정적 대시보드 | 링크·검색·테마·모바일 레이아웃 확인 | 루트 및 과정별 `index.html` |
| DOM 구조 | `python3 scripts/verify_dom_structure.py`로 실제 파싱해 태그 중첩·이스케이프 검사 | `scripts/verify_dom_structure.py` |
| 내부 링크·자원 | `python3 scripts/check_internal_links.py`로 로컬 경로 검사 | `scripts/check_internal_links.py` |
| 프런트엔드 인벤토리 | `python3 scripts/verify_frontend_inventory.py`로 카드·헤더·통계 수 일치 검사 | `scripts/verify_frontend_inventory.py` |
| 백엔드 인벤토리 | `python3 scripts/verify_backend_inventory.py`로 수업 진도·개념·과제·여정과 통계 수 일치 검사 | `scripts/verify_backend_inventory.py` |
| 자동 검증 | HTML·문서·검사 스크립트 변경 시 링크·인벤토리 검사를 자동 실행 | `.github/workflows/verify-study-notes.yml` |
| 형상 관리 | 소스·문서만 커밋하고 생성물·비밀 값은 제외 | `.gitignore`, `Front_end/.gitignore` |

## DOM 구조 검사

태그 **개수**가 맞아도 실제 문서 구조는 깨져 있을 수 있습니다. 예를 들어 `<b>내용</code>`처럼
다른 태그로 잘못 닫으면 `<b>`와 `</b>` 개수는 그대로라 어떤 개수 검사도 통과하지만, 브라우저는
뒤따르는 `<section>` 여러 개를 그 `<b>` 안으로 집어넣습니다. `List<String>`처럼 제네릭 표기를
이스케이프하지 않은 경우도 `<string>`이라는 요소가 생겨 같은 일이 벌어집니다. 둘 다 화면은
멀쩡해 보여서 눈으로는 찾기 어렵습니다.

이 검사는 개수를 세지 않고 **실제로 파싱해 트리를 만들어** 다음을 확인합니다.

- 닫히지 않았거나 다른 태그로 잘못 닫힌 태그, 짝 없는 끝 태그
- 이스케이프하지 않아 생긴 알 수 없는 요소(`<String>`, `<Object>` 등)
- 블록 요소가 인라인 요소 안에 들어간 구조 붕괴, `<section>`이 인라인 요소에 삼켜진 경우
- 중복 `id`, 문서 안에 대상이 없는 `#앵커`

```bash
python3 scripts/verify_dom_structure.py
```

검사 규칙 자체가 동작하는지 확인하는 자체 테스트도 함께 들어 있습니다. 규칙을 고친 뒤에는
아래 명령으로 11개 규칙이 모두 살아 있는지 확인할 수 있고, 자동 검증에서도 먼저 실행됩니다.

```bash
python3 scripts/verify_dom_structure.py --self-test
```

## 내부 링크 검사

정적 HTML의 실제 `a`, `link`, `script`, `img` 등에서 참조하는 **저장소 내부 경로**가 존재하는지 별도 패키지 없이 검사합니다. 새 실습 파일이나 대시보드 링크를 추가한 뒤 아래 명령을 실행하면, GitHub Pages에서 404가 될 수 있는 로컬 링크·자원을 커밋 전에 찾을 수 있습니다. 외부 URL은 네트워크 상태에 따라 달라지므로 이 검사 범위에서 제외합니다.

```bash
python3 scripts/check_internal_links.py
```

탐색은 `node_modules`·`dist` 같은 폴더에 **애초에 들어가지 않습니다**. 예전에는 결과만 걸러서
`node_modules` 안까지 들어갔는데, npm이 만든 심볼릭 링크가 저장소 구조 변경으로 끊겨 있으면
탐색 도중 `FileNotFoundError`로 검사 전체가 멈췄습니다. 지금은 가지치기와 오류 무시를 함께 두어
끊긴 링크가 있어도 완주하며, 그만큼 속도도 빨라졌습니다. 탐색 규칙이 살아 있는지는 아래로 확인합니다.

```bash
python3 scripts/check_internal_links.py --self-test
```

프런트엔드에 새 수업 카드를 추가했다면 아래 명령도 실행합니다. HTML·CSS·JavaScript·React/Next.js의 **대시보드 카드 수**, 헤더 요약, 통계 카드가 같은 수치를 가리키는지 확인하며, React 졸업 과제는 14개 레슨과 별도로 검증합니다.

```bash
python3 scripts/verify_frontend_inventory.py
```

백엔드에 수업 일차·Java 개념 카드·실습과제·학습 여정을 추가했다면 아래 명령도 실행합니다. 각 섹션의 카드 수와 상단 통계 카드가 같은 수치를 가리키는지 확인합니다.

```bash
python3 scripts/verify_backend_inventory.py
```

## 자동 검증

수동 검사는 그대로 사용할 수 있으며, 같은 검사가 HTML·Markdown·검사 스크립트·워크플로 변경을 포함한 `main` 푸시와 Pull Request에서 자동으로 실행됩니다. 자동 검증은 **읽기 전용**입니다. 저장소 파일, 배포 설정, 이슈·Pull Request에 변경을 쓰지 않고 링크와 DOM 구조, 대시보드 인벤토리만 검사합니다. 필요한 경우 저장소의 Actions 화면에서 수동 실행할 수도 있습니다.

## 폴더 구조

```text
.
├── index.html    # 학습 과정 선택 허브, 기존 해시 링크는 Front_end/로 호환
├── .nojekyll     # GitHub Pages에서 정적 파일을 가공 없이 제공
├── .github/workflows/verify-study-notes.yml  # 읽기 전용 자동 검증
├── Front_end/    # 프런트엔드 과정 (HTML · CSS · JS · React/Next.js)
│   ├── index.html        # 프런트엔드 학습 대시보드
│   ├── 1.html/ 2-css/ 3.javascript/ 4.react/   # 원본 실습 코드
│   └── slides/           # 강의 자료(PPT)
└── Back_end/     # 백엔드(Java) 과정
    ├── index.html            # Java 백엔드 학습 노트 대시보드
    ├── java_edu_project/     # 날짜별 수업 실습 코드
    ├── sql_edu_project/      # SQL 과정 실습 스크립트
    ├── web_edu_project/      # 웹 개발 실습 프로젝트 01~06 (JSP → MVC2 → 스프링)
    ├── coding-tests/         # 회차별 코딩테스트 기록 (제출 코드 · 정정 풀이 · 로컬 검증)
    └── *.pptx / *.pdf        # 교안 · 실습과제
```

## 다음 수업을 반영하는 순서

새 단원이 생기면 해당 과정 폴더에 원본 실습 코드와 최소한의 실행 안내를 먼저 추가합니다. 이후 대시보드에 복습 카드와 실습 파일 링크를 연결하고, 상단 통계·학습 여정·시험/복습 범위를 함께 갱신합니다. 마지막으로 단원별 실행 검증과 정적 페이지 동작을 확인하고, `check_internal_links.py`와 해당 과정의 인벤토리 검사(`verify_frontend_inventory.py` 또는 `verify_backend_inventory.py`)를 실행한 뒤 변경 목적이 드러나는 커밋으로 기록합니다.

과정별 상세 내용은 [`Front_end/README.md`](Front_end/README.md)와 [`Back_end/README.md`](Back_end/README.md)를 참고하세요.
