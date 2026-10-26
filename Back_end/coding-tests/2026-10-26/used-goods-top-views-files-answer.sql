-- 30회차 SQL 2번 — 조회수가 가장 많은 중고거래 게시판의 첨부파일 조회하기 (프로그래머스 164671) · 원문 정답 풀이 (FAIL · 제출 코드 칸 비어 있음)
SELECT 
    -- 1. 고정 경로와 컬럼 값들을 슬래시('/')를 포함해 하나로 이어 붙입니다.
    CONCAT('/home/grep/src/', F.BOARD_ID, '/', F.FILE_ID, F.FILE_NAME, F.FILE_EXT) AS FILE_PATH
FROM USED_GOODS_BOARD B 
-- 2. 게시글(BOARD)과 첨부파일(FILE) 테이블을 게시글 ID를 기준으로 연결합니다.
JOIN USED_GOODS_FILE F ON B.BOARD_ID = F.BOARD_ID
-- 3. 전체 게시글 중 '조회수(VIEWS)'가 가장 높은 게시글의 파일들만 골라냅니다.
WHERE B.VIEWS = (SELECT MAX(VIEWS) FROM USED_GOODS_BOARD) 
-- 4. 파일 ID를 기준으로 내림차순 정렬합니다.
ORDER BY F.FILE_ID DESC;
