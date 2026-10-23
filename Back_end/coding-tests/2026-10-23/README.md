# 29회차 코딩테스트 기록 — 2026-10-23

[웹으로 복습하기](index.html) · [10/23 수업(AI Agent 과정)](../../../AI_Agent/index.html#ai-day05)

원문 `코딩테스트오답노트29_김태경.docx`의 결과는 **3 PASS · 1 FAIL**이다(프로그래밍 PASS · SQL PASS · JAVA FAIL · SQL PASS). 제출 코드가 남은 것은 약수의 개수와 덧셈 · 총 거래금액 두 문제이고, 이름에 el이 들어가는 동물(PASS)과 소수 찾기(FAIL)는 제출 코드 칸이 비어 있어 원문의 **정답 풀이**를 옮겼다. FAIL 원인은 단정하지 않았다. 기록은 백엔드 코딩테스트 탭 ct-78~81에 이어 둔다.

| 문제 | 원문 결과 | 보존한 내용 | 문제 |
|---|---|---|---|
| 약수의 개수와 덧셈 | PASS | 제출 코드 + 원문 정답 풀이 두 개(√i 탐색 · 제곱수 판별) | [77884](https://school.programmers.co.kr/learn/courses/30/lessons/77884) |
| 이름에 el이 들어가는 동물 찾기 | PASS | 원문 정답 풀이(SQL). 제출본 없음 | [59047](https://school.programmers.co.kr/learn/courses/30/lessons/59047) |
| 소수 찾기 | FAIL | 원문 정답 풀이(Java DFS · 백트래킹). 제출본 없음 | [42839](https://school.programmers.co.kr/learn/courses/30/lessons/42839) |
| 조건에 맞는 사용자와 총 거래금액 조회하기 | PASS | 제출 코드 + 원문 정답 풀이(해설의 절을 이어 붙임) | [164668](https://school.programmers.co.kr/learn/courses/30/lessons/164668) |

파일로 옮기면서 `class Solution`의 클래스 이름만 파일 이름에 맞췄다. 문제 번호와 조건은 프로그래머스 문제 페이지에서 확인했다.

## 프로그래밍 — 약수의 개수와 덧셈 (PASS)

[`DivisorSum.java`](DivisorSum.java)(제출) · [`DivisorSumSqrt.java`](DivisorSumSqrt.java)(정답 ① √i까지) · [`DivisorSumSquare.java`](DivisorSumSquare.java)(정답 ② 제곱수 판별)

```java
for (int j = 1; j * j <= i; j++) {
    if (j * j == i) count += 1;        // 짝이 자기 자신 (제곱수)
    else if (i % j == 0) count += 2;   // (j, i / j) 짝
}
```

- 제출 코드도 정답이다 — 1과 자기 자신 2개로 시작하고 `i == 1`만 1개로, 2부터 `i / 2`까지 센다.
- 약수 개수가 홀수인 수 = 제곱수(1~1,000에 31개). 그래서 정답 ②는 `i % Math.sqrt(i) == 0`이면 빼고 아니면 더한다. 실수 나머지 식이지만 1~1억에서 정수 판별과 다른 곳이 없었다. 뜻이 분명한 쓰기는 `int r = (int) Math.sqrt(i); r * r == i`.
- 1~1,000 전체의 안쪽 반복: 제출 249,001번 · 정답 ① 20,615번.

## SQL — 이름에 el이 들어가는 동물 찾기 (PASS · 제출 코드 없음)

[`el-animals-answer.sql`](el-animals-answer.sql)

```sql
SELECT ANIMAL_ID, NAME
from ANIMAL_INS
where NAME LIKE '%EL%' AND ANIMAL_TYPE = 'Dog'
order by NAME, ANIMAL_ID
```

- `%`는 0글자 이상 — 앞뒤에 있어야 "어디든". `'EL%'`면 Maxwell 2가 빠진다.
- MySQL 기본 콜레이션은 대소문자를 무시해 `'%EL%'`가 Elijah도 찾는다. 구분하는 DB라면 `UPPER(NAME) LIKE '%EL%'`.
- 검증에 쓴 SQLite는 **정렬**이 대소문자를 가려 대문자 `ELSA`가 `Elijah`보다 먼저 나온다. MySQL 기본처럼 `COLLATE NOCASE`로 정렬하면 Elijah가 먼저.

## JAVA — 소수 찾기 (FAIL · 제출 코드 없음)

[`FindPrimes.java`](FindPrimes.java)

```java
public void dfs(String current, String numbers) {
    if (!current.equals("")) numberSet.add(Integer.parseInt(current));  // "011" → 11
    for (int i = 0; i < numbers.length(); i++) {
        if (!visited[i]) {
            visited[i] = true;
            dfs(current + numbers.charAt(i), numbers);
            visited[i] = false;                                          // 백트래킹
        }
    }
}
```

- 모든 부분 순열 → `HashSet<Integer>`로 중복 제거 → √n까지 나눠 소수 판별.
- `visited[i] = false`를 빼면 `"17"`에서 7로 시작하는 수를 못 만들어 Set이 {1, 17}, 답 1(로컬 확인).
- 종이 7장(모두 다른 숫자)이면 `dfs` 호출 13,700번.

## SQL — 조건에 맞는 사용자와 총 거래금액 조회하기 (PASS)

[`used-goods-total-sales.sql`](used-goods-total-sales.sql)(제출) · [`used-goods-total-sales-answer.sql`](used-goods-total-sales-answer.sql)(정답 풀이)

```sql
SELECT U.USER_ID, U.NICKNAME, SUM(B.PRICE) AS TOTAL_SALES
FROM USED_GOODS_BOARD B JOIN USED_GOODS_USER U ON B.WRITER_ID = U.USER_ID
WHERE B.STATUS = 'DONE'
GROUP BY U.USER_ID, U.NICKNAME
HAVING SUM(B.PRICE) >= 700000
ORDER BY TOTAL_SALES ASC;
```

- 제출 코드는 `GROUP BY B.WRITER_ID`만 쓰고 `U.NICKNAME`을 SELECT했다. MySQL은 조인의 `=`와 기본 키로 닉네임이 하나로 정해지면 `ONLY_FULL_GROUP_BY`에서도 허용한다(함수 종속). 채점 DB 설정은 알 수 없어 단정하지 않았고, MySQL로는 확인하지 않았다. 어디서나 통하게는 정답처럼 닉네임도 GROUP BY에.
- 제출 결과의 첫 열 이름은 `WRITER_ID`(문제 예시는 `USER_ID`) — 값은 같다.

| 실수 | 결과(검증용 행) |
|---|---|
| `HAVING > 700000` | 딱 70만인 사람이 빠짐 |
| `WHERE STATUS = 'DONE'` 없음 | 판매 중 금액까지 더해짐 |
| `GROUP BY U.NICKNAME` | 닉네임이 같은 두 사람이 한 줄로 |
| `WHERE SUM(PRICE) >= …` | 오류(묶기 전엔 집계 함수 불가) |

## 로컬 검증

프로그래머스 재채점이 아니다.

```powershell
javac -encoding UTF-8 -d out *.java
java -Dstdout.encoding=UTF-8 -cp out CodingTest29Test
node verify-sql29.mjs
```

- **약수의 개수와 덧셈**: 공식 예제 2개, 1~1,000의 모든 수 하나씩(1부터 n까지 나눠 센 값과 비교), 무작위 범위 2,000쌍 — 제출 · 정답 ① · 정답 ② 모두 같다.
- **소수 찾기**: 공식 예제 2개 + 길이 1~4의 모든 숫자 조합 1,000가지 + 무작위 300개(길이 1~7). 기댓값은 DFS와 다른 방법 — 에라토스테네스의 체로 1천만 미만 소수 664,579개를 구하고 숫자 구성이 종이 조각 안에 들어가는 소수를 센다.
- **SQL**: [`verify-sql29.mjs`](verify-sql29.mjs)가 SQL 파일을 **그대로 읽어** Node 내장 SQLite에 실행한다. 16개 항목 통과. 동물 표는 문제 예시 5행 + 검증용 4행, 중고 거래는 문제 예시(게시글 5 · 회원 5) + 검증용 3명.

## 이 회차에서 남길 것

- 약수 · 소수 · 넓이 짝은 "√n까지 짝으로 세기". 약수 개수가 홀수 ⇔ 제곱수.
- "어디든 포함"은 `'%…%'`, 정렬 기준이 둘이면 `ORDER BY 1순위, 2순위`. 대소문자 조건은 DB 설정보다 `UPPER`로.
- 조각으로 만드는 모든 수 = DFS + `visited` 되돌리기 + `Set`.
- 조건 → 묶기 → 그룹 조건 = `WHERE` → `GROUP BY` → `HAVING`. 묶는 기준은 ID, SELECT의 일반 열은 GROUP BY에도.
