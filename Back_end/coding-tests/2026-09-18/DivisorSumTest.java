public class DivisorSumTest {
    public static void main(String[] args) {
        // Independent oracle: add each divisor to all its multiples.
        int[] expected = new int[3001];
        for (int d = 1; d < expected.length; d++)
            for (int multiple = d; multiple < expected.length; multiple += d)
                expected[multiple] += d;
        Solution solution = new Solution();
        for (int n = 0; n < expected.length; n++) {
            int actual = solution.solution(n);
            if (actual != expected[n])
                throw new AssertionError(n + ": " + actual + " != " + expected[n]);
        }
        System.out.println("PASS: all 3001 inputs (0..3000)");
    }
}
