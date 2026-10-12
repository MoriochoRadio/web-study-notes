-- 23회차 SQL 2번 — 자동차 대여 기록에서 대여중 / 대여 가능 여부 구분하기 (프로그래머스 157340) · FAIL, 제출 코드 칸은 비어 있다
-- 아래는 오답노트의 정답 풀이 그대로
SELECT 
    CAR_ID,
    CASE 
        WHEN MAX(CASE WHEN '2022-10-16' BETWEEN START_DATE AND END_DATE THEN 1 ELSE 0 END) = 1 
        THEN '대여중'
        ELSE '대여 가능'
    END AS AVAILABILITY
FROM CAR_RENTAL_COMPANY_RENTAL_HISTORY
GROUP BY CAR_ID
ORDER BY CAR_ID DESC;
