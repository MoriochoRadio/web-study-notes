-- 25회차 SQL 2번 — 대장균의 크기에 따라 분류하기 1 (프로그래머스 299307) · 제출 코드 그대로 (PASS)
select ID, case when SIZE_OF_COLONY <= 100 then 'LOW'
when SIZE_OF_COLONY > 100 and SIZE_OF_COLONY <= 1000 then 'MEDIUM'
when SIZE_OF_COLONY > 1000 then 'HIGH' end as SIZE
from ECOLI_DATA 
order by ID asc;
