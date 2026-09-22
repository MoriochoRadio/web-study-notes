# 17회차 코딩테스트 기록 — 2026-09-21

프로그래머스로 치른 17회차 오답노트다. 이번 회차는 **JAVA 2문제 · SQL 2문제**로 평소보다 한 세트가 많았고, 결과는 **3 PASS · 1 FAIL**이었다. 제출 코드는 손대지 않고 그대로 두고, FAIL 한 문제만 원인별로 나눠 고쳤다.

아래 "로컬 검증"은 이 저장소에서 직접 돌려 본 결과이며, 프로그래머스 채점 화면을 다시 재현한 것이 아니다.

| 문제 | 유형 | 결과 | 링크 |
|---|---|---|---|
| 자릿수 더하기 | JAVA | ✅ PASS | [12931](https://school.programmers.co.kr/learn/courses/30/lessons/12931) |
| 두 개 뽑아서 더하기 | JAVA | ❌ FAIL | [68644](https://school.programmers.co.kr/learn/courses/30/lessons/68644) |
| 이름이 없는 동물의 아이디 | SQL | ✅ PASS | [59039](https://school.programmers.co.kr/learn/courses/30/lessons/59039) |
| 있었는데요 없었습니다 | SQL | ✅ PASS | [59043](https://school.programmers.co.kr/learn/courses/30/lessons/59043) |

## JAVA — 자릿수 더하기 (PASS)

[`DigitSum.java`](DigitSum.java)가 제출 코드 그대로다.

```java
while (n > 0) {
    answer += n % 10;   // 10으로 나눈 나머지 = 지금의 1의 자리
    n /= 10;            // 10으로 나누면 그 자리를 버린다
}
```

`% 10`으로 맨 뒷자리를 꺼내고 `/= 10`으로 그 자리를 버리는 것을 0이 될 때까지 반복한다. 정수 나눗셈이 소수점을 버리는 성질을 그대로 쓴 풀이라 따로 문자열로 바꿀 필요가 없다.

`n`은 문제에서 1 이상이라고 못박혀 있어 `while (n > 0)`으로 충분하다. 다만 **매개변수 `n`을 직접 깎아 쓰고 있다는 점**은 의식해 두는 게 좋다. 이 문제에서는 뒤에서 `n`을 다시 쓰지 않으니 문제가 없지만, 원본 값이 나중에 필요한 코드였다면 따로 담아 두어야 한다.

## JAVA — 두 개 뽑아서 더하기 (FAIL)

[`TwoSumPickSubmitted.java`](TwoSumPickSubmitted.java)에 제출 코드를 고치지 않고 남겼다. 접근 자체(모든 쌍의 합을 구해 중복을 빼고 정렬)는 맞았고, **고정 크기 배열을 중복 제거 장치로 쓰려다** 세 곳에서 어긋났다.

### ① 배열 크기가 모자랐다 — 런타임 에러

원소가 0 이상 100 이하이므로 두 수의 합은 0~200, 즉 **최대 201가지**다. `new int[100]`은 이걸 담지 못한다.

```
0~99 (길이 100) 고유한 합 197개
제출본 → ArrayIndexOutOfBoundsException: Index 100 out of bounds for length 100
```

### ② 중복 검사가 빈칸까지 훑었다 — 합이 0이면 사라진다

`int` 배열은 생성과 동시에 전부 0으로 채워진다. 제출한 `same`은 `answer.length` 전체를 돌기 때문에, **합이 0일 때 아직 쓰지 않은 뒤쪽 칸의 0과 마주쳐** "이미 있는 값"으로 착각하고 건너뛴다.

```
[0,0,1] 기대 [0, 1] / 제출본 [1]
```

→ 실제로 채운 개수인 `count`까지만 검사하도록 범위를 좁히면 해결된다.

### ③ 0을 빈칸으로 오해하고 지웠다 — 정렬 순서까지 얽힌다

배열 전체를 `Arrays.sort`하면 남아 있던 빈칸 0들이 **전부 앞으로 몰린다**. 그 뒤 "0이 아닌 값만 골라 담기"로 빈칸을 걸러 내려 했는데, 이 방식은 **정답인 0까지 같이 버린다**. `Arrays.copyOf(temp, count)`로 **유효 구간만 잘라낸 뒤 정렬**하면 빈칸이 애초에 섞이지 않는다.

[`TwoSumPickFixed.java`](TwoSumPickFixed.java)가 세 가지를 반영한 정정본이고, [`TwoSumPickTreeSet.java`](TwoSumPickTreeSet.java)는 같은 요구사항을 컬렉션으로 표현한 경우다 — **중복 제거 + 오름차순 정렬**은 `TreeSet`의 기본 동작이라 위 세 함정이 처음부터 생기지 않는다.

```java
TreeSet<Integer> sums = new TreeSet<>();
// ... 모든 쌍의 합을 add ...
return sums.stream().mapToInt(Integer::intValue).toArray();
```

배열 풀이를 알아 두는 것은 **"자료구조가 대신해 주던 일이 무엇이었나"**를 알기 위해서다. 크기 산정·중복 검사·유효 길이 관리가 전부 직접 해야 할 일이었다는 것이 위 세 실수로 드러난다.

### 로컬 검증

[`CodingTest17Test.java`](CodingTest17Test.java)는 기댓값을 `TreeSet`도 배열 누적도 아닌 **`boolean[201]` 존재표**로 따로 만든다. 검증 대상과 검증 방식이 같은 원리를 쓰지 않게 하려는 것이다.

```powershell
javac -encoding UTF-8 *.java
java -Dstdout.encoding=UTF-8 CodingTest17Test
```

```
자릿수 더하기 — 1~1,000,000 전수 + 상한 부근 통과
  [0,0,1] 기대 [0, 1] / 제출본 [1]
  0~99 (길이 100) 고유한 합 197개
  제출본 → ArrayIndexOutOfBoundsException: Index 100 out of bounds for length 100
두 개 뽑아서 더하기 — 제출본의 실패 두 가지를 재현함
두 개 뽑아서 더하기 — 정정본·TreeSet본 모두 통과
모두 통과 — 로컬 검증이며 프로그래머스 채점 기록이 아니다.
```

확인 범위는 ▸ 자릿수 더하기 1~1,000,000 전수 + 상한 부근 ▸ 공식 예제 2건 ▸ 원소 0~3·길이 2~5 조합 전수(1,360건) ▸ 제한 범위 안 무작위 5,000건 ▸ 전부 0 / 전부 100 / 길이 상한 경계다.

## SQL — 이름이 없는 동물의 아이디 (PASS)

[`nameless-animal-ids.sql`](nameless-animal-ids.sql)

```sql
SELECT ANIMAL_ID FROM ANIMAL_INS WHERE NAME IS NULL ORDER BY ANIMAL_ID ASC;
```

`NULL`은 "값이 없음"이라 **어떤 값과도 같다고도 다르다고도 판정되지 않는다.** 그래서 `NAME = NULL`은 에러도 아니고 0건이다 — 조용히 빈 결과가 나오는 쪽이라 더 위험하다. 반드시 `IS NULL` / `IS NOT NULL`을 쓴다.

**빈 문자열 `''`은 NULL이 아니다.** 이름 칸을 비워 저장한 데이터와 아예 이름이 없는 데이터를 같은 것으로 묶고 싶다면 조건을 따로 써 줘야 한다.

## SQL — 있었는데요 없었습니다 (PASS)

[`wrong-adoption-order.sql`](wrong-adoption-order.sql)

```sql
SELECT I.ANIMAL_ID, I.NAME
FROM ANIMAL_INS I JOIN ANIMAL_OUTS O ON I.ANIMAL_ID = O.ANIMAL_ID
WHERE O.DATETIME < I.DATETIME
ORDER BY I.DATETIME ASC;
```

- **INNER JOIN** — 보호 기록과 입양 기록이 **둘 다 있는** 개체만 비교 대상이다. 한쪽에만 있는 행은 애초에 비교할 짝이 없으므로 `JOIN`(= INNER JOIN)이 맞다. `LEFT JOIN`을 쓰면 짝 없는 행이 `NULL`로 남고, 그 `NULL`은 `WHERE` 비교에서 어차피 탈락한다 — 결과는 같아도 **불필요한 행을 만들었다가 버리는** 셈이다.
- **날짜 비교** — `DATETIME`은 과거가 작은 값이다. "입양일이 보호 시작일보다 앞선다"는 곧 `O.DATETIME < I.DATETIME`이다.
- **정렬** — "보호 시작일이 빠른 순"이므로 `I.DATETIME` 오름차순이다. `ASC`는 기본값이라 생략해도 되지만, 의도를 드러내려고 적었다.

### SQL 검증 — MariaDB 12.3에서 실행함

[`verify-shelter-queries.sql`](verify-shelter-queries.sql)은 **세션 임시 테이블**로 `ANIMAL_INS`·`ANIMAL_OUTS` 픽스처를 만들고, **제출한 두 쿼리를 그대로 실행해 결과를 보여 준 뒤**, 왜 그렇게 되는지를 항목별로 확인한다. `TEMPORARY` 테이블이라 같은 이름의 실제 테이블이 있어도 가려지기만 하고 바뀌지 않으며, 세션이 끝나면 사라진다.

```bash
mariadb -u study -D sqldb --table < verify-shelter-queries.sql
```

제출한 쿼리를 그대로 돌린 결과다.

```
--- 이름이 없는 동물의 아이디 (기대: A100, A300) ---
+-----------+
| ANIMAL_ID |
+-----------+
| A100      |
| A300      |
+-----------+

--- 있었는데요 없었습니다 (기대: A200 체리, A500 보리) ---
+-----------+--------+
| ANIMAL_ID | NAME   |
+-----------+--------+
| A200      | 체리   |
| A500      | 보리   |
+-----------+--------+
```

이어지는 8개 항목은 전부 `passed = 1`이다.

| 확인 항목 | 결과 |
|---|:--:|
| ① `IS NULL`이 이름 없는 2건만 고른다 | ✅ |
| ② `= NULL`은 0건이다 (에러가 아니라 빈 결과) | ✅ |
| ③ 빈 문자열 `''`은 `IS NULL`에 걸리지 않는다 | ✅ |
| ④ INNER JOIN이 짝 없는 A100·A300을 버린다 | ✅ |
| ⑤ `LEFT JOIN`으로 바꿔도 결과가 같다 | ✅ |
| ⑥ 뒤집힌 기록 `A200,A500`만 골라낸다 | ✅ |
| ⑦ `I.DATETIME` 오름차순이면 A200이 먼저다 | ✅ |
| ⑧ `O.DATETIME`으로 정렬하면 A500이 먼저다 | ✅ |

> **⑧은 처음에 실패했다.** 픽스처의 입양일 순서가 보호 시작일 순서와 우연히 같아서, "별칭을 빼먹으면 순서가 달라진다"는 주장을 **보여 주지 못하는 검사**였다. 값을 잡아 두 정렬 결과가 실제로 갈라지게 고쳤다. **검사가 통과했다는 것과 검사가 의미 있다는 것은 다르다**는 걸 여기서 한 번 더 확인했다.

## 이 회차에서 남길 것

- 고정 크기 배열을 중복 제거에 쓰면 **크기·빈칸·유효 길이** 세 가지를 전부 직접 관리해야 한다. 하나라도 빠지면 조용히 틀린다.
- `int[]`의 기본값 0은 **"아직 안 씀"과 "값이 0"을 구분하지 못한다.** 그래서 `count`를 따로 들고 다녀야 했다.
- SQL의 `NULL`도 같은 종류의 함정이다 — **"값이 없음"을 값처럼 비교하면** 에러 없이 0건이 나온다.
- 둘 다 **"비어 있음을 무엇으로 표현할 것인가"** 하나의 주제다. 이번 회차에서 자바와 SQL이 같은 질문을 서로 다른 얼굴로 냈다.
- 정리하면서 하나 더 배웠다 — **단언이 처음부터 참이면 그 검사는 아무것도 지켜 주지 않는다.** SQL 검증 ⑧번이 그랬다. 통과하는 검사보다 **한 번은 일부러 틀리게 만들어 빨간불이 켜지는지** 확인해 보는 편이 안전하다.

[웹 노트](index.html) · [전체 백엔드 노트](../../index.html#ct-31)
