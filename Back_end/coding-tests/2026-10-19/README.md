# 27회차 코딩테스트 기록 — 2026-10-19

[웹으로 복습하기](index.html) · [10/19 수업(AI Agent 과정)](../../../AI_Agent/index.html#ai-day01)

원문 `코딩테스트오답노트27_김태경.docx`의 결과는 **세 문제 모두 FAIL**이다(프로그래밍 1 · SQL 1 · JAVA 1). 세 문제 모두 제출 코드 칸이 비어 있어 실패 원인은 단정하지 않았고, 아래 코드는 원문의 **정답 풀이**다. 이 회차는 새 과정(AI Agent 실습 입문 1부) 첫날에 봤지만, 기록은 이어서 백엔드 코딩테스트 탭(ct-71~73)에 둔다.

| 문제 | 원문 결과 | 보존한 내용 | 문제 |
|---|---|---|---|
| 제일 작은 수 제거하기 | FAIL | 원문 정답 풀이(Java). 제출본 없음 | [12935](https://school.programmers.co.kr/learn/courses/30/lessons/12935) |
| 12세 이하인 여자 환자 목록 출력하기 | FAIL | 원문 정답 풀이(SQL). 제출본 없음 | [132201](https://school.programmers.co.kr/learn/courses/30/lessons/132201) |
| 게임 맵 최단거리 | FAIL | 원문 정답 풀이(Java BFS, 주석 포함). 제출본 없음 | [1844](https://school.programmers.co.kr/learn/courses/30/lessons/1844) |

파일로 옮기면서 `class Solution`의 클래스 이름만 파일 이름에 맞췄다. 원문 제목 "제일 작은 수 제거"는 프로그래머스 제목("제일 작은 수 제거하기")으로 적었고, SQL 제목 끝의 공백은 뺐다. 문제 번호와 조건은 프로그래머스 문제 페이지에서 확인했다.

## 프로그래밍 — 제일 작은 수 제거하기 (FAIL · 제출 코드 없음)

[`RemoveSmallestNumber.java`](RemoveSmallestNumber.java)

```java
if (arr.length <= 1) return new int[] {-1};          // 빼고 나면 빈 배열
int min = arr[0];
for (int i = 1; i < arr.length; i++) if (arr[i] < min) min = arr[i];
int[] ans = new int[arr.length - 1];
int index = 0;
for (int i = 0; i < arr.length; i++) {
    if (arr[i] == min) continue;                     // 최솟값만 건너뛰고
    ans[index++] = arr[i];                           // 나머지는 원래 순서대로
}
```

- 정렬하면 원래 순서가 깨진다 — `[4,3,2,1]`을 정렬 후 맨 앞을 빼면 `[2, 3, 4]`(예시 답은 `[4, 3, 2]`).
- 최솟값을 `0`에서 시작하면 양수만 있을 때 아무것도 건너뛰지 않아 `[5,7,9]`에서 `ArrayIndexOutOfBoundsException`.
- "원소가 모두 다르다"는 조건 덕분에 건너뛰는 것이 정확히 하나다. 조건 밖 입력 `[1,1,2]`는 `[2, 0]`.

## SQL — 12세 이하인 여자 환자 목록 출력하기 (FAIL · 제출 코드 없음)

[`patient-girls-12-answer.sql`](patient-girls-12-answer.sql)

```sql
SELECT PT_NAME, PT_NO, GEND_CD, AGE, COALESCE(TLNO, 'NONE') AS TLNO
FROM PATIENT
WHERE AGE <= 12 AND GEND_CD = 'W'
ORDER BY AGE DESC, PT_NAME ASC;
```

| 실수 | 결과(문제 예시 10행 + 검증용 3행) |
|---|---|
| NULL을 그대로 | 전화번호 칸에 `NULL` |
| `WHERE TLNO = NULL` | 0행 — NULL 비교는 `IS NULL` |
| `AGE < 12` | 12세(가람 · 한나)가 빠짐 |
| `ORDER BY AGE, PT_NAME DESC` | 방향이 기준마다 붙어 순서가 뒤집힘 |
| `AND` 대신 `OR` | 11명이 섞여 나옴 |

NULL 대체 함수는 DBMS마다 이름이 다르다 — `NVL`(Oracle) · `IFNULL`(MySQL/MariaDB) · `COALESCE`(표준, 여러 후보 중 처음으로 NULL이 아닌 값).

## JAVA — 게임 맵 최단거리 (FAIL · 제출 코드 없음)

[`GameMapShortestPath.java`](GameMapShortestPath.java)

```java
Queue<int[]> queue = new LinkedList<>();
queue.add(new int[]{0, 0});
while (!queue.isEmpty()) {
    int[] cur = queue.poll();                         // 가장 먼저 들어온(가까운) 칸
    for (int i = 0; i < 4; i++) {
        int nx = cur[0] + dx[i], ny = cur[1] + dy[i];
        if (nx < 0 || nx >= n || ny < 0 || ny >= m) continue;   // 맵 밖
        if (maps[nx][ny] == 0 || maps[nx][ny] > 1) continue;    // 벽 · 이미 간 곳
        maps[nx][ny] = maps[cur[0]][cur[1]] + 1;                // 거리 기록 = 방문 표시
        queue.add(new int[]{nx, ny});
    }
}
return maps[n - 1][m - 1] == 1 ? -1 : maps[n - 1][m - 1];
```

- BFS는 가까운 칸부터 보므로 처음 적힌 숫자가 최단 거리이고, `> 1`인 칸은 다시 건드리지 않아 덮이지 않는다.
- 범위 검사가 `maps[nx][ny]`를 읽기보다 먼저 와야 한다.
- 로컬에서 본 것(답에는 영향 없음): 출발 칸은 값이 1이라 이웃에서 한 번 3으로 덮이고, 입력 배열에 거리를 적으므로 호출한 쪽의 맵이 바뀐다.
- 조건 밖: 도착 칸이 벽이면 `0`이 나온다(문제에 명시되지 않은 입력). `answer <= 1 ? -1 : answer`로 막을 수 있다.

## 로컬 검증

프로그래머스 재채점이 아니다.

```powershell
javac -encoding UTF-8 -d out *.java
java -Dstdout.encoding=UTF-8 -cp out CodingTest27Test
node verify-sql27.mjs
```

- **제일 작은 수 제거하기**: 공식 예제 2개 + 무작위 5,000개(길이 1~20, 서로 다른 -1000~1000)를 스트림(`min()` → `filter`)으로 구한 값과 비교. 정렬 방식과 조건 밖 입력도 출력.
- **게임 맵 최단거리**: 공식 예제 2개 + 무작위 3,000개(1~12 × 1~12, 벽 0~45%, 도착 가능 1,812개)를 **큐 없이** "이웃 거리 + 1이 더 작으면 바꾸기"를 되풀이해 구한 거리와 비교. 한 줄짜리 맵, 100 × 100(답 199), 풀이 뒤 맵의 출발 칸, 도착 칸이 벽인 입력도 출력.
- **SQL**: [`verify-sql27.mjs`](verify-sql27.mjs)가 SQL 파일을 **그대로 읽어** Node 내장 SQLite(3.53)에 실행한다. 10개 항목 통과. 앞 10행은 문제 예시, 뒤 3행(같은 12세 · 13세 · 12세 남자)은 경계를 보려고 더한 행이다. SQLite는 한글을 유니코드 순서로 비교하며, 완성형 한글은 그 순서가 가나다순과 같다.

## 이 회차에서 남길 것

- 답에 원래 순서가 남아야 하면 정렬하지 말고 "찾기 → 걸러 담기". 최솟값은 첫 원소에서 시작, 예외 입력은 먼저 `return`.
- 조건 여러 개는 `AND`, NULL 대체는 `COALESCE`(표준), NULL 비교는 `IS NULL`, 정렬 방향은 기준마다.
- "가장 짧은 · 최소 몇 번"은 BFS — 큐(FIFO) · 방향 벡터 `dx`/`dy` · 넣을 때 방문 표시.
