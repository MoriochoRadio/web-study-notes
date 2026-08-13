# 웹 개발 학습 기록 (취업아카데미)

🇰🇷 한국어 · 🇬🇧 [English](README.en.md)

취업아카데미 과정에서 작성한 실습 코드와, 다시 학습할 때 바로 이해할 수 있도록 재구성한 복습 노트를 함께 관리하는 저장소입니다. 2026-08부터 프론트엔드와 백엔드 과정을 분리했으며, 각 과정은 원본 실습 코드·대시보드·과정별 안내 문서로 구성됩니다.

👉 **[학습 정리 대시보드 바로가기](https://moriochoradio.github.io/web-study-notes/)**

## 학습 범위 및 최신 점검

2026-08-13 저장소 점검 기준으로 프런트엔드 커리큘럼은 실습 코드와 대시보드 노트에 모두 반영되어 있습니다. 백엔드는 수업 진행에 맞춰 날짜별 실습과 복습 자료를 이어서 누적합니다.

| 과정 | 반영 범위 | 상태 |
| --- | --- | --- |
| 프런트엔드 | HTML 7 · CSS 12 · JavaScript 18(AJAX까지) · React/Next.js 14단원 · StockDash 졸업 과제 | ✅ 완료 |
| 백엔드 | Java 날짜별 수업 실습 · 개념 카드 · 실습과제 12문제 · 시험 대비 102문제 | 🔄 진행 중 (2026-08-03 시작) |
| 저장소 위생 | 의존성·Next.js 빌드 캐시·환경 변수·IDE 파일 제외 규칙 적용 | ✅ 점검 완료 |

> **노트 작성 원칙:** 모든 학습 카드는 “한 줄 요약 → 쉽게 말하면 → 개념 → 주석 달린 코드 → 핵심 정리”의 순서로 구성합니다. 실행 가능한 원본 코드는 단원 폴더에 남기고, 대시보드는 개념과 코드 흐름을 빠르게 복습하는 용도로 사용합니다.

## 복습과 검증 방식

대시보드는 검색, 접기/펼치기, 다크 모드, 5분 플래시카드 복습, 진도 체크, 오답 노트를 지원해 필요한 내용을 다시 찾는 시간을 줄입니다. 과목별 안내 문서에는 현재 범위와 폴더 구조를 기록하고, 수업 후에는 원본 코드와 복습 카드가 같은 단원을 가리키는지 함께 확인합니다.

| 대상 | 확인 방법 | 기록 위치 |
| --- | --- | --- |
| Java 실습 | `javac` 컴파일 및 실행 결과 확인 | `Back_end/` 코드와 백엔드 대시보드 |
| React·Next.js 실습 | 의존성 설치 후 `npm run lint`, `npm run build`, 로컬 렌더링 확인 | `Front_end/4.react/lessons/` |
| 정적 대시보드 | 링크·검색·테마·모바일 레이아웃 확인 | 루트 및 과정별 `index.html` |
| 내부 링크·자원 | `python3 scripts/check_internal_links.py`로 로컬 경로 검사 | `scripts/check_internal_links.py` |
| 프런트엔드 인벤토리 | `python3 scripts/verify_frontend_inventory.py`로 카드·헤더·통계 수 일치 검사 | `scripts/verify_frontend_inventory.py` |
| 백엔드 인벤토리 | `python3 scripts/verify_backend_inventory.py`로 수업 진도·개념·과제·여정과 통계 수 일치 검사 | `scripts/verify_backend_inventory.py` |
| 자동 검증 | HTML·문서·검사 스크립트 변경 시 링크·인벤토리 검사를 자동 실행 | `.github/workflows/verify-study-notes.yml` |
| 형상 관리 | 소스·문서만 커밋하고 생성물·비밀 값은 제외 | `.gitignore`, `Front_end/.gitignore` |

## 내부 링크 검사

정적 HTML의 실제 `a`, `link`, `script`, `img` 등에서 참조하는 **저장소 내부 경로**가 존재하는지 별도 패키지 없이 검사합니다. 새 실습 파일이나 대시보드 링크를 추가한 뒤 아래 명령을 실행하면, GitHub Pages에서 404가 될 수 있는 로컬 링크·자원을 커밋 전에 찾을 수 있습니다. 외부 URL은 네트워크 상태에 따라 달라지므로 이 검사 범위에서 제외합니다.

```bash
python3 scripts/check_internal_links.py
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

수동 검사는 그대로 사용할 수 있으며, 같은 검사가 HTML·Markdown·검사 스크립트·워크플로 변경을 포함한 `main` 푸시와 Pull Request에서 자동으로 실행됩니다. 자동 검증은 **읽기 전용**입니다. 저장소 파일, 배포 설정, 이슈·Pull Request에 변경을 쓰지 않고 링크와 대시보드 인벤토리만 검사합니다. 필요한 경우 저장소의 Actions 화면에서 수동 실행할 수도 있습니다.

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
    └── *.pptx / *.pdf        # 교안 · 실습과제
```

## 다음 수업을 반영하는 순서

새 단원이 생기면 해당 과정 폴더에 원본 실습 코드와 최소한의 실행 안내를 먼저 추가합니다. 이후 대시보드에 복습 카드와 실습 파일 링크를 연결하고, 상단 통계·학습 여정·시험/복습 범위를 함께 갱신합니다. 마지막으로 단원별 실행 검증과 정적 페이지 동작을 확인하고, `check_internal_links.py`와 해당 과정의 인벤토리 검사(`verify_frontend_inventory.py` 또는 `verify_backend_inventory.py`)를 실행한 뒤 변경 목적이 드러나는 커밋으로 기록합니다.

과정별 상세 내용은 [`Front_end/README.md`](Front_end/README.md)와 [`Back_end/README.md`](Back_end/README.md)를 참고하세요.
