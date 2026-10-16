// 26회차 SQL 을 Node 내장 SQLite(메모리 DB)로 확인한다.   실행: node verify-sql26.mjs
//
// 로컬 MariaDB 접속 정보를 쓰지 않고 누구나 바로 돌릴 수 있게 SQLite 를 쓴다(3.25+ 는 윈도우 함수 지원).
// 날짜는 'YYYY-MM-DD' 글자로 넣었고, SQLite 에 없는 MySQL DATE_FORMAT 은 쓰는 서식(%Y · %m · %d)만 같은 이름으로 등록했다.
// 제출 SQL · 정답 풀이 SQL 은 한 글자도 바꾸지 않는다. 테이블 행은 검증용으로 만든 것이다(채점 데이터가 아님).
import { DatabaseSync } from "node:sqlite";
import { readFileSync } from "node:fs";

const db = new DatabaseSync(":memory:");
db.function("DATE_FORMAT", (d, f) => String(f).replace("%Y", String(d).slice(0, 4)).replace("%m", String(d).slice(5, 7)).replace("%d", String(d).slice(8, 10)));
db.exec(`
  CREATE TABLE DOCTOR (DR_NAME TEXT, DR_ID TEXT, LCNS_NO TEXT, HIRE_YMD TEXT, MCDP_CD TEXT, TLNO TEXT);
  INSERT INTO DOCTOR VALUES
    ('루피',   'DR20090029', 'LC00010001', '2009-03-01', 'CS', '01085482011'),
    ('패티',   'DR20090001', 'LC00010901', '2009-07-01', 'CS', '01085220122'),
    ('뽀로로', 'DR20170123', 'LC00091201', '2017-03-01', 'GS', '01034969210'),
    ('티거',   'DR20100011', 'LC00011201', '2010-03-01', 'NP', '01034229818'),
    ('품바',   'DR20090231', 'LC00011302', '2015-11-01', 'OS', '01049840278'),
    ('티몬',   'DR20090112', 'LC00011162', '2010-03-01', 'FM', '01094622190'),
    ('니모',   'DR20200012', 'LC00911162', '2020-03-01', 'CS', '01089483921'),
    ('오로라', 'DR20100031', 'LC00010327', '2010-11-01', 'OS', '01098428957'),
    ('자스민', 'DR20100032', 'LC00010192', '2010-03-01', 'GS', '01023981922'),
    ('벨',     'DR20100039', 'LC00010562', '2010-07-01', 'GS', '01058390758'),
    ('가가',   'DR20200013', 'LC00911163', '2020-03-01', 'GS', '01000000000');   -- 니모와 고용일이 같다 → 이름 오름차순

  CREATE TABLE ECOLI_DATA (ID INTEGER, PARENT_ID INTEGER, SIZE_OF_COLONY INTEGER, DIFFERENTIATION_DATE TEXT, GENOTYPE INTEGER);
`);
const rows = (sql) => db.prepare(sql).all().map(r => Object.values(r).map(v => v ?? "NULL").join("|")).join(", ");
const load = (f) => readFileSync(new URL(f, import.meta.url), "utf8").split("\n").filter(l => !l.trim().startsWith("--")).join("\n");
let n = 0;
function check(label, sql, want) {
  const got = rows(sql);
  if (got !== want) throw new Error(`${label}\n  기대: ${want}\n  실제: ${got}`);
  console.log(`통과 ${++n}. ${label}\n        → ${got || "(0행)"}`);
}

// ---------- 흉부외과 또는 일반외과 ----------
const doc = "가가|DR20200013|GS|2020-03-01, 니모|DR20200012|CS|2020-03-01, 뽀로로|DR20170123|GS|2017-03-01, 벨|DR20100039|GS|2010-07-01, 자스민|DR20100032|GS|2010-03-01, 패티|DR20090001|CS|2009-07-01, 루피|DR20090029|CS|2009-03-01";
check("SQL 1 제출 코드 — CS · GS 7명, 고용일 내림차순 · 같으면 이름 오름차순(가가 → 니모)", load("./doctor-cs-gs-submitted.sql"), doc);
check("SQL 1 정답 풀이(DATE_FORMAT) — 같은 결과", load("./doctor-cs-gs-answer.sql"), doc);
check("틀린 방법 ① ORDER BY HIRE_YMD, DR_NAME DESC — 앞 기준이 오름차순이 된다",
  "SELECT DR_NAME FROM DOCTOR WHERE MCDP_CD IN ('CS','GS') ORDER BY HIRE_YMD, DR_NAME DESC", "루피, 패티, 자스민, 벨, 뽀로로, 니모, 가가");
check("틀린 방법 ② WHERE MCDP_CD = 'CS' OR MCDP_CD = 'GS' AND HIRE_YMD >= '2015-01-01' — AND가 먼저 묶여 CS는 날짜 조건을 안 받는다",
  "SELECT DR_NAME FROM DOCTOR WHERE MCDP_CD = 'CS' OR MCDP_CD = 'GS' AND HIRE_YMD >= '2015-01-01' ORDER BY HIRE_YMD DESC, DR_NAME", "가가, 니모, 뽀로로, 패티, 루피");
check("  IN 으로 쓰면 묶음이 분명하다 — CS · GS 중 2015년 이후만",
  "SELECT DR_NAME FROM DOCTOR WHERE MCDP_CD IN ('CS','GS') AND HIRE_YMD >= '2015-01-01' ORDER BY HIRE_YMD DESC, DR_NAME", "가가, 니모, 뽀로로");

// ---------- 대장균의 크기에 따라 분류하기 2 ----------
for (const total of [4, 8, 12, 20]) {
  db.exec("DELETE FROM ECOLI_DATA");
  // 크기가 모두 다른 개체 total 개, ID 와 크기 순서를 섞어 둔다
  const sizes = Array.from({ length: total }, (_, i) => (i * 37) % 997 + 10 + i);
  const ins = db.prepare("INSERT INTO ECOLI_DATA VALUES (?, NULL, ?, '2020-01-01', 1)");
  sizes.forEach((s, i) => ins.run(i + 1, s));
  // 기대값: 크기 내림차순 순위로 직접 4등분
  const order = sizes.map((s, i) => ({ id: i + 1, s })).sort((a, b) => b.s - a.s);
  const name = {}; order.forEach((o, k) => { name[o.id] = ["CRITICAL", "HIGH", "MEDIUM", "LOW"][Math.floor(k / (total / 4))]; });
  const want = Object.keys(name).map(Number).sort((a, b) => a - b).map(id => `${id}|${name[id]}`).join(", ");
  check(`SQL 2 NTILE(4) — 개체 ${total}개`, load("./ecoli-size2-ntile.sql"), want);
  check(`SQL 2 PERCENT_RANK — 개체 ${total}개`, load("./ecoli-size2-percent-rank.sql"), want);
  check(`SQL 2 CUME_DIST — 개체 ${total}개`, load("./ecoli-size2-cume-dist.sql"), want);
}
// 틀린 방법들 (개체 8개)
db.exec("DELETE FROM ECOLI_DATA");
[[1, 100], [2, 800], [3, 300], [4, 700], [5, 200], [6, 600], [7, 400], [8, 500]].forEach(([id, s]) => db.prepare("INSERT INTO ECOLI_DATA VALUES (?, NULL, ?, '2020-01-01', 1)").run(id, s));
check("틀린 방법 ③ NTILE 에서 DESC 를 빼면 — 작은 것이 CRITICAL 이 된다",
  "SELECT ID, CASE NTILE(4) OVER (ORDER BY SIZE_OF_COLONY) WHEN 1 THEN 'CRITICAL' WHEN 2 THEN 'HIGH' WHEN 3 THEN 'MEDIUM' ELSE 'LOW' END FROM ECOLI_DATA ORDER BY ID",
  "1|CRITICAL, 2|LOW, 3|HIGH, 4|LOW, 5|CRITICAL, 6|MEDIUM, 7|HIGH, 8|MEDIUM");
check("틀린 방법 ④ CUME_DIST 를 <= 대신 < 0.25 로 쓰면 — 8개 중 CRITICAL 이 2개가 아니라 1개(0.25 가 빠짐)",
  "SELECT COUNT(*) FROM (SELECT CUME_DIST() OVER (ORDER BY SIZE_OF_COLONY DESC) AS CD FROM ECOLI_DATA) WHERE CD < 0.25", "1");
check("윈도우 함수 값 그대로 보기 — 크기 내림차순으로 NTILE · PERCENT_RANK · CUME_DIST",
  "SELECT SIZE_OF_COLONY, NTILE(4) OVER w, ROUND(PERCENT_RANK() OVER w, 3), CUME_DIST() OVER w FROM ECOLI_DATA WINDOW w AS (ORDER BY SIZE_OF_COLONY DESC) ORDER BY SIZE_OF_COLONY DESC",
  "800|1|0|0.125, 700|1|0.143|0.25, 600|2|0.286|0.375, 500|2|0.429|0.5, 400|3|0.571|0.625, 300|3|0.714|0.75, 200|4|0.857|0.875, 100|4|1|1");
console.log(`\n모두 ${n}개 통과 — SQLite 로컬 검증이며 프로그래머스 재채점이 아니다.`);
