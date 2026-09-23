# 18회차 코딩테스트 기록 — 2026-09-23

[웹으로 복습하기](index.html) · [37일차 수업](../../index.html#class-day37)

원문 `코딩테스트오답노트18_김태경.docx`의 결과는 **Java 2 FAIL, SQL 2 PASS**다. Java 두 문제의 제출 코드 칸은 비어 있고 정답 풀이와 개념 설명만 남아 있다. 따라서 제출본을 만들어 내거나 특정 실수를 실제 실패 원인이라고 단정하지 않았다. SQL 두 문제는 제출 코드를 그대로 파일로 보존했다.

| 문제 | 원문 결과 | 보존한 내용 | 문제 |
|---|---|---|---|
| 정수 내림차순으로 배치하기 | FAIL | 정답 풀이 2가지. 제출본 없음 | [12933](https://school.programmers.co.kr/learn/courses/30/lessons/12933) |
| 폰켓몬 | FAIL | 정답 풀이. 제출본 없음 | [1845](https://school.programmers.co.kr/learn/courses/30/lessons/1845) |
| 이름이 있는 동물의 아이디 | PASS | SQL 제출문 | [59407](https://school.programmers.co.kr/learn/courses/30/lessons/59407) |
| 헤비 유저가 소유한 장소 | PASS | SQL 제출문 | [77487](https://school.programmers.co.kr/learn/courses/30/lessons/77487) |

원문의 첫 문제 제목은 '정수 내림차순 배치'로 축약되어 있다. 페이지와 링크에는 공식 문제명을 썼다. 원문의 정답 풀이가 한 문단으로 합쳐진 부분은 실행 가능한 줄바꿈으로 정리하고 클래스 이름만 파일에 맞췄다.

## 정수 내림차순으로 배치하기

[`DescendingDigitsString.java`](DescendingDigitsString.java)는 문자열로 자릿수를 분리하고 정렬한 뒤 뒤에서부터 StringBuilder에 붙인다. [`DescendingDigitsArithmetic.java`](DescendingDigitsArithmetic.java)는 `% 10`과 `/ 10`으로 숫자를 분리하는 두 번째 풀이를 보존했다.

- 숫자에는 `.length()`가 없다. 배열은 `arr.length`, 문자열은 `str.length()`다.
- 입력이 1~8,000,000,000이므로 `long`과 `Long.parseLong`을 쓴다. 정렬 결과는 입력 상한을 넘어설 수도 있다. 예: 7,999,999,999 → 9,999,999,997.
- `Arrays.sort`는 오름차순이므로 `length - 1`에서 0까지 읽어 내림차순으로 조립한다.
- 위 내용은 복습 포인트이며 실제 제출본의 실수였다고 확인한 내용은 아니다.

## 폰켓몬

[`PokemonKinds.java`](PokemonKinds.java)는 HashSet으로 종류 수를 세고 N/2와 비교한다. 답은 `Math.min(종류 수, N/2)`와 같다. HashSet은 중복을 없애지만 인덱스 접근이나 반복 순서를 보장하지 않는다. 이 문제는 개수만 필요하다.

종류 수와 선택 가능한 마릿수 모두 정답의 상한이다. 둘 중 작은 수만큼 다른 종류를 하나씩 고르면 그 상한을 달성할 수 있다. 그래서 모든 조합을 탐색할 필요는 없다. 검증 코드에서는 작은 입력의 모든 선택 조합을 실제로 열거해 이 결론과 비교했다.

## 이름이 있는 동물의 아이디

[`named-animal-ids.sql`](named-animal-ids.sql)

```sql
SELECT ANIMAL_ID
FROM ANIMAL_INS
WHERE NAME IS NOT NULL
ORDER BY ANIMAL_ID ASC;
```

`NAME <> NULL`로 바꾸면 UNKNOWN 때문에 행이 선택되지 않는다. MariaDB에서 빈 문자열은 NULL이 아니므로 `IS NOT NULL`에 포함된다. 문제에 없는 조건을 추가해 빈 문자열을 임의로 빼지 않는다.

## 헤비 유저가 소유한 장소

[`heavy-user-places.sql`](heavy-user-places.sql)

```sql
SELECT ID, NAME, HOST_ID
FROM PLACES
WHERE HOST_ID IN (
    SELECT HOST_ID
    FROM PLACES
    GROUP BY HOST_ID
    HAVING COUNT(*) >= 2
)
ORDER BY ID ASC;
```

서브쿼리는 조건에 맞는 **호스트 명단**을 만들고, 바깥 쿼리는 그 호스트의 **모든 장소 행**을 유지한다. WHERE는 개별 행, HAVING은 집계한 그룹의 조건이다. 마지막 정렬은 HOST_ID가 아니라 장소 ID 기준이다. 정확히 두 장소를 가진 호스트도 포함해야 한다.

## Java 로컬 검증

JDK 21에서 실행했다. [`CodingTest18Test.java`](CodingTest18Test.java)는 정렬 풀이와 별개로 숫자 빈도표로 기댓값을 만든다. 폰켓몬은 작은 배열에서 N/2개를 고르는 모든 조합을 열거해 정답 풀이와 대조한다.

```powershell
New-Item -ItemType Directory -Force build
javac -encoding UTF-8 -d build *.java
java -cp build CodingTest18Test
```

실제 출력:

```text
Descending digits: 20008 cases PASS (both solutions)
Pokemon: 7385 cases PASS (exhaustive subsets + boundary cases)
Local checks only; original submission failures cannot be reproduced without submission code.
```

정수 정렬: 1~10,000 전수 + 재현 가능한 난수 10,000개 + 경계 8개. 폰켓몬: 공식 예제 3개 + 원소 1~3·짝수 길이 2~8인 배열 7,380개 + 길이 10,000 경계 2개. 입력 배열이 바뀌지 않는지도 검사했다.

## SQL 로컬 검증

[`Sql18Verification.java`](Sql18Verification.java)가 [`verify-fixtures.sql`](verify-fixtures.sql)의 **세션 임시 테이블**을 만든 뒤, 두 제출 SQL 파일을 직접 읽어 실행한다. JDBC 드라이버 경로와 로컬 설정 파일 경로를 본인 환경에 맞춘다. 비밀번호를 명령줄 인자로 넘기지 않는다.

```powershell
java -cp "build;PATH_TO_MARIADB_DRIVER.jar" Sql18Verification "PATH_TO_LOCAL_DB_PROPERTIES"
```

MariaDB 12.3.3에서 8개 검사를 통과했다.

| 검증 | 결과 |
|---|---|
| 이름 있는 행 및 ID 정렬 | A200,A400,A500 |
| NAME <> NULL | 0건 |
| 빈 문자열도 IS NOT NULL | A400 |
| 2개·3개 보유 호스트의 모든 장소와 ID 정렬 | 10,40,60,70,90 |
| 호스트별 1개만 남은 경우 | 0건 |
| ANIMAL_INS가 비어 있음 | 0건 |
| PLACES가 비어 있음 | 0건 |
| 이름이 NULL인 행만 있음 | 0건 |

임시 테이블에만 데이터를 넣고 지웠고, 기존 수업 테이블은 변경하지 않았다. 이 검증은 로컬 풀이 확인이며 프로그래머스 재채점 결과가 아니다.
