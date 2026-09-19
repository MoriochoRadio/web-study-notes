# 16회차 보충 풀이 — 2026-09-18

노트북 고장으로 응시하지 못한 회차의 보충 학습 기록이다. 동료가 제공한 오답노트로 문제와 회차를 확인하고, 풀이와 검증을 별도로 작성했다. 본인의 제출 코드·채점 결과·소요 시간은 없다. 아래 결과는 로컬 검증이며 프로그래머스 제출 PASS 기록이 아니다.

## Java — 약수의 합

- 문제: [프로그래머스 12928](https://school.programmers.co.kr/learn/courses/30/lessons/12928)
- 입력: 0 이상 3000 이하의 정수. 약수의 합을 반환한다.
- 기본 접근: 1부터 n까지 순회하며 나머지가 0인 수를 더한다. 시간 O(n), 추가 공간 O(1).
- 보충 풀이: 약수 d를 찾으면 n/d도 함께 더한다. 완전제곱수에서는 같은 약수를 한 번만 더한다. 시간 O(√n), 추가 공간 O(1).
- `divisor <= n / divisor`를 사용해 제곱 계산을 피했다. n=0일 때 반복하지 않고 0을 반환한다.

| 확인 입력 | 기대 결과 | 확인할 부분 |
|---|---:|---|
| 0 | 0 | 반복이 실행되지 않음 |
| 1 | 1 | 약수 쌍의 중복 방지 |
| 5 | 6 | 소수 |
| 12 | 28 | 여러 약수 쌍 |
| 36 | 91 | 제곱근 6을 한 번만 더함 |
| 3000 | 9360 | 입력 상한 |

[Solution.java](Solution.java)에 제출 형식의 풀이를 두었다. [DivisorSumTest.java](DivisorSumTest.java)는 각 수의 배수에 약수를 누적하는 별도 방식으로 기대값을 만들고, 허용 범위 전체 3,001개 입력과 비교한다.

```powershell
javac -encoding UTF-8 Solution.java DivisorSumTest.java
java DivisorSumTest
```

## SQL — 최댓값 구하기

- 문제: [프로그래머스 59415](https://school.programmers.co.kr/learn/courses/30/lessons/59415)
- 대상: `ANIMAL_INS.DATETIME`의 가장 늦은 보호 시작 시각.
- 풀이: 행을 묶을 필요 없이 `MAX(DATETIME)`을 한 번 계산한다.

```sql
SELECT MAX(DATETIME) AS 시간
FROM ANIMAL_INS;
```

가장 최근 시각 하나를 구하는 문제이므로 동물 이름이나 ID는 선택하지 않는다. `GROUP BY`를 추가하면 그룹마다 결과가 나와 요구사항이 달라진다. 같은 최댓값을 가진 행이 여러 개여도 집계 결과는 한 행이다. 빈 테이블에서는 NULL 한 행이 나온다. 원문에서 DATETIME은 NOT NULL이다.

[검증 SQL](verify-max-datetime.sql)은 임시 테이블만 사용한다. 날짜 순서가 섞인 자료·최댓값 중복·한 행·빈 집합을 확인하고 임시 테이블을 삭제한다. 문제의 원본 데이터나 기존 수업 테이블을 변경하지 않는다.

## 결과와 범위

- JDK 21: 약수의 합 0~3000 전체 입력 비교.
- MariaDB 12.3: 최댓값·중복·단일 행·빈 집합 확인. MySQL 서버에서 별도 실행한 기록은 아니다.
- 동료 문서의 PASS를 본인 결과로 옮기지 않았다. 개인정보와 원본 DOCX는 공개 저장소에 포함하지 않았다.
- [웹 보충 노트](index.html) · [전체 백엔드 노트](../../index.html#ct-29)
