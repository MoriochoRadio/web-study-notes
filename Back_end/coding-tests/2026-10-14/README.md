# 25회차 코딩테스트 기록 — 2026-10-14

[웹으로 복습하기](index.html) · [48일차 수업](../../index.html#class-day48)

원문 `코딩테스트오답노트25_김태경.docx`의 결과는 **Java 1 PASS · 1 FAIL, SQL 1 PASS · 1 FAIL**이다. FAIL 두 문제는 실패 원인을 단정하지 않았다. 기능개발은 제출 코드 칸에 이 문제가 아닌 24회차 올바른 괄호 제출 코드가 들어 있고, 경기도 식품창고는 제출 코드 칸이 비어 있다. 내적은 정답 풀이 · 개념 정리 칸이 비어 있어 짚어 둘 점을 새로 정리했다. 대장균 분류는 원문에 "더 간결하게 다듬은 정석 코드"가 함께 적혀 있어 따로 옮겼다.

| 문제 | 원문 결과 | 보존한 내용 | 문제 |
|---|---|---|---|
| 내적 | PASS | Java 제출 코드 | [70128](https://school.programmers.co.kr/learn/courses/30/lessons/70128) |
| 기능개발 | FAIL | 원문의 정답 풀이 2가지. 제출 코드 칸은 24회차 코드라 옮기지 않음 | [42586](https://school.programmers.co.kr/learn/courses/30/lessons/42586) |
| 경기도에 위치한 식품창고 목록 출력하기 | FAIL | 원문의 정답 풀이 2가지(CASE · IFNULL). 제출본 없음 | [131114](https://school.programmers.co.kr/learn/courses/30/lessons/131114) |
| 대장균의 크기에 따라 분류하기 1 | PASS | SQL 제출 코드 + 원문의 정석 코드 | [299307](https://school.programmers.co.kr/learn/courses/30/lessons/299307) |

파일로 옮기면서 `class Solution`의 클래스 이름만 파일 이름에 맞췄다. 원문 SQL 제목 끝의 공백은 뺐다. 문제 번호와 조건은 프로그래머스 문제 페이지에서 확인했다.

## Java — 내적 (PASS)

[`InnerProduct.java`](InnerProduct.java)

```java
for(int i=0;i<a.length;i++){
    answer = answer+a[i]*b[i];
}
```

- 두 배열을 같은 인덱스로 돌며 곱을 더한다. `answer += a[i] * b[i]`로 줄여 쓸 수 있다.
- 향상된 for문은 인덱스가 없어 짝(`b[i]`)을 찾을 수 없다. 24회차 음양 더하기와 같은 이유다.
- 합의 범위는 −1,000,000,000 ~ 1,000,000,000(1,000 × 1,000 × 1,000개)이라 `int`(최댓값 2,147,483,647)로 충분하다.

## Java — 기능개발 (FAIL)

원문 제출 코드 칸의 코드는 [`../2026-10-12/ValidParenthesesSubmitted.java`](../2026-10-12/ValidParenthesesSubmitted.java)(24회차 올바른 괄호 제출 코드)와 공백만 다르다. 함수 모양(`boolean solution(String s)`)이 이 문제(`int[] solution(int[] progresses, int[] speeds)`)와 달라 기능개발 제출본으로 보지 않았다.

원문 정답 풀이 두 가지를 옮겼다 — [`FeatureDeployQueue.java`](FeatureDeployQueue.java)(큐), [`FeatureDeployLoop.java`](FeatureDeployLoop.java)(큐 없이 반복문 하나).

```java
int days = (remain % speeds[i] == 0) ? (remain / speeds[i]) : (remain / speeds[i] + 1);  // 올림
if (days > maxDay) {            // 지금 묶음의 기준일보다 늦게 끝나면
    if (count > 0) resultList.add(count);
    maxDay = days; count = 1;   // 새 묶음
} else {
    count++;                    // 기준일 안에(같은 날 포함) 끝나면 함께 배포
}
...
resultList.add(count);          // 마지막 묶음
```

틀리기 쉬운 곳 세 가지를 실행으로 확인했다.

| 실수 | 결과 |
|---|---|
| `(int) Math.ceil(remain / speed)` — `(double)` 없이 | 가능한 9,900쌍 중 9,427쌍에서 하루 적게(7/3 → 2) |
| 같은 날 끝난 작업을 따로 배포(`<=`를 `<`로) | 무작위 50,000개 중 29,680개 오답, `[99,99]`/`[1,1]` → `[1, 1]`(정답 `[2]`) |
| 반복문 뒤 `resultList.add(count)` 빠뜨림 | 예제 1 → `[2]`, 예제 2 → `[1, 3]`, 작업 1개 → `[]` |

올림 나눗셈은 삼항 연산자, `(remain + speed - 1) / speed`, `(int) Math.ceil((double) remain / speed)` 세 가지가 9,900쌍 모두에서 같다.

## SQL — 경기도에 위치한 식품창고 목록 출력하기 (FAIL · 제출 코드 없음)

[`food-warehouse-answer.sql`](food-warehouse-answer.sql) · [`food-warehouse-answer-ifnull.sql`](food-warehouse-answer-ifnull.sql)은 원문의 **정답 풀이**다.

```sql
SELECT WAREHOUSE_ID, WAREHOUSE_NAME, ADDRESS,
       CASE WHEN FREEZER_YN IS NULL THEN 'N' ELSE FREEZER_YN END AS FREEZER_YN
FROM FOOD_WAREHOUSE
WHERE ADDRESS LIKE '경기도%'
ORDER BY WAREHOUSE_ID ASC;
-- 또는 IFNULL(FREEZER_YN, 'N') AS FREEZER_YN
```

원문 개념 정리는 "CASE에서 ELSE를 생략하면 생기는 함정"을 핵심 오답 원인으로 적었다. 제출본이 없어 실제로 그렇게 냈는지는 확인할 수 없다. 실행해 본 틀린 방법:

| 방법 | 결과 |
|---|---|
| `CASE WHEN FREEZER_YN IS NULL THEN 'N' END` (ELSE 없음) | 원래 Y · N이던 창고가 모두 NULL |
| `CASE WHEN FREEZER_YN = NULL THEN 'N' ELSE FREEZER_YN END` | 한 번도 맞지 않아 NULL이 그대로 남음 |
| 별칭 `AS FREEZER_YN` 없이 | 결과 열 이름이 `IFNULL(FREEZER_YN, 'N')` |

`COALESCE(FREEZER_YN, 'N')`도 같은 결과다(표준 SQL, 후보를 여러 개 나열할 수 있다).

## SQL — 대장균의 크기에 따라 분류하기 1 (PASS)

[`ecoli-size-submitted.sql`](ecoli-size-submitted.sql)(제출) · [`ecoli-size-answer.sql`](ecoli-size-answer.sql)(원문의 정석 코드)

```sql
CASE
    WHEN SIZE_OF_COLONY <= 100 THEN 'LOW'
    WHEN SIZE_OF_COLONY <= 1000 THEN 'MEDIUM'   -- 여기 왔으면 이미 100 초과
    ELSE 'HIGH'
END AS SIZE
```

`CASE`는 위에서부터 처음 맞는 WHEN 하나만 고르니, 제출 코드의 `> 100 and`는 없어도 되고 마지막은 `ELSE`로 충분하다. 경계값 100 · 101 · 1000 · 1001을 넣어 확인했다 — `<`로 쓰면 100이 MEDIUM, 1000이 HIGH로 밀리고, WHEN 순서를 바꾸면(`<= 1000` 먼저) 100 이하도 MEDIUM이 된다.

## 로컬 검증

프로그래머스 재채점이 아니다.

```powershell
javac -encoding UTF-8 -d out *.java
java -Dstdout.encoding=UTF-8 -cp out CodingTest25Test
node verify-sql25.mjs
```

- **내적**: 공식 예제 2개 + 무작위 20,000개(길이 1~1000, 값 −1000~1000)가 `long`으로 계산한 기댓값과 같다.
- **기능개발**: 공식 예제 2개 + 무작위 50,000개(작업 1~100개, 진도 1~99, 속도 1~100)에서 두 풀이가 **하루씩 진도를 더해 보는 모의 실행**과 같다. 모의 실행은 나눗셈 공식을 쓰지 않아 독립적인 기준이 된다.
- **SQL**: [`verify-sql25.mjs`](verify-sql25.mjs)가 SQL 파일을 **그대로 읽어** Node 내장 SQLite(메모리 DB)에 실행한다. 11개 항목 통과. 창고 7곳 · 개체 7개는 검증용으로 만든 행이며, `CASE` · `IFNULL` · `COALESCE` · `IS NULL` · `LIKE` 규칙은 MySQL과 같다.

## 이 회차에서 남길 것

- 두 배열은 같은 인덱스로 돈다. 합의 최댓값을 먼저 계산해 `int`로 되는지 본다.
- 올림 나눗셈은 나누기 **전에** 실수로 바꾸거나 `(a + b - 1) / b`. 묶음은 끊을 때 확정되니 끝에서 한 번 더 넣는다.
- `CASE`를 쓰면 ELSE부터 챙긴다. NULL은 `IS NULL`로만 비교한다.
- 구간 나누기는 작은 쪽부터 쓰고 경계값을 하나씩 넣어 확인한다.
