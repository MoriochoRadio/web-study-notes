// 20회차 SQL 을 Node 내장 SQLite(메모리 DB)로 확인한다.   실행: node verify-sql20.mjs
//
// 로컬 MariaDB 접속 정보를 쓰지 않고 누구나 바로 돌릴 수 있게 SQLite 를 쓴다.
// SQLite 에는 MONTH() 가 없어서, 제출 SQL 을 한 글자도 바꾸지 않고 실행하려고
// "날짜 문자열의 월을 숫자로 돌려주는" MONTH 함수를 등록했다. JOIN · DISTINCT · GROUP BY ·
// ORDER BY ... DESC 의 동작은 MySQL·MariaDB 와 같다. 날짜 타입·문자셋처럼 DB마다 다른 부분은 검사하지 않는다.
import { DatabaseSync } from "node:sqlite";
import { readFileSync } from "node:fs";

const db = new DatabaseSync(":memory:");
db.function("MONTH", { deterministic: true }, (d) => (d == null ? null : Number(String(d).slice(5, 7))));
db.exec(`
  CREATE TABLE ANIMAL_INS (ANIMAL_ID TEXT NOT NULL, NAME TEXT);
  INSERT INTO ANIMAL_INS VALUES ('A350', '보리'), ('A120', NULL), ('A900', '누리'), ('A002', '체리');

  CREATE TABLE CAR_RENTAL_COMPANY_CAR (CAR_ID INTEGER PRIMARY KEY, CAR_TYPE TEXT);
  CREATE TABLE CAR_RENTAL_COMPANY_RENTAL_HISTORY (HISTORY_ID INTEGER PRIMARY KEY, CAR_ID INTEGER, START_DATE TEXT, END_DATE TEXT);
  INSERT INTO CAR_RENTAL_COMPANY_CAR VALUES (1,'세단'), (2,'SUV'), (3,'세단'), (4,'세단'), (5,'트럭');
  INSERT INTO CAR_RENTAL_COMPANY_RENTAL_HISTORY VALUES
    (1, 3, '2022-10-02', '2022-10-05'),   -- 세단 3번, 10월 ①
    (2, 3, '2022-10-20', '2022-10-21'),   -- 세단 3번, 10월 ② → 같은 차가 두 줄이 된다
    (3, 1, '2022-10-11', '2022-10-12'),   -- 세단 1번, 10월
    (4, 4, '2022-09-30', '2022-10-03'),   -- 세단 4번, 시작이 9월 → 제외 (끝나는 달은 10월이어도)
    (5, 2, '2022-10-07', '2022-10-08'),   -- SUV → 제외
    (6, 3, '2022-10-28', '2022-10-29');   -- 세단 3번, 10월 ③
`);

const rows = (sql) => db.prepare(sql).all().map(r => Object.values(r).map(v => v ?? "NULL").join("|")).join(", ");
const load = (f) => readFileSync(new URL(f, import.meta.url), "utf8").split("\n").filter(l => !l.trim().startsWith("--")).join("\n");
let n = 0;
function check(label, sql, want) {
  const got = rows(sql);
  if (got !== want) throw new Error(`${label}\n  기대: ${want}\n  실제: ${got}`);
  console.log(`통과 ${++n}. ${label}\n        → ${got || "(0행)"}`);
}

check("SQL 1 제출 코드 (ORDER BY 뒤 ASC 생략 = 오름차순)", load("./animal-id-name.sql"), "A002|체리, A120|NULL, A350|보리, A900|누리");

check("SQL 2 제출 코드 — 세단 3번이 10월에 세 번 빌려져 세 줄로 나온다", load("./rented-sedans-submitted.sql"), "3, 3, 3, 1");
check("SQL 2 정답 풀이 (DISTINCT) — 차 ID 가 한 번씩만", load("./rented-sedans-answer.sql"), "3, 1");
check("같은 결과를 GROUP BY 로도 — 집계 없이 목록만이면 DISTINCT 가 더 읽기 쉽다",
      "SELECT H.CAR_ID FROM CAR_RENTAL_COMPANY_CAR C JOIN CAR_RENTAL_COMPANY_RENTAL_HISTORY H ON C.CAR_ID = H.CAR_ID WHERE C.CAR_TYPE = '세단' AND MONTH(H.START_DATE) = 10 GROUP BY H.CAR_ID ORDER BY H.CAR_ID DESC",
      "3, 1");
check("GROUP BY 는 집계가 필요할 때 — 차마다 10월에 몇 번 빌렸나",
      "SELECT H.CAR_ID, COUNT(*) FROM CAR_RENTAL_COMPANY_CAR C JOIN CAR_RENTAL_COMPANY_RENTAL_HISTORY H ON C.CAR_ID = H.CAR_ID WHERE C.CAR_TYPE = '세단' AND MONTH(H.START_DATE) = 10 GROUP BY H.CAR_ID ORDER BY H.CAR_ID DESC",
      "3|3, 1|1");
check("1:N 조인은 행을 늘린다 — 세단 3번 한 대가 조인 뒤에는 세 줄",
      "SELECT COUNT(*) FROM CAR_RENTAL_COMPANY_CAR C JOIN CAR_RENTAL_COMPANY_RENTAL_HISTORY H ON C.CAR_ID = H.CAR_ID WHERE C.CAR_ID = 3",
      "3");
check("시작일 기준이라 9월에 시작해 10월에 끝난 세단 4번은 빠진다",
      "SELECT COUNT(*) FROM CAR_RENTAL_COMPANY_RENTAL_HISTORY WHERE CAR_ID = 4 AND MONTH(START_DATE) = 10", "0");

console.log(`\n모두 통과 (${n}개) — SQLite ${db.prepare("select sqlite_version() v").get().v}, 메모리 DB. 프로그래머스 채점이 아니다.`);
