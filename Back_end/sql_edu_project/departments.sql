-- --------------------------------------------------------
-- 호스트:                          127.0.0.1
-- 서버 버전:                        12.3.3-MariaDB - MariaDB Server
-- 서버 OS:                        Win64
-- HeidiSQL 버전:                  12.20.0.7320
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- 테이블 employees.departments 구조 내보내기
CREATE TABLE IF NOT EXISTS `departments` (
  `dept_no` char(4) NOT NULL,
  `dept_name` varchar(40) NOT NULL,
  PRIMARY KEY (`dept_no`),
  UNIQUE KEY `dept_name` (`dept_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- 테이블 데이터 employees.departments:~9 rows (대략적) 내보내기
INSERT IGNORE INTO `departments` (`dept_no`, `dept_name`) VALUES
	('d001', 'Marketing'),
	('d002', 'Finance'),
	('d003', 'Human Resources'),
	('d004', 'Production'),
	('d005', 'Development'),
	('d006', 'Quality Management'),
	('d007', 'Sales'),
	('d008', 'Research'),
	('d009', 'Customer Service');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
