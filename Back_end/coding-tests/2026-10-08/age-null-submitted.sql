-- 23회차 SQL 1번 — 나이 정보가 없는 회원 수 (프로그래머스 131528) · 제출 코드 그대로 (PASS)
SELECT count(*) as USERS
from USER_INFO 
where AGE is NULL;
