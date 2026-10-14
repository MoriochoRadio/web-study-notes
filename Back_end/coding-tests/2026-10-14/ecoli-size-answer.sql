-- 25회차 SQL 2번 — 대장균의 크기에 따라 분류하기 1 (프로그래머스 299307)
-- 원문 정답 풀이 칸의 "더 간결하게 다듬은 정석 코드"를 그대로 옮긴 것이다.
SELECT 
    ID, 
    CASE 
        WHEN SIZE_OF_COLONY <= 100 THEN 'LOW'
        WHEN SIZE_OF_COLONY <= 1000 THEN 'MEDIUM'
        ELSE 'HIGH' 
    END AS SIZE
FROM ECOLI_DATA 
ORDER BY ID ASC;
