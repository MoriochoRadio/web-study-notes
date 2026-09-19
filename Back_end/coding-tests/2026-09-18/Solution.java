class Solution {
    public int solution(int n) {
        int sum = 0;
        for (int divisor = 1; divisor <= n / divisor; divisor++) {
            if (n % divisor != 0) continue;
            sum += divisor;
            int pair = n / divisor;
            if (pair != divisor) sum += pair;
        }
        return sum;
    }
}
