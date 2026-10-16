// 26회차 JAVA 2번 — 타겟 넘버 (프로그래머스 43165) · 원문 결과 FAIL
// 원문 제출 코드 칸에 적힌 코드를 그대로 옮겼다(클래스 이름만 바꿈). 로컬 검증에서는 정답과 같은 값을 낸다 — README 참고.
class TargetNumber {
    int answer = 0; // 정답 개수를 세기 위한 전역 변수

    public int solution(int[] numbers, int target) {
        // 0번 인덱스부터, 초기 합계 0으로 탐색 시작!
        dfs(numbers, target, 0, 0);
        return answer;
    }

    public void dfs(int[] numbers, int target, int index, int sum) {
        // 1. 종료 조건: 모든 숫자를 다 확인했을 때
        if (index == numbers.length) {
            // 누적 합(sum)이 target과 같을 때만 answer를 1 증가!
            if (sum == target) {
                answer = answer + 1;
            }
            return; // 탐색 종료
        }

        // 2. 재귀 호출: 변수에 '='로 대입하지 않고, 계산한 값만 다음 함수로 넘겨줍니다.
        // 현재 숫자(numbers[index])를 더하고 다음 인덱스(index + 1)로 이동
        dfs(numbers, target, index + 1, sum + numbers[index]);
        
        // 현재 숫자(numbers[index])를 빼고 다음 인덱스(index + 1)로 이동
        dfs(numbers, target, index + 1, sum - numbers[index]);
    }
}
