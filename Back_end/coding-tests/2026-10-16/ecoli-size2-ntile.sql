-- 26회차 SQL 2번 — 대장균의 크기에 따라 분류하기 2 (프로그래머스 301649) · FAIL · 제출 코드 칸은 비어 있다
-- 원문 정답 풀이 1 (NTILE) 그대로
SELECT 
    ID,
    CASE NTILE(4) OVER (ORDER BY SIZE_OF_COLONY DESC)
        WHEN 1 THEN 'CRITICAL'
        WHEN 2 THEN 'HIGH'
        WHEN 3 THEN 'MEDIUM'
        ELSE 'LOW'
    END AS COLONY_NAME
FROM ECOLI_DATA
ORDER BY ID ASC;
