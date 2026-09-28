-- 19회차 SQL 1번 · 제출 코드 그대로 (PASS)
-- 오답노트의 문제 제목은 "이름이 있는 동물의 아이디"로 적혀 있지만,
-- 이 코드는 "어린 동물 찾기"(프로그래머스 59037)의 요구사항과 정확히 일치한다. README 의 기록 주의 참고.
SELECT ANIMAL_ID, NAME
from ANIMAL_INS
where INTAKE_CONDITION <> 'Aged'
order by ANIMAL_ID;
