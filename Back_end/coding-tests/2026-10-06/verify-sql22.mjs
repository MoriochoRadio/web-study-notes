// 22회차 SQL 을 Node 내장 SQLite(메모리 DB)로 확인한다.   실행: node verify-sql22.mjs
//
// 로컬 MariaDB 접속 정보를 쓰지 않고 누구나 바로 돌릴 수 있게 SQLite 를 쓴다.
// SQLite 에는 YEAR()·MONTH() 가 없어 같은 이름의 함수를 등록했다. 다만 SQLite 는 문자열 '01' 과
// 숫자 1 을 같은 값으로 보지 않는다(MySQL 은 '01' 을 숫자로 바꿔 1 과 같다고 본다). 제출 SQL 이
// MONTH(...) = '01' 처럼 문자열과 비교하므로, 등록한 함수는 MySQL 의 비교 결과와 같아지도록
// 'YYYY' · 'MM' 두 자리 문자열을 돌려준다. 제출 SQL 은 한 글자도 바꾸지 않는다.
import { DatabaseSync } from "node:sqlite";
import { readFileSync } from "node:fs";

const db = new DatabaseSync(":memory:");
db.function("YEAR", { deterministic: true }, (d) => (d == null ? null : String(d).slice(0, 4)));
db.function("MONTH", { deterministic: true }, (d) => (d == null ? null : String(d).slice(5, 7)));
db.exec(`
  CREATE TABLE ANIMAL_INS (ANIMAL_ID TEXT, NAME TEXT, DATETIME TEXT);
  INSERT INTO ANIMAL_INS VALUES
    ('A350', 'Lucy',  '2014-03-01 10:00:00'),
    ('A120', 'Bella', '2015-07-09 12:00:00'),
    ('A900', 'Jack',  '2013-10-14 15:38:00'),   -- 가장 먼저 들어온 동물
    ('A002', 'Max',   '2016-01-01 08:00:00');   -- 가장 최근

  CREATE TABLE BOOK (BOOK_ID INTEGER PRIMARY KEY, CATEGORY TEXT, PRICE INTEGER);
  CREATE TABLE BOOK_SALES (BOOK_ID INTEGER, SALES_DATE TEXT, SALES INTEGER);
  INSERT INTO BOOK VALUES (1,'인문',10000), (2,'경제',20000), (3,'경제',15000), (4,'생활',9000);
  INSERT INTO BOOK_SALES VALUES
    (1,'2022-01-01',2), (1,'2022-01-15',3),     -- 인문 1월 5권
    (2,'2022-01-05',1), (3,'2022-01-30',4),     -- 경제 1월 5권 (두 책 합산)
    (2,'2022-02-01',7),                          -- 2월 → 제외
    (4,'2021-01-10',9),                          -- 2021년 1월 → 제외
    (4,'2022-01-20',1);                          -- 생활 1월 1권
`);

const rows = (sql) => db.prepare(sql).all().map(r => Object.values(r).map(v => v ?? "NULL").join("|")).join(", ");
const load = (f) => readFileSync(new URL(f, import.meta.url), "utf8").split("\n").filter(l => !l.trim().startsWith("--")).join("\n");
let n = 0;
function check(label, sql, want) {
  const got = rows(sql);
  if (got !== want) throw new Error(`${label}\n  기대: ${want}\n  실제: ${got}`);
  console.log(`통과 ${++n}. ${label}\n        → ${got || "(0행)"}`);
}

check("SQL 1 정답 풀이 — 보호 시작일이 가장 이른 동물 이름 하나", load("./top-n-answer.sql"), "Jack");
check("ORDER BY 를 빼면 '가장 먼저'가 보장되지 않는다 — 정렬 없이 LIMIT 1 은 저장 순서에 따른 아무 한 행",
      "SELECT NAME FROM ANIMAL_INS LIMIT 1", "Lucy");
check("DESC 로 정렬하면 반대 — 가장 최근에 들어온 동물", "SELECT NAME FROM ANIMAL_INS ORDER BY DATETIME DESC LIMIT 1", "Max");

check("SQL 2 제출 코드 — 2022년 1월만, 카테고리별 판매량 합계, 카테고리 오름차순", load("./book-sales-submitted.sql"), "경제|5, 생활|1, 인문|5");
check("COUNT(*) 로 바꾸면 판매 '건수'가 된다 — 경제 2건·생활 1건·인문 2건",
      "SELECT B.CATEGORY, COUNT(*) FROM BOOK B JOIN BOOK_SALES S ON B.BOOK_ID = S.BOOK_ID WHERE S.SALES_DATE LIKE '2022-01%' GROUP BY B.CATEGORY ORDER BY B.CATEGORY",
      "경제|2, 생활|1, 인문|2");
check("같은 결과를 LIKE 로", "SELECT B.CATEGORY, SUM(S.SALES) FROM BOOK B JOIN BOOK_SALES S ON B.BOOK_ID = S.BOOK_ID WHERE S.SALES_DATE LIKE '2022-01%' GROUP BY B.CATEGORY ORDER BY B.CATEGORY",
      "경제|5, 생활|1, 인문|5");
check("같은 결과를 범위 비교로 (컬럼을 함수로 감싸지 않아 인덱스를 쓸 수 있는 형태)",
      "SELECT B.CATEGORY, SUM(S.SALES) FROM BOOK B JOIN BOOK_SALES S ON B.BOOK_ID = S.BOOK_ID WHERE S.SALES_DATE >= '2022-01-01' AND S.SALES_DATE < '2022-02-01' GROUP BY B.CATEGORY ORDER BY B.CATEGORY",
      "경제|5, 생활|1, 인문|5");
check("WHERE 가 GROUP BY 보다 먼저 — 2월·2021년 판매는 묶기 전에 빠진다(조건 없이 묶으면 경제 12·생활 10)",
      "SELECT B.CATEGORY, SUM(S.SALES) FROM BOOK B JOIN BOOK_SALES S ON B.BOOK_ID = S.BOOK_ID GROUP BY B.CATEGORY ORDER BY B.CATEGORY",
      "경제|12, 생활|10, 인문|5");

console.log(`\n모두 통과 (${n}개) — SQLite ${db.prepare("select sqlite_version() v").get().v}, 메모리 DB. 프로그래머스 채점이 아니다.`);
