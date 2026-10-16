# 26회차 코딩테스트 기록 — 2026-10-16

[웹으로 복습하기](index.html) · [50일차 수업](../../index.html#class-day50)

원문 `코딩테스트오답노트26_김태경.docx`의 결과는 **Java 1 PASS · 1 FAIL, SQL 1 PASS · 1 FAIL**이다. FAIL 두 문제의 실패 원인은 단정하지 않았다. 타겟 넘버는 제출 코드 칸의 코드가 로컬 검증에서 정답과 같은 값을 내고(시험 중 제출본인지는 알 수 없다), 대장균 분류 2는 제출 코드 칸이 비어 있다.

| 문제 | 원문 결과 | 보존한 내용 | 문제 |
|---|---|---|---|
| 없는 숫자 더하기 | PASS | Java 제출 코드 | [86051](https://school.programmers.co.kr/learn/courses/30/lessons/86051) |
| 타겟 넘버 | FAIL | 제출 코드 칸의 DFS 코드 | [43165](https://school.programmers.co.kr/learn/courses/30/lessons/43165) |
| 흉부외과 또는 일반외과 의사 목록 출력하기 | PASS | SQL 제출 코드 + 원문의 실전 권장 쿼리(`DATE_FORMAT`) | [132203](https://school.programmers.co.kr/learn/courses/30/lessons/132203) |
| 대장균의 크기에 따라 분류하기 2 | FAIL | 원문의 정답 풀이 3가지(NTILE · PERCENT_RANK · CUME_DIST). 제출본 없음 | [301649](https://school.programmers.co.kr/learn/courses/30/lessons/301649) |

파일로 옮기면서 `class Solution`의 클래스 이름만 파일 이름에 맞췄다. 원문 SQL 제목 끝의 공백은 뺐고, 문서 변환에서 빠진 수식 개체(0, 9, 2^20, O(n) 등)는 다시 적었다. 문제 번호와 조건은 프로그래머스 문제 페이지에서 확인했다.

## Java — 없는 숫자 더하기 (PASS)

[`MissingNumbersSum.java`](MissingNumbersSum.java)

```java
int sum = 45;                       // 0+1+…+9
for(int i=0;i<numbers.length;i++){
    sum= sum-numbers[i];
}
return sum;
```

- 원소가 **모두 다르다**는 조건 덕분에 "전체 합 − 있는 것의 합 = 없는 것의 합"이 성립한다(여집합). 조건 밖의 중복 입력 `[9,9]`이면 27이 나와 틀린다(실제 36).
- 원문의 다듬은 코드는 `for (int num : numbers) sum -= num;`. 범위가 1~n이면 `n * (n + 1) / 2`.

## Java — 타겟 넘버 (FAIL)

[`TargetNumber.java`](TargetNumber.java) — 원문 제출 코드 칸의 코드.

```java
public void dfs(int[] numbers, int target, int index, int sum) {
    if (index == numbers.length) { if (sum == target) answer = answer + 1; return; }
    dfs(numbers, target, index + 1, sum + numbers[index]);   // 더하는 길
    dfs(numbers, target, index + 1, sum - numbers[index]);   // 빼는 길
}
```

- 숫자마다 +/− 두 갈래라 2^n가지(최대 2^20 ≈ 100만) — 완전 탐색이 충분히 빠르다(이 PC에서 2.6ms).
- 상태(`index` · `sum`)는 **새 값을 인자로** 넘긴다. 변수를 직접 바꾸면 다음 갈래가 망가진다.
- `answer`가 필드라 같은 객체로 두 번 부르면 5 → 10처럼 쌓인다. `solution` 첫 줄에서 0으로 되돌리거나 `dfs`가 개수를 돌려주게 하면 안전하다.

## SQL — 흉부외과 또는 일반외과 의사 목록 출력하기 (PASS)

[`doctor-cs-gs-submitted.sql`](doctor-cs-gs-submitted.sql) · [`doctor-cs-gs-answer.sql`](doctor-cs-gs-answer.sql)(원문 "실전 권장 쿼리")

```sql
SELECT DR_NAME, DR_ID, MCDP_CD, DATE_FORMAT(HIRE_YMD, '%Y-%m-%d') AS HIRE_YMD
FROM DOCTOR
WHERE MCDP_CD IN ('CS', 'GS')
ORDER BY HIRE_YMD DESC, DR_NAME ASC;
```

| 실수 | 결과(검증용 의사 11명) |
|---|---|
| `ORDER BY HIRE_YMD, DR_NAME DESC` | 앞 기준이 오름차순이 되어 순서가 뒤집힘 |
| `MCDP_CD = 'CS' OR MCDP_CD = 'GS' AND HIRE_YMD >= '2015-01-01'` | AND가 먼저 묶여 CS 의사는 날짜 조건을 받지 않음(5명) — `IN`으로 쓰면 3명 |

## SQL — 대장균의 크기에 따라 분류하기 2 (FAIL · 제출 코드 없음)

[`ecoli-size2-ntile.sql`](ecoli-size2-ntile.sql) · [`ecoli-size2-percent-rank.sql`](ecoli-size2-percent-rank.sql) · [`ecoli-size2-cume-dist.sql`](ecoli-size2-cume-dist.sql)은 원문의 **정답 풀이 세 가지**다.

```sql
SELECT ID,
       CASE NTILE(4) OVER (ORDER BY SIZE_OF_COLONY DESC)
           WHEN 1 THEN 'CRITICAL' WHEN 2 THEN 'HIGH' WHEN 3 THEN 'MEDIUM' ELSE 'LOW'
       END AS COLONY_NAME
FROM ECOLI_DATA
ORDER BY ID ASC;
```

- 행을 줄이지 않고 순위 · 비율을 붙이는 **윈도우 함수**가 필요하다(`GROUP BY`로는 전체 중 몇 번째인지 모른다).
- 개체 4k개 · 크기가 겹치지 않으면 p번째(0부터)의 `PERCENT_RANK` = p/(4k−1), `CUME_DIST` = (p+1)/4k라, 경계(0.25 · 0.50 · 0.75)를 `<=`로 끊으면 세 풀이가 같은 답을 낸다. 개체 4 · 8 · 12 · 20개로 실행해 모두 같았다.
- 틀리기 쉬운 곳: `DESC`를 빼면 작은 것이 CRITICAL, `CUME_DIST < 0.25`로 쓰면 8개 중 CRITICAL이 1개(0.25인 두 번째가 빠짐), 바깥 `ORDER BY ID`를 빼면 순서가 보장되지 않는다.

## 로컬 검증

프로그래머스 재채점이 아니다.

```powershell
javac -encoding UTF-8 -d out *.java
java -Dstdout.encoding=UTF-8 -cp out CodingTest26Test
node verify-sql26.mjs
```

- **없는 숫자 더하기**: 공식 예제 2개 + 가능한 모든 입력(0~9의 부분집합, 길이 1~9) 1,022개.
- **타겟 넘버**: 공식 예제 2개 + 무작위 2,000개를 재귀 없이 2^n가지를 비트로 모두 센 값과 비교. 숫자 20개(모두 1) · 목표 2는 167,960 = C(20, 9).
- **SQL**: [`verify-sql26.mjs`](verify-sql26.mjs)가 SQL 파일을 **그대로 읽어** Node 내장 SQLite(3.53, 윈도우 함수 지원)에 실행한다. 20개 항목 통과. SQLite에 없는 `DATE_FORMAT`은 쓰는 서식(`%Y · %m · %d`)만 같은 이름으로 등록했다. 행은 검증용으로 만든 것이다.

## 이 회차에서 남길 것

- 범위가 정해져 있고 중복이 없으면 "전체 − 있는 것"으로 한 번에.
- 완전 탐색은 경우의 수(2^20은 OK)부터 계산하고, 재귀의 상태는 인자로 넘긴다. 필드에 쌓는 값은 초기화.
- 여러 값 중 하나는 `IN`, 정렬 방향은 기준마다, 날짜 모양은 `DATE_FORMAT`.
- "전체 중 상위 몇 %"는 윈도우 함수 — `NTILE` · `PERCENT_RANK` · `CUME_DIST`의 정의(어디가 0이고 1인지)와 경계 `<=`.
