# 새 노트북에서 수업 시작하기

**[개발환경 준비 안내 열기](https://moriochoradio.github.io/web-study-notes/setup/)**

설치 파일 선택 → 프로젝트 받기 → Eclipse·DB 설정 → 첫 실행 → 오류 해결까지 웹 안내 한 곳에서 따라갑니다.
웹을 볼 수 없으면 이 폴더의 `index.html`을 브라우저로 열어도 본문을 읽을 수 있습니다.
기준일: 2026-09-19. Windows 11을 기준으로 작성했으며 macOS/Linux 차이도 안내합니다.

## 과목별로 필요한 것

| 실습 | 필요한 환경 |
| --- | --- |
| HTML · CSS · JavaScript | 브라우저, VS Code. AJAX는 로컬 HTTP 서버 사용 |
| Java 기초 | JDK **21**, VS Code + Extension Pack for Java |
| SQL | MariaDB Server **12.3.3**, HeidiSQL |
| JSP · Servlet | JDK **21**, Eclipse **Enterprise Java and Web Developers 2026-03**, Tomcat **10.1.x**, MariaDB, Connector/J |
| React · Next.js | VS Code, **Node.js 24 LTS** + 함께 설치되는 npm, 각 프로젝트의 `package.json` |

Java/Eclipse/Tomcat/DB는 [수업 README](../Back_end/web_edu_project/README.md), [웹 개발 노트](../Back_end/index.html#web-01), 프로젝트의 `.classpath` 및 `.settings`에 근거합니다.
JDK 공급사·세부 패치와 이전 Node 버전은 기록만으로 확정할 수 없습니다. Temurin JDK 21 및 Node 24 LTS는 **새 설치 권장값**입니다.
Connector/J는 수업 기록 **3.3.3**, 새 설치는 같은 3.3 계열의 최신 안정 패치를 우선합니다. 한 프로젝트에는 JAR 한 개만 둡니다.
현재 Eclipse 웹 프로젝트에는 `pom.xml`/`build.gradle`이 없으므로 Maven·Gradle·Spring을 먼저 설치할 필요는 없습니다.

## 프로젝트 받기

[Git 공식 설치](https://git-scm.com/downloads) 후 새 터미널에서 실행합니다. 이 예시는 Windows PowerShell입니다.

```powershell
New-Item -ItemType Directory -Force "$HOME\source" | Out-Null
Set-Location "$HOME\source"
git clone https://github.com/MoriochoRadio/web-study-notes.git
Set-Location web-study-notes
```

이미 같은 폴더가 있으면 다시 clone하지 않고 해당 폴더에서 `git status`로 작업을 확인한 뒤 `git pull --ff-only`로 갱신합니다.

## 첫 실행까지 남은 단계

1. [웹 안내의 다운로드 표](https://moriochoradio.github.io/web-study-notes/setup/#downloads)에서 과목에 필요한 프로그램만 설치합니다.
2. Java 웹은 JDK 21, Eclipse의 JavaSE-21, Tomcat v10.1을 연결하고 두 웹 프로젝트를 Import합니다.
3. HeidiSQL에서 **로컬 실습 서버를 선택한 뒤** [bootstrap-hk.sql](bootstrap-hk.sql)을 열어 실행합니다. 기존 테이블·행을 삭제하지 않습니다. 기존 스키마를 수정하거나 수업 전체 DB를 복원하는 파일은 아닙니다.
4. 두 웹 프로젝트 각각의 `src/main/webapp/WEB-INF/lib/`에 Connector/J JAR를 넣고, 수업 README의 DB 접속 정보를 로컬에서 채웁니다. 실제 비밀번호를 커밋하지 않습니다.
5. Eclipse → Run on Server → `http://localhost:8080/01_userboard_sepa/`에서 회원 목록을 확인합니다. SQL 접속, Java 실행, 웹 첫 화면을 각각 확인해야 준비 완료입니다.
6. React는 레슨 폴더에서 `npm ci`(lockfile 있음) 또는 `npm install`(없음), `npm run dev`를 실행합니다. Windows PowerShell에서 npm.ps1 실행이 막히면 `npm.cmd`를 사용합니다.

## 설치 상태 점검 (선택)

저장소 루트에서 실행합니다. 설치·삭제·레지스트리·환경 변수 변경 없이 **현재 터미널의 도구 버전, JAR 유무, 로컬 포트**만 확인합니다. 관리자 권한이 필요하지 않습니다.
조직의 스크립트 실행 정책에 막히면 정책을 바꾸지 않고 웹 안내에 있는 개별 확인 명령을 사용하세요.

```powershell
powershell -NoProfile -File .\setup\Check-Environment.ps1 -Track Web
powershell -NoProfile -File .\setup\Check-Environment.ps1 -Track React
# Tomcat 폴더를 지정하면 버전도 확인합니다 (실제 압축 해제 경로로 수정).
powershell -NoProfile -File .\setup\Check-Environment.ps1 -Track Web -TomcatHome C:\dev\apache-tomcat-10.1.xx
```

`-Track` 값: `Web`(기본), `Java`, `SQL`, `React`, `Static`, `All`.
`PASS`는 해당 검사 통과, `CHECK`는 수동 확인, `MISSING`은 발견하지 못했다는 뜻입니다.
포트가 열린 것만으로 DB 인증이나 실습 동작을 보장하지 않습니다. Eclipse 설치 여부·DB 비밀번호·하드웨어 상태는 이 스크립트의 검사 범위가 아닙니다.

## 관리 원칙

- 설치 프로그램·JDK·node_modules·DB 파일·비밀번호를 Git에 넣지 않습니다. 공식 배포처 링크와 준비 절차를 보관합니다.
- JDK **21**, Tomcat **10.1**처럼 수업 호환 버전을 먼저 맞추고 그 계열 안에서 보안 패치를 적용합니다.
- Java 웹 실습 원본은 유지합니다. 새 설치에서 발생하는 환경 문제와 수업 코드의 미구현 기능을 구분합니다.
- `index.html`이 상세 절차의 원본입니다. 버전/실습 구조가 바뀌면 이 문서와 점검 스크립트도 함께 갱신합니다.
- 페이지의 체크 표시는 **현재 브라우저에만 저장**됩니다. 다른 노트북의 준비 완료 상태와 동기화하지 않습니다.
