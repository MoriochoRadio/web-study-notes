// 25회차 SQL 을 Node 내장 SQLite(메모리 DB)로 확인한다.   실행: node verify-sql25.mjs
//
// 로컬 MariaDB 접속 정보를 쓰지 않고 누구나 바로 돌릴 수 있게 SQLite 를 쓴다.
// 여기서 쓰는 CASE WHEN · IFNULL · COALESCE · LIKE · IS NULL 은 MySQL 과 규칙이 같다.
// 제출 SQL·정답 풀이 SQL 은 한 글자도 바꾸지 않는다. 테이블 행은 검증용으로 만든 것이다(문제의 채점 데이터가 아님).
import { DatabaseSync } from "node:sqlite";
import { readFileSync } from "node:fs";

const db = new DatabaseSync(":memory:");
db.exec(`
  CREATE TABLE FOOD_WAREHOUSE (WAREHOUSE_ID TEXT, WAREHOUSE_NAME TEXT, ADDRESS TEXT, TLNO TEXT, FREEZER_YN TEXT);
  INSERT INTO FOOD_WAREHOUSE VALUES
    ('WH0001', '창고_경기1', '경기도 안산시 상록구 용담로 141',  '031-152-1332', 'Y'),
    ('WH0002', '창고_충북1', '충청북도 진천군 진천읍 씨씨또길 870', '043-623-9900', 'Y'),
    ('WH0003', '창고_경기2', '경기도 이천시 마장면 서이천로 483', '031-221-7241', NULL),
    ('WH0004', '창고_서울1', '서울특별시 강남구 테헤란로 12',    '02-541-7113',  'N'),
    ('WH0005', '창고_경기3', '경기도 김포시 대곶면 율생중앙로205', '031-221-7241', 'N'),
    ('WH0006', '창고_강원1', '강원도 원주시 문막읍 문막공단길 154', NULL,          NULL),
    ('WH0007', '창고_경기4', '경기도 용인시 처인구 남사읍 통삼로 16', NULL,          'Y');

  CREATE TABLE ECOLI_DATA (ID INTEGER, PARENT_ID INTEGER, SIZE_OF_COLONY INTEGER, DIFFERENTIATION_DATE TEXT, GENOTYPE INTEGER);
  INSERT INTO ECOLI_DATA VALUES
    (1, NULL,   17, '2019-01-01', 5),
    (2, NULL,  100, '2019-01-02', 3),   -- 경계: 100 은 LOW
    (3,    1,  101, '2020-01-01', 4),   -- 경계: 101 은 MEDIUM
    (4,    2, 1000, '2022-01-02', 4),   -- 경계: 1000 은 MEDIUM
    (5,    2, 1001, '2022-01-03', 2),   -- 경계: 1001 은 HIGH
    (6,    4, 1250, '2022-03-03', 1),
    (7,    3,  520, '2023-02-01', 6);
`);

const rows = (sql) => db.prepare(sql).all().map(r => Object.values(r).map(v => v ?? "NULL").join("|")).join(", ");
const load = (f) => readFileSync(new URL(f, import.meta.url), "utf8").split("\n").filter(l => !l.trim().startsWith("--")).join("\n");
let n = 0;
function check(label, sql, want) {
  const got = rows(sql);
  if (got !== want) throw new Error(`${label}\n  기대: ${want}\n  실제: ${got}`);
  console.log(`통과 ${++n}. ${label}\n        → ${got || "(0행)"}`);
}
const only = (sql) => rows(sql).split(", ").map(r => r.split("|").at(-1)).join(" ");   // 마지막 칸만

// ---------- 경기도에 위치한 식품창고 ----------
const wh = "WH0001|창고_경기1|경기도 안산시 상록구 용담로 141|Y, WH0003|창고_경기2|경기도 이천시 마장면 서이천로 483|N, "
         + "WH0005|창고_경기3|경기도 김포시 대곶면 율생중앙로205|N, WH0007|창고_경기4|경기도 용인시 처인구 남사읍 통삼로 16|Y";
check("SQL 1 정답 풀이(CASE WHEN … ELSE FREEZER_YN) — 경기도 창고 4곳, NULL 은 'N'", load("./food-warehouse-answer.sql"), wh);
check("SQL 1 정답 풀이(IFNULL) — 같은 결과", load("./food-warehouse-answer-ifnull.sql"), wh);
check("COALESCE(FREEZER_YN, 'N') — 같은 결과",
      "SELECT WAREHOUSE_ID, WAREHOUSE_NAME, ADDRESS, COALESCE(FREEZER_YN, 'N') AS FREEZER_YN FROM FOOD_WAREHOUSE WHERE ADDRESS LIKE '경기도%' ORDER BY WAREHOUSE_ID", wh);
check("틀린 방법 ① CASE 에서 ELSE 를 빼면 — 원래 Y · N 이던 칸이 모두 NULL",
      "SELECT WAREHOUSE_ID, CASE WHEN FREEZER_YN IS NULL THEN 'N' END AS FREEZER_YN FROM FOOD_WAREHOUSE WHERE ADDRESS LIKE '경기도%' ORDER BY WAREHOUSE_ID",
      "WH0001|NULL, WH0003|N, WH0005|NULL, WH0007|NULL");
check("틀린 방법 ② WHEN FREEZER_YN = NULL — 어떤 행에서도 참이 아니라 NULL 이 그대로 남는다",
      "SELECT WAREHOUSE_ID, CASE WHEN FREEZER_YN = NULL THEN 'N' ELSE FREEZER_YN END AS FREEZER_YN FROM FOOD_WAREHOUSE WHERE ADDRESS LIKE '경기도%' ORDER BY WAREHOUSE_ID",
      "WH0001|Y, WH0003|NULL, WH0005|N, WH0007|Y");
// 틀린 방법 ③ 별칭을 빼면 결과 열 이름이 FREEZER_YN 이 아니라 식 그대로가 된다 (뷰를 만들어 열 이름을 읽는다)
db.exec("CREATE VIEW no_alias AS SELECT WAREHOUSE_ID, IFNULL(FREEZER_YN, 'N') FROM FOOD_WAREHOUSE");
check("틀린 방법 ③ AS FREEZER_YN 을 빼면 — 결과 열 이름이 식 그대로",
      "SELECT name FROM pragma_table_info('no_alias')", "WAREHOUSE_ID, IFNULL(FREEZER_YN, 'N')");
check("TLNO = NULL 은 0행, TLNO IS NULL 은 전화번호 없는 2행 (= NULL 은 늘 UNKNOWN)",
      "SELECT COUNT(*) FROM FOOD_WAREHOUSE WHERE TLNO = NULL UNION ALL SELECT COUNT(*) FROM FOOD_WAREHOUSE WHERE TLNO IS NULL",
      "0, 2");

// ---------- 대장균의 크기에 따라 분류하기 1 ----------
const ecoli = "1|LOW, 2|LOW, 3|MEDIUM, 4|MEDIUM, 5|HIGH, 6|HIGH, 7|MEDIUM";
check("SQL 2 제출 코드 — 경계값 100 · 101 · 1000 · 1001 포함", load("./ecoli-size-submitted.sql"), ecoli);
check("SQL 2 정답 풀이(WHEN 은 위에서부터, ELSE 'HIGH') — 같은 결과", load("./ecoli-size-answer.sql"), ecoli);
const lt = only("SELECT ID, CASE WHEN SIZE_OF_COLONY < 100 THEN 'LOW' WHEN SIZE_OF_COLONY < 1000 THEN 'MEDIUM' ELSE 'HIGH' END FROM ECOLI_DATA ORDER BY ID");
check("틀린 방법 — <= 대신 < 를 쓰면 경계(100 · 1000)가 한 칸씩 위로",
      "SELECT ID, CASE WHEN SIZE_OF_COLONY < 100 THEN 'LOW' WHEN SIZE_OF_COLONY < 1000 THEN 'MEDIUM' ELSE 'HIGH' END AS SIZE FROM ECOLI_DATA WHERE ID IN (2, 4) ORDER BY ID",
      "2|MEDIUM, 4|HIGH");
check("WHEN 순서를 바꾸면(<= 1000 을 먼저) — 100 이하도 먼저 맞은 MEDIUM 이 된다",
      "SELECT ID, CASE WHEN SIZE_OF_COLONY <= 1000 THEN 'MEDIUM' WHEN SIZE_OF_COLONY <= 100 THEN 'LOW' ELSE 'HIGH' END AS SIZE FROM ECOLI_DATA WHERE ID IN (1, 2) ORDER BY ID",
      "1|MEDIUM, 2|MEDIUM");
console.log(`\n(참고) < 로 쓴 전체 결과: ${lt}`);
console.log(`\n모두 ${n}개 통과 — SQLite 로컬 검증이며 프로그래머스 재채점이 아니다.`);
