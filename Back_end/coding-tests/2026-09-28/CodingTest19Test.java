// 19회차 자바 두 문제를 로컬에서 확인한다. 프로그래머스 재채점이 아니다.
//  - 나머지가 1이 되는 수: 제출 코드를 "n-1의 가장 작은 소인수" 표(에라토스테네스 체)와 비교한다.
//  - 크레인 인형뽑기: 원문 정답 풀이를, 열마다 인형을 쌓아 둔 덱으로 따로 짠 시뮬레이션과 비교한다.
import java.util.*;

public class CodingTest19Test {

    // ---------- 나머지가 1이 되는 수 ----------
    static int[] smallestPrimeFactor(int max) {
        int[] spf = new int[max + 1];
        for (int i = 2; i <= max; i++)
            if (spf[i] == 0)
                for (int j = i; j <= max; j += i)
                    if (spf[j] == 0) spf[j] = i;
        return spf;
    }

    static void checkRemainderOne() {
        final int MAX = 1_000_000;
        int[] spf = smallestPrimeFactor(MAX);
        RemainderOne target = new RemainderOne();
        int checked = 0;
        // n % x == 1  ⇔  x 가 n-1 을 나누고 x ≥ 2  →  답은 n-1 의 가장 작은 소인수
        for (int n = 3; n <= 50_000; n++) { expect(target, spf, n); checked++; }
        Random r = new Random(20260928L);
        for (int k = 0; k < 20_000; k++) { expect(target, spf, 3 + r.nextInt(MAX - 2)); checked++; }
        // 최악의 경우: n-1 이 소수면 반복이 n-1 번 돈다. 상한 근처의 그런 n 을 골라 시간도 본다.
        int worst = 0; long t0 = System.nanoTime();
        for (int n = MAX; n > 3 && worst < 20; n--)
            if (spf[n - 1] == n - 1) { expect(target, spf, n); worst++; checked++; }
        long ms = (System.nanoTime() - t0) / 1_000_000;
        expect(target, spf, 3); expect(target, spf, MAX); checked += 2;
        System.out.println("나머지가 1이 되는 수 — " + checked + "개 입력 통과 (3~50,000 전수 + 무작위 20,000 + 최악 20개 "
            + ms + "ms)");
    }

    static void expect(RemainderOne t, int[] spf, int n) {
        int want = spf[n - 1], got = t.solution(n);
        if (got != want) throw new AssertionError("n=" + n + ": " + got + " != " + want);
    }

    // ---------- 크레인 인형뽑기 ----------
    /** 기준 구현: 열마다 위에서부터 인형을 덱에 담아 두고 꺼낸다. 원문 풀이와 구조를 겹치지 않게 했다. */
    static int reference(int[][] board, int[] moves) {
        int n = board.length;
        List<ArrayDeque<Integer>> cols = new ArrayList<>();
        for (int c = 0; c < n; c++) {
            ArrayDeque<Integer> d = new ArrayDeque<>();
            for (int r = 0; r < n; r++) if (board[r][c] != 0) d.addLast(board[r][c]);
            cols.add(d);
        }
        List<Integer> basket = new ArrayList<>();
        int popped = 0;
        for (int m : moves) {
            Integer doll = cols.get(m - 1).pollFirst();
            if (doll == null) continue;                     // 빈 열이면 아무것도 안 집는다
            int last = basket.size() - 1;
            if (last >= 0 && basket.get(last).equals(doll)) { basket.remove(last); popped += 2; }
            else basket.add(doll);
        }
        return popped;
    }

    /** 원문 풀이에서 break 한 줄만 뺀 형태 — 비교용 시연이다. 실제 제출본이 아니다. */
    static int withoutBreak(int[][] board, int[] moves) {
        int answer = 0; Stack<Integer> basket = new Stack<>();
        for (int m : moves) {
            int col = m - 1;
            for (int row = 0; row < board.length; row++) {
                if (board[row][col] != 0) {
                    int doll = board[row][col]; board[row][col] = 0;
                    if (!basket.isEmpty() && basket.peek() == doll) { basket.pop(); answer += 2; }
                    else basket.push(doll);
                }
            }
        }
        return answer;
    }

    static int[][] copy(int[][] b) { int[][] c = new int[b.length][]; for (int i = 0; i < b.length; i++) c[i] = b[i].clone(); return c; }

    /** 인형은 바닥부터 쌓인다 — 열마다 높이를 정하고 아래에서부터 채운다. */
    static int[][] randomBoard(Random r, int n, int kinds) {
        int[][] b = new int[n][n];
        for (int c = 0; c < n; c++) {
            int h = r.nextInt(n + 1);
            for (int k = 0; k < h; k++) b[n - 1 - k][c] = 1 + r.nextInt(kinds);
        }
        return b;
    }

    static void checkCrane() {
        int[][] official = {{0,0,0,0,0},{0,0,1,0,3},{0,2,5,0,1},{4,2,4,4,2},{3,5,1,3,1}};
        int[] moves = {1,5,3,5,1,2,1,4};
        int got = new CraneGame().solution(copy(official), moves);
        if (got != 4) throw new AssertionError("공식 예제: " + got + " != 4");
        System.out.println("크레인 — 공식 예제 = " + got + " (기대 4)");
        System.out.println("  비교: break 를 뺀 형태는 같은 예제에서 " + withoutBreak(copy(official), moves) + " — 한 번에 여러 개를 집는다");

        Random r = new Random(20260928L);
        int trials = 0;
        for (int t = 0; t < 20_000; t++) {
            int n = 5 + r.nextInt(26);                       // 5 ≤ N ≤ 30
            int kinds = t % 3 == 0 ? 2 : 1 + r.nextInt(100);  // 종류가 적으면 연쇄가 자주 생긴다
            int[][] b = randomBoard(r, n, kinds);
            int[] mv = new int[1 + r.nextInt(1000)];         // 1 ≤ moves ≤ 1000
            for (int i = 0; i < mv.length; i++) mv[i] = 1 + r.nextInt(n);
            int want = reference(copy(b), mv), have = new CraneGame().solution(copy(b), mv);
            if (want != have) throw new AssertionError("무작위 " + t + ": " + have + " != " + want);
            trials++;
        }
        System.out.println("크레인 — 무작위 보드 " + String.format("%,d", trials) + "개 통과 (N 5~30, moves 1~1000)");
    }

    public static void main(String[] args) {
        checkRemainderOne();
        checkCrane();
        System.out.println("모두 통과 — 로컬 검증이며 프로그래머스 채점 기록이 아니다.");
    }
}
