# 백엔드 카드 점검 상세 — 2026-10-03

> **2026-10-04 갱신:** 아래 중·하 항목도 모두 처리했다(이미 해결된 것은 확인 후 건너뜀). 처리 요약은 [card-audit-2026-10-03.md](../../card-audit-2026-10-03.md)의 "2026-10-04" 절에 있다.

[요약 보고서](../../card-audit-2026-10-03.md)의 백엔드 부분 상세 목록이다. 형식은 `카드 — 문제 → 고칠 방향`이다. **상** 항목은 2026-10-03에 모두 고쳤다. 중·하는 상 항목을 고치면서 같이 해결된 것(예: day15 "죽은 코드", day16 동시 실행 설명, util-02 "비동기", sql-36 비유 등)을 빼고는 아직 남아 있다.

## 📅 수업 진도 1~10일차

### 상
- day01 — `float f = 15.77;`은 경고가 아니라 컴파일 에러
- day03 — "역피라미드도 i++로 똑같이 나온다"는데 마지막 블록은 정피라미드, 주석의 개수도 틀림
- day04 — 코드 주석 "equals()가 hashcode()로 비교"가 교정 없이 남음
- day05 — `List<Integer>`에 `list.add("가")`가 "자동 형변환으로 가능"하다는 주석(실제로는 컴파일 에러)
- day05 — 정리의 "equals()는 항상 내용 비교"가 4일차("Object 기본 equals는 주소 비교")와 충돌
- day06 — search() 코드는 생략본인데 출력은 원문 기준("검색된 개수: 5개")
- day07 — 개미수열 "11 → 12" 설명이 틀림("1이 2개"라서 12)
- day07 — arraycopy "기본타입 배열 한정", "clone()도 깊은 복사"는 틀림
- day09 — "super.필드로 부모 생성자를 거치지 않고 초기화"는 틀림(super()는 항상 먼저 실행)
- day09 — "부모 타입으로 생성하면 부모 로직만"은 다형성과 정반대(new한 객체가 결정)
- day09 — 달력 첫 줄 탭 수가 "토요일 6칸"과 맞지 않음
- day10 — "4일차의 마방진"은 존재하지 않음(실습과제 9번)
- day03 TIP — 삼항연산자를 "2일차에 써 봤다"는데 실제로는 4일차
- day01·03 — static 설명 "non-static은 메모리에 없어서" → 진짜 이유는 호출할 객체(this)가 없어서
- day08 — 출력을 만드는 Main·Compare 코드가 카드에 없고, "2개 일치 5등"은 실제 로또 규칙과 다름
- day02·07 — "콘솔이 입력을 다시 안 찍는다" → 자동 입력으로 실행해서 입력값이 생략된 것

### 중
- day01 — 원본 주석의 틀린 이유(b1+b2, b4=10+20) 교정 누락
- day03 — "메서드는 네 종류"인데 예시가 셋
- day04 — equals 설명이 클래스 비교에서 String 재정의로 논리 비약, 코드·설명 순서가 뒤섞임
- day05 — D1_ImmutableTest가 사실은 값 전달 이야기인데 관계 설명 없음, "지연 초기화" 용어 오용(blank final), 재대입을 immutable의 증거로 씀, StringBuilder 비교 실험의 반복 횟수가 다름
- day06 — "6일차 진도의 그대로 복습"(자기 자신), private 효과 설명 부정확, 3인자 indexOf는 JDK 21+ 전용, 한 블록에 public class 여러 개
- day07 — 개미수열 규칙 설명 없음(수업판은 숫자→개수, 표준은 개수→숫자)
- day08 — "캡슐화"라고 하지만 필드가 public, Compare·Util 코드 없음
- day09 — super.필드 방식이 재사용이 아니라 복사, `super(...)` 정석 비교 누락, `+=`의 자동 캐스팅 미설명, Main 코드 없음, "8일차 D4_Constructor"는 4일차이고 내용도 반대, Calendar 월 0부터 미설명, protected 정의 애매
- day10 — 코드에 없는 `moveAnimal(Object)` 설명, 다형성 조건 ①②가 같은 것
- day05 — 참조 캐스팅을 `(byte)200`에 비유

### 하
- day03 res 초기화 이유, day04 생성자 "한 번" 표현, day04 prac02 링크 설명 없음, day06 인덱스 주석, day06 C·D 이름 규칙 반대, day07 문구, day08 D2_Parent의 super(5) 무시 미설명, day08~10 미리 나온 용어(VMI·추상 클래스·제네릭)

## 📅 수업 진도 10~42일차

### 상
- day16 — 이름을 "동료"로 익명화하면서 출력·설명이 틀어짐(2글자, "임"으로 시작 안 함)
- day14 — 6×6 실패를 "알고리즘 한계"라고 함 → `makeA()`의 `if (i == 2)` 하드코딩 버그
- day18 — 생산자-소비자가 "정확히 번갈아 10개씩" → wait/notify는 범위만 보장
- day23 — "DELETE는 되돌릴 수 있다" → MariaDB/HeidiSQL은 autocommit이라 START TRANSACTION 뒤에만
- day23 — "부서 컬럼 출력은 JOIN이 유일" → SELECT 절 스칼라 서브쿼리도 가능
- day32 — 정리 작업 메모가 본문, 개념 설명 없음
- day33 — 제목의 트랜잭션·batch 설명이 본문에 없음
- day38~42 — "이 날 코드의 상태" 대부분이 검증 기록(SQLite, 파일 수정 시각, -parameters 유무)
- day18 — "11일차의 Runnable 이야기"는 없음, "15일차 StringBuilder"는 🧱15번 카드
- day29 — "🧱 08. 오버로딩" 링크가 package/import 카드로 감

### 중
- day12 — 발췌에 기본 생성자가 없어 익명 클래스가 컴파일 안 됨, 출력의 `ma결과:` 줄이 코드에 없음(day14도)
- day19 — 출력의 `address:` 줄을 찍는 println이 발췌에서 빠짐
- day14 — 팩토리가 쓰는 건 상속판인데 독립형 코드를 보여 줌, "템플릿 메서드" 용어 부정확
- day15 — 뒤의 catch는 "죽은 코드"가 아니라 컴파일 에러
- day13 — [◆5] 한 번 등장은 equals의 증거가 아님
- day16 — "에코가 없다"(입력 생략), "진짜 동시" vs "번갈아" 모순, 발췌에 없는 test02 주석을 근거로 설명, 15일차에 없는 파일 복사 로직 참조
- day18 — 카드 코드에 없는 synchronized 블록을 설명
- day19·18 — "학습 여정 마무리/마지막 단계" 낡은 문구, 단계 번호 겹침
- day20~28 — MySQL/MariaDB 표기 혼재(ERROR 4025는 MariaDB)
- day20~27 — SQL 일차 카드에 쿼리 예시가 하나도 없음
- day27 — "`emp_no*1`은 못 쓰고 `20000/1`은 씀" 식 전체가 없음
- day26 — 보조 인덱스 = UNIQUE로 읽힘, JOIN 뷰 수정 불가는 부정확
- day29 — "내일 NPE로 돌아온다"가 회수되지 않음
- day30 — "변경은 POST가 원칙"인데 01 프로젝트 삭제는 GET
- day34 — ServletConfig·ServletContext·Session 차이 설명 없음
- day36·37 — 스프링 용어 5개가 한 줄에 설명 없이, Service 계층이 왜 생겼는지 없음
- day38 — `.board` 매핑이 소개된 적 없음
- day39 — log4j.xml을 정상 설정처럼 쓰고 바로 아래에서 "안 읽힌다"
- day42 — 프록시·생성자 주입 이유 0줄
- day32~42 — 형식 붕괴(요약·쉽게 말하면·정리 없이 bullet과 링크만)
- day17 — 카드가 없다는 안내 없음

### 하
- day21 > ALL ≡ > MAX의 예외, day23 에러 번호(1248), day24 순위 예시, day25 RIGHT JOIN 방향, day28 낡은 "다음 진도", day40 nvl(MAX(refer),0)+1, day31 프런트 컨트롤러 정의, day19 test03 날짜, day19 출력 줄바꿈, day35 JSTL jar 이름

## ☕ 자바 기초 · 🧱 객체지향

### 상
- basic-04 — "기본타입은 스택에, 불변" → 지역변수만 스택, immutable 아님
- oop-09·oop-03 — "참조타입은 pass by reference" → 자바는 항상 값 전달(주솟값 복사)
- oop-09 — "String만 예외(immutable이라)" → 매개변수 재대입은 어떤 타입이든 원본에 영향 없음
- oop-12·14·02 — "equals는 hashCode를 비교", "hashCode는 고유값" → equals는 내용, hashCode는 해시 보조값
- oop-01 — "클래스는 heap에 할당" → 객체는 heap, 클래스 정보는 Method Area
- oop-17 — 얕은 복사 정의가 둘로 갈림 → 참조 복사 / 얕은 복사 / 깊은 복사
- oop-18 — 수업 줄임말(부타자생 등 6개)이 암호처럼 남음, "생주부주" 의미 오해
- oop-22 — "인터페이스는 public 또는 protected" → protected 불가, Java 9+ private 메서드 가능
- basic-06 — "실수 연산은 double로" → 더 큰 타입으로(float*float=float)
- basic-11 — Scanner를 닫은 뒤 System.in을 다시 읽어 IOException

### 중
- basic-06 — 기본형 변환을 업/다운캐스팅이라 불러 참조형 용어와 충돌
- basic-05 — 부호 비트 설명이 비트를 안 보여 줌
- oop-01 — 주석 괄호가 static까지 "인스턴스 변수"로 묶음, 객체와 참조변수 혼동
- oop-05 — static 할당 시점이 본문과 스스로 확인에서 다름, 상수 풀 vs String pool 구분 없음
- oop-07·18 — "자생부생" 글자 순서가 의미와 반대로 읽힘
- oop-14 — "주소 01 / 해시 11" 판서 숫자
- oop-15 — "String은 Constant Pool" 부정확, split의 끝 빈 문자열 제거 누락
- oop-17·09 — 방어적 복사와 얕은 복사 관계
- oop-18 — 오버라이딩 금지 목록에 final 누락
- oop-19 — 설공메사를 메모리로 설명(실제는 컴파일러 검사), VMI 설명과 코드가 다름
- oop-21 — Java 8 이후 인터페이스도 구현을 가짐
- oop-12 — "String만 유일하게 기본타입 특징" 과장

### 하
- basic-07 `obj != null && obj.getName()` 컴파일 안 됨, basic-08 switch 타입 분류, basic-09 continue, basic-02 명명 용어, basic-05 byte·short 권장, basic-06↔oop-10 중복, oop-03 순서 "고정", oop-04 protected 단서, oop-06 오버로딩 범위, oop-10 중복, oop-11 equals 문장, oop-15 hasMoreTokens, oop-16 배열 문장, oop-18 추상화 누락, oop-19 공변 반환, oop-20 `Sun` 오타, oop-21 abstract 설명, oop-22 이름 비튼 이유, oop-23 중첩 클래스 접근 범위, basic-04 boolean 크기

## 🛠️ 자바 활용 · 🌐 네트워크 · 🧪 실습과제

### 상
- prac-12 — 카드 숫자 배열에 A가 없고 10과 T가 같이 있음
- prac-07 — 규칙 설명이 이중 부정, 코드(숫자→개수)와 스스로 확인(개수→숫자)이 반대
- net-07 — UDP 서버가 buffer.length 전체를 돌려보냄(클라이언트 덕에 우연히 맞아 보임)
- util-10 — read()가 int를 돌려주는 이유 설명이 틀림(EOF -1 구분)
- net-04 — "OSI 7계층"인데 7계층 표가 없음
- prac-09 — 본문은 왼쪽 위 대각선, 스스로 확인은 오른쪽 위

### 중
- prac-09 — "LUX 방법" → Strachey, 영역 뒤집기 설명, 추상 클래스·팩토리 코드 없음
- net-08 — synchronizedSet vs synchronizedList
- util-02 — "ArrayList는 비동기" → 동기화되지 않음, remove 예시
- util-06 — "3대 Checked Exception"이 패키지 이름
- util-08↔09 — Stream API와 IO 스트림 구분 안내 없음, Optional·flatMap 미설명
- util-09 — "전송 단위는 byte"와 Reader 설명 모순
- util-10 — 한글을 1바이트씩 읽어 깨지는데 경고 없음
- util-11 — 스레드 상태 그림 부정확, 잠금 해제 시점 틀림
- net-02 — 유니캐스트=MAC, 브로드캐스트=UDP 단정
- net-05 — 본문에 없는 URL/URI 질문
- prac-05↔04 — 완전수·친화수 관계 모순
- prac-06 — "문제 7" 주석, 섹션 설명
- prac-08 — 로또 등수 규칙
- prac-11 — 0=일요일 근거
- prac-01·04·05 — 약수 합 메서드 이름 셋
- util-01↔03 — "Set은 순서 없음" vs LinkedHashSet·TreeSet

### 하
- util-05 multi-catch 소제목, util-05↔06 중복, util-04 ct-13 참조, util-07 effectively final, util-09·10 close 순서, util-10 flush, util-10 "19일차", util-11 Runnable 단점·wait/notify, net-01 3-way handshake, net-03 127·CIDR, net-08 ConcurrentHashMap·broadcast, prac-01 i == n/i, prac-12 byRandom, util-02 정리

## 🗄️ SQL 기초

### 상
- sql-11 — 구매 INSERT가 없는 회원(BBK)을 써서 그대로 돌리면 ERROR 1452, 결과 행도 코드와 다름
- sql-25 — membertbl에 PK가 없어 ON DUPLICATE KEY가 동작하지 않음(PK 추가 단계 누락), 결과표 모순
- sql-38 — UNION 두 SELECT의 컬럼 순서가 달라 칸이 섞임, 의사코드라 실행 불가

### 중
- 섹션 — "MySQL"이라 하지만 실제 환경은 MariaDB, 선언이 sql-14에서야 나옴
- tabledb·indexdb — 소개 없이 등장
- sql-05 — 인덱스를 못 쓰는 변환 방향이 반대
- sql-16 — CTAS는 NOT NULL·DEFAULT를 유지(빠지는 건 PK·FK·인덱스·AUTO_INCREMENT)
- sql-18·21·22·27·32·34·39·40 — 실행 결과가 위 쿼리의 출력이 아님(다른 문제, 축약 테이블, 없는 컬럼)
- sql-20 — testtbl 구조 없음, 제목과 내용 불일치
- sql-21 — MariaDB 10.3.2+는 같은 테이블 서브쿼리 허용, WHERE 없는 UPDATE 표시 없음
- sql-22 — autocommit·ROLLBACK 예제 없음
- sql-23 — "스칼라 서브쿼리"인데 SELECT 절 예제가 없음
- sql-24 — "JOIN이 유일한 답", GROUP BY PK 함수 종속 설명 없음
- sql-26 — "인라인 뷰 방식" 주석인데 코드는 GROUP BY
- sql-30 — 결과 생략 표시 없음, LAST_VALUE 프레임 함정
- sql-33 — `GROUP BY d.dname`에 `d.loc` SELECT(1055 패턴)
- sql-35 — JOIN 뷰 수정 가능 조건
- sql-36 — "클러스터형 = 목차" 비유 오류, 보조 인덱스는 PK 값을 저장
- sql-37 — INSERT 데이터가 없어 예측 불가
- sql-39 — FK 이름 불일치(ERROR 1091)
- sql-43 — USE INDEX는 강제가 아님(FORCE INDEX), 범위가 넓으면 포기하는 이유
- sql-44 — 세미콜론으로 자르는 건 클라이언트
- sql-02↔42·43 — 행 수 불일치

### 하
- 순서(안 배운 개념 선사용), "N회차" 맥락, errno 150, "Oracle의 MySQL", 에러 번호 1248, CTE 지원 버전, NTILE·CUME_DIST 예제, 인덱스 이름, 숫자 FK 이름, EXPLAIN 용어, DROP PROCEDURE IF EXISTS, DETERMINISTIC 설명

## 🖥️ 웹 개발

### 상
- web-31 — "9월 18일 구현 범위", "뒤쪽 분기는 아직 이전 이름" → 지금 코드와 다름. URI 분기 개념 예시 없음
- web-36 — "클래스 파일이 바이트 단위로 같다"는 web-37의 수정과 모순
- web-37 — 개인 PC 실행 방식(STUDY_DB_PASSWORD) 이야기와 세 주제 혼합
- web-40 — 카드 전체가 작업 보고서
- web-46 — 디버깅 로그, "Controller엔 목록만"이 다음 카드와 모순
- web-45 — "Controller에는 목록 요청만"(07에 mulDel 있음)
- web-56 — 날짜별 수정 메모가 겹겹이
- web-25 — 코드 리뷰 메모, 핵심(getBoard가 빈 DTO를 돌려줌)이 묻힘
- web-23 — 개념 표는 좋은데 진도 보고가 끼어 있음
- web-20 vs web-16 — MVC1 정의가 다름
- web-14 — Tomcat 인코딩 기본값 서술이 자기모순(GET/POST 혼동)
- 섹션 설명 — "JSP·Servlet·JDBC", "앞으로 MVC2…"가 낡음
- web-27 — 트랜잭션·autoCommit·executeBatch 설명 없음
- web-43 — 작성자에게 하는 말, 커넥션 풀 설명 없음
- web-42 — 부모·자식 컨텍스트가 설명 전에 나옴, DI 이유 없음
- web-28 — doGet 본문·매핑·생명주기 그림 없음, super.init 누락의 결과 미설명

### 중
- web-21 "TXT 설명 보완", web-26 진도 문구, web-30 Filter 등록·순서, web-29 context-param, web-44 namespace 설명 난해·`${}` 비교 부족, web-41 Model ≈ request 속성 연결, web-47 "37일차" 표기, web-59 번호·가짜 객체·MyBatis 예외 변환, web-58 SQLite·arrow.png, web-54·52 낡은 진도, web-33 JSTL URI 원인 확인, web-16 작업 보고서, web-49 "이 PC", forward/redirect 5번 중복, web-19~37·41~46 형식, web-47·50 `redirect:error.jsp` 함정, web-39 부모·자식 관계

### 하
- web-05 finally 안 rs.close() 예외 처리, web-06 에러 메시지·캐시 설명, web-06 executeQuery 설명, web-10 코드와 결과, web-18 "다음 시간에", web-16 낡은 진도, web-35 날짜, web-38 참조, web-50·56·57·60 메타 문구, web-53 log 폴더, web-58 CDATA

## 📖 개념 사전 · 🧩 코딩테스트

정답 풀이 50개는 모두 문제 요구를 만족한다. 문제는 설명문 쪽이다.

### 상
- concept-java-err-npe — `Scanner sc; sc.nextInt();`는 NPE가 아니라 컴파일 에러
- ct-06 — "NULL은 여전히 남는다" → WHERE에서 NULL 행도 빠짐, 실제 원인은 LIMIT 누락
- ct-29 — "2보다 작은 수로 나누면 몫이 n보다 커진다"는 틀린 논리
- ct-04·06~14 — 정답 코드가 문단에 한 줄로 뭉쳐 있음

### 중
- concept-java-err-cannot-find-symbol 메시지, concept-java-memory 스코프=스택 등식·"공지사항" 비유, concept-java-compile 파일명 규칙 이유, concept-sql-null IFNULL 권장, 개념 사전 그룹 D에 SQL 카드 섞임, 별칭 규칙(ct-08), 다운캐스팅 용어(ct-19), ct-18 GROUP BY 설명, ct-14 큰따옴표, ct-10 조인 키, ct-12 날짜 뺄셈, ct-11 구성, ct-28~41 작성 메타 정보, ct-35·36 클래스 이름(Solution 아님), ct-29·35~50 문제 설명 없음, FAIL인데 실패 원인 없는 카드들, ct-44 replace 생략, ct-40 Integer 캐시, ct-27 용어, ct-36 문장

### 하
- 오버라이딩 공변 반환, NPE 메시지 버전, default 메서드, 기본형 위치, 클래스 로딩 시점, Scanner 비유, DDL 자동 커밋 범위, ON 없는 JOIN, 미설명 용어들, ct-01 "피연산자", ct-03 ⊕, ct-05·17·25·38 세부, 회차 순서·13회차 없음·섹션 소개
