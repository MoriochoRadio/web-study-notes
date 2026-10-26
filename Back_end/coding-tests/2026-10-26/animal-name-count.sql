-- 30회차 SQL 1번 — 동명 동물 수 찾기 (프로그래머스 59041) · 제출 코드 그대로 (PASS)
SELECT NAME, count(*) as 'COUNT'
from ANIMAL_INS 
group by NAME 
HAVING count(NAME) >= 2 
order by NAME;
