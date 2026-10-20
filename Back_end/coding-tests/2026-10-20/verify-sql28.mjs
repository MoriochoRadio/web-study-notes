// 28회차 SQL 을 Node 내장 SQLite(메모리 DB)로 확인한다.   실행: node verify-sql28.mjs
//
// 로컬 MariaDB 접속 정보를 쓰지 않고 누구나 바로 돌릴 수 있게 SQLite 를 쓴다.
// SQLite 에 없는 MySQL YEAR() 는 같은 이름으로 등록했다(날짜 글자 앞 4자리 → 정수).
// 정답 풀이 SQL 은 한 글자도 바꾸지 않는다. 예시 행은 프로그래머스 문제 예시, 표시한 행은 검증용으로 더한 것이다(채점 데이터가 아님).
import { DatabaseSync } from "node:sqlite";
import { readFileSync } from "node:fs";

const db = new DatabaseSync(":memory:");
db.function("YEAR", (d) => (d == null ? null : Number(String(d).slice(0, 4))));
db.exec(`
  CREATE TABLE USER_INFO (USER_ID INTEGER, GENDER INTEGER, AGE INTEGER, JOINED TEXT);
  INSERT INTO USER_INFO VALUES
    (1, 1, 26,   '2021-10-05'), (2, 0, NULL, '2021-11-25'), (3, 1, 22, '2021-11-30'),
    (4, 0, 31,   '2021-12-03'), (5, 0, 28,   '2021-12-16'), (6, 1, 24, '2022-01-03'),
    (7, 1, NULL, '2022-01-09');

  CREATE TABLE ECOLI_DATA (ID INTEGER, PARENT_ID INTEGER, SIZE_OF_COLONY INTEGER, DIFFERENTIATION_DATE TEXT, GENOTYPE INTEGER);
  INSERT INTO ECOLI_DATA VALUES
    (1, NULL, 10, '2019-01-01', 5), (2, NULL, 2, '2019-01-01', 3), (3, 1, 100, '2020-01-01', 4),
    (4, 2, 17, '2020-01-01', 4), (5, 2, 10, '2020-01-01', 6), (6, 4, 101, '2021-01-01', 22);
`);
const rows = (sql) => db.prepare(sql).all().map(r => Object.values(r).map(v => v ?? "NULL").join("|")).join(", ");
const load = (f) => readFileSync(new URL(f, import.meta.url), "utf8").split("\n").filter(l => !l.trim().startsWith("--")).join("\n");
let n = 0;
function check(label, sql, want) {
  const got = rows(sql);
  if (got !== want) throw new Error(`${label}\n  기대: ${want}\n  실제: ${got}`);
  console.log(`통과 ${++n}. ${label}\n        → ${got || "(0행)"}`);
}

// ---------- 조건에 맞는 회원수 구하기 ----------
const users = load("./users-2021-20s-answer.sql");
check("SQL 1 정답 풀이 — 문제 예시 7행: USER_ID 1 · 3 · 5", users, "3");
db.exec(`INSERT INTO USER_INFO VALUES
  (8, 0, 20, '2021-01-01'),   -- 경계: 20세 · 1월 1일 → 들어가야 한다
  (9, 1, 29, '2021-12-31'),   -- 경계: 29세 · 12월 31일 → 들어가야 한다
  (10, 0, 19, '2021-06-01'),  -- 19세 → 빠진다
  (11, 1, 30, '2021-06-01'),  -- 30세 → 빠진다
  (12, 0, 25, '2020-12-31')   -- 2020년 가입 → 빠진다`);
check("SQL 1 정답 풀이 — 검증용 5행 추가(20세 · 29세 · 1/1 · 12/31 경계, 19 · 30세, 2020년): 3 + 2", users, "5");
check("  BETWEEN 대신 AGE >= 20 AND AGE <= 29 — 같은 결과",
  "SELECT COUNT(*) FROM USER_INFO WHERE YEAR(JOINED) = 2021 AND AGE >= 20 AND AGE <= 29", "5");
check("  YEAR() 대신 날짜 범위 JOINED BETWEEN '2021-01-01' AND '2021-12-31' — DATE 열이면 같은 결과",
  "SELECT COUNT(*) FROM USER_INFO WHERE JOINED BETWEEN '2021-01-01' AND '2021-12-31' AND AGE BETWEEN 20 AND 29", "5");
check("틀린 방법 ① AGE BETWEEN 20 AND 30 — 30세까지 들어간다",
  "SELECT COUNT(*) FROM USER_INFO WHERE YEAR(JOINED) = 2021 AND AGE BETWEEN 20 AND 30", "6");
check("  나이가 NULL 인 회원(2번)은 BETWEEN 이 참이 아니라 저절로 빠진다 — 2021년 가입 전체는 9명",
  "SELECT COUNT(*) FROM USER_INFO WHERE YEAR(JOINED) = 2021", "9");
check("  COUNT(*) 와 COUNT(AGE) — 2021년 가입자 9명 중 나이가 적힌 사람은 8명(NULL 은 COUNT(열)에서 빠짐)",
  "SELECT COUNT(*), COUNT(AGE) FROM USER_INFO WHERE YEAR(JOINED) = 2021", "9|8");

// ---------- 대장균들의 자식의 수 구하기 ----------
const child = load("./ecoli-child-count-answer.sql");
check("SQL 2 정답 풀이 — 문제 예시 6행: 자식 없는 3 · 5 · 6 도 0으로", child, "1|1, 2|2, 3|0, 4|1, 5|0, 6|0");
check("틀린 방법 ② LEFT 대신 INNER JOIN — 자식이 있는 개체만 남는다",
  "SELECT E1.ID, COUNT(E2.ID) FROM ECOLI_DATA E1 JOIN ECOLI_DATA E2 ON E1.ID = E2.PARENT_ID GROUP BY E1.ID ORDER BY E1.ID", "1|1, 2|2, 4|1");
check("틀린 방법 ③ COUNT(E2.ID) 대신 COUNT(*) — 자식이 없어도 NULL 로 붙은 한 줄을 세어 1이 된다",
  "SELECT E1.ID, COUNT(*) FROM ECOLI_DATA E1 LEFT JOIN ECOLI_DATA E2 ON E1.ID = E2.PARENT_ID GROUP BY E1.ID ORDER BY E1.ID", "1|1, 2|2, 3|1, 4|1, 5|1, 6|1");
check("틀린 방법 ④ ON 의 방향을 바꿔 E1.PARENT_ID = E2.ID — '내 부모가 있나'(0 또는 1)를 센다",
  "SELECT E1.ID, COUNT(E2.ID) FROM ECOLI_DATA E1 LEFT JOIN ECOLI_DATA E2 ON E1.PARENT_ID = E2.ID GROUP BY E1.ID ORDER BY E1.ID", "1|0, 2|0, 3|1, 4|1, 5|1, 6|1");
check("다른 풀이 — 상관 서브쿼리로 자식 수 세기(같은 결과)",
  "SELECT P.ID, (SELECT COUNT(*) FROM ECOLI_DATA C WHERE C.PARENT_ID = P.ID) AS CHILD_COUNT FROM ECOLI_DATA P ORDER BY P.ID", "1|1, 2|2, 3|0, 4|1, 5|0, 6|0");
check("LEFT JOIN 만 한 중간 결과 — 자식 없는 개체는 E2 쪽이 NULL 인 한 줄",
  "SELECT E1.ID AS PARENT, E2.ID AS CHILD FROM ECOLI_DATA E1 LEFT JOIN ECOLI_DATA E2 ON E1.ID = E2.PARENT_ID ORDER BY E1.ID, E2.ID", "1|3, 2|4, 2|5, 3|NULL, 4|6, 5|NULL, 6|NULL");
console.log(`\n모두 ${n}개 통과 — SQLite 로컬 검증이며 프로그래머스 재채점이 아니다.`);
