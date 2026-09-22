public class DivisorSumTest {
    public static void main(String[] args) {
        // Independent oracle: add each divisor to all its multiples.
        int[] expected = new int[3001];
        for (int d = 1; d < expected.length; d++)
            for (int multiple = d; multiple < expected.length; multiple += d)
                expected[multiple] += d;

        Solution solution = new Solution();                       // O(sqrt n) 보충 풀이
        SubmittedDivisorSum submitted = new SubmittedDivisorSum(); // 본인 제출 코드 (n/2 순회)
        for (int n = 0; n < expected.length; n++) {
            int actual = solution.solution(n);
            if (actual != expected[n])
                throw new AssertionError("보충 풀이 " + n + ": " + actual + " != " + expected[n]);
            int submittedActual = submitted.solution(n);
            if (submittedActual != expected[n])
                throw new AssertionError("제출 코드 " + n + ": " + submittedActual + " != " + expected[n]);
        }
        System.out.println("PASS: all 3001 inputs (0..3000) — 보충 풀이 · 제출 코드 둘 다 일치");
    }
}
