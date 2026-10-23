// 29회차 SQL 을 Node 내장 SQLite(메모리 DB)로 확인한다.   실행: node verify-sql29.mjs
//
// 로컬 MariaDB 접속 정보를 쓰지 않고 누구나 바로 돌릴 수 있게 SQLite 를 쓴다.
// 제출 · 정답 풀이 SQL 은 한 글자도 바꾸지 않는다. 예시 행은 프로그래머스 문제 예시, 표시한 행은 검증용으로 더한 것이다(채점 데이터가 아님).
// SQLite 의 LIKE 는 MySQL 기본 설정처럼 영문 대소문자를 구분하지 않는다. GROUP BY 에 없는 열을 SELECT 해도 오류를 내지 않는다(MySQL 의 ONLY_FULL_GROUP_BY 검사는 재현하지 않음).
import { DatabaseSync } from "node:sqlite";
import { readFileSync } from "node:fs";

const db = new DatabaseSync(":memory:");
db.exec(`
  CREATE TABLE ANIMAL_INS (ANIMAL_ID TEXT, ANIMAL_TYPE TEXT, DATETIME TEXT, INTAKE_CONDITION TEXT, NAME TEXT, SEX_UPON_INTAKE TEXT);
  INSERT INTO ANIMAL_INS VALUES
    ('A355753', 'Dog', '2015-09-10 13:14:00', 'Normal',  'Elijah',      'Neutered Male'),
    ('A352872', 'Dog', '2015-07-09 17:51:00', 'Aged',    'Peanutbutter','Neutered Male'),
    ('A353259', 'Dog', '2016-05-08 12:57:00', 'Injured', 'Bj',          'Neutered Male'),
    ('A373219', 'Cat', '2014-07-29 11:43:00', 'Normal',  'Ella',        'Spayed Female'),
    ('A382192', 'Dog', '2015-03-13 13:14:00', 'Normal',  'Maxwell 2',   'Intact Male');

  CREATE TABLE USED_GOODS_BOARD (BOARD_ID TEXT, WRITER_ID TEXT, TITLE TEXT, CONTENTS TEXT, PRICE INTEGER, CREATED_DATE TEXT, STATUS TEXT, VIEWS INTEGER);
  INSERT INTO USED_GOODS_BOARD VALUES
    ('B0001', 'zkzkdh1',   '캠핑의자',       '가벼워요 깨끗한 상태입니다. 2개',        25000,  '2022-11-29', 'SALE', 34),
    ('B0002', 'miyeon89',  '벽걸이 에어컨',   '엘지 휘센 7평',                        100000, '2022-11-29', 'SALE', 55),
    ('B0003', 'dhfkzmf09', '에어팟 맥스',     '에어팟 맥스 스카이 블루 색상 판매합니다.', 450000, '2022-11-26', 'DONE', 67),
    ('B0004', 'sangjune1', '파파야나인',      '포르쉐 푸쉬카 예민하신분은 피해주세요',   30000,  '2022-11-30', 'DONE', 78),
    ('B0005', 'zkzkdh1',   '애플워치7',       '애플워치7 실버 스텐 45미리 판매합니다.',  700000, '2022-11-30', 'DONE', 99);
  CREATE TABLE USED_GOODS_USER (USER_ID TEXT PRIMARY KEY, NICKNAME TEXT, CITY TEXT, STREET_ADDRESS1 TEXT, STREET_ADDRESS2 TEXT, TLNO TEXT);
  INSERT INTO USED_GOODS_USER VALUES
    ('cjfwls91',  '점심만금식', '성남시', '분당구 내정로 185', '501호',        '01036344964'),
    ('zkzkdh1',   '후후후',     '성남시', '분당구 내정로 35',  '가동 1202호',   '01032777543'),
    ('spdlqj12',  '크크큭',     '성남시', '분당구 수내로 206', '2019동 801호',  '01087234922'),
    ('xlqpfh2',   '잉여킹',     '성남시', '분당구 수내로 1',   '001-004',      '01064534911'),
    ('dhfkzmf09', '찐찐',       '성남시', '분당구 수내로 13',  'A동 1107호',    '01053422914');
`);
const rows = (sql) => db.prepare(sql).all().map(r => Object.values(r).map(v => v ?? "NULL").join("|")).join(", ");
const load = (f) => readFileSync(new URL(f, import.meta.url), "utf8").split("\n").filter(l => !l.trim().startsWith("--")).join("\n");
let n = 0;
function check(label, sql, want) {
  const got = rows(sql);
  if (got !== want) throw new Error(`${label}\n  기대: ${want}\n  실제: ${got}`);
  console.log(`통과 ${++n}. ${label}\n        → ${got || "(0행)"}`);
}

// ---------- 이름에 el이 들어가는 동물 찾기 ----------
const el = load("./el-animals-answer.sql");
check("SQL 1 정답 풀이 — 문제 예시 5행: 개 중 이름에 el 이 있는 Elijah · Maxwell 2 (고양이 Ella 는 빠짐)", el, "A355753|Elijah, A382192|Maxwell 2");
db.exec(`INSERT INTO ANIMAL_INS VALUES
  ('A400001', 'Dog', '2016-01-01 10:00:00', 'Normal', 'ELSA',   'Spayed Female'),  -- 대문자 EL
  ('A400000', 'Dog', '2016-01-02 10:00:00', 'Normal', 'Elijah', 'Intact Male'),    -- 같은 이름 → 아이디 순
  ('A400002', 'Dog', '2016-01-03 10:00:00', 'Normal', NULL,     'Intact Male'),    -- 이름 없음
  ('A400003', 'Dog', '2016-01-04 10:00:00', 'Normal', 'Noel',   'Intact Male')     -- 끝에 el`);
check("SQL 1 정답 풀이 — 검증용 4행 추가(대문자 ELSA · 같은 이름 Elijah 두 마리 · 이름 NULL · 끝에 el)",
  el, "A400001|ELSA, A355753|Elijah, A400000|Elijah, A382192|Maxwell 2, A400003|Noel");
check("  ↑ SQLite 의 ORDER BY 는 대소문자를 가려(대문자가 먼저) ELSA 가 앞에 온다. MySQL 기본 설정(대소문자 무시 정렬)과 같게 COLLATE NOCASE 로 정렬하면",
  "SELECT ANIMAL_ID, NAME FROM ANIMAL_INS WHERE NAME LIKE '%EL%' AND ANIMAL_TYPE = 'Dog' ORDER BY NAME COLLATE NOCASE, ANIMAL_ID", "A355753|Elijah, A400000|Elijah, A400001|ELSA, A382192|Maxwell 2, A400003|Noel");
check("  대소문자를 구분하는 비교(SQLite GLOB '*EL*')면 대문자 ELSA 만 남는다 — 구분하는 DB에서는 UPPER(NAME) LIKE '%EL%'",
  "SELECT ANIMAL_ID, NAME FROM ANIMAL_INS WHERE NAME GLOB '*EL*' AND ANIMAL_TYPE = 'Dog' ORDER BY NAME, ANIMAL_ID", "A400001|ELSA");
check("  UPPER(NAME) LIKE '%EL%' — 대소문자 구분과 상관없이 같은 결과",
  "SELECT ANIMAL_ID, NAME FROM ANIMAL_INS WHERE UPPER(NAME) LIKE '%EL%' AND ANIMAL_TYPE = 'Dog' ORDER BY NAME, ANIMAL_ID", "A400001|ELSA, A355753|Elijah, A400000|Elijah, A382192|Maxwell 2, A400003|Noel");
check("  같은 이름이 둘(Elijah) — ORDER BY NAME 만 쓰면 둘 사이 순서가 정해지지 않아 두 번째 기준 ANIMAL_ID 가 필요하다(문제 조건)",
  "SELECT COUNT(*) FROM (SELECT NAME FROM ANIMAL_INS WHERE NAME LIKE '%EL%' AND ANIMAL_TYPE = 'Dog' GROUP BY NAME HAVING COUNT(*) > 1)", "1");
check("틀린 방법 ① LIKE 'EL%' — 'el 로 시작'만 찾아 Maxwell 2 · Noel 이 빠진다",
  "SELECT ANIMAL_ID, NAME FROM ANIMAL_INS WHERE NAME LIKE 'EL%' AND ANIMAL_TYPE = 'Dog' ORDER BY NAME, ANIMAL_ID", "A400001|ELSA, A355753|Elijah, A400000|Elijah");
check("  이름이 NULL 인 개는 LIKE 가 참이 아니라 저절로 빠진다 — 개는 모두 8마리, 이름이 있는 개 7마리",
  "SELECT COUNT(*), COUNT(NAME) FROM ANIMAL_INS WHERE ANIMAL_TYPE = 'Dog'", "8|7");

// ---------- 조건에 맞는 사용자와 총 거래금액 조회하기 ----------
const mine = load("./used-goods-total-sales.sql");
const ans = load("./used-goods-total-sales-answer.sql");
check("SQL 2 제출 코드 — 문제 예시: zkzkdh1 후후후 700000 (B0001 은 SALE 이라 빠짐)", mine, "zkzkdh1|후후후|700000");
check("SQL 2 정답 풀이 — 같은 결과", ans, "zkzkdh1|후후후|700000");
db.exec(`
  INSERT INTO USED_GOODS_USER VALUES ('edge01', '딱칠십', '성남시', '-', NULL, '010'), ('edge02', '하나모자람', '성남시', '-', NULL, '010'), ('edge03', '후후후', '성남시', '-', NULL, '010');
  INSERT INTO USED_GOODS_BOARD VALUES
    ('B1001', 'edge01', 'a', 'a', 300000, '2022-12-01', 'DONE', 1), ('B1002', 'edge01', 'b', 'b', 400000, '2022-12-02', 'DONE', 1),   -- 합 정확히 700000
    ('B1003', 'edge02', 'c', 'c', 699999, '2022-12-03', 'DONE', 1), ('B1004', 'edge02', 'd', 'd', 500000, '2022-12-04', 'SALE', 1),   -- DONE 만 699999
    ('B1005', 'edge03', 'e', 'e', 800000, '2022-12-05', 'DONE', 1);   -- 닉네임이 zkzkdh1 과 같은 다른 사람`);
check("SQL 2 제출 코드 — 검증용 3명 추가(DONE 합 정확히 70만 · 69만 9,999 + 판매 중 · 같은 닉네임의 다른 사람): 70만은 포함, 판매 중은 빠짐",
  mine, "edge01|딱칠십|700000, zkzkdh1|후후후|700000, edge03|후후후|800000");
check("SQL 2 정답 풀이 — 같은 결과", ans, "edge01|딱칠십|700000, zkzkdh1|후후후|700000, edge03|후후후|800000");
check("틀린 방법 ① HAVING SUM(B.PRICE) > 700000 — '이상'인데 초과로 써서 딱 70만이 빠진다",
  "SELECT U.USER_ID, U.NICKNAME, SUM(B.PRICE) AS TOTAL_SALES FROM USED_GOODS_BOARD B JOIN USED_GOODS_USER U ON B.WRITER_ID = U.USER_ID WHERE B.STATUS = 'DONE' GROUP BY U.USER_ID, U.NICKNAME HAVING SUM(B.PRICE) > 700000 ORDER BY TOTAL_SALES", "edge03|후후후|800000");
check("틀린 방법 ② WHERE 의 STATUS = 'DONE' 을 빼면 — 판매 중 50만이 더해져 69만 9,999 인 사람이 들어온다",
  "SELECT U.USER_ID, SUM(B.PRICE) AS TOTAL_SALES FROM USED_GOODS_BOARD B JOIN USED_GOODS_USER U ON B.WRITER_ID = U.USER_ID GROUP BY U.USER_ID HAVING SUM(B.PRICE) >= 700000 ORDER BY TOTAL_SALES", "edge01|700000, zkzkdh1|725000, edge03|800000, edge02|1199999");
check("틀린 방법 ③ GROUP BY U.NICKNAME 만 — 닉네임이 같은 두 사람이 한 줄로 합쳐진다",
  "SELECT U.NICKNAME, SUM(B.PRICE) AS TOTAL_SALES FROM USED_GOODS_BOARD B JOIN USED_GOODS_USER U ON B.WRITER_ID = U.USER_ID WHERE B.STATUS = 'DONE' GROUP BY U.NICKNAME HAVING SUM(B.PRICE) >= 700000 ORDER BY TOTAL_SALES", "딱칠십|700000, 후후후|1500000");
try {
  db.prepare("SELECT WRITER_ID, SUM(PRICE) FROM USED_GOODS_BOARD WHERE STATUS = 'DONE' AND SUM(PRICE) >= 700000 GROUP BY WRITER_ID").all();
  throw new Error("WHERE 에 SUM 이 통과하면 안 된다");
} catch (e) {
  console.log(`통과 ${++n}. 틀린 방법 ④ WHERE 에 SUM(PRICE) — 묶기 전이라 집계 함수를 쓸 수 없다\n        → 오류: ${e.message}`);
}
console.log(`\n모두 ${n}개 통과 — SQLite 로컬 검증이며 프로그래머스 재채점이 아니다.`);
