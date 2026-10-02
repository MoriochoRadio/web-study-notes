# 21회차 코딩테스트 기록 — 2026-10-02

[웹으로 복습하기](index.html) · [42일차 수업](../../index.html#class-day42)

원문 `코딩테스트오답노트21_김태경.docx`의 결과는 **Java 1 PASS · 1 FAIL, SQL 1 PASS · 1 FAIL**이다. Java FAIL(모의고사)은 제출 코드 칸이 비어 있어 실패 원인을 단정하지 않았다. SQL FAIL은 제출 코드와 정답 풀이가 모두 남아 있어 차이를 직접 비교했다.

| 문제 | 원문 결과 | 보존한 내용 | 문제 |
|---|---|---|---|
| 문자열을 정수로 바꾸기 | PASS | Java 제출 코드 | [12925](https://school.programmers.co.kr/learn/courses/30/lessons/12925) |
| 모의고사 | FAIL | 정답 풀이. 제출본 없음 | [42840](https://school.programmers.co.kr/learn/courses/30/lessons/42840) |
| 여러 기준으로 정렬하기 | PASS | SQL 제출 코드 | [59404](https://school.programmers.co.kr/learn/courses/30/lessons/59404) |
| 조건에 맞는 사용자 정보 조회하기 | FAIL | SQL 제출 코드 + 정답 풀이 | [164670](https://school.programmers.co.kr/learn/courses/30/lessons/164670) |

파일로 옮기면서 `class Solution`의 클래스 이름만 파일 이름에 맞췄다.

## Java — 문자열을 정수로 바꾸기 (PASS)

[`StringToInt.java`](StringToInt.java)

```java
int answer = 0;
answer=Integer.parseInt(s);
return answer;
```

`Integer.parseInt`는 맨 앞의 부호까지 읽는다. `"+1234"` → 1234, `"-1234"` → -1234. 숫자가 아닌 글자가 섞이면 `NumberFormatException`이다.

## Java — 모의고사 (FAIL · 제출 코드 없음)

[`MockExam.java`](MockExam.java)는 원문의 **정답 풀이**다.

```java
for (int i = 0; i < answers.length; i++) {
    if (answers[i] == p1[i % p1.length]) score1++;
    if (answers[i] == p2[i % p2.length]) score2++;
    if (answers[i] == p3[i % p3.length]) score3++;
}
int maxScore = Math.max(score1, Math.max(score2, score3));
if (score1 == maxScore) list.add(1);
if (score2 == maxScore) list.add(2);
if (score3 == maxScore) list.add(3);
```

오답노트에 정리한 개념:

- **`i % 패턴길이`** — 문제 번호가 아무리 커져도 인덱스가 0 ~ 길이-1 안에서 돈다.
- **반복문 하나로 세 사람 동시 채점** — 문제 수 N만큼만 돈다(O(N)).
- **정렬 대신 `Math.max`** — 점수 배열을 정렬하면 누가 몇 번이었는지 사라진다.
- **`else if`가 아니라 독립된 `if` 세 개** — 동점자를 모두 담는다. 1→2→3 순서로 검사하므로 오름차순도 저절로 맞는다. `else if`로 고르면 `[1,3,2,4,2]`의 답 `[1, 2, 3]`이 `[1]`이 된다(로컬에서 확인).
- **`ArrayList<Integer>` → `int[]`** — 크기를 모르는 결과는 리스트에 모은 뒤 배열로 옮긴다.

## SQL — 여러 기준으로 정렬하기 (PASS)

[`multi-sort.sql`](multi-sort.sql)

```sql
SELECT ANIMAL_ID, NAME, DATETIME
FROM ANIMAL_INS
ORDER BY NAME ASC, DATETIME DESC;
```

정렬 기준을 쉼표로 이으면 앞 기준이 같을 때만 다음 기준을 본다. 방향(ASC·DESC)은 기준마다 따로 정한다.

## SQL — 조건에 맞는 사용자 정보 조회하기 (FAIL)

[`user-info-submitted.sql`](user-info-submitted.sql) · [`user-info-answer.sql`](user-info-answer.sql)

"글 3개 이상 쓴 사람"을 고르는 부분은 제출 코드(`WHERE IN` 서브쿼리 + `DISTINCT`)와 정답 풀이(`GROUP BY` + `HAVING`)가 같은 결과를 낸다. 차이는 출력 형식이다.

| 부분 | 제출 코드 | 정답 풀이 |
|---|---|---|
| 전화번호 앞 3자리 | `'010'` 고정 | `SUBSTR(U.TLNO, 1, 3)` |
| 주소 | `CONCAT(…, ' ', …)` — NULL 하나면 전체 NULL | `CONCAT_WS(' ', …)` — NULL은 건너뜀 |

TLNO가 011로 시작하면 제출 코드는 `010-…`으로 찍는다. 실제 채점 데이터를 볼 수 없어 이것이 FAIL의 원인이라고 단정하지는 않지만, 가장 분명한 차이다.

오답노트에 정리한 개념:

- **`CONCAT` vs `CONCAT_WS`** — `CONCAT_WS(구분자, …)`는 사이사이에 구분자를 넣고 NULL은 건너뛴다.
- **`SUBSTR(문자열, 시작, 길이)`** — SQL은 1부터 센다(자바 `substring`은 0부터). 길이를 생략하면 끝까지.
- **WHERE vs HAVING** — 집계 함수 조건(`COUNT(*) >= 3`)은 HAVING에.
- **GROUP BY와 SELECT 컬럼** — 원문은 SELECT 컬럼을 GROUP BY에도 적으라고 정리했다. 덧붙이면, 이 문제처럼 기본 키(USER_ID)로 묶으면 MySQL 5.7 이상은 나머지 컬럼을 허용한다(함수적 종속).

## 로컬 검증

프로그래머스 재채점이 아니다.

```powershell
javac -encoding UTF-8 *.java
java -Dstdout.encoding=UTF-8 CodingTest21Test
node verify-sql21.mjs
```

- **문자열을 정수로 바꾸기**: 문제 조건(길이 1~5, 부호 가능, 0으로 시작하지 않음)에서 가능한 입력 119,998개 전부 통과.
- **모의고사**: 공식 예제 2개 + 무작위 20,000개(길이 10,000짜리 200개 포함, 동점자 4,931개) 통과. 기댓값은 사람마다 따로 채점하는 별도 코드로 계산.
- **SQL**: [`verify-sql21.mjs`](verify-sql21.mjs)가 SQL 파일을 **그대로 읽어** Node 내장 SQLite(3.53, 메모리 DB)에 실행한다. 8개 항목 통과. SQLite의 `CONCAT`은 NULL을 빈 문자열로 치므로, MySQL처럼 인자에 NULL이 있으면 NULL을 돌려주는 같은 이름의 함수를 등록했다. 011 번호와 NULL 상세 주소는 차이를 보이려고 넣은 데이터다. 로컬 MariaDB 접속 정보는 쓰지 않았다.

## 이 회차에서 남길 것

- 반복 패턴은 `배열[i % 길이]`.
- 동점자를 모두 고를 때는 `else if`가 아니라 독립된 `if`.
- 값을 하드코딩하지 말고 원본 컬럼에서 잘라 쓴다. 구분자로 이을 땐 `CONCAT_WS`.
