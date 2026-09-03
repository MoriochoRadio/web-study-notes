
-- use문법: 사용하고자하는 데이터베이스 선택
USE scott;

SELECT *
FROM emp
LIMIT 20;

SHOW DATABASES;

USE hr;

SHOW TABLES;

DESC employees;

SHOW TABLE STATUS;

SELECT * FROM employees;

-- scott데이터베이스 실습

-- Select ~ from 사용하기

-- Q1) 사원 테이블(EMP)의 모든 데이터를 출력하자.

SELECT * FROM EMP;

-- Q2) 사원 테이블에서 사원의 이름(ENAME), 사원의 번호(EMPNO), 월급(SAL)을 출력하자.

SELECT ENAME, EMPNO, SAL
FROM EMP;

-- Q3) 사원 테이블에서 사원의 이름과 연봉을 출력하자.

SELECT ENAME, SAL*12 AS sal_year
FROM EMP;

-- Q4) 사원의 이름, 입사일(HIREDATE), 부서번호(DEPTNO)를 출력하자.

SELECT ENAME, HIREDATE, DEPTNO
FROM EMP;

-- Q5) 사원의 이름과, 사원을 관리하고있는 관리자(MGR)를 출력하자.

SELECT ENAME, MGR
FROM EMP;

-- Q6) 부서 테이블(DEPT)의 모든 데이터를 출력하자.

SELECT * FROM DEPT;

-- Q7) 부서 테이블의 구조를 보자

DESC DEPT;

-- Q8) 사원 테이블에서 사원의 이름, 월급, 커미션(COMM)을 출력하자.

SELECT ENAME, SAL, COMM
FROM EMP;

-- Q9) 사원 테이블의 모든 데이터를 "OO님이 0000-00-00에 입사를 하고 OO의 월급을 받습니다." 형식인 하나의 컬럼으로 출력하자.

SELECT CONCAT(ENAME, '님이 ', HIREDATE, '에 입사를 하고 ', SAL, '의 월급을 받습니다.') AS 사원정보
FROM EMP
ORDER BY '급여지급현황';

CREATE DATABASE sqlDB;

USE sqlDB;

CREATE TABLE userTbl -- 회원 테이블
( userID  	CHAR(8) NOT NULL PRIMARY KEY, -- 사용자 아이디(PK)
  name    	VARCHAR(10) NOT NULL, -- 이름
  birthYear   	INT NOT NULL,  -- 출생년도
  addr	  	CHAR(2) NOT NULL, -- 지역(경기,서울,경남 식으로 2글자만입력)
  mobile1	CHAR(3), -- 휴대폰의 국번(011, 016, 017, 018, 019, 010 등)
  mobile2	CHAR(8), -- 휴대폰의 나머지 전화번호(하이픈제외)
  height    	SMALLINT,  -- 키
  mDate    	DATE  -- 회원 가입일
);
CREATE TABLE buyTbl -- 회원 구매 테이블
(  num 		INT AUTO_INCREMENT NOT NULL PRIMARY KEY, -- 순번(PK)
   userID  	CHAR(8) NOT NULL, -- 아이디(FK)
   prodName 	CHAR(6) NOT NULL, --  물품명
   groupName 	CHAR(4)  , -- 분류
   price     	INT  NOT NULL, -- 단가
   amount    	SMALLINT  NOT NULL, -- 수량
   FOREIGN KEY (userID) REFERENCES userTbl(userID) -- 외래키 지정
);

INSERT INTO userTbl VALUES('LSG', N'이승기', 1987, N'서울', '011', '11111111', 182, '2008-8-8');
INSERT INTO userTbl VALUES('KBS', N'김범수', 1979, N'경남', '011', '22222222', 173, '2012-4-4');
INSERT INTO userTbl VALUES('KKH', N'김경호', 1971, N'전남', '019', '33333333', 177, '2007-7-7');
INSERT INTO userTbl VALUES('JYP', N'조용필', 1950, N'경기', '011', '44444444', 166, '2009-4-4');
INSERT INTO userTbl VALUES('SSK', N'성시경', 1979, N'서울', NULL  , NULL      , 186, '2013-12-12');
INSERT INTO userTbl VALUES('LJB', N'임재범', 1963, N'서울', '016', '66666666', 182, '2009-9-9');
INSERT INTO userTbl VALUES('YJS', N'윤종신', 1969, N'경남', NULL  , NULL      , 170, '2005-5-5');
INSERT INTO userTbl VALUES('EJW', N'은지원', 1972, N'경북', '011', '88888888', 174, '2014-3-3');
INSERT INTO userTbl VALUES('JKW', N'조관우', 1965, N'경기', '018', '99999999', 172, '2010-10-10');
INSERT INTO userTbl VALUES('BBK', N'바비킴', 1973, N'서울', '010', '00000000', 176, '2013-5-5');
INSERT INTO buyTbl VALUES(NULL, 'KBS', N'운동화', NULL   , 30,   2);
INSERT INTO buyTbl VALUES(NULL, 'KBS', N'노트북', N'전자', 1000, 1);
INSERT INTO buyTbl VALUES(NULL, 'JYP', N'모니터', N'전자', 200,  1);
INSERT INTO buyTbl VALUES(NULL, 'BBK', N'모니터', N'전자', 200,  5);
INSERT INTO buyTbl VALUES(NULL, 'KBS', N'청바지', N'의류', 50,   3);
INSERT INTO buyTbl VALUES(NULL, 'BBK', N'메모리', N'전자', 80,  10);
INSERT INTO buyTbl VALUES(NULL, 'SSK', N'책'    , N'서적', 15,   5);
INSERT INTO buyTbl VALUES(NULL, 'EJW', N'책'    , N'서적', 15,   2);
INSERT INTO buyTbl VALUES(NULL, 'EJW', N'청바지', N'의류', 50,   1);
INSERT INTO buyTbl VALUES(NULL, 'BBK', N'운동화', NULL   , 30,   2);
INSERT INTO buyTbl VALUES(NULL, 'EJW', N'책'    , N'서적', 15,   1);
INSERT INTO buyTbl VALUES(NULL, 'BBK', N'운동화', NULL   , 30,   2);

SELECT *
FROM usertbl
WHERE NAME = '김경호';

SELECT userid, name
FROM usertbl
WHERE birthyear >= 1970 AND height >= 182;

SELECT userid, name
FROM usertbl
WHERE birthyear >= 1970 OR height >= 182;

SELECT NAME, height
FROM usertbl
WHERE height BETWEEN 180 AND 183;

SELECT NAME, addr
FROM usertbl
WHERE addr IN ('경남','전남','경북');

SELECT NAME, height
FROM usertbl
WHERE NAME LIKE '_종신';

-- 2. Select ~ from~where 사용하기
USE scott;
-- Q1) 사원테이블에서 사원번호가 '7844' 인 사원의 사원번호, 이름, 월급을 출력하자.
SELECT EMPNO, ENAME, SAL 
FROM emp
WHERE EMPNO = '7844';

-- Q2) 사원테이블에서 'SMITH'의 사원번호, 이름, 월급을 출력하자.

SELECT EMPNO, ENAME, SAL
FROM emp
WHERE ENAME LIKE 'SMITH';

-- Q3) 사원테이블에서 입사일이 1980년 12월 17일인 사원의 모든 데이터를 출력하자.

SELECT *
FROM emp
WHERE HIREDATE = '1980-12-17';

-- Q4) 1980년도에서 1982년도 사이에 입사한 사원의 이름과 입사일을 출력하자.
-- V
SELECT ENAME, HIREDATE
FROM emp
WHERE HIREDATE BETWEEN '1980-01-01' AND '1982-12-31';

-- Q5) 월급이 2000 이하인 사원의 이름과 월급을 출력하자.

SELECT ENAME, SAL
FROM emp
WHERE SAL <= 2000;

-- Q6) 월급이 1000에서 2000 사이인 사원의 이름과 월급을 출력하자.

SELECT ENAME, SAL
FROM emp
WHERE SAL BETWEEN 1000 AND 2000;

-- Q7) 사원번호가 7369, 7499, 7521인 사원들의 이름과 월급을 출력하자.
-- V
SELECT ENAME, SAL
FROM emp
WHERE EMPNO IN(7369,7499,7521);

USE sqldb;
-- 서브쿼리
SELECT NAME, height
FROM usertbl
WHERE height >= ANY (SELECT height FROM usertbl WHERE addr = '경남');

SELECT NAME, height
FROM usertbl
WHERE height >= ALL (SELECT height FROM usertbl WHERE addr = '경남');

SELECT NAME, height
FROM usertbl
WHERE height IN (SELECT height FROM usertbl WHERE addr = '경남');

-- 3. 서브쿼리(1) 사용하기
USE scott;
-- 01. 부서번호가 10번인 사원들과 
-- 같은 월급을 받는 사원의 이름과 월급을 출력하자.

SELECT ENAME, SAL
FROM emp
WHERE sal IN (SELECT sal FROM emp WHERE deptno = 10);

-- 02. 직업이 'CLERK'인 사원과 같은 부서에서 근무하는 사원의 
-- 이름과 월급, 부서번호를 출력하자.

SELECT ENAME, SAL, DEPTNO 
FROM emp
WHERE deptno = ANY (SELECT DEPTNO FROM emp WHERE job = 'clerk');

-- 03. 'CHICAGO'에서 근무하는 사원들과 같은 부서에서 근무하는 
-- 사원의 이름과 월급을 출력하자.

SELECT ename, sal
FROM emp
WHERE deptno = (SELECT deptno FROM dept WHERE loc = 'CHICAGO');

-- 04. 부하직원이 있는 사원의 사원번호와 이름을 출력하자. 
-- 자기 자신이 다른 사원의 관리자인 사원)
-- v
SELECT empno, ename
FROM emp
WHERE empno IN (SELECT mgr FROM emp);

-- 05. 부하직원이 없는 사원의 사원번호와 이름을 출력하자.
-- NVL(컬럼,지정값): 해당 컬럼의 값들 중에 null을 찾아서 지정한 값으로 대체  
-- v
SELECT empno, ename
FROM emp
WHERE empno NOT IN (
    SELECT NVL(mgr, 0) 
    FROM emp
);

-- WHERE empno <> ALL ( SELECT NVL(mgr, 0) FROM emp);
    
    


-- 06. 'KING'에게 보고하는 사원의 이름과 월급을 출력하자. 
-- (관리자가 'KING'인 사원)

SELECT Ename, sal
FROM emp
WHERE mgr IN (SELECT empno FROM emp WHERE ename = 'KING');

-- 07. 20번 부서의 사원 중 가장 많은 월급을 받는 사원보다 
-- 더 많은 월급을 받는 사원들의 이름과 월급을 출력하자.
-- 단, MAX함수를 사용하지 말자.(ANY, ALL 연산자)

SELECT ename, sal
FROM emp
WHERE sal > ALL (select sal from emp where deptno = 20);

-- 08. 직업이 'SALESMAN' 인 사원중 가장 큰 월급을 받는 사원보다 
-- 더 많은 월급을 받는 사원들의 이름과 월급을 출력하자.
-- 단, MAX함수를 사용하지 말자.(ANY, ALL 연산자)

SELECT ename, sal
FROM emp
WHERE sal > ALL (select sal from emp where job = 'SALESMAN');

-- 정렬하기
USE sqldb;

SELECT NAME, height
FROM usertbl
ORDER BY height DESC, NAME ASC;

-- 테이블 복사하기: create table ~ select(서브쿼리)
-- 제약조건 등은 복사되지 않는다
CREATE TABLE buytbl2 (SELECT * FROM buytbl);
CREATE TABLE emp2 (SELECT * FROM scott.emp);
SELECT * FROM buytbl2;

-- 제약조건이 필요하면 alter를 이용해 따로 추가해준다
ALTER TABLE buytbl2
ADD CONSTRAINT pk_buytbl2_num PRIMARY KEY (num);

-- 5. create문 서브쿼리를 활용한 테이블 복사하기

-- Q1) SIZE가 10인 문자형 컬럼 ID와 PW를 가진 TEST 테이블을 생성해보자(create 기본 문법으로 테이블 생성하기: 교재등을 참고하여 만들기)

CREATE TABLE test (
id VARCHAR(10),
pw VARCHAR(10)
);

-- Q2) 사원 테이블(EMP)의 모든 구조와 데이터를 TEST01로 복사하여 생성해보자.

CREATE TABLE test01 (
SELECT *
FROM scott.emp);


-- Q3) 사원 테이블에서 사원의 번호와 이름을 TEST02로 복사하여 생성해보자.
USE sqldb;
CREATE table Test02 (
SELECT empno, ename
FROM scott.emp );

-- Q4) 사원 테이블에서 사원의 번호와 이름을 TEST03으로 복사하여 생성해보자.
-- 단, 컬럼명을 M1, M2로 변경하면서 복사하자.
-- v

CREATE TABLE TEST03 (
    SELECT empno AS M1, ename AS M2
    FROM scott.emp
);

-- Q5) 사원 테이블의 구조만 TEST04로 복사하여 생성해보자.

CREATE TABLE test04 AS
SELECT * 
FROM scott.emp 
WHERE 1 = 0;

-- Q6) 부서 테이블(DEPT) 의 구조만 TEST05로 복사하여 생성해보자.

CREATE TABLE test05 AS
SELECT * 
FROM scott.dept 
WHERE 1 = 0;

USE sqldb;
-- group by 절
SELECT userid, SUM(amount) AS '총 구매 개수'
FROM buytbl
GROUP BY userid;

SELECT userid AS '사용자 아이디' ,SUM(price * amount) AS '총 구매액'
FROM buytbl
GROUP BY userid;

-- 7. Group by와 집계함수 이용하기
USE scott;
-- Q1) 사원테이블에서 평균 월급을 출력하자.

SELECT AVG(sal)
FROM emp;

-- Q2) 사원테이블에서 부서번호가 10인 부서에 근무하고 있는 사원들의 부서번호와 평균 월급을 출력하자.

SELECT deptno, AVG(sal)
FROM emp
WHERE deptno = 10
GROUP BY deptno;

-- Q3) 사원테이블에서 직업이 'SALESMAN'인 사원들의 평균 월급을 출력하자.

SELECT job, AVG(sal)
FROM emp
WHERE job = 'salesman'
GROUP BY job;

-- Q4) 사원테이블에서 부서별 평균 월급을 출력하자.

SELECT deptno, AVG(sal)
FROM emp
GROUP BY deptno;

-- Q5) 사원테이블에서 직업별 평균 월급을 출력하자.

SELECT job, AVG(sal)
FROM emp
GROUP BY job;

-- Q6) 사원 테이블에서 평균 커미션(COMM)을 출력하자.

SELECT AVG(comm)
FROM emp;

-- Q7) 사원테이블에서 10번 부서의 최대 월급을 출력하자.

SELECT max(sal)
FROM emp
WHERE deptno = 10;

-- Q8) 사원테이블에서 부서별 최대 월급을 출력하자.

SELECT deptno, max(sal)
FROM emp
GROUP BY deptno;

-- Q9) 사원테이블에서 직업별 최대 월급을 출력하자.

SELECT job, MAX(sal)
FROM emp
GROUP BY job;

-- Q10) 사원테이블에서 직업이 'SALESMAN'인 사원들 중 최대월급을 출력하자.
USE scott;

SELECT job, max(sal)
FROM emp
WHERE job = 'salesman';

-- 8. Group by와 집계함수 이용하기

-- Q1) 사원 테이블에서 부서별 최대 월급을 출력하자.

SELECT deptno, max(sal)
FROM emp
GROUP BY deptno;

-- Q2) 사원테이블에서 직업별 최소 월급을 구하되, 직업이 'CLERK' 인 것만 출력하자.

SELECT job, MIN(sal)
FROM emp
WHERE job = 'clerk';

-- Q3) 사원테이블에서 커미션이 책정된 사원은 모두 몇 명인지 출력하자.

SELECT count(comm)
FROM emp
WHERE comm IS NOT NULL;

-- Q4) 사원테이블에서 직업이 'SALESMAN'이고 월급이 1000 이상인 사원의 이름과 월급을 출력하자.

SELECT ename, sal
FROM emp
WHERE job = 'salesman'
GROUP BY ename
HAVING sal >= 1000;

-- Q5) 사원테이블에서 부서별 평균 월급을 출력하되, 평균 월급이 2000보다 큰 부서의 부서번호와 평균 월급을 출력하자.

SELECT deptno AVG(sal)
FROM emp
GROUP BY deptno
HAVING AVG(sal) > 2000;

-- Q6) 사원테이블에서 직업이 'MANAGER' 인 사원을 출력하되, 월급이 높은 순으로 이름, 직업, 월급을 출력하자.(내림차순)

SELECT ename, job, sal
FROM emp
ORDER BY sal DESC;

-- Q7) 사원테이블에서 각 직업별 총 월급을 출력하되 월급이 낮은 순으로 출력하자.(오름차순)

SELECT job, sum(sal)
FROM emp
GROUP BY job
ORDER BY SUM(sal);

-- Q8) 사원테이블에서 직업별 총 월급을 출력하되, 직업이 'MANAGER'인 사원들은 제외하고, 총 월급이 5000보다 큰 직업만 출력하자.

SELECT job, sum(sal)
FROM emp
WHERE job != 'manager'
GROUP BY job
HAVING SUM(sal)>5000;


-- Q9) 사원테이블에서 직업별 최대 월급을 출력하되, 직업이 'CLERK' 인 사원들은 제외하고, 총 월급이 2000 이상인 직업과 최대월급을 오름차순으로 정렬하여 출력하자.

SELECT job, MAX(sal)
FROM emp
WHERE job <> 'CLERK'         
GROUP BY job                  
HAVING SUM(sal) >= 2000       
ORDER BY MAX(sal) ASC;        

-- Q10) 사원테이블에서 부서별 총 월급을 출력하되, 30번 부서를 제외하고, 총 월급이 8000 이상인 부서를 총 월급이 높은 순으로 출력하자.(내림차순)

SELECT deptno, sum(sal)
FROM emp
WHERE deptno <> 30
GROUP BY deptno
HAVING SUM(sal) >= 8000
ORDER BY sum(sal) desc

-- 11) 사원테이블에서 부서별 평균 월급을 출력하되, 커미션이 책정된 사원만 구하고, 평균 월급이 1000 달러 이상인 부서만 구하고, 평균 월급이 높은 순으로 출력하자.(내림차순)

SELECT deptno, AVG(sal)
FROM emp
WHERE comm IS NOT NULL       
GROUP BY deptno               
HAVING AVG(sal) >= 1000       
ORDER BY AVG(sal) DESC;       

-- sql 분류: dml, ddl, dcl
USE sqldb;
CREATE TABLE testTBL1 (id INT, userName CHAR(3), age INT);

INSERT INTO testtbl1 VALUES(1, '홍길동', 25);
SELECT * FROM testtbl1;

INSERT INTO testtbl1(id,username) VALUES(2,'설현');
INSERT INTO testtbl1(username,id) VALUES('설현2',3);

CREATE TABLE testtbl2(
 id INT AUTO_INCREMENT PRIMARY KEY,
 username CHAR(3),
 age INT 
);

SELECT * FROM testtbl2;
INSERT INTO testtbl2 VALUES(NULL, '정우성', 50);

-- 초기값 설정 가능
ALTER TABLE testtbl2 AUTO_INCREMENT = 100;

-- 증가값 설정 가능
SET @@AUTO_INCREMENT_increment = 3;

-- 한문장으로 여러 데이터를 추가할 수 있다
INSERT INTO testtbl2 VALUES(NULL, '정우성', 50),
(NULL, '정우일', 50),
(NULL, '정우이', 50),
(NULL, '정우삼', 50),
(NULL, '정우사', 50),
(NULL, '정우오', 50);

-- 4. 서브쿼리(2) 사용하기

-- 01. 'SMITH'보다 월급을 많이 받는 사원들의 
-- 이름과 월급을 출력하자.
USE scott;

SELECT ename, sal 
FROM emp
WHERE sal > 800;

-- 02. 10번 부서의 사원들과 같은 월급을 받는 사원들의 
-- 이름, 월급, 부서번호를 출력하자.

SELECT ename, sal, deptno
FROM emp
WHERE sal IN (SELECT sal FROM emp WHERE deptno = 10);

-- 03. 'BLAKE'가 근무하는 부서의 위치(LOC)를 출력하자.

SELECT loc 
FROM dept
WHERE deptno = (SELECT deptno FROM emp WHERE ename = 'blake');

-- 04. 총 사원의 평균월급보다 더 많은 월급을 받는 사원들의 사원번호, 이름, 월급을 출력하되, 월급이 높은 사람 순으로 출력하자.

SELECT empno, ename, sal
FROM emp
WHERE sal > (SELECT avg(sal) FROM emp)
ORDER BY sal DESC;

-- 05. 이름에 'T'를 포함하고 있는 사원들의 이름을 출력하자.

SELECT ename
FROM emp
WHERE eNAME LIKE '%T%';

-- 06. 20번 부서에 있는 사원들 중 
-- 가장 많은 월급을 받는 사원보다 
-- 많은 월급을 받는 사원들의 이름, 부서번호, 월급을 출력하자.

SELECT ename, deptno, sal
FROM emp
WHERE sal > (SELECT MAX(sal) FROM emp WHERE deptno = 20);

-- 07. 'DALLAS'에서 근무하고 있는 사원과 
-- 같은 부서에서 일하는 사원의 이름, 부서번호, 직업을 출력하자.

SELECT e.ename, e.deptno, e.job
FROM emp e
JOIN dept d 
  ON e.deptno = d.deptno
WHERE d.loc = 'DALLAS';

SELECT empno, deptno, job
FROM emp
WHERE deptno IN (SELECT deptno FROM dept WHERE loc = 'dallas');

-- 08. 이름에 'S'가 들어가는 사원과 동일한 부서에서 근무하는 사원 중, 
-- 자신의 급여가 평균 급여보다 많은 사원들의 
-- 사원번호, 이름, 급여를 출력하자.

SELECT empno, ename, sal
FROM emp
WHERE deptno IN (SELECT deptno FROM emp WHERE ename LIKE '%S%')
AND sal > (SELECT AVG(sal) FROM emp);

-- 인라인 뷰 사용 -> 반드시 별칭을 정의해야 함
SELECT empno, ename, sal
FROM 
(SELECT empno, ename, sal
FROM emp
WHERE deptno IN (SELECT deptno FROM emp WHERE ename LIKE '%S%') 
) AS a
WHERE sal > (SELECT AVG(sal) FROM emp);

-- 09. 사원번호가 7369 인 사원과 같은 직업이고, 
-- 월급이 7876보다 많은 사원의 
-- 이름과 직업을 출력하자.

SELECT ename, job
FROM emp
WHERE job  = (SELECT job FROM emp WHERE empno = 7369) AND sal > (SELECT sal FROM emp WHERE empno = 7876);

-- 트랜잭션이 우리 일상생활에서 필요한 사례같은거 물어본적있다함 이런거 알아두기?

USE sqldb;
CREATE TABLE buytbl3 (SELECT * FROM buytbl);

ALTER TABLE buytbl3
ADD CONSTRAINT pk_buytbl3_num PRIMARY KEY (num);

UPDATE buytbl3 SET price = 90, amount = 60, prodname = '노트북'
WHERE num = 6;

SELECT * FROM buytbl3;

DELETE FROM buytbl3 WHERE num = 2;

-- table 복사 후 삭제 연습
CREATE TABLE bigtbl1 (SELECT * FROM employees.employees);
CREATE TABLE bigtbl2 (SELECT * FROM employees.employees);
CREATE TABLE bigtbl3 (SELECT * FROM employees.employees);

-- 삭제하는 기능 3가지
DELETE FROM bigtbl1; -- table의 행들을 삭제
DROP TABLE bigtbl2; -- table 삭제
TRUNCATE TABLE bigtbl3; -- table의 데이터만 삭제

-- p.213 실습4
USE sqldb;

CREATE TABLE membertbl (SELECT USERid, NAME, addr FROM usertbl LIMIT3);

ALTER TABLE membertbl
ADD CONSTRAINT pk_memberTBL PRIMARY KEY (userID);

SELECT * FROM memberTBL;

INSERT INTO membertbl VALUES('BBK','비비코','미국'); -- pk 중복으로 오류 발생
INSERT INTO membertbl VALUES('SJH','서장훈','서울'); -- 나머지 쿼리 실행 X
INSERT INTO membertbl VALUES('HJY','현주엽','경기'); -- 나머지 쿼리 실행 X 

INSERT INTO membertbl VALUES('BBK','비비코','미국')
ON DUPLICATE KEY UPDATE NAME = '비비코' , addr = '미국';

INSERT INTO membertbl VALUES('DJM','동짜몽','일본')
ON DUPLICATE KEY UPDATE NAME = '동짜몽' , addr = '일본';

-- CTE 사용하기

SELECT userid, SUM(price*amount)
FROM buytbl
GROUP BY userid;

WITH abc(userid, total)
AS 
(SELECT userid, SUM(price*amount)
FROM buytbl
GROUP BY userid)
SELECT * FROM abc ORDER BY total DESC; -- 하나의 묶음으로 실행

SELECT * FROM abc ORDER BY total DESC; -- 재실행은 안됨

SELECT * FROM memberTBL;

-- 연습문제 9 (update, delete, 상관서브쿼리, 집계함수)
USE scott;

CREATE TABLE emp2 AS SELECT * FROM emp;

-- 1.	사원(EMP이름)테이블에서 직업(JOB)이 ‘SALESMAN’ 인 사원 급여(SAL)에 400 더하는 수정(UPDATE) 구문을 구하시오
 	
UPDATE emp2
SET sal = sal - 400
WHERE job = 'SALESMAN'; 
 	
-- 2.	사원(EMP이름)테이블에서 급여(SAL)가 사원 평균급여 보다 높은 사원을 대상으로 고용일자(HIREDATE)를 1년 더하는 수정(UPDATE) 구문을 구하시오
--         (ADDDATE()함수는 날짜를 더하는 함수)

UPDATE emp2
SET hiredate = ADDDATE(hiredate, INTERVAL 1 YEAR)
WHERE sal > (
    SELECT avg_sal 
    FROM (SELECT AVG(sal) AS avg_sal FROM emp2) AS temp
);


-- 3.	사원(EMP이름)테이블에서 전체 사원을 대상으로 COMM 컬럼에 100 을 더하고 직업(JOB)이 ‘CLERK’ 인 사원은 현 급여에서 2배, ‘MANAGER’ 인 
--        직업을 가진 사원은 현 급여에서 3배,이외 직업을 가진 사원은 현 급여에서 4배를 더하는 수정(UPDATE) 구문을 구하시오
   
UPDATE emp2
SET comm = IFNULL(comm, 0) + 100,
    sal = CASE job
            WHEN 'CLERK' THEN sal * 2
            WHEN 'MANAGER' THEN sal * 3
            ELSE sal * 4
          END;
   
-- 4.	사원(EMP이름)테이블에서 이름(ENAME)이 ‘M’으로 시작하는 사원 삭제(DELETE) 구문을 구하시오

DELETE FROM emp2
WHERE ename LIKE 'M%';

-- 5.	사원(EMP이름)테이블에서 급여(SAL)가 사원 평균급여 보다 높은 사원 삭제(DELETE) 구문을 구하시오

DELETE FROM emp2
WHERE sal > (
    SELECT avg_sal
    FROM (SELECT AVG(sal) AS avg_sal FROM emp) AS temp
);

DELETE FROM emp2 
WHERE sal > (SELECT AVG(sal) FROM emp2);

-- 10. 함수 이용하기(내장함수)
USE scott;

-- Q1) 사원 테이블에서 사원이름을 첫글자는 대문자로, 나머지는 소문자로 출력하자.

SELECT CONCAT(
         UPPER(SUBSTR(ename, 1, 1)),   -- 첫 번째 글자만 대문자로
         LOWER(SUBSTR(ename, 2))       -- 두 번째 글자부터 끝까지 소문자로
       ) AS ename
FROM emp;

-- Q2) 사원테이블에서 사원이름을 출력하고, 이름의 두번째 글자부터 네번째 글자도 출력하자.

SELECT ename, SUBSTR(ename, 2, 3)
FROM emp;

-- Q3) 사원테이블에서 각 사원 이름의 철자 개수를 출력하자.

SELECT ename, CHAR_LENGTH(ename) AS 글자수
FROM emp;

-- Q4) 사원테이블에서 각 사원 이름의 앞 글자 하나와 마지막 글자 하나만 출력하되, 소문자로 출력하라.

SELECT LOWER(CONCAT(LEFT(ename, 1), RIGHT(ename, 1))) AS result
FROM emp;

-- Q5) 3456.78을 소수점 첫번째 자리에서 반올림해서 출력하자.

SET @num =  3456.78;
SELECT ROUND(@num, 0)
FROM emp;

SELECT ROUND(3456.78, 0) AS result;

-- Q6) 사원테이블에서 사원이름과 근무일수(고용일 ~ 현재 날짜)를 출력하자. 

SELECT ename, DATEDIFF(CURDATE(), hiredate) AS 근무일수
FROM emp;

-- Q7) 위 문제에서 근무일수를 '00년 00개월 00일' 형식으로 출력하자. (한달을 30일로 계산)
-- 예)
--  ENAME  |  근무일수
--  -------------------------------
--  KING     |  00년 00개월 00일

SELECT ename,
       CONCAT(
         FLOOR(DATEDIFF(CURDATE(), hiredate) / 365), '년 ',
         FLOOR((DATEDIFF(CURDATE(), hiredate) % 365) / 30), '개월 ',
         (DATEDIFF(CURDATE(), hiredate) % 365) % 30, '일'
       ) AS 근무일수
FROM emp;

SELECT ename,
       CONCAT(
         FLOOR(DATEDIFF(CURDATE(), hiredate) / 365), '년 ',
         FLOOR(MOD(DATEDIFF(CURDATE(), hiredate), 365) / 30), '개월 ',
         mod(mod(DATEDIFF(CURDATE(), hiredate) , 365) , 30), '일'
       ) AS 근무일수
FROM emp;
