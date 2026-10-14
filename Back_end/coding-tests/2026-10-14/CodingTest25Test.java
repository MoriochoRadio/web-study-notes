// 25회차 자바 두 문제를 로컬에서 확인한다. 프로그래머스 재채점이 아니다.
import java.util.*;

public class CodingTest25Test {

    // ---------- 내적 ----------
    /** 기댓값: long 으로 더해 넘침 없이 계산 */
    static long reference(int[] a, int[] b) {
        long sum = 0;
        for (int i = 0; i < a.length; i++) sum += (long) a[i] * b[i];
        return sum;
    }

    static void checkInnerProduct() {
        InnerProduct target = new InnerProduct();
        if (target.solution(new int[]{1, 2, 3, 4}, new int[]{-3, -1, 0, 2}) != 3) throw new AssertionError("공식 예제 1");
        if (target.solution(new int[]{-1, 0, 1}, new int[]{1, 0, -1}) != -2) throw new AssertionError("공식 예제 2");
        System.out.println("내적 — 공식 예제 2개 통과 ([1,2,3,4]·[-3,-1,0,2] → 3, [-1,0,1]·[1,0,-1] → -2)");

        Random r = new Random(25);
        for (int t = 0; t < 20_000; t++) {
            int n = 1 + r.nextInt(1000);
            int[] a = new int[n], b = new int[n];
            for (int i = 0; i < n; i++) { a[i] = r.nextInt(2001) - 1000; b[i] = r.nextInt(2001) - 1000; }
            if (target.solution(a, b) != reference(a, b)) throw new AssertionError("무작위 " + t);
        }
        int[] max = new int[1000], min = new int[1000];
        Arrays.fill(max, 1000);
        Arrays.fill(min, -1000);
        System.out.println("내적 — 무작위 20,000개(길이 1~1000, 값 -1000~1000) 통과. 합의 범위 "
            + String.format("%,d", target.solution(max, min)) + " ~ " + String.format("%,d", target.solution(max, max))
            + " (int 최댓값 " + String.format("%,d", Integer.MAX_VALUE) + " 안)");
    }

    // ---------- 기능개발 ----------
    /** 기댓값: 하루씩 실제로 진도를 올리며 앞에서부터 배포해 보는 모의 실행 */
    static int[] simulate(int[] progresses, int[] speeds) {
        int n = progresses.length;
        int[] p = progresses.clone();
        List<Integer> out = new ArrayList<>();
        int front = 0;
        while (front < n) {
            for (int i = front; i < n; i++) p[i] = Math.min(100, p[i] + speeds[i]);
            int c = 0;
            while (front < n && p[front] >= 100) { front++; c++; }
            if (c > 0) out.add(c);
        }
        return out.stream().mapToInt(Integer::intValue).toArray();
    }

    /** 흔한 실수 1: 같은 날 끝나는 뒤 작업을 따로 배포 (<= 대신 <) */
    static int[] strictLess(int[] progresses, int[] speeds) {
        List<Integer> out = new ArrayList<>();
        int maxDay = 0, count = 0;
        for (int i = 0; i < progresses.length; i++) {
            int days = (100 - progresses[i] + speeds[i] - 1) / speeds[i];
            if (days >= maxDay) { if (count > 0) out.add(count); maxDay = days; count = 1; }
            else count++;
        }
        out.add(count);
        return out.stream().mapToInt(Integer::intValue).toArray();
    }

    /** 흔한 실수 2: 반복문이 끝난 뒤 마지막 묶음을 넣지 않음 */
    static int[] noLastAdd(int[] progresses, int[] speeds) {
        List<Integer> out = new ArrayList<>();
        int maxDay = 0, count = 0;
        for (int i = 0; i < progresses.length; i++) {
            int days = (100 - progresses[i] + speeds[i] - 1) / speeds[i];
            if (days > maxDay) { if (count > 0) out.add(count); maxDay = days; count = 1; }
            else count++;
        }
        return out.stream().mapToInt(Integer::intValue).toArray();
    }

    static void checkFeatureDeploy() {
        FeatureDeployQueue queue = new FeatureDeployQueue();
        FeatureDeployLoop loop = new FeatureDeployLoop();
        int[][][] ex = {
            {{93, 30, 55}, {1, 30, 5}, {2, 1}},
            {{95, 90, 99, 99, 80, 99}, {1, 1, 1, 1, 1, 1}, {1, 3, 2}},
        };
        for (int[][] e : ex) {
            if (!Arrays.equals(queue.solution(e[0], e[1]), e[2])) throw new AssertionError("방법 1 공식 예제");
            if (!Arrays.equals(loop.solution(e[0], e[1]), e[2])) throw new AssertionError("방법 2 공식 예제");
            if (!Arrays.equals(simulate(e[0], e[1]), e[2])) throw new AssertionError("모의 실행 공식 예제");
        }
        System.out.println("기능개발 — 공식 예제 2개 통과 ([93,30,55]/[1,30,5] → [2, 1], [95,90,99,99,80,99]/[1×6] → [1, 3, 2]) — 방법 1 · 방법 2 · 하루씩 모의 실행");

        // 올림 나눗셈 세 가지와 틀린 방법 — 가능한 모든 (남은 작업량 1~99, 속도 1~100)
        int pairs = 0, wrongCeil = 0;
        for (int remain = 1; remain <= 99; remain++) {
            for (int speed = 1; speed <= 100; speed++) {
                int a = (remain % speed == 0) ? remain / speed : remain / speed + 1;
                int b = (remain + speed - 1) / speed;
                int c = (int) Math.ceil((double) remain / speed);
                if (a != b || b != c) throw new AssertionError("올림 " + remain + "/" + speed);
                if ((int) Math.ceil(remain / speed) != a) wrongCeil++;
                pairs++;
            }
        }
        System.out.println("기능개발 — 올림 나눗셈: 가능한 모든 (남은 작업량, 속도) " + String.format("%,d", pairs)
            + "쌍에서 삼항 연산자 · (remain + speed - 1) / speed · Math.ceil((double) …) 가 모두 같다. "
            + "(double) 없는 Math.ceil(remain / speed) 는 " + String.format("%,d", wrongCeil) + "쌍에서 하루 적게 나온다 (예: 7/3 → "
            + (int) Math.ceil(7 / 3) + ", 맞는 값 " + (int) Math.ceil((double) 7 / 3) + ")");

        Random r = new Random(25);
        int strictWrong = 0;
        for (int t = 0; t < 50_000; t++) {
            int n = 1 + r.nextInt(100);
            int[] p = new int[n], s = new int[n];
            for (int i = 0; i < n; i++) { p[i] = 1 + r.nextInt(99); s[i] = 1 + r.nextInt(100); }
            int[] want = simulate(p, s);
            if (!Arrays.equals(queue.solution(p, s), want)) throw new AssertionError("방법 1 무작위 " + t);
            if (!Arrays.equals(loop.solution(p, s), want)) throw new AssertionError("방법 2 무작위 " + t);
            if (!Arrays.equals(strictLess(p, s), want)) strictWrong++;
        }
        System.out.println("기능개발 — 무작위 50,000개(작업 1~100개, 진도 1~99, 속도 1~100): 방법 1 · 방법 2 모두 모의 실행과 같다");
        System.out.println("기능개발 — 틀린 변형 ① 같은 날 끝난 작업을 따로 배포(<=를 <로): 무작위 50,000개 중 "
            + String.format("%,d", strictWrong) + "개 오답, [99,99]/[1,1](둘 다 1일) → " + Arrays.toString(strictLess(new int[]{99, 99}, new int[]{1, 1}))
            + " (맞는 답 " + Arrays.toString(simulate(new int[]{99, 99}, new int[]{1, 1})) + ")");
        System.out.println("기능개발 — 틀린 변형 ② 반복문 뒤 resultList.add(count) 빠뜨림: 예제 1 → "
            + Arrays.toString(noLastAdd(ex[0][0], ex[0][1])) + " · 예제 2 → " + Arrays.toString(noLastAdd(ex[1][0], ex[1][1]))
            + " · 작업 1개 [50]/[50] → " + Arrays.toString(noLastAdd(new int[]{50}, new int[]{50})));
    }

    public static void main(String[] args) {
        checkInnerProduct();
        checkFeatureDeploy();
        System.out.println("\n모두 통과 — 로컬 검증이며 프로그래머스 재채점이 아니다.");
    }
}
