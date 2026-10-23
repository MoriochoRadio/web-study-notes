// 29회차 프로그래밍 — 약수의 개수와 덧셈 (프로그래머스 77884) · 원문 정답 풀이 ① 제곱근(j * j <= i)까지 탐색
// 원문의 class Solution 은 파일 이름에 맞춰 클래스 이름만 바꿨다.
class DivisorSumSqrt {
    public int solution(int left, int right) {
        int sum = 0;
        
        for (int i = left; i <= right; i++) {
            int count = 0;
            
            // 제곱근(j * j <= i)까지만 탐색
            for (int j = 1; j * j <= i; j++) {
                if (j * j == i) {
                    count += 1; // 제곱수인 경우 (예: 4 * 4 = 16) 1개만 추가
                } else if (i % j == 0) {
                    count += 2; // 짝을 이루는 약수 2개 추가 (예: 2와 8)
                }
            }
            
            sum += (count % 2 == 0) ? i : -i;
        }
        
        return sum;
    }
}
