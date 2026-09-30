# 20회차 코딩테스트 기록 — 2026-09-30

[웹으로 복습하기](index.html) · [40일차 수업](../../index.html#class-day40)

원문 `코딩테스트오답노트20_김태경.docx`의 결과는 **Java 1 PASS · 1 FAIL, SQL 1 PASS · 1 FAIL**이다. Java FAIL(숫자 문자열과 영단어)은 제출 코드 칸이 비어 있어 실패 원인을 단정하지 않았다. SQL FAIL은 제출 코드와 정답 풀이가 모두 남아 있어 차이를 직접 비교했다.

| 문제 | 원문 결과 | 보존한 내용 | 문제 |
|---|---|---|---|
| x만큼 간격이 있는 n개의 숫자 | PASS | Java 제출 코드 | [12954](https://school.programmers.co.kr/learn/courses/30/lessons/12954) |
| 숫자 문자열과 영단어 | FAIL | 정답 풀이. 제출본 없음 | [81301](https://school.programmers.co.kr/learn/courses/30/lessons/81301) |
| 동물의 아이디와 이름 | PASS | SQL 제출 코드 | [59403](https://school.programmers.co.kr/learn/courses/30/lessons/59403) |
| 대여 기록이 존재하는 자동차 리스트 구하기 | FAIL | SQL 제출 코드 + 정답 풀이 | [157341](https://school.programmers.co.kr/learn/courses/30/lessons/157341) |

원문의 마지막 문제 제목은 '대여 기록 존재하는 자동차'로 축약되어 있어 공식 문제명을 썼다. 파일로 옮기면서 `class Solution`의 클래스 이름만 파일 이름에 맞췄다.

## Java — x만큼 간격이 있는 n개의 숫자 (PASS)

[`XInterval.java`](XInterval.java)

```java
long[] answer = new long[n];
answer[0]=x;
for(int i=1;i<answer.length;i++){
    answer[i]= answer[i-1]+x;
}
```

앞의 값에 x를 계속 더해 간다. 이 문제의 핵심은 **반환 타입이 `long[]`인 이유**다. x는 −1천만~1천만, n은 최대 1,000이라 마지막 값은 최대 **100억**이다. `int`는 약 21억까지라 담을 수 없다.

제출 코드는 `answer[i-1]`이 이미 `long`이라 `long + int` 계산이 되어 안전하다. 같은 값을 곱셈으로 구할 때는 순서를 조심해야 한다.

| 식 | x = 10,000,000, n = 1000 | 이유 |
|---|---:|---|
| `x * n` (int끼리) | 1,410,065,408 | 곱하는 순간 21억을 넘어 값이 넘친다 |
| `(long)(x * n)` | 1,410,065,408 | 이미 넘친 값을 long으로 바꿔도 늦다 |
| `(long) x * n` | 10,000,000,000 | 곱하기 **전에** long으로 바꿔야 한다 |
| 제출 코드의 마지막 값 | 10,000,000,000 | 누적 변수가 long |

## Java — 숫자 문자열과 영단어 (FAIL · 제출 코드 없음)

[`NumberWords.java`](NumberWords.java)는 원문의 **정답 풀이**다.

```java
String[] words = {"zero","one","two","three","four","five","six","seven","eight","nine"};
for (int i = 0; i < words.length; i++) {
    s = s.replace(words[i], Integer.toString(i));
}
return Integer.parseInt(s);
```

배열의 **인덱스가 곧 그 단어의 숫자**라는 점을 이용한다. `words[7]`이 `"seven"`이므로 `"seven"`을 `"7"`로 바꾸면 된다.

오답노트에 정리한 개념 세 가지:

- **`String`은 불변이다.** `s.replace(...)`만 쓰면 원본은 그대로다. 반드시 `s = s.replace(...)`로 다시 담는다. (`"banana".replace("a","o")`를 다시 담지 않으면 그대로 `banana`)
- **`replace`와 `replaceAll`** — `replace`는 글자 그대로 찾아 **모두** 바꾸고, `replaceAll`은 정규식으로 찾는다. 단순 치환이면 `replace`.
- **`Integer.parseInt`** — 숫자만 남은 문자열을 `int`로 바꾼다. 영문자가 남아 있으면 `NumberFormatException`. 이 문제의 반환값은 최대 20억이라 `int`(최대 약 21.47억)에 들어간다. 더 클 수 있으면 `Long.parseLong`.

## SQL — 동물의 아이디와 이름 (PASS)

[`animal-id-name.sql`](animal-id-name.sql)

```sql
SELECT ANIMAL_ID, NAME
from ANIMAL_INS
order by ANIMAL_ID;
```

`ORDER BY` 뒤에 `ASC`를 쓰지 않으면 오름차순이다.

## SQL — 대여 기록이 존재하는 자동차 리스트 구하기 (FAIL)

[`rented-sedans-submitted.sql`](rented-sedans-submitted.sql) · [`rented-sedans-answer.sql`](rented-sedans-answer.sql)

```sql
SELECT DISTINCT H.CAR_ID      -- 제출 코드에는 DISTINCT 가 없었다
FROM CAR_RENTAL_COMPANY_CAR C JOIN CAR_RENTAL_COMPANY_RENTAL_HISTORY H ON
C.CAR_ID = H.CAR_ID
WHERE C.CAR_TYPE = '세단' AND MONTH(H.START_DATE) = 10
ORDER BY H.CAR_ID DESC;
```

제출 코드와 정답 풀이의 차이는 **`DISTINCT` 한 단어**다. 자동차 한 대는 여러 번 대여될 수 있다(1:N). 그래서 조인하면 **대여 기록 수만큼 같은 차가 여러 줄**이 된다. 문제는 "자동차 ID 리스트는 중복이 없어야 한다"고 요구한다.

같은 차가 10월에 세 번 빌려진 데이터로 돌려 보면:

```
제출 코드 (DISTINCT 없음) → 3, 3, 3, 1
정답 풀이 (DISTINCT)      → 3, 1
```

- **DISTINCT vs GROUP BY** — 목록에서 중복만 없애면 `DISTINCT`, 묶은 뒤 개수·합계 같은 집계가 필요하면 `GROUP BY`. `GROUP BY H.CAR_ID`로도 같은 목록이 나오지만 의도가 덜 드러난다.
- **`MONTH(START_DATE) = 10`** — 시작일 기준이다. 9월에 시작해 10월에 끝난 대여는 빠진다. 이 문제의 데이터는 2022년뿐이라 월만 봐도 되지만, 여러 해가 섞이면 `YEAR`도 함께 보거나 `DATE_FORMAT(START_DATE, '%Y-%m') = '2022-10'`처럼 연·월을 같이 비교한다.

## 로컬 검증

프로그래머스 재채점이 아니다.

```powershell
javac -encoding UTF-8 *.java
java -Dstdout.encoding=UTF-8 CodingTest20Test
node verify-sql20.mjs
```

- **x만큼 간격**: 경계 x 6개(±1천만·±1·0·2) × n 1~1000 + 무작위 20,000 = 26,000개. 기댓값은 `(long) x * (i+1)` 곱셈으로 따로 계산.
- **숫자 문자열과 영단어**: 공식 예제 4개 + 문제가 입력을 만드는 방식대로(자릿수마다 숫자나 영단어를 무작위로 골라) 만든 50,000개 + 경계 4개(전부 영단어인 20억 등) 통과.
- **SQL**: [`verify-sql20.mjs`](verify-sql20.mjs)가 세 SQL 파일을 **그대로 읽어** Node 내장 SQLite(3.53, 메모리 DB)에 실행한다. 7개 항목 통과. SQLite에는 `MONTH()`가 없어 날짜 문자열의 월을 돌려주는 같은 이름의 함수를 등록했다 — 제출 SQL을 한 글자도 바꾸지 않기 위해서다. 로컬 MariaDB 접속 정보는 쓰지 않았다.

## 이 회차에서 남길 것

- 값의 범위부터 본다. **"최대값 × 개수"가 21억을 넘으면 `long`**, 곱셈은 **곱하기 전에** 형변환.
- `String` 메서드는 새 문자열을 **돌려줄 뿐**이다. 결과를 다시 담는다.
- 1:N 조인 뒤 "1" 쪽 컬럼만 뽑으면 중복이 생긴다. 문제에 "중복 없이"가 있으면 `DISTINCT`.
