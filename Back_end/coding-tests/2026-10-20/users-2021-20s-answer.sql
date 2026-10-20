-- 28회차 SQL 1번 — 조건에 맞는 회원수 구하기 (프로그래머스 131535) · 원문 정답 풀이 (PASS · 제출 코드 칸은 비어 있음)
SELECT COUNT(*) AS USERS
FROM USER_INFO
WHERE YEAR(JOINED) = 2021
  AND AGE BETWEEN 20 AND 29;
