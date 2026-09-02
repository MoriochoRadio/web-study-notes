
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
WHERE deptno = 10;

-- 02. 직업이 'CLERK'인 사원과 같은 부서에서 근무하는 사원의 
-- 이름과 월급, 부서번호를 출력하자.

SELECT ENAME, SAL, DEPTNO 
FROM emp
WHERE deptno IN (SELECT DEPTNO FROM emp WHERE job = 'clerk');

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

-- 06. 'KING'에게 보고하는 사원의 이름과 월급을 출력하자. 
-- (관리자가 'KING'인 사원)

SELECT Ename, sal
FROM emp
WHERE mgr = (SELECT empno FROM emp WHERE ename = 'KING');

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