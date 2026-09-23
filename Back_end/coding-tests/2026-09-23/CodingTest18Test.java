import java.util.Arrays;
import java.util.Random;

public class CodingTest18Test {
    private static int digitCases;
    private static int pokemonCases;
    private static void equal(long expected, long actual, String label) {
        if (expected != actual) throw new AssertionError(label + ": " + expected + " != " + actual);
    }
    // 정렬을 쓰는 풀이와 독립적으로 빈도표로 기댓값 생성.
    private static long expectedDigits(long n) {
        int[] counts = new int[10];
        do { counts[(int) (n % 10)]++; n /= 10; } while (n > 0);
        long answer = 0;
        for (int digit = 9; digit >= 0; digit--)
            for (int j = 0; j < counts[digit]; j++) answer = answer * 10 + digit;
        return answer;
    }
    private static void checkDigits(long n) {
        long expected = expectedDigits(n);
        equal(expected, new DescendingDigitsString().solution(n), "string n=" + n);
        equal(expected, new DescendingDigitsArithmetic().solution(n), "arithmetic n=" + n);
        digitCases++;
    }
    // 작은 입력은 실제로 N/2개를 고르는 모든 조합을 열거해 검증.
    private static int bruteKinds(int[] a) {
        int best = 0;
        for (int mask = 0; mask < (1 << a.length); mask++) {
            if (Integer.bitCount(mask) != a.length / 2) continue;
            int distinct = 0;
            for (int i = 0; i < a.length; i++) {
                if ((mask & (1 << i)) == 0) continue;
                boolean seen = false;
                for (int j = 0; j < i; j++)
                    if ((mask & (1 << j)) != 0 && a[j] == a[i]) seen = true;
                if (!seen) distinct++;
            }
            best = Math.max(best, distinct);
        }
        return best;
    }
    private static void checkPokemon(int[] a, int expected) {
        int[] before = a.clone();
        equal(expected, new PokemonKinds().solution(a), Arrays.toString(a));
        if (!Arrays.equals(a, before)) throw new AssertionError("input mutated");
        pokemonCases++;
    }
    public static void main(String[] args) {
        equal(873211L, new DescendingDigitsString().solution(118372L), "official example");
        long[] edges = {1L,10L,1000L,11111L,118372L,2147483648L,7999999999L,8000000000L};
        for (long n : edges) checkDigits(n);
        for (long n = 1; n <= 10000; n++) checkDigits(n);
        Random random = new Random(20260923);
        for (int i = 0; i < 10000; i++) checkDigits(random.nextLong(1L,8000000001L));
        checkPokemon(new int[]{3,1,2,3},2);
        checkPokemon(new int[]{3,3,3,2,2,4},3);
        checkPokemon(new int[]{3,3,3,2,2,2},2);
        for (int n : new int[]{2,4,6,8}) {
            int combinations = (int) Math.pow(3,n);
            for (int code = 0; code < combinations; code++) {
                int[] a = new int[n]; int value = code;
                for (int i = 0; i < n; i++) { a[i] = value % 3 + 1; value /= 3; }
                checkPokemon(a, bruteKinds(a));
            }
        }
        int[] same = new int[10000]; Arrays.fill(same,200000); checkPokemon(same,1);
        int[] distinct = new int[10000];
        for (int i = 0; i < distinct.length; i++) distinct[i] = i + 1;
        checkPokemon(distinct,5000);
        System.out.println("Descending digits: " + digitCases + " cases PASS (both solutions)");
        System.out.println("Pokemon: " + pokemonCases + " cases PASS (exhaustive subsets + boundary cases)");
        System.out.println("Local checks only; original submission failures cannot be reproduced without submission code.");
    }
}
