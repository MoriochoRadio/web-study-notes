// 24회차 SQL 을 Node 내장 SQLite(메모리 DB)로 확인한다.   실행: node verify-sql24.mjs
//
// 로컬 MariaDB 접속 정보를 쓰지 않고 누구나 바로 돌릴 수 있게 SQLite 를 쓴다.
// 날짜는 'YYYY-MM-DD' 문자열로 넣었다. 이 형식은 글자 순서가 곧 날짜 순서라 BETWEEN 이 MySQL 의 DATE 비교와
// 같은 결과를 낸다. SQLite 에는 MySQL 의 MONTH() 가 없어서 같은 일을 하는 함수를 등록했다.
// 제출 SQL·정답 풀이 SQL 은 한 글자도 바꾸지 않는다.
import { DatabaseSync } from "node:sqlite";
import { readFileSync } from "node:fs";

const db = new DatabaseSync(":memory:");
db.function("MONTH", (d) => Number(String(d).slice(5, 7)));   // MySQL MONTH('2022-08-15') → 8

db.exec(`
  CREATE TABLE FOOD_FACTORY (FACTORY_ID TEXT, FACTORY_NAME TEXT, ADDRESS TEXT, TLNO TEXT);
  INSERT INTO FOOD_FACTORY VALUES
    ('FT19980003', '(주)맛있는라면',   '강원도 정선군 남면 칠현로 679', '033-431-3122'),
    ('FT19980004', '(주)맛있는기름',   '경기도 평택시 포승읍 포승공단순환로 245', '031-651-2410'),
    ('FT20010001', '(주)맛있는소스',   '경상북도 구미시 1공단로7길 58-11', '054-231-2121'),
    ('FT20010002', '(주)맛있는통조림', '전라남도 영암군 미암면 곤미현로 1336', '061-341-5210'),
    ('FT20100001', '(주)맛있는차',     '전라남도 장성군 서삼면 장산리 233-1번지', '061-661-1420'),
    ('FT20100002', '(주)맛있는김치',   '충청남도 아산시 탕정면 탕정면로 485', '041-241-5421'),
    ('FT20100003', '(주)맛있는음료',   '강원도 원주시 문막읍 문막공단길 154', '033-232-7630'),
    ('FT20100004', '(주)맛있는국',     '강원도 평창군 봉평면 진조길 227-35', '033-323-6640'),
    ('FT20110001', '(주)맛있는밥',     '경기도 화성시 경기동로 461', '031-463-7051'),
    ('FT20110002', '(주)맛있는과자',   '광주광역시 북구 하서로 222', '062-211-7759');

  CREATE TABLE CAR_RENTAL_COMPANY_RENTAL_HISTORY (HISTORY_ID INTEGER, CAR_ID INTEGER, START_DATE TEXT, END_DATE TEXT);
  INSERT INTO CAR_RENTAL_COMPANY_RENTAL_HISTORY VALUES
    -- 1번 차: 기간(8~10월) 안에 5번 → 대상. 7월 · 11월 이력도 있다
    ( 1, 1, '2022-07-28', '2022-07-30'),
    ( 2, 1, '2022-08-02', '2022-08-03'),
    ( 3, 1, '2022-08-10', '2022-08-12'),
    ( 4, 1, '2022-09-05', '2022-09-06'),
    ( 5, 1, '2022-09-21', '2022-09-22'),
    ( 6, 1, '2022-10-31', '2022-11-02'),   -- 대여 시작일이 10/31 (BETWEEN 끝 날짜)
    ( 7, 1, '2022-11-01', '2022-11-03'),
    -- 2번 차: 기간 안에는 4번뿐 → 대상 아님. 7월 이력까지 세면 6번이 된다
    ( 8, 2, '2022-07-01', '2022-07-02'),
    ( 9, 2, '2022-07-15', '2022-07-16'),
    (10, 2, '2022-08-07', '2022-08-08'),
    (11, 2, '2022-08-20', '2022-08-21'),
    (12, 2, '2022-09-11', '2022-09-12'),
    (13, 2, '2022-10-09', '2022-10-10'),
    -- 3번 차: 9월에만 5번 → 대상. 8 · 10월은 0번이라 그 달 줄이 없어야 한다
    (14, 3, '2022-09-01', '2022-09-01'),
    (15, 3, '2022-09-08', '2022-09-09'),
    (16, 3, '2022-09-14', '2022-09-15'),
    (17, 3, '2022-09-20', '2022-09-21'),
    (18, 3, '2022-09-27', '2022-09-28'),
    -- 4번 차: 8월 1번 + 10월 4번 → 대상 (8/1 은 BETWEEN 시작 날짜)
    (19, 4, '2022-08-01', '2022-08-01'),
    (20, 4, '2022-10-03', '2022-10-04'),
    (21, 4, '2022-10-12', '2022-10-13'),
    (22, 4, '2022-10-18', '2022-10-20'),
    (23, 4, '2022-10-25', '2022-10-26');
`);

const rows = (sql) => db.prepare(sql).all().map(r => Object.values(r).map(v => v ?? "NULL").join("|")).join(", ");
const load = (f) => readFileSync(new URL(f, import.meta.url), "utf8").split("\n").filter(l => !l.trim().startsWith("--")).join("\n");
let n = 0;
function check(label, sql, want) {
  const got = rows(sql);
  if (got !== want) throw new Error(`${label}\n  기대: ${want}\n  실제: ${got}`);
  console.log(`통과 ${++n}. ${label}\n        → ${got || "(0행)"}`);
}

const factoryId = "FT19980003|(주)맛있는라면|강원도 정선군 남면 칠현로 679, FT20100003|(주)맛있는음료|강원도 원주시 문막읍 문막공단길 154, FT20100004|(주)맛있는국|강원도 평창군 봉평면 진조길 227-35";
check("SQL 1 제출 코드 — 주소에 '강원도'가 들어간 공장, FACTORY_ID 오름차순", load("./food-factory-submitted.sql"), factoryId);
check("LIKE '강원도%' (앞부분 일치)로 써도 이 데이터에서는 같은 결과",
      "SELECT FACTORY_ID, FACTORY_NAME, ADDRESS FROM FOOD_FACTORY WHERE ADDRESS LIKE '강원도%' ORDER BY FACTORY_ID", factoryId);
check("% 없이 LIKE '강원도' 로 쓰면 0행 — 와일드카드가 없으면 '주소 전체가 강원도'인지 비교하는 것과 같다",
      "SELECT FACTORY_ID FROM FOOD_FACTORY WHERE ADDRESS LIKE '강원도'", "");
check("ORDER BY 를 FACTORY_ID DESC 로 쓰면 순서가 뒤집혀 오답",
      "SELECT FACTORY_ID FROM FOOD_FACTORY WHERE ADDRESS LIKE '%강원도%' ORDER BY FACTORY_ID DESC", "FT20100004, FT20100003, FT19980003");

const monthly = "8|4|1, 8|1|2, 9|3|5, 9|1|2, 10|4|4, 10|1|1";
check("SQL 2 정답 풀이 — 기간 안 5번 이상인 차(1·3·4번)의 월별 횟수, 월 오름차순 · CAR_ID 내림차순, 0번인 달은 줄이 없다",
      load("./car-rental-monthly-answer.sql"), monthly);
check("바깥 쿼리의 기간 조건을 빼면 1번 차의 7월 · 11월 이력까지 월별로 세어진다",
      `SELECT MONTH(START_DATE) AS MONTH, CAR_ID, COUNT(*) AS RECORDS FROM CAR_RENTAL_COMPANY_RENTAL_HISTORY
       WHERE CAR_ID IN (SELECT CAR_ID FROM CAR_RENTAL_COMPANY_RENTAL_HISTORY WHERE START_DATE BETWEEN '2022-08-01' AND '2022-10-31'
                        GROUP BY CAR_ID HAVING COUNT(*) >= 5)
       GROUP BY MONTH(START_DATE), CAR_ID ORDER BY MONTH ASC, CAR_ID DESC`,
      "7|1|1, 8|4|1, 8|1|2, 9|3|5, 9|1|2, 10|4|4, 10|1|1, 11|1|1");
check("서브쿼리의 기간 조건을 빼면 기간 밖 이력까지 세어 2번 차(기간 안 4번)가 대상에 끼어든다",
      `SELECT MONTH(START_DATE) AS MONTH, CAR_ID, COUNT(*) AS RECORDS FROM CAR_RENTAL_COMPANY_RENTAL_HISTORY
       WHERE START_DATE BETWEEN '2022-08-01' AND '2022-10-31'
         AND CAR_ID IN (SELECT CAR_ID FROM CAR_RENTAL_COMPANY_RENTAL_HISTORY GROUP BY CAR_ID HAVING COUNT(*) >= 5)
       GROUP BY MONTH(START_DATE), CAR_ID ORDER BY MONTH ASC, CAR_ID DESC`,
      "8|4|1, 8|2|2, 8|1|2, 9|3|5, 9|2|1, 9|1|2, 10|4|4, 10|2|1, 10|1|1");
check("서브쿼리 없이 월별로 묶은 뒤 HAVING COUNT(*) >= 5 로 거르면 '한 달에 5번'이 되어 3번 차만 남는다",
      `SELECT MONTH(START_DATE) AS MONTH, CAR_ID, COUNT(*) AS RECORDS FROM CAR_RENTAL_COMPANY_RENTAL_HISTORY
       WHERE START_DATE BETWEEN '2022-08-01' AND '2022-10-31'
       GROUP BY MONTH(START_DATE), CAR_ID HAVING COUNT(*) >= 5 ORDER BY MONTH ASC, CAR_ID DESC`,
      "9|3|5");
check("BETWEEN 은 양 끝을 포함 — 8/1 (4번 차) · 10/31 (1번 차) 에 시작한 대여도 들어간다 (< · > 로 쓰면 빠진다)",
      `SELECT CAR_ID, START_DATE FROM CAR_RENTAL_COMPANY_RENTAL_HISTORY
       WHERE START_DATE BETWEEN '2022-08-01' AND '2022-10-31' AND START_DATE IN ('2022-08-01', '2022-10-31') ORDER BY START_DATE`,
      "4|2022-08-01, 1|2022-10-31");

console.log(`\n모두 통과 (${n}개) — SQLite ${db.prepare("select sqlite_version() v").get().v}, 메모리 DB. 프로그래머스 채점이 아니다.`);
