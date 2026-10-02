-- 21회차 SQL 2번 — 조건에 맞는 사용자 정보 조회하기 (프로그래머스 164670) · 제출 코드 그대로 (FAIL)
SELECT DISTINCT U.USER_ID, U.NICKNAME, CONCAT(U.CITY, ' ', U.STREET_ADDRESS1, ' ', U.STREET_ADDRESS2) AS 전체주소, CONCAT('010','-',SUBSTR(U.TLNO,4,4),'-',SUBSTR(U.TLNO,8,4)) AS 전화번호
FROM USED_GOODS_BOARD G JOIN USED_GOODS_USER U ON G.WRITER_ID = U.USER_ID
WHERE G.WRITER_ID IN (SELECT WRITER_ID
                     from USED_GOODS_BOARD 
                     group by WRITER_ID
                     having count(*) >= 3)
ORDER BY U.USER_ID DESC;
