// 26회차 자바 두 문제를 로컬에서 확인한다. 프로그래머스 재채점이 아니다.
import java.util.*;

public class CodingTest26Test {

    // ---------- 없는 숫자 더하기 ----------
    static void checkMissing() {
        MissingNumbersSum target = new MissingNumbersSum();
        if (target.solution(new int[]{1, 2, 3, 4, 6, 7, 8, 0}) != 14) throw new AssertionError("공식 예제 1");
        if (target.solution(new int[]{5, 8, 4, 0, 6, 7, 9}) != 6) throw new AssertionError("공식 예제 2");
        System.out.println("없는 숫자 더하기 — 공식 예제 2개 통과 ([1,2,3,4,6,7,8,0] → 14, [5,8,4,0,6,7,9] → 6)");
        // 0~9 의 부분집합 중 길이 1~9 인 것 전부 (중복 없는 배열 = 부분집합)
        int cases = 0;
        for (int mask = 1; mask < (1 << 10) - 1; mask++) {
            List<Integer> in = new ArrayList<>();
            int missing = 0;
            for (int d = 0; d <= 9; d++) { if ((mask >> d & 1) == 1) in.add(d); else missing += d; }
            int[] arr = in.stream().mapToInt(Integer::intValue).toArray();
            if (target.solution(arr) != missing) throw new AssertionError("부분집합 " + in);
            cases++;
        }
        System.out.println("없는 숫자 더하기 — 가능한 모든 입력(0~9 의 부분집합, 길이 1~9) " + cases + "개에서 '없는 숫자를 직접 더한 값'과 같다");
        // 중복이 있으면 45 - 합 은 깨진다 (문제 조건이 막아 주는 경우)
        System.out.println("없는 숫자 더하기 — (조건 밖) 중복이 있는 [9,9] 를 넣으면 " + target.solution(new int[]{9, 9})
            + " (실제 없는 숫자 0~8 의 합은 36) — '원소가 모두 다르다'는 조건 덕분에 되는 풀이");
    }

    // ---------- 타겟 넘버 ----------
    /** 기댓값: 부호 2^n 가지를 비트로 모두 세어 보는 반복문 (재귀를 쓰지 않음) */
    static int brute(int[] numbers, int target) {
        int n = numbers.length, count = 0;
        for (int mask = 0; mask < (1 << n); mask++) {
            int sum = 0;
            for (int i = 0; i < n; i++) sum += ((mask >> i & 1) == 1) ? numbers[i] : -numbers[i];
            if (sum == target) count++;
        }
        return count;
    }

    static void checkTarget() {
        if (new TargetNumber().solution(new int[]{1, 1, 1, 1, 1}, 3) != 5) throw new AssertionError("공식 예제 1");
        if (new TargetNumber().solution(new int[]{4, 1, 2, 1}, 4) != 2) throw new AssertionError("공식 예제 2");
        System.out.println("타겟 넘버 — 공식 예제 2개 통과 ([1,1,1,1,1]/3 → 5, [4,1,2,1]/4 → 2)");
        Random r = new Random(26);
        for (int t = 0; t < 2_000; t++) {
            int n = 2 + r.nextInt(13);                       // 2~14개 (비교용 반복문이 빨리 끝나게)
            int[] a = new int[n];
            for (int i = 0; i < n; i++) a[i] = 1 + r.nextInt(50);
            int target = 1 + r.nextInt(Math.min(1000, Arrays.stream(a).sum()));
            if (new TargetNumber().solution(a, target) != brute(a, target)) throw new AssertionError("무작위 " + t);
        }
        System.out.println("타겟 넘버 — 무작위 2,000개(숫자 2~14개, 1~50)에서 2^n 가지를 비트로 모두 센 값과 같다");
        int[] big = new int[20]; Arrays.fill(big, 1);
        long t0 = System.nanoTime();
        int res = new TargetNumber().solution(big, 2);
        double ms = (System.nanoTime() - t0) / 1e6;
        System.out.printf("타겟 넘버 — 최대 크기(숫자 20개 = 1 · 목표 2): 답 %,d, 이 PC에서 %.1fms (2^20 = 1,048,576 갈래)%n", res, ms);
        TargetNumber reused = new TargetNumber();
        int first = reused.solution(new int[]{1, 1, 1, 1, 1}, 3), second = reused.solution(new int[]{1, 1, 1, 1, 1}, 3);
        System.out.println("타겟 넘버 — (주의) 같은 객체로 두 번 부르면 " + first + " → " + second
            + " — answer 가 필드라 0으로 되돌아가지 않는다");
    }

    public static void main(String[] args) {
        checkMissing();
        checkTarget();
        System.out.println("\n모두 통과 — 로컬 검증이며 프로그래머스 재채점이 아니다.");
    }
}
