// 21회차 SQL 을 Node 내장 SQLite(메모리 DB)로 확인한다.   실행: node verify-sql21.mjs
//
// 로컬 MariaDB 접속 정보를 쓰지 않고 누구나 바로 돌릴 수 있게 SQLite 를 쓴다.
// SQLite 의 CONCAT 은 NULL 을 빈 문자열로 치지만 MySQL 의 CONCAT 은 인자 하나라도 NULL 이면 NULL 이다.
// 제출 SQL 을 한 글자도 바꾸지 않고 MySQL 규칙대로 돌리려고 같은 이름의 CONCAT 을 다시 등록했다.
// CONCAT_WS(NULL 은 건너뜀) · SUBSTR(1부터 셈) · GROUP BY · HAVING 은 MySQL 과 같은 규칙이다.
import { DatabaseSync } from "node:sqlite";
import { readFileSync } from "node:fs";

const db = new DatabaseSync(":memory:");
db.function("CONCAT", { varargs: true, deterministic: true },
  (...args) => (args.some(a => a == null) ? null : args.join("")));
db.exec(`
  CREATE TABLE ANIMAL_INS (ANIMAL_ID TEXT, NAME TEXT, DATETIME TEXT);
  INSERT INTO ANIMAL_INS VALUES
    ('A350', 'Lucy', '2014-03-01 10:00:00'),
    ('A120', 'Bella', '2015-07-09 12:00:00'),
    ('A900', 'Lucy', '2017-11-21 09:00:00'),   -- 이름이 같으면 보호 시작이 늦은 쪽(나중)이 먼저
    ('A002', 'Bella', '2013-01-01 08:00:00');

  CREATE TABLE USED_GOODS_USER (USER_ID TEXT PRIMARY KEY, NICKNAME TEXT, CITY TEXT,
    STREET_ADDRESS1 TEXT, STREET_ADDRESS2 TEXT, TLNO TEXT);
  CREATE TABLE USED_GOODS_BOARD (BOARD_ID TEXT PRIMARY KEY, WRITER_ID TEXT, TITLE TEXT);
  INSERT INTO USED_GOODS_USER VALUES
    ('dhfkzmf09', '찐찐', '성남시', '분당구 수내로 13', 'A동 1107호', '01053422914'),
    ('dlPcks90',  '썹썹', '성남시', '분당구 수내로 74', '401호',      '01034573944'),
    ('user011',   '엘사', '서울시', '강남구 테헤란로 1', '101호',     '01198765432'),  -- 011 로 시작하는 번호
    ('noaddr2',   '널',   '서울시', '종로구 종로 1',     NULL,         '01011112222'),  -- 상세 주소 없음
    ('few',       '적음', '서울시', '중구 1',            '1호',        '01099998888');  -- 글 2개 → 제외
  INSERT INTO USED_GOODS_BOARD VALUES
    ('B1','dhfkzmf09','a'),('B2','dhfkzmf09','b'),('B3','dhfkzmf09','c'),('B4','dhfkzmf09','d'),
    ('B5','dlPcks90','a'),('B6','dlPcks90','b'),('B7','dlPcks90','c'),
    ('B8','user011','a'),('B9','user011','b'),('B10','user011','c'),
    ('B11','noaddr2','a'),('B12','noaddr2','b'),('B13','noaddr2','c'),
    ('B14','few','a'),('B15','few','b');
`);

const rows = (sql) => db.prepare(sql).all().map(r => Object.values(r).map(v => v ?? "NULL").join("|")).join(", ");
const load = (f) => readFileSync(new URL(f, import.meta.url), "utf8").split("\n").filter(l => !l.trim().startsWith("--")).join("\n");
let n = 0;
function check(label, sql, want) {
  const got = rows(sql);
  if (got !== want) throw new Error(`${label}\n  기대: ${want}\n  실제: ${got}`);
  console.log(`통과 ${++n}. ${label}\n        → ${got || "(0행)"}`);
}

check("SQL 1 제출 코드 — 이름 오름차순, 같은 이름이면 보호 시작이 나중인 쪽이 먼저", load("./multi-sort.sql"),
  "A120|Bella|2015-07-09 12:00:00, A002|Bella|2013-01-01 08:00:00, A900|Lucy|2017-11-21 09:00:00, A350|Lucy|2014-03-01 10:00:00");

const sub = load("./user-info-submitted.sql"), ans = load("./user-info-answer.sql");
check("SQL 2 제출 코드 — 011 번호도 010 으로 찍히고, 상세 주소가 NULL 이면 주소 전체가 NULL", sub,
  "user011|엘사|서울시 강남구 테헤란로 1 101호|010-9876-5432, noaddr2|널|NULL|010-1111-2222, dlPcks90|썹썹|성남시 분당구 수내로 74 401호|010-3457-3944, dhfkzmf09|찐찐|성남시 분당구 수내로 13 A동 1107호|010-5342-2914");
check("SQL 2 정답 풀이 — 앞 세 자리를 TLNO 에서 잘라 오고, CONCAT_WS 는 NULL 을 건너뛴다", ans,
  "user011|엘사|서울시 강남구 테헤란로 1 101호|011-9876-5432, noaddr2|널|서울시 종로구 종로 1|010-1111-2222, dlPcks90|썹썹|성남시 분당구 수내로 74 401호|010-3457-3944, dhfkzmf09|찐찐|성남시 분당구 수내로 13 A동 1107호|010-5342-2914");
check("고르는 사람(글 3개 이상)은 두 방식이 같다 — WHERE IN 서브쿼리 + DISTINCT = JOIN + GROUP BY + HAVING",
  "SELECT DISTINCT U.USER_ID FROM USED_GOODS_BOARD G JOIN USED_GOODS_USER U ON G.WRITER_ID = U.USER_ID WHERE G.WRITER_ID IN (SELECT WRITER_ID FROM USED_GOODS_BOARD GROUP BY WRITER_ID HAVING COUNT(*) >= 3) ORDER BY U.USER_ID DESC",
  rows("SELECT U.USER_ID FROM USED_GOODS_USER U JOIN USED_GOODS_BOARD B ON U.USER_ID = B.WRITER_ID GROUP BY U.USER_ID HAVING COUNT(*) >= 3 ORDER BY U.USER_ID DESC"));
check("DISTINCT 를 빼면 글 수만큼 같은 사람이 여러 줄", 
  "SELECT U.USER_ID FROM USED_GOODS_BOARD G JOIN USED_GOODS_USER U ON G.WRITER_ID = U.USER_ID WHERE U.USER_ID = 'dhfkzmf09'", "dhfkzmf09, dhfkzmf09, dhfkzmf09, dhfkzmf09");
check("CONCAT(MySQL 규칙)은 NULL 하나에 전체가 NULL, CONCAT_WS 는 NULL 을 건너뜀",
  "SELECT CONCAT('a', ' ', NULL) AS c, CONCAT_WS(' ', 'a', NULL, 'b') AS w", "NULL|a b");
check("SUBSTR 은 1부터 센다 — 01198765432 의 1~3 / 4~7 / 8~11번째 글자",
  "SELECT SUBSTR('01198765432',1,3), SUBSTR('01198765432',4,4), SUBSTR('01198765432',8,4)", "011|9876|5432");
check("WHERE 에는 집계 함수를 쓸 수 없다 — HAVING 으로 그룹을 거른다",
  "SELECT WRITER_ID, COUNT(*) FROM USED_GOODS_BOARD GROUP BY WRITER_ID HAVING COUNT(*) < 3", "few|2");

console.log(`\n모두 통과 (${n}개) — SQLite ${db.prepare("select sqlite_version() v").get().v}, 메모리 DB. 프로그래머스 채점이 아니다.`);
