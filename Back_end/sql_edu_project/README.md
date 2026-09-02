# sql_edu_project — SQL 수업 실습 소스

취업아카데미 백엔드 과정의 **데이터베이스(SQL) 수업** 실습 파일입니다.
2026-08-31(20일차)부터 **HeidiSQL로 MySQL에 접속해** 진행하고 있습니다.

정리된 학습 노트는 대시보드의 **🗄️ SQL 기초** 탭에서 볼 수 있습니다
→ https://moriochoradio.github.io/web-study-notes/Back_end/#sql-01

## 파일 구성

| 파일 | 내용 |
|---|---|
| `쿼리 #1.sql` | **수업 중 직접 작성한 쿼리 모음.** SELECT~FROM 기초(Q1~Q9), WHERE 조건 연산자, 서브쿼리 실습이 순서대로 들어 있습니다. |
| `sqldb생성.sql` | 실습용 `sqlDB` 생성 스크립트 — 회원(`userTbl`)·구매(`buyTbl`) 테이블 생성과 데이터 INSERT. |
| `scott.sql` | `scott` 실습 DB — 사원(`EMP`) 14행, 부서(`DEPT`) 4행. 오라클 시절부터 쓰인 고전 실습 스키마입니다. |
| `hr.sql` | `hr` 실습 DB — 좀 더 큰 인사 관리 스키마. |
| `departments.sql` | 부서 테이블 단독 스크립트. |
| `employees/` | 대용량 샘플 DB의 **스키마·테스트 스크립트만**. 데이터 덤프는 아래 참고. |

## 실행 순서

```bash
# 1) 실습 DB 올리기 (HeidiSQL의 "SQL 파일 실행" 또는 CLI)
mysql -u root -p < scott.sql
mysql -u root -p < hr.sql

# 2) 직접 만드는 실습 DB
mysql -u root -p < "sqldb생성.sql"
```

`쿼리 #1.sql`은 통째로 실행하는 파일이 아니라 **한 문장씩 골라 실행하며 결과를 확인하는
연습용**입니다. HeidiSQL에서 원하는 쿼리를 블록으로 선택한 뒤 `F9`로 실행하면 됩니다.

## 저장소에 포함하지 않은 파일

`employees` 샘플 DB의 **데이터 덤프는 용량이 커서 제외**했습니다(합계 약 372MB).

| 제외한 파일 | 크기 |
|---|---|
| `employees_all.sql` | 168 MB |
| `load_salaries.dump` | 116 MB |
| `employees.zip` | 37 MB |
| `load_titles.dump` | 21 MB |
| `load_employees.dump` | 17 MB |
| `load_dept_emp.dump` | 14 MB |

필요하면 원본 배포처에서 다시 받을 수 있습니다 →
https://github.com/datacharmer/test_db

## 라이선스

`employees/` 디렉터리의 샘플 데이터베이스는 **MySQL AB(2007, 2008)** 저작물로
**Creative Commons Attribution-Share Alike 3.0 Unported** 라이선스를 따릅니다.
원본 스키마는 Giuseppe Maxia, 데이터 변환은 Patrick Crews, 원 데이터는
Siemens Corporate Research의 Fusheng Wang·Carlo Zaniolo가 만들었습니다.
자세한 내용과 전체 고지는 `employees/README`에 그대로 두었습니다.

나머지 파일(`쿼리 #1.sql`, `sqldb생성.sql` 등)은 수업 실습 자료입니다.
