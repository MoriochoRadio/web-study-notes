-- 29회차 SQL 1번 — 이름에 el이 들어가는 동물 찾기 (프로그래머스 59047) · 원문 정답 풀이 (PASS · 제출 코드 칸 비어 있음)
SELECT ANIMAL_ID, NAME
from ANIMAL_INS 
where NAME LIKE '%EL%' AND ANIMAL_TYPE = 'Dog'
order by NAME, ANIMAL_ID
