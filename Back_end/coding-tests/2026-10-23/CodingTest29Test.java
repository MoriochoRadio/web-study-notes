// 29회차 자바 두 문제를 로컬에서 확인한다. 프로그래머스 재채점이 아니다.
import java.util.*;

public class CodingTest29Test {

    // ---------- 약수의 개수와 덧셈 ----------
    /** 기댓값: 1부터 n까지 모두 나눠 보는 가장 단순한 약수 개수 */
    static int divisorCount(int n) {
        int c = 0;
        for (int d = 1; d <= n; d++) if (n % d == 0) c++;
        return c;
    }

    static void checkDivisorSum() {
        DivisorSum submitted = new DivisorSum();
        DivisorSumSqrt sqrt = new DivisorSumSqrt();
        DivisorSumSquare square = new DivisorSumSquare();
        int[][] ex = {{13, 17, 43}, {24, 27, 52}};
        for (int[] e : ex) {
            if (submitted.solution(e[0], e[1]) != e[2] || sqrt.solution(e[0], e[1]) != e[2] || square.solution(e[0], e[1]) != e[2])
                throw new AssertionError("공식 예제 " + Arrays.toString(e));
        }
        System.out.println("약수의 개수와 덧셈 — 공식 예제 2개 통과 (13~17 → 43, 24~27 → 52) · 제출 코드 · 정답 풀이 두 개 모두");
        // 1~1,000 의 모든 수 하나씩: 약수 개수의 홀짝이 맞는지 (solution(i, i) 는 +i 또는 -i)
        int odd = 0;
        for (int i = 1; i <= 1000; i++) {
            int want = divisorCount(i) % 2 == 0 ? i : -i;
            if (want < 0) odd++;
            if (submitted.solution(i, i) != want) throw new AssertionError("제출 " + i);
            if (sqrt.solution(i, i) != want) throw new AssertionError("정답① " + i);
            if (square.solution(i, i) != want) throw new AssertionError("정답② " + i);
        }
        System.out.println("약수의 개수와 덧셈 — 1~1,000 모든 수에서 세 풀이의 +/− 가 단순 약수 세기와 같다. 약수가 홀수 개인 수 " + odd + "개 = 제곱수 1, 4, 9, …, 961");
        // 범위 전체: 무작위 2,000쌍
        long[] prefix = new long[1001];
        for (int i = 1; i <= 1000; i++) prefix[i] = prefix[i - 1] + (divisorCount(i) % 2 == 0 ? i : -i);
        Random r = new Random(29);
        for (int t = 0; t < 2000; t++) {
            int a = 1 + r.nextInt(1000), b = 1 + r.nextInt(1000), left = Math.min(a, b), right = Math.max(a, b);
            long want = prefix[right] - prefix[left - 1];
            if (submitted.solution(left, right) != want || sqrt.solution(left, right) != want || square.solution(left, right) != want)
                throw new AssertionError("범위 " + left + "~" + right);
        }
        System.out.println("약수의 개수와 덧셈 — 무작위 범위 2,000쌍(1 ≤ left ≤ right ≤ 1,000)에서 세 풀이 모두 기댓값과 같다");
        System.out.println("약수의 개수와 덧셈 — 1~1,000 전체 합: " + submitted.solution(1, 1000));
        // 반복 횟수: 제출(i/2 까지) vs 정답①(j*j <= i)
        long loopsHalf = 0, loopsSqrt = 0;
        for (int i = 1; i <= 1000; i++) { loopsHalf += Math.max(0, i / 2 - 1); for (int j = 1; j * j <= i; j++) loopsSqrt++; }
        System.out.printf("약수의 개수와 덧셈 — 1~1,000 전체에서 안쪽 반복 횟수: 제출(2 ~ i/2) %,d번 · 정답①(j*j ≤ i) %,d번%n", loopsHalf, loopsSqrt);
        // 정답②의 i % Math.sqrt(i) == 0 — 실수 나머지로 제곱수를 가리는 식이 큰 수에서도 맞는지
        long t0 = System.nanoTime();
        int limit = 100_000_000, mismatch = 0;
        for (int i = 1; i <= limit; i++) {
            int s = (int) Math.sqrt(i);
            boolean isSquare = (long) s * s == i;
            if ((i % Math.sqrt(i) == 0) != isSquare) mismatch++;
        }
        System.out.printf("약수의 개수와 덧셈 — 정답②의 i %% Math.sqrt(i) == 0 을 정수 판별((int)√i 의 제곱 == i)과 1 ~ %,d 에서 비교: 다른 곳 %d개 (%.0fms)%n",
            limit, mismatch, (System.nanoTime() - t0) / 1e6);
    }

    // ---------- 소수 찾기 ----------
    static boolean[] composite;
    static List<int[]> primeDigits = new ArrayList<>();   // 소수마다 숫자 0~9 의 개수

    static void sieve(int max) {
        composite = new boolean[max + 1];
        composite[0] = composite[1] = true;
        for (int i = 2; (long) i * i <= max; i++) if (!composite[i]) for (int j = i * i; j <= max; j += i) composite[j] = true;
        for (int p = 2; p <= max; p++) if (!composite[p]) {
            int[] c = new int[10];
            for (int x = p; x > 0; x /= 10) c[x % 10]++;
            primeDigits.add(c);
        }
    }

    /** 기댓값: 0 ~ 9,999,999 의 모든 소수 중 그 숫자들을 종이 조각으로 만들 수 있는 것의 수 (DFS 와 다른 방법) */
    static int expectedPrimes(String numbers) {
        int[] have = new int[10];
        for (char ch : numbers.toCharArray()) have[ch - '0']++;
        int n = 0;
        outer:
        for (int[] c : primeDigits) {
            for (int d = 0; d < 10; d++) if (c[d] > have[d]) continue outer;
            n++;
        }
        return n;
    }

    static int calls;
    static void countCalls(String cur, String numbers, boolean[] used) {
        calls++;
        for (int i = 0; i < numbers.length(); i++) if (!used[i]) { used[i] = true; countCalls(cur + numbers.charAt(i), numbers, used); used[i] = false; }
    }

    static void checkFindPrimes() {
        String[][] ex = {{"17", "3"}, {"011", "2"}};
        for (String[] e : ex) if (new FindPrimes().solution(e[0]) != Integer.parseInt(e[1])) throw new AssertionError("공식 예제 " + e[0]);
        System.out.println("소수 찾기 — 공식 예제 2개 통과 (\"17\" → 3 [7, 17, 71], \"011\" → 2 [11, 101])");
        long t0 = System.nanoTime();
        sieve(9_999_999);
        System.out.printf("소수 찾기 — 기댓값용 에라토스테네스의 체: 1천만 미만 소수 %,d개 (%.0fms)%n", primeDigits.size(), (System.nanoTime() - t0) / 1e6);
        // 길이 1~4 의 모든 숫자 조합(중복 조합) + 무작위 300개(길이 1~7)
        int all = 0;
        for (int len = 1; len <= 4; len++) all += allMultisets(len, 0, new StringBuilder());
        Random r = new Random(29);
        for (int t = 0; t < 300; t++) {
            int len = 1 + r.nextInt(7);
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < len; i++) sb.append((char) ('0' + r.nextInt(10)));
            String s = sb.toString();
            if (new FindPrimes().solution(s) != expectedPrimes(s)) throw new AssertionError("무작위 " + s);
        }
        System.out.println("소수 찾기 — 길이 1~4 의 모든 숫자 조합 " + all + "가지 + 무작위 300개(길이 1~7)에서 DFS 정답 풀이와 체로 센 기댓값이 같다");
        for (String s : new String[]{"0", "00", "1", "2", "1234567", "7777777", "0000000"}) {
            System.out.println("소수 찾기 —   \"" + s + "\" → " + new FindPrimes().solution(s));
        }
        calls = 0;
        countCalls("", "1234567", new boolean[7]);
        System.out.printf("소수 찾기 — 종이 7장일 때 dfs 호출 수 %,d번(빈 문자열 포함) — 모두 다른 숫자면 만든 수도 거의 그만큼%n", calls);
    }

    static int allMultisets(int len, int from, StringBuilder sb) {
        if (sb.length() == len) {
            String s = sb.toString();
            if (new FindPrimes().solution(s) != expectedPrimes(s)) throw new AssertionError("조합 " + s);
            return 1;
        }
        int n = 0;
        for (int d = from; d <= 9; d++) { sb.append((char) ('0' + d)); n += allMultisets(len, d, sb); sb.setLength(sb.length() - 1); }
        return n;
    }

    public static void main(String[] args) {
        checkDivisorSum();
        checkFindPrimes();
        System.out.println("\n모두 통과 — 로컬 검증이며 프로그래머스 재채점이 아니다.");
    }
}
