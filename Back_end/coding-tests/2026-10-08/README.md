# 23회차 코딩테스트 기록 — 2026-10-08

[웹으로 복습하기](index.html) · [45일차 수업](../../index.html#class-day45)

원문 `코딩테스트오답노트23_김태경.docx`의 결과는 **Java 0 PASS · 2 FAIL, SQL 1 PASS · 1 FAIL**이다. FAIL 세 문제는 제출 코드 칸이 비어 있어 실패 원인을 단정하지 않았다. PASS 한 문제는 오답노트의 정답 풀이·개념 정리 칸이 비어 있어, 짚어 둘 점을 새로 정리했다.

| 문제 | 원문 결과 | 보존한 내용 | 문제 |
|---|---|---|---|
| 콜라츠 추측 | FAIL | 정답 풀이. 제출본 없음 | [12943](https://school.programmers.co.kr/learn/courses/30/lessons/12943) |
| 같은 숫자는 싫어 | FAIL | 정답 풀이. 제출본 없음 | [12906](https://school.programmers.co.kr/learn/courses/30/lessons/12906) |
| 나이 정보가 없는 회원 수 | PASS | SQL 제출 코드 | [131528](https://school.programmers.co.kr/learn/courses/30/lessons/131528) |
| 자동차 대여 기록에서 대여중 / 대여 가능 여부 구분하기 | FAIL | 정답 풀이. 제출본 없음 | [157340](https://school.programmers.co.kr/learn/courses/30/lessons/157340) |

파일로 옮기면서 `class Solution`의 클래스 이름만 파일 이름에 맞췄다. 원문 개념 정리의 수식(int 범위 등)은 문서 변환 과정에서 숫자가 빠져 있어 다시 적었다.

## Java — 콜라츠 추측 (FAIL · 제출 코드 없음)

[`Collatz.java`](Collatz.java)는 원문의 **정답 풀이**다.

```java
if (num == 1) return 0;
long n = num;                       // int 오버플로 방지
int count = 0;
while (n != 1) {
    if (count == 500) return -1;    // 작업하기 전에 500번 검사
    if (n % 2 == 0) n /= 2;
    else n = n * 3 + 1;
    count++;
}
return count;
```

흔히 틀리는 곳을 실제로 돌려 본 결과(1 이상 8,000,000 미만 전부):

| 실수 | 결과 |
|---|---|
| `int`로 계산 | 25,051개의 답이 달라진다. 113383부터 중간값이 int를 넘고(정답 247 → int −1), 공식 예제 626331은 −1이어야 하는데 488 |
| `count++` 뒤 `count >= 500`이면 −1 | 정확히 500번째 작업에서 1이 되는 수 5개(3027113 등)를 −1로 잘못 처리 |

500번 안에서 가장 큰 중간값은 **60,342,610,919,632**(시작 6631675)다. `int` 최댓값은 2,147,483,647(2³¹−1). 처음부터 1이면 `while (n != 1)`이 처음부터 거짓이라 첫 줄의 `if`가 없어도 0이다.

## Java — 같은 숫자는 싫어 (FAIL · 제출 코드 없음)

[`NoSameNumber.java`](NoSameNumber.java)는 원문의 **정답 풀이**다. 스택이 비었거나 맨 위 값과 다를 때만 넣고(`stack.isEmpty() || stack.peek() != arr[i]` — 단락 평가로 빈 스택에서 `peek()`을 부르지 않음), `stack.get(i)`로 바닥부터 옮겨 원래 순서를 지킨다. 원문 주석대로 `else if` 블록은 같은 값을 꺼냈다 다시 넣을 뿐이라 지워도 결과가 같다.

- **연속 중복만** 지운다 — `HashSet`을 쓰면 떨어져 있는 같은 숫자까지 지워 `[1,3,0]`이 된다.
- 스택 없이 `i == 0 || arr[i] != arr[i-1]`이면 넣기만 해도 같은 결과(무작위 20,000개로 비교).
- `Integer`끼리 `!=`는 주소 비교 — −128~127 밖이면 같은 값도 다르다고 나온다(1000으로 확인). 정답 풀이는 한쪽이 `int`라 값 비교가 되고, 이 문제는 0~9라 드러나지 않는다.

## SQL — 나이 정보가 없는 회원 수 (PASS)

[`age-null-submitted.sql`](age-null-submitted.sql)

```sql
SELECT count(*) as USERS
from USER_INFO 
where AGE is NULL;
```

- `WHERE AGE = NULL`은 0 — NULL과의 비교는 UNKNOWN이라 어떤 행도 남지 않는다.
- `COUNT(AGE)`로 세면 0 — 컬럼을 세는 `COUNT`는 NULL을 건너뛴다.
- `COUNT(*) - COUNT(AGE)`도 NULL의 개수다.

## SQL — 자동차 대여 기록에서 대여중 / 대여 가능 여부 구분하기 (FAIL · 제출 코드 없음)

[`car-rental-answer.sql`](car-rental-answer.sql)은 원문의 **정답 풀이**다.

```sql
SELECT CAR_ID,
    CASE WHEN MAX(CASE WHEN '2022-10-16' BETWEEN START_DATE AND END_DATE THEN 1 ELSE 0 END) = 1
         THEN '대여중' ELSE '대여 가능' END AS AVAILABILITY
FROM CAR_RENTAL_COMPANY_RENTAL_HISTORY
GROUP BY CAR_ID
ORDER BY CAR_ID DESC;
```

이력 테이블은 차 한 대에 여러 줄이라 `GROUP BY CAR_ID`로 접고, "10/16에 걸친 이력이 하나라도 있는가"를 `MAX(CASE …) = 1`로 판정한다(`SUM(…) > 0`도 같음). 실행해 본 틀린 방법:

| 방법 | 결과 |
|---|---|
| 줄마다 판정 + `DISTINCT` | 2·4번 차가 '대여중'과 '대여 가능'으로 두 줄씩 |
| `WHERE`로 10/16 이력만 | 대여 가능한 3·5번 차가 사라짐 |
| `<` · `>`로 비교 | 반납일·시작일이 10/16인 1·4번 차가 빠짐 (`BETWEEN`은 양 끝 포함) |

## 로컬 검증

프로그래머스 재채점이 아니다.

```powershell
javac -encoding UTF-8 *.java
java -Dstdout.encoding=UTF-8 CodingTest23Test
node verify-sql23.mjs
```

- **콜라츠 추측**: 공식 예제 3개 + 1 이상 8,000,000 미만 전부 7,999,999개 통과(−1이 답인 수 413개). 기댓값은 `long`으로 501번까지 따라가는 별도 코드.
- **같은 숫자는 싫어**: 공식 예제 2개 + 무작위 20,000개(길이 1~200, 0~9) 통과. 길이 1,000,000 배열 약 10ms.
- **SQL**: [`verify-sql23.mjs`](verify-sql23.mjs)가 SQL 파일을 **그대로 읽어** Node 내장 SQLite(3.53, 메모리 DB)에 실행한다. 10개 항목 통과. 날짜는 `'YYYY-MM-DD'` 글자로 넣었고, 이 형식은 글자 순서가 날짜 순서라 `BETWEEN`이 MySQL의 DATE 비교와 같은 결과를 낸다.

## 이 회차에서 남길 것

- 곱셈이 반복되는 계산은 입력이 작아도 `long`. "N번 안에"는 경계(정확히 N번째)를 손으로 따라가 본다.
- 연속 중복 제거 = 직전 값과 다를 때만 넣기. 객체(`Integer`)끼리는 `equals`.
- NULL은 `IS NULL`, 행 수는 `COUNT(*)`.
- 이력(1:N) 테이블에서 엔티티별 상태 하나 = `GROUP BY` + `MAX/SUM(CASE …)`.
