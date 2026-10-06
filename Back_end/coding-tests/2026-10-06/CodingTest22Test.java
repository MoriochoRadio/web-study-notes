// 22회차 자바 두 문제를 로컬에서 확인한다. 프로그래머스 재채점이 아니다.
import java.util.*;

public class CodingTest22Test {

    // ---------- 서울에서 김서방 찾기 ----------
    static void checkKimSeoul() {
        KimSeoul target = new KimSeoul();
        String got = target.solution(new String[]{"Jane", "Kim"});
        if (!got.equals("김서방은 1에 있다")) throw new AssertionError("공식 예제: " + got);
        Random r = new Random(20261006L);
        int checked = 0;
        for (int k = 0; k < 20_000; k++) {
            int len = 1 + r.nextInt(1000);                 // seoul 길이 1~1000, "Kim"은 딱 한 번
            String[] arr = new String[len];
            for (int i = 0; i < len; i++) arr[i] = "P" + r.nextInt(100);
            int pos = r.nextInt(len);
            arr[pos] = "Kim";
            String want = "김서방은 " + pos + "에 있다";
            if (!target.solution(arr).equals(want)) throw new AssertionError("pos=" + pos);
            checked++;
        }
        System.out.println("서울에서 김서방 찾기 — 공식 예제 + 무작위 " + String.format("%,d", checked) + "개 통과");

        // == 와 equals: 실행 중에 만든 "Kim"은 리터럴과 다른 객체다
        String made = new String("Kim");
        String joined = "Ki" + String.valueOf('m');
        System.out.println("  new String(\"Kim\") == \"Kim\" → " + (made == "Kim") + " / equals → " + made.equals("Kim")
            + " / 실행 중에 이어 붙인 \"Ki\"+'m' == \"Kim\" → " + (joined == "Kim"));
    }

    // ---------- 체육복 ----------
    /** 기댓값: 여벌을 가진 학생마다 "앞에게 / 뒤에게 / 안 빌려줌" 세 가지를 모두 시도해 최댓값을 구한다. */
    static int brute(int n, int[] lost, int[] reserve) {
        int[] have = new int[n + 2];
        for (int i = 1; i <= n; i++) have[i] = 1;
        for (int l : lost) have[l]--;
        for (int r : reserve) have[r]++;
        List<Integer> lenders = new ArrayList<>();
        for (int i = 1; i <= n; i++) if (have[i] == 2) lenders.add(i);
        return tryAll(have, lenders, 0, n);
    }
    static int tryAll(int[] have, List<Integer> lenders, int k, int n) {
        if (k == lenders.size()) { int c = 0; for (int i = 1; i <= n; i++) if (have[i] >= 1) c++; return c; }
        int best = tryAll(have, lenders, k + 1, n);              // 안 빌려줌
        int who = lenders.get(k);
        for (int to : new int[]{who - 1, who + 1}) {
            if (to < 1 || to > n || have[to] != 0) continue;
            have[to]++; have[who]--;
            best = Math.max(best, tryAll(have, lenders, k + 1, n));
            have[to]--; have[who]++;
        }
        return best;
    }


    /** 흔한 실수 ①: 뒤 번호(i+1)부터 빌린다 */
    static int backFirst(int n, int[] lost, int[] reserve) {
        int[] s = new int[n + 2];
        for (int i = 1; i <= n; i++) s[i] = 1;
        for (int l : lost) s[l]--;
        for (int r : reserve) s[r]++;
        for (int i = 1; i <= n; i++) {
            if (s[i] == 0 && s[i + 1] == 2) { s[i]++; s[i + 1]--; }
            else if (s[i] == 0 && s[i - 1] == 2) { s[i]++; s[i - 1]--; }
        }
        int c = 0; for (int i = 1; i <= n; i++) if (s[i] >= 1) c++;
        return c;
    }
    /** 흔한 실수 ②: 도난당한 여벌 학생을 빼지 않고 lost·reserve 배열을 그대로 비교한다 */
    static int ignoreOverlap(int n, int[] lost, int[] reserve) {
        int[] ls = lost.clone(); java.util.Arrays.sort(ls);
        boolean[] used = new boolean[n + 2];
        Set<Integer> res = new HashSet<>(); for (int r : reserve) res.add(r);
        int count = n - lost.length;
        for (int l : ls) for (int r : new int[]{l - 1, l + 1}) if (res.contains(r) && !used[r]) { used[r] = true; count++; break; }
        return count;
    }

    static void checkGymSuit() {
        GymSuit target = new GymSuit();
        int[][][] official = {{{5},{2,4},{1,3,5}}, {{5},{2,4},{3}}, {{3},{3},{1}}};
        int[] want = {5, 4, 2};
        for (int t = 0; t < 3; t++)
            if (target.solution(official[t][0][0], official[t][1], official[t][2]) != want[t]) throw new AssertionError("예제 " + t);
        System.out.println("체육복 — 공식 예제 3개 통과");

        // n = 2~8 에서 가능한 (lost, reserve) 조합을 전부 — 학생마다 (도난?, 여벌?) 4가지
        int checked = 0, overlap = 0;
        for (int n = 2; n <= 8; n++) {
            int total = 1; for (int i = 0; i < n; i++) total *= 4;
            for (int code = 0; code < total; code++) {
                List<Integer> L = new ArrayList<>(), R = new ArrayList<>();
                int c = code; boolean both = false;
                for (int i = 1; i <= n; i++, c /= 4) {
                    int s = c % 4;
                    if ((s & 1) != 0) L.add(i);
                    if ((s & 2) != 0) R.add(i);
                    if (s == 3) both = true;
                }
                if (L.isEmpty() || R.isEmpty()) continue;           // lost·reserve 길이는 1 이상
                Collections.shuffle(L, new Random(code));            // 입력은 정렬돼 있다는 보장이 없다
                int[] lost = L.stream().mapToInt(Integer::intValue).toArray();
                int[] reserve = R.stream().mapToInt(Integer::intValue).toArray();
                int got = target.solution(n, lost, reserve), exp = brute(n, lost, reserve);
                if (got != exp) throw new AssertionError("n=" + n + " lost=" + L + " reserve=" + R + " → " + got + " (기대 " + exp + ")");
                checked++; if (both) overlap++;
            }
        }
        System.out.println("체육복 — n 2~8 가능한 입력 전부 " + String.format("%,d", checked) + "개 통과 (도난당한 여벌 학생이 있는 경우 "
            + String.format("%,d", overlap) + "개 포함, lost 순서는 섞음)");

        System.out.println("  흔한 실수 ① 뒤 번호부터 빌리기 — n=4, lost=[2,4], reserve=[1,3] → 정답 풀이 "
            + target.solution(4, new int[]{2,4}, new int[]{1,3}) + " / 뒤 먼저 " + backFirst(4, new int[]{2,4}, new int[]{1,3}));
        System.out.println("  흔한 실수 ② 도난당한 여벌 학생 무시 — n=2, lost=[1], reserve=[1] → 정답 풀이 "
            + target.solution(2, new int[]{1}, new int[]{1}) + " / 무시하면 " + ignoreOverlap(2, new int[]{1}, new int[]{1}));
        System.out.println("  n=5, lost=[2,4], reserve=[3] → " + target.solution(5, new int[]{2,4}, new int[]{3})
            + " (3번의 여벌 하나는 앞 번호 2번이 먼저 받는다)");
    }

    public static void main(String[] args) {
        checkKimSeoul();
        checkGymSuit();
        System.out.println("모두 통과 — 로컬 검증이며 프로그래머스 채점 기록이 아니다.");
    }
}
