# 28회차 코딩테스트 기록 — 2026-10-20

[웹으로 복습하기](index.html) · [10/20 수업(AI Agent 과정)](../../../AI_Agent/index.html#ai-day02)

원문 `코딩테스트오답노트28_김태경.docx`의 결과는 **2 PASS · 2 FAIL**이다(프로그래밍 PASS · SQL PASS · JAVA FAIL · SQL FAIL). 제출 코드가 남은 것은 가운데 글자 가져오기뿐이고, 나머지 세 문제는 제출 코드 칸이 비어 있어 원문의 **정답 풀이**를 옮겼다(SQL 1은 결과가 PASS인데도 칸이 비어 있다). FAIL 원인은 단정하지 않았다. 기록은 백엔드 코딩테스트 탭 ct-74~77에 이어 둔다.

| 문제 | 원문 결과 | 보존한 내용 | 문제 |
|---|---|---|---|
| 가운데 글자 가져오기 | PASS | 제출 코드 + 원문 정답 풀이(`substring`) | [12903](https://school.programmers.co.kr/learn/courses/30/lessons/12903) |
| 조건에 맞는 회원수 구하기 | PASS | 원문 정답 풀이(SQL). 제출본 없음 | [131535](https://school.programmers.co.kr/learn/courses/30/lessons/131535) |
| 카펫 | FAIL | 원문 정답 풀이(Java 완전 탐색). 제출본 없음 | [42842](https://school.programmers.co.kr/learn/courses/30/lessons/42842) |
| 대장균들의 자식의 수 구하기 | FAIL | 원문 정답 풀이(SQL 셀프 조인). 제출본 없음 | [299305](https://school.programmers.co.kr/learn/courses/30/lessons/299305) |

파일로 옮기면서 `class Solution`의 클래스 이름만 파일 이름에 맞췄다. 문제 번호와 조건은 프로그래머스 문제 페이지에서 확인했다.

## 프로그래밍 — 가운데 글자 가져오기 (PASS)

[`MiddleChar.java`](MiddleChar.java)(제출) · [`MiddleCharAnswer.java`](MiddleCharAnswer.java)(정답 풀이)

```java
int cen = s.length() / 2;
return s.length() % 2 == 0 ? s.substring(cen - 1, cen + 1) : s.substring(cen, cen + 1);
```

- 제출 코드도 정답이다. 제출 코드의 `st + s.charAt(…) + s.charAt(…)`에서 빈 문자열 `st`가 빠지면 `char + char`가 **정수**가 된다 — `"qwer"`에서 `'w' + 'e'` = 220.
- 제출 코드의 `cen = s.length() % 2` 뒤 `cen % 2 == 0`은 `cen == 0`과 같다(나머지를 두 번).

## SQL — 조건에 맞는 회원수 구하기 (PASS · 제출 코드 없음)

[`users-2021-20s-answer.sql`](users-2021-20s-answer.sql)

```sql
SELECT COUNT(*) AS USERS
FROM USER_INFO
WHERE YEAR(JOINED) = 2021
  AND AGE BETWEEN 20 AND 29;
```

- BETWEEN은 양 끝 포함. 나이가 NULL인 회원은 비교가 참이 아니라 저절로 빠진다.
- `COUNT(*)`는 행 수, `COUNT(AGE)`는 나이가 적힌 행 수(검증 데이터: 2021년 가입 9명 중 8명).

## JAVA — 카펫 (FAIL · 제출 코드 없음)

[`Carpet.java`](Carpet.java)

```java
int total = brown + yellow;
for (int h = 3; h <= total; h++) {
    if (total % h == 0) {
        int w = total / h;
        if ((w - 2) * (h - 2) == yellow) return new int[] { w, h };
    }
}
```

- 가로 × 세로 = 전체, (가로 − 2) × (세로 − 2) = 노랑. 세로를 3부터 **올라가며** 찾으므로 처음 맞는 것이 짧은 변이라 "가로 ≥ 세로"가 저절로 지켜진다. 큰 쪽부터 내려가면 24/24 → `[6, 8]`(순서 반대).

## SQL — 대장균들의 자식의 수 구하기 (FAIL · 제출 코드 없음)

[`ecoli-child-count-answer.sql`](ecoli-child-count-answer.sql)

```sql
SELECT E1.ID, COUNT(E2.ID) AS CHILD_COUNT
FROM ECOLI_DATA E1
LEFT JOIN ECOLI_DATA E2 ON E1.ID = E2.PARENT_ID
GROUP BY E1.ID
ORDER BY E1.ID ASC;
```

| 실수 | 결과(문제 예시 6행) |
|---|---|
| `INNER JOIN` | 자식 있는 1 · 2 · 4만 남음 |
| `COUNT(*)` | 자식 없는 3 · 5 · 6이 1로 셈 |
| `ON E1.PARENT_ID = E2.ID` | 부모가 있는지(0/1)를 셈 |

## 로컬 검증

프로그래머스 재채점이 아니다.

```powershell
javac -encoding UTF-8 -d out *.java
java -Dstdout.encoding=UTF-8 -cp out CodingTest28Test
node verify-sql28.mjs
```

- **가운데 글자 가져오기**: 공식 예제 2개 + 무작위 10,000개(길이 1~100, 영문 · 한글)에서 제출 코드 · 정답 풀이 모두 별도 식의 기댓값과 같다.
- **카펫**: 공식 예제 3개 + 조건 안의 모든 카펫 1,560,001개(가로 ≥ 세로 ≥ 3, brown ≤ 5,000, yellow ≤ 2,000,000)를 brown · yellow로 바꿔 넣어 원래 크기가 나오는지 확인(이 PC에서 855ms). 세로를 큰 쪽부터 찾는 틀린 방법도 출력.
- **SQL**: [`verify-sql28.mjs`](verify-sql28.mjs)가 SQL 파일을 **그대로 읽어** Node 내장 SQLite(3.53)에 실행한다. 13개 항목 통과. SQLite에 없는 MySQL `YEAR()`는 같은 이름으로 등록했다. 회원 표는 문제 예시 7행 + 경계 확인용 5행, 대장균 표는 문제 예시 6행.

## 이 회차에서 남길 것

- 가운데 · 절반 · 짝홀은 `/ 2`와 `% 2`. 문자 두 개를 이을 땐 `char + char`가 숫자가 되는 함정 — `substring`으로.
- 조건 두 개는 `AND`, 범위는 `BETWEEN`(양 끝 포함), 연도는 `YEAR()`. NULL은 비교에서 저절로 빠진다.
- 크기 맞히기는 식 두 개(넓이 · 안쪽) + 한 변을 작은 쪽부터 돌리는 완전 탐색.
- "항목마다 딸린 것의 개수(0 포함)"는 `LEFT JOIN` + `GROUP BY` + `COUNT(오른쪽 열)`.
