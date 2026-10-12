// 23회차 자바 두 문제를 로컬에서 확인한다. 프로그래머스 재채점이 아니다.
import java.util.*;

public class CodingTest23Test {

    // ---------- 콜라츠 추측 ----------
    /** 기댓값: long 으로 끝까지 따라가며 센다. 500번 안에 1이 안 되면 -1 */
    static int reference(int num) {
        long n = num;
        for (int c = 0; c <= 500; c++) {
            if (n == 1) return c;
            n = (n % 2 == 0) ? n / 2 : n * 3 + 1;
        }
        return -1;
    }
    /** 흔한 실수 ①: int 로 계산한다 */
    static int intVersion(int num) {
        int n = num, count = 0;
        while (n != 1) {
            if (count == 500) return -1;
            n = (n % 2 == 0) ? n / 2 : n * 3 + 1;
            count++;
        }
        return count;
    }
    /** 흔한 실수 ②: 카운트를 올린 뒤 ">= 500" 으로 먼저 끊는다 — 500번째에 1이 된 경우를 놓친다 */
    static int cutBeforeCheck(int num) {
        long n = num;
        int count = 0;
        while (n != 1) {
            n = (n % 2 == 0) ? n / 2 : n * 3 + 1;
            count++;
            if (count >= 500) return -1;
        }
        return count;
    }

    static void checkCollatz() {
        Collatz target = new Collatz();
        int[][] official = {{6, 8}, {16, 4}, {626331, -1}};
        for (int[] t : official)
            if (target.solution(t[0]) != t[1]) throw new AssertionError("공식 예제 " + t[0]);
        System.out.println("콜라츠 추측 — 공식 예제 3개 통과 (6→8, 16→4, 626331→-1)");

        int minusOne = 0, intDiff = 0, firstIntDiff = 0, exact500 = 0, firstExact500 = 0, overflowStart = 0;
        long maxSeen = 0; int maxSeenFrom = 0;
        for (int num = 1; num < 8_000_000; num++) {
            int want = reference(num);
            if (target.solution(num) != want) throw new AssertionError("num=" + num);
            if (want == -1) minusOne++;
            if (want == 500) { exact500++; if (firstExact500 == 0) firstExact500 = num; }
            if (intVersion(num) != want) { intDiff++; if (firstIntDiff == 0) firstIntDiff = num; }
            // 500번 안에서 가장 크게 올라간 값
            long n = num;
            for (int c = 0; c < 500 && n != 1; c++) {
                n = (n % 2 == 0) ? n / 2 : n * 3 + 1;
                if (n > Integer.MAX_VALUE && overflowStart == 0) overflowStart = num;
                if (n > maxSeen) { maxSeen = n; maxSeenFrom = num; }
            }
        }
        System.out.println("콜라츠 추측 — 1 이상 8,000,000 미만 전부 7,999,999개 통과 (-1 이 답인 수 " + String.format("%,d", minusOne) + "개)");
        System.out.println("  500번 안에서 가장 큰 중간값: " + String.format("%,d", maxSeen) + " (시작 " + maxSeenFrom + ") — int 최댓값 "
            + String.format("%,d", Integer.MAX_VALUE));
        System.out.println("  중간값이 int 를 처음 넘는 시작 수: " + overflowStart);
        System.out.println("  흔한 실수 ① int 로 계산 — 답이 달라지는 수 " + String.format("%,d", intDiff) + "개, 첫 번째 " + firstIntDiff
            + " → int " + intVersion(firstIntDiff) + " / 정답 " + reference(firstIntDiff)
            + " · 공식 예제 626331 → int " + intVersion(626331));
        System.out.println("  정확히 500번째에 1이 되는 수 " + exact500 + "개" + (exact500 > 0 ? " (첫 번째 " + firstExact500
            + " → 정답 풀이 " + target.solution(firstExact500) + " / 카운트 후 >= 500 으로 끊으면 " + cutBeforeCheck(firstExact500) + ")" : ""));
        System.out.println("  num == 1 → " + target.solution(1) + " (while (n != 1) 이 처음부터 거짓이라 첫 줄의 if 가 없어도 0)");
    }

    // ---------- 같은 숫자는 싫어 ----------
    static int[] reference(int[] arr) {
        List<Integer> out = new ArrayList<>();
        for (int i = 0; i < arr.length; i++) if (i == 0 || arr[i] != arr[i - 1]) out.add(arr[i]);
        return out.stream().mapToInt(Integer::intValue).toArray();
    }

    static void checkNoSame() {
        NoSameNumber target = new NoSameNumber();
        if (!Arrays.equals(target.solution(new int[]{1,1,3,3,0,1,1}), new int[]{1,3,0,1})) throw new AssertionError("예제 1");
        if (!Arrays.equals(target.solution(new int[]{4,4,4,3,3}), new int[]{4,3})) throw new AssertionError("예제 2");
        System.out.println("같은 숫자는 싫어 — 공식 예제 2개 통과");

        Random r = new Random(20261008L);
        int checked = 0;
        for (int k = 0; k < 20_000; k++) {
            int len = 1 + r.nextInt(200);
            int[] arr = new int[len];
            int range = 1 + r.nextInt(10);                       // 원소는 0~9, 범위를 좁혀 연속 중복을 많이
            for (int i = 0; i < len; i++) arr[i] = r.nextInt(range);
            if (!Arrays.equals(target.solution(arr), reference(arr))) throw new AssertionError(Arrays.toString(arr));
            checked++;
        }
        System.out.println("같은 숫자는 싫어 — 무작위 " + String.format("%,d", checked) + "개 통과");

        int[] big = new int[1_000_000];
        for (int i = 0; i < big.length; i++) big[i] = (i / 3) % 10;   // 세 개씩 같은 수
        long t0 = System.nanoTime();
        int size = target.solution(big).length;
        System.out.println("  길이 1,000,000 → 결과 " + String.format("%,d", size) + "개, " + (System.nanoTime() - t0) / 1_000_000 + "ms");

        // Integer 끼리 != 는 주소 비교 — -128~127 밖에서는 같은 값도 다르다고 나온다
        Stack<Integer> s = new Stack<>();
        s.push(1000);
        Integer next = 1000;
        System.out.println("  Integer 끼리 비교: peek() != Integer 1000 → " + (s.peek() != next)
            + " / peek() != int 1000 → " + (s.peek() != 1000) + " / equals → " + s.peek().equals(next)
            + " (이 문제는 0~9 라 드러나지 않는다)");
    }

    public static void main(String[] args) {
        checkCollatz();
        checkNoSame();
        System.out.println("모두 통과 — 로컬 검증이며 프로그래머스 채점 기록이 아니다.");
    }
}
