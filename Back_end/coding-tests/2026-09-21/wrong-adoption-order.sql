-- 17회차 SQL 2번 — 있었는데요 없었습니다 (프로그래머스 59043) · 제출 코드 그대로
-- 두 테이블에 모두 있는 개체만 비교하면 되므로 INNER JOIN 이면 충분하다.
-- DATETIME 은 과거가 작은 값이므로, 입양일이 보호 시작일보다 "작으면" 순서가 뒤집힌 기록이다.
SELECT I.ANIMAL_ID, I.NAME
FROM ANIMAL_INS I JOIN ANIMAL_OUTS O ON I.ANIMAL_ID = O.ANIMAL_ID
WHERE O.DATETIME < I.DATETIME
ORDER BY I.DATETIME ASC;
