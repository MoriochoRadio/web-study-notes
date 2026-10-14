-- 25회차 SQL 1번 — 경기도에 위치한 식품창고 목록 출력하기 (프로그래머스 131114)
-- 원문 정답 풀이의 두 번째 방법(IFNULL)을 그대로 옮긴 것이다.
SELECT 
    WAREHOUSE_ID, 
    WAREHOUSE_NAME, 
    ADDRESS, 
    IFNULL(FREEZER_YN, 'N') AS FREEZER_YN
FROM FOOD_WAREHOUSE 
WHERE ADDRESS LIKE '경기도%'
ORDER BY WAREHOUSE_ID ASC;
