// 27회차 자바 두 문제를 로컬에서 확인한다. 프로그래머스 재채점이 아니다.
import java.util.*;

public class CodingTest27Test {

    // ---------- 제일 작은 수 제거하기 ----------
    /** 기댓값: 스트림으로 최솟값을 구해 걸러 낸다 (원문 풀이와 다른 방법) */
    static int[] expectedRemove(int[] arr) {
        int min = Arrays.stream(arr).min().getAsInt();
        int[] rest = Arrays.stream(arr).filter(v -> v != min).toArray();
        return rest.length == 0 ? new int[]{-1} : rest;
    }

    static void checkRemove() {
        RemoveSmallestNumber target = new RemoveSmallestNumber();
        if (!Arrays.equals(target.solution(new int[]{4, 3, 2, 1}), new int[]{4, 3, 2})) throw new AssertionError("공식 예제 1");
        if (!Arrays.equals(target.solution(new int[]{10}), new int[]{-1})) throw new AssertionError("공식 예제 2");
        System.out.println("제일 작은 수 제거하기 — 공식 예제 2개 통과 ([4,3,2,1] → [4, 3, 2], [10] → [-1])");
        Random r = new Random(27);
        for (int t = 0; t < 5_000; t++) {
            int n = 1 + r.nextInt(20);
            LinkedHashSet<Integer> set = new LinkedHashSet<>();          // 원소가 모두 다르게 (문제 조건)
            while (set.size() < n) set.add(r.nextInt(2_001) - 1_000);
            int[] arr = set.stream().mapToInt(Integer::intValue).toArray();
            if (!Arrays.equals(target.solution(arr), expectedRemove(arr))) throw new AssertionError("무작위 " + Arrays.toString(arr));
        }
        System.out.println("제일 작은 수 제거하기 — 무작위 5,000개(길이 1~20, 서로 다른 -1000~1000)에서 스트림으로 걸러 낸 값과 같다");
        int[] demo = {4, 3, 2, 1};
        int[] sorted = demo.clone(); Arrays.sort(sorted);
        System.out.println("제일 작은 수 제거하기 — (틀린 방법) 정렬 후 맨 앞을 빼면 " + Arrays.toString(Arrays.copyOfRange(sorted, 1, sorted.length))
            + " — 원래 순서 [4, 3, 2] 가 깨진다");
        System.out.println("제일 작은 수 제거하기 — (조건 밖) 최솟값이 두 번 있는 [1,1,2] 를 넣으면 " + Arrays.toString(target.solution(new int[]{1, 1, 2}))
            + " — 두 개를 다 건너뛰어 뒤에 0 이 남는다. '원소가 모두 다르다'는 조건 덕분에 되는 풀이");
    }

    // ---------- 게임 맵 최단거리 ----------
    static int[][] copy(int[][] a) { int[][] c = new int[a.length][]; for (int i = 0; i < a.length; i++) c[i] = a[i].clone(); return c; }

    /** 기댓값: 큐 없이 "이웃보다 1 크게"를 바뀌는 것이 없을 때까지 되풀이 (Bellman-Ford 방식) */
    static int expectedPath(int[][] maps) {
        int n = maps.length, m = maps[0].length, INF = Integer.MAX_VALUE / 2;
        int[][] d = new int[n][m];
        for (int[] row : d) Arrays.fill(row, INF);
        d[0][0] = 1;
        boolean changed = true;
        while (changed) {
            changed = false;
            for (int x = 0; x < n; x++) for (int y = 0; y < m; y++) {
                if (maps[x][y] == 0 || d[x][y] == INF) continue;
                int[][] nb = {{x - 1, y}, {x + 1, y}, {x, y - 1}, {x, y + 1}};
                for (int[] p : nb) {
                    if (p[0] < 0 || p[0] >= n || p[1] < 0 || p[1] >= m || maps[p[0]][p[1]] == 0) continue;
                    if (d[x][y] + 1 < d[p[0]][p[1]]) { d[p[0]][p[1]] = d[x][y] + 1; changed = true; }
                }
            }
        }
        return d[n - 1][m - 1] == INF ? -1 : d[n - 1][m - 1];
    }

    static void checkPath() {
        int[][] ex1 = {{1,0,1,1,1},{1,0,1,0,1},{1,0,1,1,1},{1,1,1,0,1},{0,0,0,0,1}};
        int[][] ex2 = {{1,0,1,1,1},{1,0,1,0,1},{1,0,1,1,1},{1,1,1,0,0},{0,0,0,0,1}};
        if (new GameMapShortestPath().solution(copy(ex1)) != 11) throw new AssertionError("공식 예제 1");
        if (new GameMapShortestPath().solution(copy(ex2)) != -1) throw new AssertionError("공식 예제 2");
        System.out.println("게임 맵 최단거리 — 공식 예제 2개 통과 (11, -1)");
        Random r = new Random(27);
        int reached = 0, total = 3_000;
        for (int t = 0; t < total; t++) {
            int n = 1 + r.nextInt(12), m = (n == 1 ? 2 : 1) + r.nextInt(12);   // n, m 이 모두 1 인 경우는 없음 (문제 조건)
            int wall = r.nextInt(46);                                          // 벽 비율 0~45%
            int[][] g = new int[n][m];
            for (int[] row : g) for (int y = 0; y < m; y++) row[y] = r.nextInt(100) < wall ? 0 : 1;
            g[0][0] = 1; g[n - 1][m - 1] = 1;                                  // 출발 · 도착 칸은 길
            int want = expectedPath(g);
            if (want != -1) reached++;
            if (new GameMapShortestPath().solution(copy(g)) != want) throw new AssertionError("무작위 " + Arrays.deepToString(g));
        }
        System.out.println("게임 맵 최단거리 — 무작위 " + String.format("%,d", total) + "개(1~12 × 1~12, 벽 0~45%, 도착 가능 " + reached
            + "개)에서 큐 없이 되풀이해 구한 거리와 같다");
        System.out.println("게임 맵 최단거리 — 한 줄짜리 맵 [[1,1,1,1,1]] → " + new GameMapShortestPath().solution(new int[][]{{1, 1, 1, 1, 1}})
            + " (n = 1 도 허용되는 입력)");
        int[][] big = new int[100][100];
        for (int[] row : big) Arrays.fill(row, 1);
        long t0 = System.nanoTime();
        int res = new GameMapShortestPath().solution(big);
        double ms = (System.nanoTime() - t0) / 1e6;
        System.out.printf("게임 맵 최단거리 — 최대 크기 100 × 100 (벽 없음): 답 %d, 이 PC에서 %.1fms (칸 10,000개를 한 번씩)%n", res, ms);
        int[][] used = copy(ex1);
        new GameMapShortestPath().solution(used);
        System.out.println("게임 맵 최단거리 — 풀이가 끝난 뒤 맵: 도착 칸 " + used[4][4] + ", 출발 칸 " + used[0][0]
            + " — 입력 배열에 거리를 적는다(호출한 쪽의 배열이 바뀐다). 출발 칸은 1이라 '처음 가는 길'로 보여 이웃에서 한 번 3으로 덮인다(답에는 영향 없음)");
        System.out.println("게임 맵 최단거리 — (조건 밖) 도착 칸이 벽인 [[1,1],[1,0]] → " + new GameMapShortestPath().solution(new int[][]{{1, 1}, {1, 0}})
            + " — answer == 1 만 막아서 0 이 나온다(answer <= 1 이면 -1 로 막을 수 있음)");
    }

    public static void main(String[] args) {
        checkRemove();
        checkPath();
        System.out.println("\n모두 통과 — 로컬 검증이며 프로그래머스 재채점이 아니다.");
    }
}
