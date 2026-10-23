-- 29회차 SQL 2번 — 조건에 맞는 사용자와 총 거래금액 조회하기 (프로그래머스 164668) · 제출 코드 그대로 (PASS)
SELECT B.WRITER_ID, U.NICKNAME, sum(B.PRICE) AS TOTAL_SALES
from USED_GOODS_BOARD B join USED_GOODS_USER U on B.WRITER_ID = U.USER_ID
where B.STATUS = 'DONE'
group by B.WRITER_ID
having sum(B.PRICE) >= 700000
order by TOTAL_SALES ASC;
