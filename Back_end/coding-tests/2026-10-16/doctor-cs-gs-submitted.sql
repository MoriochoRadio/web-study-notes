-- 26회차 SQL 1번 — 흉부외과 또는 일반외과 의사 목록 출력하기 (프로그래머스 132203) · 제출 코드 그대로 (PASS)
SELECT DR_NAME, DR_ID, MCDP_CD, HIRE_YMD
from DOCTOR 
where MCDP_CD in ('CS','GS')
order by HIRE_YMD desc, DR_NAME asc;
