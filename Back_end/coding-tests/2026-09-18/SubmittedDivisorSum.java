// 16회차 JAVA — 약수의 합 (프로그래머스 12928) · 본인 제출 코드 그대로
// 시험 당일에는 노트북 고장으로 응시하지 못했고, 이후 직접 풀어 제출해 PASS 한 코드다.
// 자기 자신(n)을 먼저 더해 두고, 나머지 약수는 n/2 이하에만 존재한다는 성질을 이용한다.
public class SubmittedDivisorSum {
    public int solution(int n) {
        if (n == 0) return 0;

        int answer = n; // 자기 자신을 먼저 더함

        for (int i = 1; i <= n / 2; i++) {
            if (n % i == 0) {
                answer += i;
            }
        }

        return answer;
    }
}
