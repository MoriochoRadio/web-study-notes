-- 17회차 SQL 두 문제를 세션 임시 테이블만으로 확인한다.
-- TEMPORARY 테이블이라 같은 이름의 실제 테이블이 있어도 가려지기만 하고 바뀌지 않으며,
-- 세션이 끝나면 사라진다. 수업 데이터나 문제 원본은 건드리지 않는다.
--
-- 실행:  mariadb -u study -D sqldb --table < verify-shelter-queries.sql

CREATE TEMPORARY TABLE ANIMAL_INS (
  ANIMAL_ID VARCHAR(10) NOT NULL,
  NAME      VARCHAR(20) NULL,
  DATETIME  DATETIME    NOT NULL
);
CREATE TEMPORARY TABLE ANIMAL_OUTS (
  ANIMAL_ID VARCHAR(10) NOT NULL,
  DATETIME  DATETIME    NOT NULL
);

INSERT INTO ANIMAL_INS VALUES
  ('A100', NULL,   '2026-09-01 10:00:00'),  -- 이름 없음 · 입양 기록 없음
  ('A200', '체리', '2026-09-02 10:00:00'),  -- 입양일이 더 이르다 → 잘못된 기록
  ('A300', NULL,   '2026-09-03 10:00:00'),  -- 이름 없음 · 입양 기록 없음
  ('A400', '',     '2026-09-04 10:00:00'),  -- 빈 문자열: NULL 이 아니다
  ('A500', '보리', '2026-09-05 10:00:00');  -- 입양일이 더 이르다 → 잘못된 기록

INSERT INTO ANIMAL_OUTS VALUES
  ('A200', '2026-09-02 09:00:00'),  -- 보호 시작보다 이른 입양
  ('A400', '2026-09-10 09:00:00'),  -- 정상 순서
  ('A500', '2026-09-01 09:00:00');  -- 보호 시작보다 이른 입양
  -- A100, A300 은 ANIMAL_OUTS 에 없다 → INNER JOIN 에서 빠져야 한다
  --
  -- 입양일(OUTS)은 A500 이 더 이르고, 보호 시작일(INS)은 A200 이 더 이르다.
  -- 두 컬럼 이름이 똑같아서 별칭을 빼먹으면 순서가 조용히 뒤바뀌는데,
  -- 일부러 그 차이가 드러나도록 값을 잡았다 (아래 ⑧번 확인).


-- ============================================================
-- 1부. 제출한 쿼리를 그대로 실행해 결과를 눈으로 확인한다
-- ============================================================

SELECT '--- 이름이 없는 동물의 아이디 (기대: A100, A300) ---' AS ' ';

SELECT ANIMAL_ID
FROM ANIMAL_INS
WHERE NAME IS NULL
ORDER BY ANIMAL_ID ASC;

SELECT '--- 있었는데요 없었습니다 (기대: A200 체리, A500 보리) ---' AS ' ';

SELECT I.ANIMAL_ID, I.NAME
FROM ANIMAL_INS I JOIN ANIMAL_OUTS O ON I.ANIMAL_ID = O.ANIMAL_ID
WHERE O.DATETIME < I.DATETIME
ORDER BY I.DATETIME ASC;


-- ============================================================
-- 2부. 왜 그렇게 되는지를 항목별로 확인한다 (passed = 1 이면 통과)
-- ============================================================

-- ① IS NULL 은 이름이 비어 있는 두 건만 고른다.
SELECT 'IS NULL 이 고르는 건수' AS test,
       (SELECT COUNT(*) FROM ANIMAL_INS WHERE NAME IS NULL) = 2 AS passed;

-- ② = NULL 은 어떤 행도 고르지 못한다. NULL 비교의 결과는 참도 거짓도 아니기 때문이다.
SELECT '= NULL 은 0건' AS test,
       (SELECT COUNT(*) FROM ANIMAL_INS WHERE NAME = NULL) = 0 AS passed;

-- ③ 빈 문자열은 IS NULL 에 걸리지 않는다 — 둘을 같은 것으로 다루면 안 된다.
SELECT '빈 문자열은 NULL 이 아니다' AS test,
       (SELECT COUNT(*) FROM ANIMAL_INS WHERE NAME = '') = 1 AS passed;

-- ④ INNER JOIN 은 양쪽에 다 있는 개체만 남긴다 (A100, A300 제외).
SELECT 'INNER JOIN 결과 건수' AS test,
       (SELECT COUNT(*) FROM ANIMAL_INS I JOIN ANIMAL_OUTS O ON I.ANIMAL_ID = O.ANIMAL_ID) = 3 AS passed;

-- ⑤ LEFT JOIN 으로 바꿔도 결과는 같다 — 짝 없는 행의 NULL 이 WHERE 에서 탈락하기 때문이다.
--    결과가 같아도 불필요한 행을 만들었다가 버리는 셈이라 INNER JOIN 이 맞다.
SELECT 'LEFT JOIN 으로 바꿔도 결과 동일' AS test,
       (SELECT GROUP_CONCAT(I.ANIMAL_ID ORDER BY I.DATETIME ASC)
          FROM ANIMAL_INS I LEFT JOIN ANIMAL_OUTS O ON I.ANIMAL_ID = O.ANIMAL_ID
         WHERE O.DATETIME < I.DATETIME)
     = (SELECT GROUP_CONCAT(I.ANIMAL_ID ORDER BY I.DATETIME ASC)
          FROM ANIMAL_INS I JOIN ANIMAL_OUTS O ON I.ANIMAL_ID = O.ANIMAL_ID
         WHERE O.DATETIME < I.DATETIME) AS passed;

-- ⑥ 입양일 < 보호 시작일 조건이 잘못된 기록 두 건만 골라낸다.
SELECT '순서가 뒤집힌 기록' AS test,
       (SELECT GROUP_CONCAT(I.ANIMAL_ID ORDER BY I.DATETIME ASC)
          FROM ANIMAL_INS I JOIN ANIMAL_OUTS O ON I.ANIMAL_ID = O.ANIMAL_ID
         WHERE O.DATETIME < I.DATETIME) = 'A200,A500' AS passed;

-- ⑦ ORDER BY I.DATETIME ASC 는 보호 시작이 이른 순이다 (A200 이 A500 보다 먼저).
SELECT '보호 시작 오름차순' AS test,
       (SELECT I.ANIMAL_ID
          FROM ANIMAL_INS I JOIN ANIMAL_OUTS O ON I.ANIMAL_ID = O.ANIMAL_ID
         WHERE O.DATETIME < I.DATETIME
         ORDER BY I.DATETIME ASC LIMIT 1) = 'A200' AS passed;

-- ⑧ ORDER BY 를 O.DATETIME 으로 바꾸면 순서가 달라진다 — 별칭을 빼먹으면 안 되는 이유.
SELECT 'O.DATETIME 으로 정렬하면 순서가 다르다' AS test,
       (SELECT I.ANIMAL_ID
          FROM ANIMAL_INS I JOIN ANIMAL_OUTS O ON I.ANIMAL_ID = O.ANIMAL_ID
         WHERE O.DATETIME < I.DATETIME
         ORDER BY O.DATETIME ASC LIMIT 1) = 'A500' AS passed;

DROP TEMPORARY TABLE ANIMAL_INS;
DROP TEMPORARY TABLE ANIMAL_OUTS;
