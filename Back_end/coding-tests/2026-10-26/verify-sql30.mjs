// 30회차 SQL 을 Node 내장 SQLite(메모리 DB)로 확인한다.   실행: node verify-sql30.mjs
//
// 로컬 MariaDB 접속 정보를 쓰지 않고 누구나 바로 돌릴 수 있게 SQLite 를 쓴다.
// 제출 · 정답 풀이 SQL 은 한 글자도 바꾸지 않는다. 예시 행은 프로그래머스 문제 예시, 표시한 행은 검증용으로 더한 것이다(채점 데이터가 아님).
// SQLite 의 LIKE · 비교는 대소문자 규칙이 MySQL 과 다를 수 있고(GROUP BY 는 구분함), GROUP BY 검사도 MySQL 보다 느슨하다.
import { DatabaseSync } from "node:sqlite";
import { readFileSync } from "node:fs";

const db = new DatabaseSync(":memory:");
db.exec(`
  CREATE TABLE ANIMAL_INS (ANIMAL_ID TEXT, ANIMAL_TYPE TEXT, DATETIME TEXT, INTAKE_CONDITION TEXT, NAME TEXT, SEX_UPON_INTAKE TEXT);
  INSERT INTO ANIMAL_INS VALUES
    ('A396810', 'Dog', '2016-08-22 16:13:00', 'Injured', 'Raven',  'Spayed Female'),
    ('A377750', 'Dog', '2017-10-25 17:17:00', 'Normal',  'Lucy',   'Spayed Female'),
    ('A355688', 'Dog', '2014-01-26 13:48:00', 'Normal',  'Shadow', 'Neutered Male'),
    ('A399421', 'Dog', '2015-08-25 14:08:00', 'Normal',  'Lucy',   'Spayed Female'),
    ('A400680', 'Dog', '2017-06-17 13:29:00', 'Normal',  'Lucy',   'Spayed Female'),
    ('A410668', 'Cat', '2015-11-19 13:41:00', 'Normal',  'Raven',  'Spayed Female');

  CREATE TABLE USED_GOODS_BOARD (BOARD_ID TEXT, WRITER_ID TEXT, TITLE TEXT, CONTENTS TEXT, PRICE INTEGER, CREATED_DATE TEXT, STATUS TEXT, VIEWS INTEGER);
  INSERT INTO USED_GOODS_BOARD VALUES
    ('B0001', 'kwag98',    '반려견 배변패드 팝니다', '정말 저렴히 판매합니다. 전부 미개봉 새상품입니다.', 12000,  '2022-10-01', 'DONE', 250),
    ('B0002', 'lee871201', '국내산 볶음참깨',       '직접 농사지은 참깨입니다.',                      3000,   '2022-10-02', 'DONE', 121),
    ('B0003', 'goung12',   '배드민턴 라켓',         '사놓고 방치만 해서 팝니다.',                      9000,   '2022-10-02', 'SALE', 212),
    ('B0004', 'keel1990',  '디올 귀걸이',           '신세계강남점에서 구입. 정품 아닐시 백퍼센트 환불',  130000, '2022-10-02', 'SALE', 199),
    ('B0005', 'haphli01',  '스팸클래식 팔아요',     '유통기한 2025년까지에요',                         10000,  '2022-10-02', 'SALE', 121);
  CREATE TABLE USED_GOODS_FILE (FILE_ID TEXT, FILE_EXT TEXT, FILE_NAME TEXT, BOARD_ID TEXT);
  INSERT INTO USED_GOODS_FILE VALUES
    ('IMG_000001', '.jpg', 'photo1', 'B0001'),
    ('IMG_000002', '.jpg', 'photo2', 'B0001'),
    ('IMG_000003', '.png', '사진',   'B0002'),
    ('IMG_000004', '.jpg', '사진',   'B0003'),
    ('IMG_000005', '.jpg', 'photo',  'B0004');
`);
// MySQL 의 CONCAT 이 SQLite 에 없으면 같은 이름으로 등록한다(NULL 이 하나라도 있으면 NULL — MySQL 과 같음)
try { db.prepare("SELECT CONCAT('a','b')").get(); } catch { db.function("CONCAT", { varargs: true }, (...a) => (a.some(x => x == null) ? null : a.join(""))); }
const rows = (sql) => db.prepare(sql).all().map(r => Object.values(r).map(v => v ?? "NULL").join("|")).join(", ");
const load = (f) => readFileSync(new URL(f, import.meta.url), "utf8").split("\n").filter(l => !l.trim().startsWith("--")).join("\n");
let n = 0;
function check(label, sql, want) {
  const got = rows(sql);
  if (got !== want) throw new Error(`${label}\n  기대: ${want}\n  실제: ${got}`);
  console.log(`통과 ${++n}. ${label}\n        → ${got || "(0행)"}`);
}

// ---------- 동명 동물 수 찾기 ----------
const mine = load("./animal-name-count.sql");
check("SQL 1 제출 코드 — 문제 예시 6행: Lucy 3 · Raven 2 (Shadow 1마리는 빠짐)", mine, "Lucy|3, Raven|2");
db.exec(`INSERT INTO ANIMAL_INS VALUES
  ('A500001', 'Dog', '2018-01-01 10:00:00', 'Normal', NULL,    'Intact Male'),   -- 이름 없음 두 마리
  ('A500002', 'Cat', '2018-01-02 10:00:00', 'Normal', NULL,    'Intact Male'),
  ('A500003', 'Dog', '2018-01-03 10:00:00', 'Normal', 'lucy',  'Intact Male'),   -- 소문자 lucy
  ('A500004', 'Dog', '2018-01-04 10:00:00', 'Normal', 'Bella', 'Intact Male'),
  ('A500005', 'Cat', '2018-01-05 10:00:00', 'Normal', 'Bella', 'Intact Male')`);
check("SQL 1 제출 코드 — 검증용 5행 추가(이름 NULL 두 마리 · 소문자 lucy · Bella 두 마리): NULL 그룹은 count(NAME)=0 이라 빠지고, SQLite 는 Lucy / lucy 를 구분",
  mine, "Bella|2, Lucy|3, Raven|2");
check("  대소문자를 무시하고 묶으면(COLLATE NOCASE — MySQL 기본 설정과 같은 동작) Lucy + lucy = 4",
  "SELECT NAME, count(*) AS COUNT FROM ANIMAL_INS GROUP BY NAME COLLATE NOCASE HAVING count(NAME) >= 2 ORDER BY NAME", "Bella|2, Lucy|4, Raven|2");
check("틀린 방법 ① HAVING count(*) >= 2 — 이름이 NULL 인 두 마리가 한 그룹이 되어 NULL | 2 행이 들어온다",
  "SELECT NAME, count(*) AS COUNT FROM ANIMAL_INS GROUP BY NAME HAVING count(*) >= 2 ORDER BY NAME", "NULL|2, Bella|2, Lucy|3, Raven|2");
check("  다른 풀이 — WHERE NAME IS NOT NULL 로 먼저 거르고 HAVING count(*) >= 2 (같은 결과)",
  "SELECT NAME, count(*) AS COUNT FROM ANIMAL_INS WHERE NAME IS NOT NULL GROUP BY NAME HAVING count(*) >= 2 ORDER BY NAME", "Bella|2, Lucy|3, Raven|2");
check("  HAVING 없이 전부 보면 — 한 마리뿐인 Shadow · 소문자 lucy 와 NULL 그룹(count(NAME)=0)까지 나온다",
  "SELECT NAME, count(*) AS ALL_ROWS, count(NAME) AS NAMED FROM ANIMAL_INS GROUP BY NAME ORDER BY NAME", "NULL|2|0, Bella|2|2, Lucy|3|3, Raven|2|2, Shadow|1|1, lucy|1|1");
check("틀린 방법 ② HAVING count(NAME) > 2 — '두 번 이상'을 초과로 써서 2마리인 Raven · Bella 가 빠진다",
  "SELECT NAME, count(*) AS COUNT FROM ANIMAL_INS GROUP BY NAME HAVING count(NAME) > 2 ORDER BY NAME", "Lucy|3");
try {
  db.prepare("SELECT NAME, count(*) FROM ANIMAL_INS WHERE count(*) >= 2 GROUP BY NAME").all();
  throw new Error("WHERE 에 count(*) 가 통과하면 안 된다");
} catch (e) {
  console.log(`통과 ${++n}. 틀린 방법 ③ WHERE count(*) >= 2 — 묶기 전이라 집계 함수를 쓸 수 없다\n        → 오류: ${e.message}`);
}

db.exec(`INSERT INTO ANIMAL_INS VALUES ('A500006', 'Dog', '2018-01-06 10:00:00', 'Normal', NULL, 'Intact Male')`);
check("검증용: 이름이 NULL 인 동물이 3마리가 되면 HAVING count(*) >= 2 는 NULL | 3 행을 돌려준다(스스로 확인 1번)",
  "SELECT NAME, count(*) AS COUNT FROM ANIMAL_INS GROUP BY NAME HAVING count(*) >= 2 ORDER BY NAME", "NULL|3, Bella|2, Lucy|3, Raven|2");
check("  제출 코드(count(NAME))는 NULL 이 3마리여도 그 행이 없다", mine, "Bella|2, Lucy|3, Raven|2");

// ---------- 조회수가 가장 많은 중고거래 게시판의 첨부파일 조회하기 ----------
const ans = load("./used-goods-top-views-files-answer.sql");
check("SQL 2 정답 풀이 — 문제 예시: 조회수 1등 B0001(250)의 파일 둘, FILE_ID 내림차순이라 IMG_000002 가 먼저", ans,
  "/home/grep/src/B0001/IMG_000002photo2.jpg, /home/grep/src/B0001/IMG_000001photo1.jpg");
check("  (참고) 문제 페이지의 예시 출력은 IMG_000001 이 먼저 나와 있다 — 오름차순으로 정렬하면 그 순서",
  ans.replace("DESC", "ASC"), "/home/grep/src/B0001/IMG_000001photo1.jpg, /home/grep/src/B0001/IMG_000002photo2.jpg");
check("  서브쿼리 대신 ORDER BY VIEWS DESC LIMIT 1 로 게시글 하나를 고르면 — 조회수 1등이 하나뿐일 때 같은 결과",
  `SELECT CONCAT('/home/grep/src/', F.BOARD_ID, '/', F.FILE_ID, F.FILE_NAME, F.FILE_EXT) AS FILE_PATH FROM USED_GOODS_FILE F WHERE F.BOARD_ID = (SELECT BOARD_ID FROM USED_GOODS_BOARD ORDER BY VIEWS DESC LIMIT 1) ORDER BY F.FILE_ID DESC`,
  "/home/grep/src/B0001/IMG_000002photo2.jpg, /home/grep/src/B0001/IMG_000001photo1.jpg");
check("틀린 방법 ① 게시글 ID 뒤 슬래시 빠짐 — CONCAT('/home/grep/src/', BOARD_ID, FILE_ID, …) 은 디렉터리가 안 나뉜다",
  "SELECT CONCAT('/home/grep/src/', F.BOARD_ID, F.FILE_ID, F.FILE_NAME, F.FILE_EXT) AS FILE_PATH FROM USED_GOODS_BOARD B JOIN USED_GOODS_FILE F ON B.BOARD_ID = F.BOARD_ID WHERE B.VIEWS = (SELECT MAX(VIEWS) FROM USED_GOODS_BOARD) ORDER BY F.FILE_ID DESC",
  "/home/grep/src/B0001IMG_000002photo2.jpg, /home/grep/src/B0001IMG_000001photo1.jpg");
check("틀린 방법 ② 모든 게시글의 파일을 조회(조회수 조건 없음) — 파일 5개가 모두 나온다",
  "SELECT COUNT(*) FROM USED_GOODS_BOARD B JOIN USED_GOODS_FILE F ON B.BOARD_ID = F.BOARD_ID ORDER BY F.FILE_ID DESC", "5");
try {
  db.prepare("SELECT F.FILE_ID FROM USED_GOODS_BOARD B JOIN USED_GOODS_FILE F ON B.BOARD_ID = F.BOARD_ID WHERE B.VIEWS = MAX(B.VIEWS)").all();
  throw new Error("WHERE 에 MAX 가 통과하면 안 된다");
} catch (e) {
  console.log(`통과 ${++n}. 틀린 방법 ③ WHERE B.VIEWS = MAX(B.VIEWS) — 묶기 전에는 집계 함수를 쓸 수 없어 서브쿼리가 필요하다\n        → 오류: ${e.message}`);
}
db.exec(`INSERT INTO USED_GOODS_BOARD VALUES ('B0006', 'tie01', '공동 1등', '조회수가 같은 글', 5000, '2022-10-03', 'SALE', 250);
         INSERT INTO USED_GOODS_FILE VALUES ('IMG_000006', '.gif', 'tie', 'B0006');`);
check("검증용: 조회수 250 이 공동 1등이 되면(문제는 \"하나만 존재\"를 보장) 서브쿼리 MAX 방식은 두 게시글의 파일을 모두 돌려준다",
  ans, "/home/grep/src/B0006/IMG_000006tie.gif, /home/grep/src/B0001/IMG_000002photo2.jpg, /home/grep/src/B0001/IMG_000001photo1.jpg");
check("  같은 상황에서 LIMIT 1 방식은 게시글 하나(어느 쪽인지는 정해지지 않음)만 — 둘의 차이",
  `SELECT COUNT(DISTINCT F.BOARD_ID) FROM USED_GOODS_FILE F WHERE F.BOARD_ID = (SELECT BOARD_ID FROM USED_GOODS_BOARD ORDER BY VIEWS DESC LIMIT 1)`, "1");
db.exec(`DELETE FROM USED_GOODS_FILE WHERE FILE_ID = 'IMG_000006'; DELETE FROM USED_GOODS_BOARD WHERE BOARD_ID = 'B0006';
         INSERT INTO USED_GOODS_FILE VALUES ('IMG_9', '.png', 'x', 'B0001'), ('IMG_10', '.png', 'y', 'B0001');`);
check("참고: FILE_ID 는 VARCHAR 라 글자 순으로 정렬된다 — 자릿수가 다른 IMG_9 · IMG_10 이 있다면 IMG_9 가 IMG_10 보다 '크다'(문제 데이터는 000001 처럼 자릿수가 같음)",
  ans, "/home/grep/src/B0001/IMG_9x.png, /home/grep/src/B0001/IMG_10y.png, /home/grep/src/B0001/IMG_000002photo2.jpg, /home/grep/src/B0001/IMG_000001photo1.jpg");
console.log(`\n모두 ${n}개 통과 — SQLite 로컬 검증이며 프로그래머스 재채점이 아니다.`);
