# 30회차 코딩테스트 기록 — 2026-10-26

[웹으로 복습하기](index.html) · [10/26 수업(AI Agent 과정)](../../../AI_Agent/index.html#ai-day06)

원문 `코딩테스트오답노트30_김태경.docx`의 결과는 **1 PASS · 3 FAIL**이다(프로그래밍 FAIL · SQL PASS · JAVA FAIL · SQL FAIL). 제출 코드가 남은 것은 동명 동물 수 찾기(PASS) 하나뿐이고, 나머지 세 문제는 제출 코드 칸이 비어 있어 원문의 **정답 풀이**를 옮겼다. FAIL 원인은 단정하지 않았다. 기록은 백엔드 코딩테스트 탭 ct-82~85에 이어 둔다.

| 문제 | 원문 결과 | 보존한 내용 | 문제 |
|---|---|---|---|
| 문자열 내림차순으로 배치하기 | FAIL | 원문 정답 풀이(Java `toCharArray` · 정렬 · `reverse`). 제출본 없음 | [12917](https://school.programmers.co.kr/learn/courses/30/lessons/12917) |
| 동명 동물 수 찾기 | PASS | 제출 코드(SQL). 정답 풀이 칸 비어 있음 | [59041](https://school.programmers.co.kr/learn/courses/30/lessons/59041) |
| H-Index | FAIL | 원문 정답 풀이(Java 정렬 + `n - i`). 제출본 없음 | [42747](https://school.programmers.co.kr/learn/courses/30/lessons/42747) |
| 조회수가 가장 많은 중고거래 게시판의 첨부파일 조회하기 | FAIL | 원문 정답 풀이(SQL 서브쿼리 + `CONCAT`). 제출본 없음 | [164671](https://school.programmers.co.kr/learn/courses/30/lessons/164671) |

파일로 옮기면서 `class Solution`의 클래스 이름만 파일 이름에 맞췄다. 원문 표의 문제 제목(문자열 내림차순 배치 · 조회수 많은 중고거래)은 줄여 쓴 것이라 프로그래머스 제목을 따랐다. 문제 번호와 조건은 프로그래머스 문제 페이지에서 확인했다.

## 프로그래밍 — 문자열 내림차순으로 배치하기 (FAIL · 제출 코드 없음)

[`StringDesc.java`](StringDesc.java)

```java
char[] charArray = s.toCharArray();
Arrays.sort(charArray);                                              // 오름차순 (문자 코드 순)
return new StringBuilder(new String(charArray)).reverse().toString(); // 뒤집어 내림차순
```

- 문자 코드로 비교하므로 대문자(65~90)가 소문자(97~122)보다 작다 — `"Zbcdefg"` → `"gfedcbZ"`.
- 실행해 본 실수: 대소문자를 무시하고 정렬하면 `"Zgfedcb"`, 정렬한 `char[]`에 `toString()`을 하면 `[C@…`(배열 주소), 내림차순을 바로 정렬하려 `Arrays.sort(char[], Collections.reverseOrder())`를 쓰면 컴파일 오류(`no suitable method found`).

## SQL — 동명 동물 수 찾기 (PASS)

[`animal-name-count.sql`](animal-name-count.sql)

```sql
SELECT NAME, count(*) as 'COUNT'
from ANIMAL_INS
group by NAME
HAVING count(NAME) >= 2
order by NAME;
```

- `GROUP BY NAME`은 NULL끼리도 한 그룹으로 묶는다. `count(NAME)`은 NULL을 세지 않아 이름 없는 동물의 그룹(0)이 `>= 2`를 못 넘어 빠진다. `HAVING count(*) >= 2`로 쓰면 NULL 이름이 둘 이상일 때 `NULL | n` 행이 들어온다(검증용 행으로 확인).
- 대소문자: SQLite는 `Lucy`와 `lucy`를 따로 묶고, MySQL 기본 콜레이션은 같은 이름으로 본다(문서 기준 — 이 PC에서 MySQL로는 확인하지 않음). 로컬에서는 `COLLATE NOCASE`로 재현했다.

## JAVA — H-Index (FAIL · 제출 코드 없음)

[`HIndex.java`](HIndex.java)

```java
Arrays.sort(citations);                    // [3, 0, 6, 1, 5] → [0, 1, 3, 5, 6]
int n = citations.length;
for (int i = 0; i < n; i++) {
    int h = n - i;                         // 이 논문 포함 뒤에 남은 논문 수
    if (citations[i] >= h) return h;       // 처음 성립하는 h 가 최댓값
}
return 0;
```

- "h번 이상 인용된 논문이 h편 이상"인 h의 최댓값. 정렬해 두었으니 개수를 세지 않고 `n - i`로 안다. i가 커질수록 h가 줄어들어 처음 성립하는 순간이 최댓값.
- 경계: `[0]` → 0 · `[100]` → 1(논문 수가 상한) · `[0, 0, 0]` → 0(반환문 `return 0` 필요 — 빼면 `missing return statement`) · 1,000편이 모두 10,000회 → 1000.
- 정렬한 가운데 값을 답으로 하면 공식 예제는 우연히 맞지만 `[10, 8, 5, 4, 3]`(답 4)에서는 5가 된다.

## SQL — 조회수가 가장 많은 중고거래 게시판의 첨부파일 조회하기 (FAIL · 제출 코드 없음)

[`used-goods-top-views-files-answer.sql`](used-goods-top-views-files-answer.sql)

```sql
SELECT CONCAT('/home/grep/src/', F.BOARD_ID, '/', F.FILE_ID, F.FILE_NAME, F.FILE_EXT) AS FILE_PATH
FROM USED_GOODS_BOARD B
JOIN USED_GOODS_FILE F ON B.BOARD_ID = F.BOARD_ID
WHERE B.VIEWS = (SELECT MAX(VIEWS) FROM USED_GOODS_BOARD)
ORDER BY F.FILE_ID DESC;
```

- **문제 예시의 출력 순서**: 본문은 "FILE ID 내림차순"인데 문제 페이지의 예시 출력에는 `IMG_000001`이 `IMG_000002`보다 먼저 나와 있다(2026-10-26 확인). 이 SQL을 예시 데이터에 돌리면 내림차순이라 `IMG_000002`가 먼저, `ASC`로 바꾸면 예시의 순서가 된다. 채점이 어느 쪽인지는 확인하지 못했고 FAIL의 원인이라고 단정하지 않았다.
- 조회수 1등이 둘이면 `= (SELECT MAX …)`는 두 게시글의 파일을 모두, `ORDER BY VIEWS DESC LIMIT 1`은 하나만 돌려준다(문제는 "하나만 존재" 보장).
- `FILE_ID`는 문자열이라 글자 순으로 정렬된다. 문제 데이터는 `IMG_000001`처럼 자릿수가 같아 괜찮다.
- 실행해 본 실수: 게시글 ID 뒤 `'/'` 빠짐(`…/B0001IMG_000002photo2.jpg`), `WHERE B.VIEWS = MAX(B.VIEWS)`(집계 함수 오류), 조회수 조건 없이 JOIN만(파일 5개 전부).

## 로컬 검증

프로그래머스 재채점이 아니다.

```powershell
javac -encoding UTF-8 -d out *.java
java -Dstdout.encoding=UTF-8 -cp out CodingTest30Test
node verify-sql30.mjs
```

- **문자열 내림차순으로 배치하기**: 공식 예제 + 무작위 10,000개(영문 대소문자, 길이 1~100). 기댓값은 정렬을 쓰지 않고 문자 코드별 개수를 세어 큰 코드부터 이어 붙인 문자열.
- **H-Index**: 공식 예제 + 경계 11개 + 무작위 20,000개(1~30편) + 문제 상한(1,000편 · 0~10,000회) 안의 무작위 200개. 기댓값은 정의 그대로 `h = n, n-1, …`를 큰 쪽부터 "h번 이상 인용된 논문이 h편 이상"인지 세는 방법.
- **SQL**: [`verify-sql30.mjs`](verify-sql30.mjs)가 SQL 파일을 **그대로 읽어** Node 내장 SQLite에 실행한다. 19개 항목 통과. 동물 표는 문제 예시 6행 + 검증용 6행, 중고거래는 문제 예시(게시글 5 · 파일 5) + 검증용 행. SQLite에 `CONCAT`이 이미 있어 그대로 실행했다. GROUP BY 검사가 MySQL보다 느슨해 `ONLY_FULL_GROUP_BY`는 재현하지 못한다.

## 이 회차에서 남길 것

- 문자열 정렬은 `toCharArray → sort → new String`, 내림차순은 "오름차순 + 뒤집기". 대문자 < 소문자.
- "두 번 이상 나온 것"은 `GROUP BY 열 HAVING COUNT(*) >= 2`. 열에 NULL이 있으면 `COUNT(열)`과 `COUNT(*)`의 차이를 생각하기.
- 정의가 문장인 문제는 식 한 줄로 바꾸고, 정렬하면 "세는 일"이 위치 계산이 되는지 보기.
- "가장 ○○한 것에 딸린 것"은 서브쿼리(최댓값) + JOIN. 문제 예시의 출력 순서와 본문이 다르면 둘 다 돌려 보고 본문 규칙을 확인.
