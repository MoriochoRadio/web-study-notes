// 19회차 SQL 두 문제를 Node 내장 SQLite(메모리 DB)로 확인한다.   실행: node verify-sql19.mjs
//
// 왜 SQLite 인가 — 로컬 MariaDB 접속 정보를 쓰지 않고 누구나 바로 돌릴 수 있게 하려는 것이다.
// 여기서 확인하는 문법(<>, IS NULL, RIGHT/LEFT JOIN, NOT EXISTS, ORDER BY)과 NULL 비교 규칙은
// MySQL·MariaDB와 같다. 대소문자 비교·문자셋처럼 DB마다 다른 부분은 검사하지 않는다.
import { DatabaseSync } from "node:sqlite";
import { readFileSync } from "node:fs";

const db = new DatabaseSync(":memory:");
db.exec(`
  CREATE TABLE ANIMAL_INS (ANIMAL_ID TEXT NOT NULL, NAME TEXT, INTAKE_CONDITION TEXT, DATETIME TEXT NOT NULL);
  CREATE TABLE ANIMAL_OUTS (ANIMAL_ID TEXT NOT NULL, NAME TEXT, DATETIME TEXT NOT NULL);
  INSERT INTO ANIMAL_INS VALUES
    ('A300', '보리',  'Normal', '2026-09-01 10:00'),
    ('A100', NULL,    'Sick',   '2026-09-02 10:00'),  -- 이름 없음, 하지만 Aged 아님 → 어린 동물 결과에 나와야 함
    ('A200', '체리',  'Aged',   '2026-09-03 10:00'),  -- Aged → 제외
    ('A400', '두부',  'Injured','2026-09-04 10:00'),
    ('A500', '콩이',  NULL,     '2026-09-05 10:00');  -- 실제 문제에선 NOT NULL. <> 가 NULL 을 어떻게 다루는지 보려고 넣음
  INSERT INTO ANIMAL_OUTS VALUES
    ('A300', '보리', '2026-09-10 10:00'),
    ('A900', '누리', '2026-09-11 10:00'),   -- INS 에 없음 → 없어진 기록
    ('A700', '해피', '2026-09-12 10:00'),   -- INS 에 없음 → 없어진 기록
    ('A400', '두부', '2026-09-13 10:00');
`);

const rows = (sql) => db.prepare(sql).all().map(r => Object.values(r).map(v => v ?? "NULL").join("|")).join(", ");
const stripComments = (s) => s.split("\n").filter(l => !l.trim().startsWith("--")).join("\n");
let n = 0;
function check(label, sql, want) {
  const got = rows(sql);
  if (got !== want) throw new Error(`${label}\n  기대: ${want}\n  실제: ${got}`);
  console.log(`통과 ${++n}. ${label}\n        → ${got || "(0행)"}`);
}

// ── SQL 1: 제출 코드를 파일에서 그대로 읽어 실행 ──
const sql1 = stripComments(readFileSync(new URL("./intake-not-aged.sql", import.meta.url), "utf8"));
check("제출 SQL 1 (INTAKE_CONDITION <> 'Aged', ID순)", sql1, "A100|NULL, A300|보리, A400|두부");
check("<> 'Aged' 는 INTAKE_CONDITION 이 NULL 인 A500 도 빼 버린다", 
      "SELECT COUNT(*) FROM ANIMAL_INS WHERE INTAKE_CONDITION <> 'Aged'", "3");
check("NULL 까지 살리려면 조건을 따로 적어야 한다",
      "SELECT ANIMAL_ID FROM ANIMAL_INS WHERE INTAKE_CONDITION <> 'Aged' OR INTAKE_CONDITION IS NULL ORDER BY ANIMAL_ID",
      "A100, A300, A400, A500");
check("(비교) 문서 제목대로 '이름이 있는 동물의 아이디'였다면 — NAME IS NOT NULL, ID만",
      "SELECT ANIMAL_ID FROM ANIMAL_INS WHERE NAME IS NOT NULL ORDER BY ANIMAL_ID",
      "A200, A300, A400, A500");

// ── SQL 2: 없어진 기록 찾기 ──
const sql2 = stripComments(readFileSync(new URL("./missing-intake-records.sql", import.meta.url), "utf8"));
check("제출 SQL 2 (RIGHT JOIN + IS NULL)", sql2, "A700|해피, A900|누리");
check("같은 뜻의 LEFT JOIN (OUTS 를 왼쪽에)",
      "SELECT O.ANIMAL_ID, O.NAME FROM ANIMAL_OUTS O LEFT JOIN ANIMAL_INS I ON I.ANIMAL_ID = O.ANIMAL_ID WHERE I.ANIMAL_ID IS NULL ORDER BY O.ANIMAL_ID",
      "A700|해피, A900|누리");
check("같은 뜻의 NOT EXISTS",
      "SELECT O.ANIMAL_ID, O.NAME FROM ANIMAL_OUTS O WHERE NOT EXISTS (SELECT 1 FROM ANIMAL_INS I WHERE I.ANIMAL_ID = O.ANIMAL_ID) ORDER BY O.ANIMAL_ID",
      "A700|해피, A900|누리");
check("INNER JOIN 으로는 찾을 수 없다 — 짝이 없는 행이 처음부터 빠진다",
      "SELECT COUNT(*) FROM ANIMAL_INS I JOIN ANIMAL_OUTS O ON I.ANIMAL_ID = O.ANIMAL_ID WHERE I.ANIMAL_ID IS NULL", "0");
check("SELECT 를 I 쪽 컬럼으로 쓰면 전부 NULL 이 나온다 — 그래서 O 쪽을 골라야 한다",
      "SELECT I.ANIMAL_ID, I.NAME FROM ANIMAL_INS I RIGHT JOIN ANIMAL_OUTS O ON I.ANIMAL_ID = O.ANIMAL_ID WHERE I.ANIMAL_ID IS NULL ORDER BY O.ANIMAL_ID",
      "NULL|NULL, NULL|NULL");
check("RIGHT JOIN 의 원래 모습 — 짝이 없는 행의 I 쪽이 NULL 로 채워진다",
      // 두 컬럼 이름이 같으면 결과 객체에서 하나가 덮어써진다 — 별칭으로 구분한다 (조인에서 별칭이 필요한 또 다른 이유)
      "SELECT O.ANIMAL_ID AS OUT_ID, I.ANIMAL_ID AS IN_ID FROM ANIMAL_INS I RIGHT JOIN ANIMAL_OUTS O ON I.ANIMAL_ID = O.ANIMAL_ID ORDER BY O.ANIMAL_ID",
      "A300|A300, A400|A400, A700|NULL, A900|NULL");

console.log(`\n모두 통과 (${n}개) — SQLite ${db.prepare("select sqlite_version() v").get().v}, 메모리 DB. 프로그래머스 채점이 아니다.`);
