-- Local class database only. Review the selected connection before running.
-- Based on Back_end/web_edu_project/README.md (2026-09-19).
-- No DROP / TRUNCATE / UPDATE / password changes. Existing rows are preserved.
-- IF NOT EXISTS does not repair an existing incompatible schema.
-- Windows MariaDB normally ignores table-name case; Linux may not.
CREATE DATABASE IF NOT EXISTS hk CHARACTER SET utf8mb4;
USE hk;

CREATE TABLE IF NOT EXISTS userTbl (
    userId CHAR(8) NOT NULL PRIMARY KEY,
    name VARCHAR(10) NOT NULL,
    birthYear INT NOT NULL,
    addr CHAR(2) NOT NULL,
    mobile1 CHAR(3),
    mobile2 CHAR(8),
    height SMALLINT,
    mDate DATE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS buyTbl (
    num INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    userID CHAR(8) NOT NULL,
    prodName CHAR(6) NOT NULL,
    groupName CHAR(4),
    price INT NOT NULL,
    amount SMALLINT NOT NULL,
    FOREIGN KEY (userID) REFERENCES userTbl(userId)
) ENGINE=InnoDB;

-- hkboard column lengths are inferred from the class DAO/DTO and README.
CREATE TABLE IF NOT EXISTS hkboard (
    seq INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    id VARCHAR(20) NOT NULL,
    title VARCHAR(100) NOT NULL,
    content TEXT,
    regdate DATE
) ENGINE=InnoDB;

-- One synthetic member for the first list screen. Re-running does not duplicate it.
-- Purchase and board tables start empty; their UI supports entering practice data.
INSERT INTO userTbl (userId, name, birthYear, addr, mobile1, mobile2, height, mDate)
SELECT 'DEMO01', '실습회원', 2000, '서울', NULL, NULL, 170, '2026-09-19'
WHERE NOT EXISTS (SELECT 1 FROM userTbl WHERE userId = 'DEMO01');

SELECT VERSION() AS server_version, DATABASE() AS selected_database;
SHOW TABLES;
SELECT userId, name FROM userTbl;
