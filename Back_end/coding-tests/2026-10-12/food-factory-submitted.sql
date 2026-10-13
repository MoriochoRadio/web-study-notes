-- 24회차 SQL 1번 — 강원도에 위치한 생산공장 목록 출력하기 (프로그래머스 131112) · 제출 코드 그대로 (PASS)
-- 원문 제목은 '생산공장 목록'으로 줄여 적혀 있어 공식 문제명을 썼다
SELECT FACTORY_ID, FACTORY_NAME, ADDRESS
from FOOD_FACTORY
where ADDRESS like '%강원도%'
order by FACTORY_ID asc;
