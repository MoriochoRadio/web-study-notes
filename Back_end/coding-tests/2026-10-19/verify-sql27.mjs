// 27회차 SQL 을 Node 내장 SQLite(메모리 DB)로 확인한다.   실행: node verify-sql27.mjs
//
// 로컬 MariaDB 접속 정보를 쓰지 않고 누구나 바로 돌릴 수 있게 SQLite 를 쓴다. COALESCE · IFNULL 은 SQLite 에도 있다.
// 정답 풀이 SQL 은 한 글자도 바꾸지 않는다. 앞 10행은 프로그래머스 문제 예시, 뒤 3행은 검증용으로 더한 것이다(채점 데이터가 아님).
import { DatabaseSync } from "node:sqlite";
import { readFileSync } from "node:fs";

const db = new DatabaseSync(":memory:");
db.exec(`
  CREATE TABLE PATIENT (PT_NO TEXT NOT NULL, PT_NAME TEXT NOT NULL, GEND_CD TEXT NOT NULL, AGE INTEGER NOT NULL, TLNO TEXT);
  INSERT INTO PATIENT VALUES
    ('PT22000003', '브라운', 'M', 18, '01031246641'),
    ('PT22000004', '크롱',   'M',  7, NULL),
    ('PT22000006', '뽀뽀',   'W',  8, NULL),
    ('PT22000009', '한나',   'W', 12, '01032323117'),
    ('PT22000012', '뿡뿡이', 'M',  5, NULL),
    ('PT22000013', '크리스', 'M', 30, '01059341192'),
    ('PT22000014', '토프',   'W', 22, '01039458213'),
    ('PT22000018', '안나',   'W', 11, NULL),
    ('PT22000019', '바라',   'W', 10, '01079068799'),
    ('PT22000021', '릴로',   'W', 33, '01023290767');
`);
const rows = (sql) => db.prepare(sql).all().map(r => Object.values(r).map(v => v ?? "NULL").join("|")).join(", ");
const load = (f) => readFileSync(new URL(f, import.meta.url), "utf8").split("\n").filter(l => !l.trim().startsWith("--")).join("\n");
let n = 0;
function check(label, sql, want) {
  const got = rows(sql);
  if (got !== want) throw new Error(`${label}\n  기대: ${want}\n  실제: ${got}`);
  console.log(`통과 ${++n}. ${label}\n        → ${got || "(0행)"}`);
}
const answer = load("./patient-girls-12-answer.sql");

check("정답 풀이 — 문제 예시 10행: 프로그래머스 예시 출력과 같은 4행",
  answer, "한나|PT22000009|W|12|01032323117, 안나|PT22000018|W|11|NONE, 바라|PT22000019|W|10|01079068799, 뽀뽀|PT22000006|W|8|NONE");

db.exec(`INSERT INTO PATIENT VALUES
  ('PT22000030', '가람', 'W', 12, NULL),            -- 한나와 나이가 같다 → 이름 오름차순(가람 → 한나)
  ('PT22000031', '나래', 'W', 13, '01000000013'),   -- 13세 → 빠져야 한다
  ('PT22000032', '다온', 'M', 12, NULL);            -- 남자 → 빠져야 한다`);
const six = "가람|PT22000030|W|12|NONE, 한나|PT22000009|W|12|01032323117, 안나|PT22000018|W|11|NONE, 바라|PT22000019|W|10|01079068799, 뽀뽀|PT22000006|W|8|NONE";
check("정답 풀이 — 검증용 3행 추가(같은 12세 · 13세 · 12세 남자): 같은 나이는 이름 오름차순, 13세와 남자는 빠진다", answer, six);

check("IFNULL(TLNO, 'NONE') — MySQL 함수로 써도 같은 결과",
  "SELECT PT_NAME, PT_NO, GEND_CD, AGE, IFNULL(TLNO, 'NONE') AS TLNO FROM PATIENT WHERE AGE <= 12 AND GEND_CD = 'W' ORDER BY AGE DESC, PT_NAME ASC", six);
check("CASE WHEN TLNO IS NULL THEN 'NONE' ELSE TLNO END — 함수 없이 써도 같은 결과",
  "SELECT PT_NAME, PT_NO, GEND_CD, AGE, CASE WHEN TLNO IS NULL THEN 'NONE' ELSE TLNO END AS TLNO FROM PATIENT WHERE AGE <= 12 AND GEND_CD = 'W' ORDER BY AGE DESC, PT_NAME ASC", six);
check("틀린 방법 ① NULL 을 바꾸지 않으면 — 전화번호 칸이 NULL 로 남는다",
  "SELECT PT_NAME, TLNO FROM PATIENT WHERE AGE <= 12 AND GEND_CD = 'W' ORDER BY AGE DESC, PT_NAME ASC",
  "가람|NULL, 한나|01032323117, 안나|NULL, 바라|01079068799, 뽀뽀|NULL");
check("틀린 방법 ② TLNO = NULL 로 비교하면 — NULL 은 = 로 같다고 나오지 않아 0행",
  "SELECT PT_NAME FROM PATIENT WHERE TLNO = NULL", "");
check("  IS NULL 로 비교해야 한다 — 전화번호 없는 사람 6명(남녀 · 나이 무관)",
  "SELECT PT_NAME FROM PATIENT WHERE TLNO IS NULL ORDER BY PT_NAME", "가람, 다온, 뽀뽀, 뿡뿡이, 안나, 크롱");
check("틀린 방법 ③ AGE < 12 로 쓰면 — 12세(가람 · 한나)가 빠진다",
  "SELECT PT_NAME FROM PATIENT WHERE AGE < 12 AND GEND_CD = 'W' ORDER BY AGE DESC, PT_NAME ASC", "안나, 바라, 뽀뽀");
check("틀린 방법 ④ ORDER BY AGE, PT_NAME DESC — 앞 기준이 오름차순이 되어 순서가 뒤집힌다",
  "SELECT PT_NAME FROM PATIENT WHERE AGE <= 12 AND GEND_CD = 'W' ORDER BY AGE, PT_NAME DESC", "뽀뽀, 바라, 안나, 한나, 가람");
check("틀린 방법 ⑤ AND 대신 OR — 12세 이하 남자와 모든 나이의 여자가 섞인다(11명)",
  "SELECT COUNT(*) FROM PATIENT WHERE AGE <= 12 OR GEND_CD = 'W'", "11");
console.log(`\n모두 ${n}개 통과 — SQLite 로컬 검증이며 프로그래머스 재채점이 아니다.`);
