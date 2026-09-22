-- 17회차 SQL 1번 — 이름이 없는 동물의 아이디 (프로그래머스 59039) · 제출 코드 그대로
-- NULL 은 값이 아니라 "값이 없음"이라 = 로 비교할 수 없다. IS NULL 만 통한다.
SELECT ANIMAL_ID
FROM ANIMAL_INS
WHERE NAME IS NULL
ORDER BY ANIMAL_ID ASC;
