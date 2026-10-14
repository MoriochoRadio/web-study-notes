-- 25회차 SQL 1번 — 경기도에 위치한 식품창고 목록 출력하기 (프로그래머스 131114) · FAIL
-- 오답노트의 제출 코드 칸은 비어 있다. 아래는 원문의 "정답 풀이"(CASE WHEN)를 그대로 옮긴 것이다.
SELECT 
    WAREHOUSE_ID, 
    WAREHOUSE_NAME, 
    ADDRESS, 
    CASE 
        WHEN FREEZER_YN IS NULL THEN 'N' 
        ELSE FREEZER_YN 
    END AS FREEZER_YN
FROM FOOD_WAREHOUSE 
WHERE ADDRESS LIKE '경기도%'
ORDER BY WAREHOUSE_ID ASC;
