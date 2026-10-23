// 29회차 프로그래밍 — 약수의 개수와 덧셈 (프로그래머스 77884) · 원문 정답 풀이 ② 제곱수 판별
// 원문의 class Solution 은 파일 이름에 맞춰 클래스 이름만 바꿨다.
class DivisorSumSquare {
    public int solution(int left, int right) {
        int sum = 0;
        
        for (int i = left; i <= right; i++) {
            // i가 제곱수인지 판별 (제곱근으로 나누어떨어지면 제곱수)
            if (i % Math.sqrt(i) == 0) {
                sum -= i; // 제곱수는 약수의 개수가 홀수이므로 뺌
            } else {
                sum += i; // 제곱수가 아니면 약수의 개수가 짝수이므로 더함
            }
        }
        
        return sum;
    }
}
