// 23회차 SQL 을 Node 내장 SQLite(메모리 DB)로 확인한다.   실행: node verify-sql23.mjs
//
// 로컬 MariaDB 접속 정보를 쓰지 않고 누구나 바로 돌릴 수 있게 SQLite 를 쓴다.
// 날짜는 'YYYY-MM-DD' 문자열로 넣었다. 이 형식은 글자 순서가 곧 날짜 순서라 BETWEEN 이 MySQL 의 DATE 비교와
// 같은 결과를 낸다. 제출 SQL·정답 풀이 SQL 은 한 글자도 바꾸지 않는다.
import { DatabaseSync } from "node:sqlite";
import { readFileSync } from "node:fs";

const db = new DatabaseSync(":memory:");
db.exec(`
  CREATE TABLE USER_INFO (USER_ID INTEGER, GENDER INTEGER, AGE INTEGER, JOINED TEXT);
  INSERT INTO USER_INFO VALUES
    (1, 1, 26,   '2021-06-01'),
    (2, NULL, NULL, '2021-06-25'),   -- 나이 없음
    (3, 0, NULL, '2021-06-30'),      -- 나이 없음
    (4, 1, 0,    '2021-07-03'),      -- 0살은 NULL 이 아니다
    (5, 0, 31,   '2021-07-05');

  CREATE TABLE CAR_RENTAL_COMPANY_RENTAL_HISTORY (HISTORY_ID INTEGER, CAR_ID INTEGER, START_DATE TEXT, END_DATE TEXT);
  INSERT INTO CAR_RENTAL_COMPANY_RENTAL_HISTORY VALUES
    (1, 4, '2022-09-27', '2022-09-27'),
    (2, 3, '2022-10-03', '2022-10-04'),
    (3, 2, '2022-10-05', '2022-10-05'),
    (4, 1, '2022-10-11', '2022-10-16'),   -- 1번: 반납일이 10/16 → 대여중
    (5, 3, '2022-10-13', '2022-10-15'),   -- 3번: 10/15 반납 → 대여 가능
    (6, 2, '2022-10-15', '2022-10-17'),   -- 2번: 10/16 을 걸침 → 대여중 (이력은 두 줄)
    (7, 4, '2022-10-16', '2022-10-20'),   -- 4번: 대여 시작일이 10/16 → 대여중
    (8, 5, '2022-10-17', '2022-10-20');   -- 5번: 10/17 부터 → 대여 가능
`);

const rows = (sql) => db.prepare(sql).all().map(r => Object.values(r).map(v => v ?? "NULL").join("|")).join(", ");
const load = (f) => readFileSync(new URL(f, import.meta.url), "utf8").split("\n").filter(l => !l.trim().startsWith("--")).join("\n");
let n = 0;
function check(label, sql, want) {
  const got = rows(sql);
  if (got !== want) throw new Error(`${label}\n  기대: ${want}\n  실제: ${got}`);
  console.log(`통과 ${++n}. ${label}\n        → ${got || "(0행)"}`);
}

check("SQL 1 제출 코드 — AGE 가 NULL 인 회원 수", load("./age-null-submitted.sql"), "2");
check("= NULL 로 쓰면 0 — NULL 과의 비교는 참도 거짓도 아닌 '알 수 없음'이라 어떤 행도 남지 않는다",
      "SELECT COUNT(*) AS USERS FROM USER_INFO WHERE AGE = NULL", "0");
check("COUNT(AGE) 로 세면 0 — 컬럼을 세는 COUNT 는 NULL 을 건너뛴다",
      "SELECT COUNT(AGE) AS USERS FROM USER_INFO WHERE AGE IS NULL", "0");
check("COUNT(*) 와 COUNT(AGE) 의 차이 = NULL 의 개수 (전체 5 · 나이 있음 3)",
      "SELECT COUNT(*), COUNT(AGE), COUNT(*) - COUNT(AGE) FROM USER_INFO", "5|3|2");

check("SQL 2 정답 풀이 — 차마다 한 줄, 10/16 에 걸친 이력이 하나라도 있으면 대여중, CAR_ID 내림차순",
      load("./car-rental-answer.sql"), "5|대여 가능, 4|대여중, 3|대여 가능, 2|대여중, 1|대여중");
check("GROUP BY 없이 줄마다 판정하고 DISTINCT 를 걸면 같은 차가 두 번 — 2·4번이 '대여중'과 '대여 가능'으로 함께 나온다",
      `SELECT DISTINCT CAR_ID, CASE WHEN '2022-10-16' BETWEEN START_DATE AND END_DATE THEN '대여중' ELSE '대여 가능' END AS AVAILABILITY
       FROM CAR_RENTAL_COMPANY_RENTAL_HISTORY ORDER BY CAR_ID DESC, AVAILABILITY`,
      "5|대여 가능, 4|대여 가능, 4|대여중, 3|대여 가능, 2|대여 가능, 2|대여중, 1|대여중");
check("WHERE 로 10/16 이력만 남기면 대여 가능한 차(3·5번)가 결과에서 사라진다",
      `SELECT CAR_ID, '대여중' FROM CAR_RENTAL_COMPANY_RENTAL_HISTORY
       WHERE '2022-10-16' BETWEEN START_DATE AND END_DATE GROUP BY CAR_ID ORDER BY CAR_ID DESC`,
      "4|대여중, 2|대여중, 1|대여중");
check("BETWEEN 은 양 끝을 포함 — 반납일·시작일이 10/16 인 1·4번도 걸린다 (< · > 로 쓰면 빠진다)",
      `SELECT CAR_ID FROM CAR_RENTAL_COMPANY_RENTAL_HISTORY
       WHERE START_DATE < '2022-10-16' AND '2022-10-16' < END_DATE ORDER BY CAR_ID DESC`,
      "2");
check("SUM(...) > 0 으로 써도 같은 결과",
      `SELECT CAR_ID, CASE WHEN SUM(CASE WHEN '2022-10-16' BETWEEN START_DATE AND END_DATE THEN 1 ELSE 0 END) > 0
              THEN '대여중' ELSE '대여 가능' END AS AVAILABILITY
       FROM CAR_RENTAL_COMPANY_RENTAL_HISTORY GROUP BY CAR_ID ORDER BY CAR_ID DESC`,
      "5|대여 가능, 4|대여중, 3|대여 가능, 2|대여중, 1|대여중");
check("서브쿼리로 써도 같은 결과 — 10/16 대여 중인 차 목록에 들어 있는가",
      `SELECT DISTINCT CAR_ID, CASE WHEN CAR_ID IN (SELECT CAR_ID FROM CAR_RENTAL_COMPANY_RENTAL_HISTORY
                                                   WHERE '2022-10-16' BETWEEN START_DATE AND END_DATE)
              THEN '대여중' ELSE '대여 가능' END AS AVAILABILITY
       FROM CAR_RENTAL_COMPANY_RENTAL_HISTORY ORDER BY CAR_ID DESC`,
      "5|대여 가능, 4|대여중, 3|대여 가능, 2|대여중, 1|대여중");

console.log(`\n모두 통과 (${n}개) — SQLite ${db.prepare("select sqlite_version() v").get().v}, 메모리 DB. 프로그래머스 채점이 아니다.`);
