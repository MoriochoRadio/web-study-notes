-- 17회차 SQL 두 문제의 근거를 세션 임시 테이블만으로 확인한다.
-- 문제의 원본 데이터나 수업 테이블은 건드리지 않는다. 아무 실습 DB나 USE 한 뒤 실행하면 된다.

CREATE TEMPORARY TABLE ct17_ins (
  ANIMAL_ID VARCHAR(10) NOT NULL,
  NAME      VARCHAR(20) NULL,
  DATETIME  DATETIME    NOT NULL
);
CREATE TEMPORARY TABLE ct17_outs (
  ANIMAL_ID VARCHAR(10) NOT NULL,
  DATETIME  DATETIME    NOT NULL
);

INSERT INTO ct17_ins VALUES
  ('A100', NULL,     '2026-09-01 10:00:00'),  -- 이름 없음
  ('A200', '체리',   '2026-09-02 10:00:00'),
  ('A300', NULL,     '2026-09-03 10:00:00'),  -- 이름 없음
  ('A400', '',       '2026-09-04 10:00:00'),  -- 빈 문자열: NULL 이 아니다
  ('A500', '보리',   '2026-09-05 10:00:00');

INSERT INTO ct17_outs VALUES
  ('A200', '2026-09-01 09:00:00'),  -- 보호 시작보다 이른 입양 → 잘못된 기록
  ('A400', '2026-09-10 09:00:00'),  -- 정상 순서
  ('A500', '2026-09-03 09:00:00');  -- 보호 시작보다 이른 입양 → 잘못된 기록
  -- A100, A300 은 ANIMAL_OUTS 에 없다 → INNER JOIN 에서 빠져야 한다

-- ① IS NULL 은 이름이 비어 있는 두 건만 고른다. 빈 문자열('')은 NULL 이 아니다.
SELECT 'IS NULL 이 고르는 건수' AS test,
       (SELECT COUNT(*) FROM ct17_ins WHERE NAME IS NULL) = 2 AS passed;

-- ② = NULL 은 어떤 행도 고르지 못한다. NULL 비교의 결과는 참도 거짓도 아니기 때문이다.
SELECT '= NULL 은 0건' AS test,
       (SELECT COUNT(*) FROM ct17_ins WHERE NAME = NULL) = 0 AS passed;

-- ③ 빈 문자열은 IS NULL 에 걸리지 않는다 — 둘을 같은 것으로 다루면 안 된다.
SELECT '빈 문자열은 NULL 이 아니다' AS test,
       (SELECT COUNT(*) FROM ct17_ins WHERE NAME = '') = 1 AS passed;

-- ④ INNER JOIN 은 양쪽에 다 있는 개체만 남긴다 (A100, A300 제외).
SELECT 'INNER JOIN 결과 건수' AS test,
       (SELECT COUNT(*) FROM ct17_ins I JOIN ct17_outs O ON I.ANIMAL_ID = O.ANIMAL_ID) = 3 AS passed;

-- ⑤ 입양일 < 보호 시작일 조건이 잘못된 기록 두 건만 골라낸다.
SELECT '순서가 뒤집힌 기록' AS test,
       (SELECT GROUP_CONCAT(I.ANIMAL_ID ORDER BY I.DATETIME ASC)
          FROM ct17_ins I JOIN ct17_outs O ON I.ANIMAL_ID = O.ANIMAL_ID
         WHERE O.DATETIME < I.DATETIME) = 'A200,A500' AS passed;

-- ⑥ ORDER BY I.DATETIME ASC 는 보호 시작이 이른 순이다 (A200 이 A500 보다 먼저).
SELECT '보호 시작 오름차순' AS test,
       (SELECT I.ANIMAL_ID
          FROM ct17_ins I JOIN ct17_outs O ON I.ANIMAL_ID = O.ANIMAL_ID
         WHERE O.DATETIME < I.DATETIME
         ORDER BY I.DATETIME ASC LIMIT 1) = 'A200' AS passed;

DROP TEMPORARY TABLE ct17_ins;
DROP TEMPORARY TABLE ct17_outs;
