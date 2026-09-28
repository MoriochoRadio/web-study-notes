-- 19회차 SQL 2번 — 없어진 기록 찾기 (프로그래머스 59042) · 제출 코드 그대로 (PASS)
-- 입양 기록(OUTS)은 있는데 보호소 입소 기록(INS)이 없는 동물 = OUTS 기준 외부 조인 + INS 쪽 IS NULL
SELECT O.ANIMAL_ID, O.NAME
from ANIMAL_INS I RIGHT JOIN ANIMAL_OUTS O ON I.ANIMAL_ID = O.ANIMAL_ID
where I.ANIMAL_ID is null
ORDER BY O.ANIMAL_ID;
