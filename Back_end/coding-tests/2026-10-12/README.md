# 24회차 코딩테스트 기록 — 2026-10-12

[웹으로 복습하기](index.html) · [46일차 수업](../../index.html#class-day46)

원문 `코딩테스트오답노트24_김태경.docx`의 결과는 **Java 2 PASS, SQL 1 PASS · 1 FAIL**이다. FAIL 한 문제는 제출 코드 칸이 비어 있어 실패 원인을 단정하지 않았다. PASS 세 문제 중 음양 더하기와 생산공장 목록은 오답노트의 정답 풀이·개념 정리 칸이 비어 있어 짚어 둘 점을 새로 정리했고, 올바른 괄호는 원문에 함께 적힌 정석 풀이를 따로 옮겼다.

| 문제 | 원문 결과 | 보존한 내용 | 문제 |
|---|---|---|---|
| 음양 더하기 | PASS | Java 제출 코드 | [76501](https://school.programmers.co.kr/learn/courses/30/lessons/76501) |
| 올바른 괄호 | PASS | Java 제출 코드 + 원문의 정석 풀이 | [12909](https://school.programmers.co.kr/learn/courses/30/lessons/12909) |
| 강원도에 위치한 생산공장 목록 출력하기 | PASS | SQL 제출 코드 | [131112](https://school.programmers.co.kr/learn/courses/30/lessons/131112) |
| 대여 횟수가 많은 자동차들의 월별 대여 횟수 구하기 | FAIL | 정답 풀이. 제출본 없음 | [151139](https://school.programmers.co.kr/learn/courses/30/lessons/151139) |

파일로 옮기면서 `class Solution`의 클래스 이름만 파일 이름에 맞췄다. 원문 제목 '생산공장 목록'은 줄여 적힌 것이라 공식 문제명을 썼다. 원문 개념 정리의 수식 개체("O(1)", 화살표 "→")는 문서 변환 과정에서 빠져 있어 다시 적었다.

## Java — 음양 더하기 (PASS)

[`SignedSum.java`](SignedSum.java)

```java
for(int i=0;i<absolutes.length;i++){
    if(signs[i]==true){
        answer = answer + absolutes[i];
    } else if (signs[i] == false){
        answer = answer - absolutes[i];
    }
}
```

- `signs[i] == true`는 `signs[i]`로, `else if (signs[i] == false)`는 `else`로 충분하다. 한 줄로는 `answer += signs[i] ? absolutes[i] : -absolutes[i];`.
- 두 배열을 같은 위치끼리 봐야 해서 향상된 for문(`for (int a : absolutes)`)은 쓸 수 없다 — 인덱스가 없다.
- `if (signs[i] = true)`는 대입이라 늘 참인데도 컴파일된다. `==`를 아예 쓰지 않으면 이 실수도 막힌다.

## Java — 올바른 괄호 (PASS)

제출 코드 [`ValidParenthesesSubmitted.java`](ValidParenthesesSubmitted.java)도 통과했고, 원문에 함께 적힌 정석 풀이는 [`ValidParentheses.java`](ValidParentheses.java)로 옮겼다.

```java
for (char c : s.toCharArray()) {
    if (c == '(') {
        stack.push(c);
    } else {
        if (stack.isEmpty()) return false;   // 꺼낼 '(' 가 없으면 바로 false
        stack.pop();
    }
}
return stack.isEmpty();
```

길이 1~16의 모든 문자열 131,070개에서 두 코드의 답은 같다(올바른 것 2,055개). 차이는 세 가지다.

| 제출 코드 | 정석 풀이 |
|---|---|
| 첫 글자가 `)`여도 끝까지 돈다 (길이 100,000에서 평균 5.45ms) | 그 자리에서 `return false` (0.009ms) |
| `)`까지 스택에 넣는다 | `(`만 쌓는다 |
| 디버깅용 `System.out.println(stack)`이 남아 있다 (`(` 100,000개면 300,002글자) | 출력 없음 |

괄호가 한 종류뿐이면 스택 없이 `int` 카운터 하나로도 된다(`(`에서 +1, `)`에서 −1, 도중에 음수면 false, 끝에 0이면 true — O(1) 공간). 제출 코드의 `stack.peek() == s.charAt(i)`는 `Character`와 `char`의 비교라 값으로 비교된다(23회차의 `Integer`끼리 `!=`와 다른 경우).

## SQL — 강원도에 위치한 생산공장 목록 출력하기 (PASS)

[`food-factory-submitted.sql`](food-factory-submitted.sql)

```sql
SELECT FACTORY_ID, FACTORY_NAME, ADDRESS
from FOOD_FACTORY
where ADDRESS like '%강원도%'
order by FACTORY_ID asc;
```

- 주소는 시·도부터 적으니 "강원도에 위치한"은 `LIKE '강원도%'`(앞부분 일치)가 뜻에 더 정확하다. 앞에 `%`가 붙으면 인덱스도 쓸 수 없다. 이번 제출(`'%강원도%'`)은 채점을 통과했다. 채점 데이터에 다른 도의 '…강원도로' 같은 주소가 있는지는 알 수 없다.
- `LIKE '강원도'`(`%` 없음)는 0행 — 주소 전체가 정확히 '강원도'인지 비교하는 것과 같다.
- `ORDER BY`의 기본은 오름차순(`ASC` 생략 가능). `DESC`로 쓰면 순서가 뒤집혀 오답.

## SQL — 대여 횟수가 많은 자동차들의 월별 대여 횟수 구하기 (FAIL · 제출 코드 없음)

[`car-rental-monthly-answer.sql`](car-rental-monthly-answer.sql)은 원문의 **정답 풀이**다.

```sql
SELECT MONTH(START_DATE) AS MONTH, CAR_ID, COUNT(*) AS RECORDS
FROM CAR_RENTAL_COMPANY_RENTAL_HISTORY
WHERE START_DATE BETWEEN '2022-08-01' AND '2022-10-31'
  AND CAR_ID IN (
      SELECT CAR_ID
      FROM CAR_RENTAL_COMPANY_RENTAL_HISTORY
      WHERE START_DATE BETWEEN '2022-08-01' AND '2022-10-31'
      GROUP BY CAR_ID
      HAVING COUNT(*) >= 5
  )
GROUP BY MONTH(START_DATE), CAR_ID
ORDER BY MONTH ASC, CAR_ID DESC;
```

고르는 기준(석 달 합계 5번 이상)과 세는 단위(월 · 차별)가 달라서 `GROUP BY` 한 번으로는 안 된다. 서브쿼리로 대상 차를 고르고, 바깥 쿼리에서 **같은 기간을 다시 걸어** 월별로 센다. 실행해 본 틀린 방법:

| 방법 | 결과 |
|---|---|
| 바깥 쿼리의 기간 조건을 뺀다 | 고른 차의 7월 · 11월 이력까지 세어진다 |
| 서브쿼리의 기간 조건을 뺀다 | 기간 안 4번 + 7월 2번인 차가 대상에 끼어든다 |
| 서브쿼리 없이 월별로 묶고 `HAVING COUNT(*) >= 5` | "한 달에 5번"이 되어 한 대만 남는다 |

대여가 0번인 달은 `GROUP BY`가 줄을 만들지 않으니 따로 처리하지 않는다. `BETWEEN`은 양 끝(8/1 · 10/31)을 포함한다. 원문 "가독성 팁"은 "코드 6번 줄의 `between'2022-08-01'`"을 가리키지만 원문 정답 풀이에는 붙여 쓴 줄이 없어(모두 띄어 씀), 팁의 내용("키워드와 값 사이는 띄운다")만 옮겼다.

## 로컬 검증

프로그래머스 재채점이 아니다.

```powershell
javac -encoding UTF-8 *.java
java -Dstdout.encoding=UTF-8 CodingTest24Test
node verify-sql24.mjs
```

- **음양 더하기**: 공식 예제 2개 + 무작위 20,000개(길이 1~1000, 절댓값 1~1000) 통과. 합의 범위는 −1,000,000 ~ 1,000,000이라 `int`로 충분하다.
- **올바른 괄호**: 공식 예제 4개 + 길이 1~16의 모든 문자열 131,070개에서 정석 풀이 · 제출 코드 · 정수 카운터의 답이 같다. 길이 100,000 시간(이 PC, 20번 평균): 균형 맞음 정석 0.15ms · 제출 3.46ms · 카운터 0.05ms, 첫 글자 `)` 정석 0.009ms · 제출 5.45ms.
- **SQL**: [`verify-sql24.mjs`](verify-sql24.mjs)가 SQL 파일을 **그대로 읽어** Node 내장 SQLite(3.53, 메모리 DB)에 실행한다. 9개 항목 통과. 날짜는 `'YYYY-MM-DD'` 글자로 넣어 `BETWEEN`이 MySQL의 DATE 비교와 같은 결과를 내고, SQLite에 없는 `MONTH()`는 같은 일을 하는 함수를 등록했다.

## 이 회차에서 남길 것

- `boolean`은 그 자체가 조건 — `== true`, `else if (… == false)`는 군더더기.
- 짝 맞추기는 스택. 실패가 확정되면 그 자리에서 `return`. 제출 전에 디버깅 출력은 지운다.
- "~에 위치한"은 앞부분 일치(`'강원도%'`). 앞에 `%`가 붙으면 인덱스를 못 쓴다.
- 고르는 기준과 집계 단위가 다르면 서브쿼리로 나누고, 기간 조건은 양쪽에 모두 건다.
