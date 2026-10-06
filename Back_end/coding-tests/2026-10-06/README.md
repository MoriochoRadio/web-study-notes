# 22회차 코딩테스트 기록 — 2026-10-06

[웹으로 복습하기](index.html) · [43일차 수업](../../index.html#class-day43)

원문 `코딩테스트오답노트22_김태경.docx`의 결과는 **Java 1 PASS · 1 FAIL, SQL 1 PASS · 1 FAIL**이다. FAIL 두 문제(체육복 · 상위 n개 레코드)는 제출 코드 칸이 비어 있어 실패 원인을 단정하지 않았다. PASS 두 문제는 오답노트의 정답 풀이·개념 정리 칸이 비어 있거나 짧아, 짚어 둘 점을 새로 정리했다.

| 문제 | 원문 결과 | 보존한 내용 | 문제 |
|---|---|---|---|
| 서울에서 김서방 찾기 | PASS | Java 제출 코드 | [12919](https://school.programmers.co.kr/learn/courses/30/lessons/12919) |
| 체육복 | FAIL | 정답 풀이. 제출본 없음 | [42862](https://school.programmers.co.kr/learn/courses/30/lessons/42862) |
| 상위 n개 레코드 | FAIL | 정답 풀이. 제출본 없음 | [59405](https://school.programmers.co.kr/learn/courses/30/lessons/59405) |
| 카테고리 별 도서 판매량 집계하기 | PASS | SQL 제출 코드 | [144855](https://school.programmers.co.kr/learn/courses/30/lessons/144855) |

원문의 마지막 문제 제목은 '도서 판매량 집계'로 줄여 적혀 있어 공식 문제명을 썼다. 파일로 옮기면서 `class Solution`의 클래스 이름만 파일 이름에 맞췄다.

## Java — 서울에서 김서방 찾기 (PASS)

[`KimSeoul.java`](KimSeoul.java)

```java
String answer = "김서방은 ";
for(int i =0;i<seoul.length;i++){
    if(seoul[i].equals("Kim")){
        answer = answer+(Integer.toString(i))+"에 있다";
    }
}
return answer;
```

- **문자열 비교는 `equals`** — `==`는 같은 객체인지 본다. 리터럴끼리는 String pool 덕분에 우연히 같을 수 있지만, `new String("Kim")`이나 실행 중에 이어 붙인 `"Ki"+'m'`은 글자가 같아도 `==`가 `false`다(로컬에서 확인).
- **찾으면 바로 반환** — `"Kim"`은 딱 한 번 나오므로 `return "김서방은 " + i + "에 있다";`로 끝내도 된다. 두 번 나오는 입력이라면 제출 코드는 문장을 두 번 덧붙인다.
- `"Kim".equals(seoul[i])`처럼 리터럴을 앞에 두면 칸이 `null`이어도 NullPointerException이 나지 않는다.

## Java — 체육복 (FAIL · 제출 코드 없음)

[`GymSuit.java`](GymSuit.java)는 원문의 **정답 풀이**다.

```java
int[] student = new int[n+2];                  // 0번·n+1번은 경계용 빈 칸
for (int i = 1; i <= n; i++) student[i] = 1;
for (int l : lost) student[l]--;
for (int r : reserve) student[r]++;            // 도난+여벌이면 1로 돌아온다
for(int i=1;i<=n;i++){
    if( (student[i]==0) && (student[i-1]==2) ){ student[i]++; student[i-1]--; }      // 앞 번호 먼저
    else if( (student[i]==0) && (student[i+1]==2) ){ student[i]++; student[i+1]--; } // 그다음 뒤
}
// student[i] >= 1 인 학생 수
```

오답노트에 정리한 개념: **탐욕법**(0벌이면 앞 번호에게 먼저 — 앞 학생의 여벌은 지나가면 다시 쓰일 일이 없다), **경계 패딩**(`n+2`로 잡아 `i-1`·`i+1` 경계 검사를 없앤다), **상태 배열**(두 배열 비교 대신 학생별 체육복 수 하나로), **향상된 for문**(값만 읽을 때 `for (int l : lost)`, 인덱스·앞뒤 칸이 필요하면 일반 for).

흔히 틀리는 곳을 실제로 돌려 본 결과:

| 실수 | 입력 | 정답 풀이 | 실수한 코드 |
|---|---|---|---|
| 뒤 번호부터 빌리기 | n=4, lost=[2,4], reserve=[1,3] | 4 | 3 |
| 도난당한 여벌 학생을 빼지 않기 | n=2, lost=[1], reserve=[1] | 2 | 1 |

## SQL — 상위 n개 레코드 (FAIL · 제출 코드 없음)

[`top-n-answer.sql`](top-n-answer.sql)은 원문의 **정답 풀이**다.

```sql
SELECT NAME
FROM ANIMAL_INS
ORDER BY DATETIME ASC
LIMIT 1;
```

"가장 먼저 들어온" = 보호 시작일이 가장 이른 행. 정렬하지 않고 `LIMIT 1`만 쓰면 어떤 행이 나올지 보장되지 않고, `DESC`면 가장 최근 동물이 나온다. `SELECT NAME, MIN(DATETIME)`처럼 집계와 일반 컬럼을 섞으면 그 날짜를 가진 행의 이름이라는 보장이 없다.

**오답노트 표현 바로잡기** — 원문은 `SELECT → FROM → WHERE → GROUP BY → HAVING → ORDER BY → LIMIT`을 "실행 및 작성 순서"로 함께 적었는데, 이것은 **작성 순서**다. 논리적인 처리 순서는 `FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT`이다(그래서 `WHERE`에서는 `SELECT`의 별칭을 못 쓰고 `ORDER BY`에서는 쓸 수 있다). "ORDER BY가 LIMIT보다 먼저"라는 결론은 두 순서 모두에서 맞다.

## SQL — 카테고리 별 도서 판매량 집계하기 (PASS)

[`book-sales-submitted.sql`](book-sales-submitted.sql)

```sql
SELECT B.CATEGORY, SUM(S.SALES) AS TOTAL_SALES
FROM BOOK B JOIN BOOK_SALES S ON B.BOOK_ID = S.BOOK_ID
where YEAR(S.SALES_DATE) = '2022' AND MONTH(S.SALES_DATE) = '01'
GROUP BY B.CATEGORY
ORDER BY B.CATEGORY ASC;
```

- **COUNT vs SUM** — 판매 "건수"가 아니라 판매 "권수"라 `SUM(SALES)`.
- **날짜 조건 세 가지** — `YEAR()`·`MONTH()` 함수 / `LIKE '2022-01%'`·`DATE_FORMAT` / 범위 비교 `>= '2022-01-01' AND < '2022-02-01'`. 범위 비교는 컬럼을 함수로 감싸지 않아 인덱스를 쓸 수 있다.
- `MONTH()`는 숫자 1을 돌려주지만 MySQL은 문자열 `'01'`을 숫자로 바꿔 비교하므로 `= '01'`도 맞다(문서 기준).
- **WHERE가 GROUP BY보다 먼저** — 1월 판매만 남긴 뒤 묶는다. 묶은 결과를 거를 때만 `HAVING`.

## 로컬 검증

프로그래머스 재채점이 아니다.

```powershell
javac -encoding UTF-8 *.java
java -Dstdout.encoding=UTF-8 CodingTest22Test
node verify-sql22.mjs
```

- **서울에서 김서방 찾기**: 공식 예제 + 무작위 20,000개(길이 1~1,000) 통과. `==`와 `equals` 비교 출력.
- **체육복**: 공식 예제 3개 + n 2~8에서 가능한 입력 전부 86,367개(도난당한 여벌 학생이 있는 경우 77,539개, `lost` 순서는 섞음) 통과. 기댓값은 여벌 학생마다 "앞에게 / 뒤에게 / 안 빌려줌"을 전부 시도해 최댓값을 구하는 별도 코드로 계산했다. 위 표의 두 실수도 같은 파일에서 실행한다.
- **SQL**: [`verify-sql22.mjs`](verify-sql22.mjs)가 SQL 파일을 **그대로 읽어** Node 내장 SQLite(3.53, 메모리 DB)에 실행한다. 8개 항목 통과. SQLite에는 `YEAR()`·`MONTH()`가 없어 같은 이름의 함수를 등록했고, SQLite는 문자열 `'01'`과 숫자 1을 다르게 보므로 MySQL의 비교 결과와 같도록 `'2022'`·`'01'` 같은 문자열을 돌려주게 했다. 로컬 MariaDB 접속 정보는 쓰지 않았다.

## 이 회차에서 남길 것

- 문자열 내용 비교는 언제나 `equals`.
- 탐욕법은 "그 선택이 왜 손해가 없는지" 설명할 수 있을 때 쓴다. 확신이 없으면 작은 입력에서 모든 경우와 비교해 본다.
- "가장 ○○한 n개" = 정렬 후 `LIMIT n`. 판매량은 `SUM`, 기간 조건은 범위 비교.
