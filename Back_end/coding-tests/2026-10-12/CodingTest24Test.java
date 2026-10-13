// 24회차 자바 두 문제를 로컬에서 확인한다. 프로그래머스 재채점이 아니다.
import java.io.*;
import java.util.*;

public class CodingTest24Test {

    // ---------- 음양 더하기 ----------
    /** 기댓값: 부호를 붙여 더한다 */
    static int reference(int[] a, boolean[] s) {
        int sum = 0;
        for (int i = 0; i < a.length; i++) sum += s[i] ? a[i] : -a[i];
        return sum;
    }

    static void checkSignedSum() {
        SignedSum target = new SignedSum();
        if (target.solution(new int[]{4, 7, 12}, new boolean[]{true, false, true}) != 9) throw new AssertionError("공식 예제 1");
        if (target.solution(new int[]{1, 2, 3}, new boolean[]{false, false, true}) != 0) throw new AssertionError("공식 예제 2");
        System.out.println("음양 더하기 — 공식 예제 2개 통과 ([4,7,12]/[t,f,t] → 9, [1,2,3]/[f,f,t] → 0)");

        Random r = new Random(24);
        for (int t = 0; t < 20_000; t++) {
            int n = 1 + r.nextInt(1000);
            int[] a = new int[n];
            boolean[] s = new boolean[n];
            for (int i = 0; i < n; i++) { a[i] = 1 + r.nextInt(1000); s[i] = r.nextBoolean(); }
            if (target.solution(a, s) != reference(a, s)) throw new AssertionError("무작위 " + t);
        }
        int[] big = new int[1000];
        Arrays.fill(big, 1000);
        boolean[] allPlus = new boolean[1000];
        Arrays.fill(allPlus, true);
        System.out.println("음양 더하기 — 무작위 20,000개(길이 1~1000, 값 1~1000) 통과. 합의 범위 "
            + target.solution(big, new boolean[1000]) + " ~ " + target.solution(big, allPlus) + " (int 로 충분)");
    }

    // ---------- 올바른 괄호 ----------
    /** 기댓값: 정수 카운터 (오답노트 '실무 팁'의 방법) */
    static boolean counter(String s) {
        int count = 0;
        for (char c : s.toCharArray()) {
            if (c == '(') count++;
            else if (--count < 0) return false;
        }
        return count == 0;
    }

    /** 제출 코드는 끝에 System.out.println(stack) 을 하므로, 비교하는 동안 출력을 버린다 */
    static boolean quiet(ValidParenthesesSubmitted sub, String s) {
        PrintStream old = System.out;
        System.setOut(new PrintStream(OutputStream.nullOutputStream()));
        try { return sub.solution(s); } finally { System.setOut(old); }
    }

    /** 제출 코드가 실제로 출력하는 글자 수 */
    static int printedChars(ValidParenthesesSubmitted sub, String s) {
        PrintStream old = System.out;
        ByteArrayOutputStream buf = new ByteArrayOutputStream();
        System.setOut(new PrintStream(buf));
        try { sub.solution(s); } finally { System.setOut(old); }
        return buf.size();
    }

    static double ms(Runnable job, int times) {
        job.run();                                         // 한 번 데워 둔다
        long t = System.nanoTime();
        for (int i = 0; i < times; i++) job.run();
        return (System.nanoTime() - t) / 1e6 / times;
    }

    static void checkParentheses() {
        ValidParentheses answer = new ValidParentheses();
        ValidParenthesesSubmitted sub = new ValidParenthesesSubmitted();

        String[] ex = {"()()", "(())()", ")()(", "(()("};
        boolean[] want = {true, true, false, false};
        for (int i = 0; i < ex.length; i++)
            if (answer.solution(ex[i]) != want[i] || quiet(sub, ex[i]) != want[i] || counter(ex[i]) != want[i])
                throw new AssertionError("공식 예제 " + ex[i]);
        System.out.println("올바른 괄호 — 공식 예제 4개 통과 (정답 풀이 · 제출 코드 · 정수 카운터 모두)");

        long total = 0, valid = 0;
        for (int len = 1; len <= 16; len++) {
            for (int bits = 0; bits < (1 << len); bits++) {
                char[] cs = new char[len];
                for (int k = 0; k < len; k++) cs[k] = ((bits >> k) & 1) == 1 ? '(' : ')';
                String s = new String(cs);
                boolean w = counter(s);
                if (answer.solution(s) != w) throw new AssertionError("정답 풀이 " + s);
                if (quiet(sub, s) != w) throw new AssertionError("제출 코드 " + s);
                total++;
                if (w) valid++;
            }
        }
        System.out.println("올바른 괄호 — 길이 1~16 의 모든 문자열 " + String.format("%,d", total)
            + "개: 정답 풀이 · 제출 코드 · 정수 카운터가 모두 같은 답 (올바른 것 " + String.format("%,d", valid) + "개)");

        // 문제의 최대 길이 100,000
        String balanced = "(".repeat(50_000) + ")".repeat(50_000);
        String closeFirst = ")" + "(".repeat(99_999);                 // 첫 글자부터 틀림
        String allOpen = "(".repeat(100_000);                         // 끝까지 닫히지 않음
        System.out.printf("올바른 괄호 — 길이 100,000 (평균, ms)%n");
        System.out.printf("  균형 맞음 (((…)))      정답 풀이 %.2f · 제출 코드 %.2f · 정수 카운터 %.2f%n",
            ms(() -> answer.solution(balanced), 20), ms(() -> quiet(sub, balanced), 20), ms(() -> counter(balanced), 20));
        System.out.printf("  첫 글자가 ')'          정답 풀이 %.4f · 제출 코드 %.2f  (정답 풀이는 첫 글자에서 바로 false)%n",
            ms(() -> answer.solution(closeFirst), 20), ms(() -> quiet(sub, closeFirst), 20));
        System.out.println("  제출 코드가 출력하는 글자 수 — 균형 맞음 " + printedChars(sub, balanced)
            + " · '(' 100,000개 " + String.format("%,d", printedChars(sub, allOpen)) + " (System.out.println(stack))");
    }

    public static void main(String[] args) {
        checkSignedSum();
        checkParentheses();
        System.out.println("\n모두 통과 — 로컬 검증이며 프로그래머스 재채점이 아니다.");
    }
}
