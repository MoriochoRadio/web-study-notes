# 19회차 코딩테스트 기록 — 2026-09-28

[웹으로 복습하기](index.html) · [38일차 수업](../../index.html#class-day38)

원문 `코딩테스트오답노트19_김태경.docx`의 결과는 **Java 1 PASS · 1 FAIL, SQL 2 PASS**다. FAIL 한 크레인 문제는 제출 코드 칸이 비어 있어 실패 원인을 단정하지 않았다. 나머지 세 문제는 제출 코드를 그대로 파일로 보존했다.

| 문제 | 원문 결과 | 보존한 내용 | 문제 |
|---|---|---|---|
| 나머지가 1이 되는 수 찾기 | PASS | Java 제출 코드 | [87389](https://school.programmers.co.kr/learn/courses/30/lessons/87389) |
| 크레인 인형뽑기 게임 | FAIL | 정답 풀이. 제출본 없음 | [64061](https://school.programmers.co.kr/learn/courses/30/lessons/64061) |
| 어린 동물 찾기 *(원문 제목: 이름이 있는 동물의 아이디)* | PASS | SQL 제출 코드 | [59037](https://school.programmers.co.kr/learn/courses/30/lessons/59037) |
| 없어진 기록 찾기 | PASS | SQL 제출 코드 | [59042](https://school.programmers.co.kr/learn/courses/30/lessons/59042) |

원문의 첫 문제 제목은 '나머지가 1이 되는 수'로 축약되어 있어 공식 문제명을 썼다. 파일로 옮기면서 `class Solution`의 클래스 이름만 파일 이름에 맞췄다.

> **기록 주의 — SQL 1번의 제목.** 오답노트에는 제목이 **"이름이 있는 동물의 아이디"** 로 적혀 있다. 그런데 이 문제는 [18회차](../2026-09-23/)에서 이미 풀었고, 이번 제출 SQL(`ANIMAL_ID, NAME` 조회 · `INTAKE_CONDITION <> 'Aged'` · ID순)은 **"어린 동물 찾기"(59037)의 요구사항과 정확히 일치**한다. 제목 칸이 지난 회차 양식에서 남은 것으로 보고 공식 문제명을 썼다. 원문 제목은 위처럼 함께 적어 둔다.

## Java — 나머지가 1이 되는 수 찾기 (PASS)

[`RemainderOne.java`](RemainderOne.java)

```java
for(int i=1;i<=n;i++){
    if(n%i==1){ answer = i; break; }
}
```

**n을 x로 나눈 나머지가 1이다 ⇔ x가 n−1을 나누어떨어지게 한다(x ≥ 2).** 그래서 답은 "n−1의 약수 중 1을 뺀 가장 작은 것"이다. 사탕 n개를 x명에게 똑같이 나눠 주고 1개가 남으려면, 1개를 빼 둔 n−1개가 딱 나눠떨어져야 하는 것과 같다.

- `i=1`부터 시작해도 괜찮다. `n % 1`은 항상 0이라 조건에 걸리지 않는다.
- 처음 걸린 `i`에서 `break` 하므로 **가장 작은** x가 답이 된다.
- 가장 오래 도는 경우는 n−1이 소수일 때다. n−1번 가까이 돌지만 n ≤ 1,000,000이라 제한 안이다(상한 근처 최악 20개가 모두 합쳐 수십 ms).

## Java — 크레인 인형뽑기 게임 (FAIL · 제출 코드 없음)

[`CraneGame.java`](CraneGame.java)는 원문의 **정답 풀이**다. 제출 코드 칸이 비어 있으므로 아래는 "어디서 틀렸는가"가 아니라 "무엇을 알아야 풀 수 있는가"의 정리다.

크레인은 **열은 고정하고 행을 위에서 아래로** 내려가며 처음 만난 인형 **하나만** 집는다. 바구니는 스택(`Stack`)이다 — 맨 위와 같은 인형이 들어오면 둘 다 사라진다.

| 놓치기 쉬운 곳 | 이유 |
|---|---|
| `int col = m - 1;` | `moves`는 1번 칸부터 센 사람 기준 번호다. 배열은 0부터 |
| 인형을 집은 뒤 `board[row][col] = 0;` | 집은 자리를 비워야 다음에 같은 열을 또 뽑을 때 아래 인형이 나온다 |
| 안쪽 반복의 `break` | 없으면 한 번에 그 열의 인형을 전부 집는다. **공식 예제에서 break만 빼면 4가 아니라 6이 나온다**(비교용 시연) |
| `answer += 2` | 세는 것은 "터진 횟수"가 아니라 "사라진 인형 수"다. 한 번 터지면 2개 |

`basket.peek() == doll`에서 `peek()`은 `Integer`, `doll`은 `int`라 **자동으로 값을 풀어서(언박싱) 비교**한다. 만약 둘 다 `Integer`였다면 `==`는 값이 아니라 주소를 비교한다. 이 문제의 인형 번호는 100 이하라 캐시 범위(−128~127) 안에서 우연히 맞겠지만, 객체끼리는 `equals`로 비교하는 습관이 안전하다.

오답노트의 개념 정리에는 **배열과 `ArrayList`의 문법 차이**도 적혀 있다 — 길이는 `arr.length`(필드) vs `list.size()`(메서드), 원소는 `arr[i]` vs `list.get(i)`.

## SQL — 어린 동물 찾기 (PASS · 원문 제목: 이름이 있는 동물의 아이디)

[`intake-not-aged.sql`](intake-not-aged.sql)

```sql
SELECT ANIMAL_ID, NAME
from ANIMAL_INS
where INTAKE_CONDITION <> 'Aged'
order by ANIMAL_ID;
```

"어린 동물"을 직접 찾는 대신 **"늙은(Aged) 것이 아닌 것"으로 조건을 뒤집었다.** `<>`는 "같지 않다"이며 `!=`와 같다.

`<> 'Aged'`에는 함정이 하나 있다. **`INTAKE_CONDITION`이 NULL인 행도 함께 빠진다.** NULL과의 비교는 참도 거짓도 아닌 "알 수 없음"이라 WHERE를 통과하지 못하기 때문이다. 이 문제는 해당 컬럼이 NOT NULL이라 상관없지만, NULL이 섞일 수 있는 컬럼이면 `OR INTAKE_CONDITION IS NULL`을 따로 적어야 한다.

## SQL — 없어진 기록 찾기 (PASS)

[`missing-intake-records.sql`](missing-intake-records.sql)

```sql
SELECT O.ANIMAL_ID, O.NAME
from ANIMAL_INS I RIGHT JOIN ANIMAL_OUTS O ON I.ANIMAL_ID = O.ANIMAL_ID
where I.ANIMAL_ID is null
ORDER BY O.ANIMAL_ID;
```

"입양 기록은 있는데 입소 기록이 없는 동물" = **OUTS를 기준으로 외부 조인한 뒤, INS 쪽이 비어 있는(NULL) 행**이다. 차집합을 구하는 대표 패턴이다.

- **INNER JOIN으로는 못 찾는다.** 짝이 없는 행은 조인 단계에서 이미 사라진다.
- `ANIMAL_INS I RIGHT JOIN ANIMAL_OUTS O` = `ANIMAL_OUTS O LEFT JOIN ANIMAL_INS I`. 기준 테이블을 왼쪽에 두는 LEFT JOIN이 읽기 쉬워 더 자주 쓴다. `NOT EXISTS`로도 같은 결과가 나온다.
- **SELECT는 O 쪽 컬럼**이어야 한다. 짝이 없는 행의 I 쪽 컬럼은 전부 NULL이다.
- [17회차 "있었는데요 없었습니다"](../2026-09-21/)는 양쪽에 **다 있는** 동물을 INNER JOIN으로 비교했다. 이번에는 **한쪽에만 있는** 동물을 찾는다.

## 로컬 검증

프로그래머스 재채점이 아니다.

```powershell
javac -encoding UTF-8 *.java
java -Dstdout.encoding=UTF-8 CodingTest19Test
node verify-sql19.mjs
```

```
나머지가 1이 되는 수 — 70020개 입력 통과 (3~50,000 전수 + 무작위 20,000 + 최악 20개)
크레인 — 공식 예제 = 4 (기대 4)
  비교: break 를 뺀 형태는 같은 예제에서 6 — 한 번에 여러 개를 집는다
크레인 — 무작위 보드 20,000개 통과 (N 5~30, moves 1~1000)
```

- **나머지가 1이 되는 수**: 기댓값은 에라토스테네스 체로 만든 "n−1의 가장 작은 소인수" 표. 제출 코드와 계산 방식이 다르다.
- **크레인**: 기댓값은 열마다 인형을 덱(`ArrayDeque`)에 담아 두고 꺼내는 별도 시뮬레이션. 인형은 바닥부터 쌓이도록 무작위 보드를 만들었다.
- **SQL**: [`verify-sql19.mjs`](verify-sql19.mjs)가 두 제출 SQL을 **파일에서 그대로 읽어** Node 내장 SQLite(3.53, 메모리 DB)에 실행한다. 10개 항목 통과 — 제출 결과, `<>`가 NULL을 빼는 것, LEFT JOIN·NOT EXISTS가 같은 결과인 것, INNER JOIN으로는 0행인 것, I 쪽 SELECT가 NULL인 것.

SQL을 SQLite로 확인한 이유는 **로컬 MariaDB 접속 정보를 쓰지 않고** 누구나 바로 돌릴 수 있게 하기 위해서다. 여기서 쓴 문법(`<>`, `IS NULL`, `LEFT/RIGHT JOIN`, `NOT EXISTS`, `ORDER BY`)과 NULL 비교 규칙은 MySQL·MariaDB와 같다. 대소문자 비교·문자셋처럼 DB마다 다른 부분은 검사하지 않았다.

## 이 회차에서 남길 것

- 나머지 문제는 **"나머지가 r이다 ⇔ (n−r)이 나누어떨어진다"** 로 바꾸면 약수 문제가 된다.
- 시뮬레이션은 **바깥 반복이 명령(moves), 안쪽이 탐색**이다. 탐색에서 하나를 찾으면 `break`.
- `<>`와 `=`는 NULL 앞에서 둘 다 "알 수 없음"이다. **없는 것을 찾을 때는 `IS NULL`** — 컬럼 비교든 외부 조인이든 마찬가지다.
