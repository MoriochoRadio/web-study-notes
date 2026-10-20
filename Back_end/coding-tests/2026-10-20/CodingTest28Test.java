// 28회차 자바 두 문제를 로컬에서 확인한다. 프로그래머스 재채점이 아니다.
import java.util.*;

public class CodingTest28Test {

    // ---------- 가운데 글자 가져오기 ----------
    /** 기댓값: 길이에 따라 직접 자르는 다른 식 (짝수면 두 글자, 홀수면 한 글자) */
    static String expectedMiddle(String s) {
        int n = s.length();
        return n % 2 == 0 ? s.substring(n / 2 - 1, n / 2 + 1) : String.valueOf(s.charAt(n / 2));
    }

    static void checkMiddle() {
        MiddleChar submitted = new MiddleChar();
        MiddleCharAnswer answer = new MiddleCharAnswer();
        for (String[] ex : new String[][]{{"abcde", "c"}, {"qwer", "we"}}) {
            if (!submitted.solution(ex[0]).equals(ex[1]) || !answer.solution(ex[0]).equals(ex[1])) throw new AssertionError("공식 예제 " + ex[0]);
        }
        System.out.println("가운데 글자 가져오기 — 공식 예제 2개 통과 (abcde → c, qwer → we) · 제출 코드 · 정답 풀이 모두");
        Random r = new Random(28);
        String letters = "abcdefghijklmnopqrstuvwxyz가나다라마";
        for (int t = 0; t < 10_000; t++) {
            int n = 1 + r.nextInt(100);                      // 길이 1~100 (문제 조건)
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < n; i++) sb.append(letters.charAt(r.nextInt(letters.length())));
            String s = sb.toString(), want = expectedMiddle(s);
            if (!submitted.solution(s).equals(want)) throw new AssertionError("제출 " + s);
            if (!answer.solution(s).equals(want)) throw new AssertionError("정답 " + s);
        }
        System.out.println("가운데 글자 가져오기 — 무작위 10,000개(길이 1~100)에서 제출 코드 · 정답 풀이 모두 기댓값과 같다");
        String q = "qwer";
        int mid = q.length() / 2;
        System.out.println("가운데 글자 가져오기 — (함정) \"\" 없이 q.charAt(" + (mid - 1) + ") + q.charAt(" + mid + ") 를 하면 "
            + (q.charAt(mid - 1) + q.charAt(mid)) + " — char 끼리 더하면 문자 코드(119 + 101)의 합인 int 가 된다. 제출 코드의 st + … 가 문자열 이어 붙이기로 만든다");
    }

    // ---------- 카펫 ----------
    static void checkCarpet() {
        int[][][] ex = {{{10, 2}, {4, 3}}, {{8, 1}, {3, 3}}, {{24, 24}, {8, 6}}};
        for (int[][] e : ex) {
            if (!Arrays.equals(new Carpet().solution(e[0][0], e[0][1]), e[1])) throw new AssertionError("공식 예제 " + Arrays.toString(e[0]));
        }
        System.out.println("카펫 — 공식 예제 3개 통과 (10/2 → [4, 3], 8/1 → [3, 3], 24/24 → [8, 6])");
        // 가능한 모든 카펫(가로 w ≥ 세로 h ≥ 3, brown ≤ 5,000, 1 ≤ yellow ≤ 2,000,000)을 만들어 거꾸로 맞히는지
        int cases = 0;
        long t0 = System.nanoTime();
        for (int h = 3; 2 * h + 2 * h - 4 <= 5000; h++) {
            for (int w = h; 2 * w + 2 * h - 4 <= 5000; w++) {
                int brown = 2 * w + 2 * h - 4;
                long yellow = (long) (w - 2) * (h - 2);
                if (yellow < 1 || yellow > 2_000_000) continue;
                int[] got = new Carpet().solution(brown, (int) yellow);
                if (got.length != 2 || got[0] != w || got[1] != h) throw new AssertionError("카펫 " + w + "x" + h + " → " + Arrays.toString(got));
                cases++;
            }
        }
        double ms = (System.nanoTime() - t0) / 1e6;
        System.out.printf("카펫 — 조건 안의 모든 카펫 %,d개(가로 ≥ 세로 ≥ 3, brown ≤ 5,000, yellow ≤ 2,000,000)를 brown · yellow 로 바꿔 넣으면 모두 원래 [가로, 세로]가 나온다 (이 PC에서 %.0fms)%n", cases, ms);
        // 세로를 작은 쪽부터 올리기 때문에 처음 맞는 것이 '세로 ≤ 가로' — 큰 쪽부터 내려가면 뒤집힌다
        int brown = 24, yellow = 24, total = brown + yellow;
        int[] reversed = {};
        for (int h = total; h >= 3; h--) {
            if (total % h == 0) { int w = total / h; if ((w - 2) * (h - 2) == yellow) { reversed = new int[]{w, h}; break; } }
        }
        System.out.println("카펫 — (틀린 방법) 세로를 큰 쪽부터 내려가며 찾으면 24/24 → " + Arrays.toString(reversed)
            + " — 가로 < 세로가 되어 [8, 6] 과 순서가 반대");
    }

    public static void main(String[] args) {
        checkMiddle();
        checkCarpet();
        System.out.println("\n모두 통과 — 로컬 검증이며 프로그래머스 재채점이 아니다.");
    }
}
