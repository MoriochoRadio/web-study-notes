// 30회차 자바 두 문제를 로컬에서 확인한다. 프로그래머스 재채점이 아니다.
import java.util.*;

public class CodingTest30Test {

    // ---------- 문자열 내림차순으로 배치하기 ----------
    /** 기댓값: 문자 코드(0~127) 개수를 세어 큰 코드부터 그만큼 이어 붙이는, 정렬을 쓰지 않는 방법 */
    static String expectedDesc(String s) {
        int[] cnt = new int[128];
        for (char c : s.toCharArray()) cnt[c]++;
        StringBuilder sb = new StringBuilder();
        for (int code = 127; code >= 0; code--) for (int k = 0; k < cnt[code]; k++) sb.append((char) code);
        return sb.toString();
    }

    static void checkStringDesc() {
        StringDesc sol = new StringDesc();
        if (!sol.solution("Zbcdefg").equals("gfedcbZ")) throw new AssertionError("공식 예제");
        System.out.println("문자열 내림차순으로 배치하기 — 공식 예제 통과 (\"Zbcdefg\" → \"gfedcbZ\")");
        Random r = new Random(30);
        String letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        for (int t = 0; t < 10_000; t++) {
            int n = 1 + r.nextInt(100);
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < n; i++) sb.append(letters.charAt(r.nextInt(letters.length())));
            String s = sb.toString();
            if (!sol.solution(s).equals(expectedDesc(s))) throw new AssertionError("무작위 " + s);
        }
        System.out.println("문자열 내림차순으로 배치하기 — 무작위 10,000개(영문 대소문자, 길이 1~100)에서 코드 개수를 세어 만든 기댓값과 같다");
        System.out.println("문자열 내림차순으로 배치하기 — \"aAbB\" → \"" + sol.solution("aAbB") + "\"  (오름차순 \"ABab\"을 뒤집은 것 — 대문자 65~90 < 소문자 97~122)");
        System.out.println("문자열 내림차순으로 배치하기 — 글자 하나 \"a\" → \"" + sol.solution("a") + "\", 같은 글자만 \"zzz\" → \"" + sol.solution("zzz") + "\"");
        // 틀리기 쉬운 방법들
        String s = "Zbcdefg";
        Character[] boxed = new Character[s.length()];
        for (int i = 0; i < boxed.length; i++) boxed[i] = s.charAt(i);
        Arrays.sort(boxed, (a, b) -> Character.toLowerCase(b) - Character.toLowerCase(a));
        StringBuilder ignoreCase = new StringBuilder();
        for (char c : boxed) ignoreCase.append(c);
        System.out.println("문자열 내림차순으로 배치하기 — (틀린 방법 ①) 대소문자를 무시하고 정렬하면 \"" + ignoreCase + "\" — 문제는 대문자가 소문자보다 작다고 정함");
        char[] arr = s.toCharArray();
        Arrays.sort(arr);
        String printed = arr.toString();
        System.out.println("문자열 내림차순으로 배치하기 — (틀린 방법 ②) 정렬한 char[]를 toString()하면 \"" + printed.substring(0, 3) + "…\" 꼴 — 글자가 아니라 배열의 주소 표시. new String(arr) = \"" + new String(arr) + "\"");
        System.out.println("문자열 내림차순으로 배치하기 — (틀린 방법 ③) 정렬만 하고 뒤집지 않으면(오름차순) \"" + new String(arr) + "\"");
    }

    // ---------- H-Index ----------
    /** 기댓값: 정의 그대로 h = n, n-1, …, 0 을 큰 쪽부터 시험 — "h번 이상 인용된 논문이 h편 이상"인 가장 큰 h */
    static int expectedH(int[] c) {
        for (int h = c.length; h >= 1; h--) {
            int cnt = 0;
            for (int x : c) if (x >= h) cnt++;
            if (cnt >= h) return h;
        }
        return 0;
    }

    static void checkHIndex() {
        if (new HIndex().solution(new int[]{3, 0, 6, 1, 5}) != 3) throw new AssertionError("공식 예제");
        System.out.println("H-Index — 공식 예제 통과 ([3, 0, 6, 1, 5] → 3)");
        int[][] edge = {{0}, {1}, {100}, {0, 0, 0}, {1, 1, 1}, {4, 4, 4, 4}, {10, 8, 5, 4, 3}, {25, 8, 5, 3, 3}, {1, 2}, {2, 2}, {9, 7, 6, 2, 1}};
        StringBuilder sb = new StringBuilder();
        for (int[] e : edge) {
            int want = expectedH(e), got = new HIndex().solution(e.clone());
            if (got != want) throw new AssertionError("경계 " + Arrays.toString(e) + " " + got + " ≠ " + want);
            sb.append(Arrays.toString(e)).append(" → ").append(got).append("  ");
        }
        System.out.println("H-Index — 경계 11개: " + sb.toString().trim());
        int[] big = new int[1000];
        Arrays.fill(big, 10_000);
        if (new HIndex().solution(big) != 1000) throw new AssertionError("1000편 모두 10,000회");
        System.out.println("H-Index — 1,000편이 모두 10,000회 인용 → " + new HIndex().solution(big) + " (논문 수가 상한, 첫 칸에서 바로 반환)");
        Random r = new Random(30);
        for (int t = 0; t < 20_000; t++) {
            int n = 1 + r.nextInt(30), max = 1 + r.nextInt(40);
            int[] c = new int[n];
            for (int i = 0; i < n; i++) c[i] = r.nextInt(max + 1);
            int[] copy = c.clone();
            if (new HIndex().solution(c) != expectedH(copy)) throw new AssertionError("무작위 " + Arrays.toString(copy));
        }
        System.out.println("H-Index — 무작위 20,000개(논문 1~30편, 인용 0~40회 이내)에서 정의 그대로 센 기댓값과 같다");
        for (int t = 0; t < 200; t++) {
            int n = 1 + r.nextInt(1000);
            int[] c = new int[n];
            for (int i = 0; i < n; i++) c[i] = r.nextInt(10_001);
            int[] copy = c.clone();
            if (new HIndex().solution(c) != expectedH(copy)) throw new AssertionError("큰 입력");
        }
        System.out.println("H-Index — 문제 상한(1,000편 · 0~10,000회) 안의 무작위 200개도 같다");
        // 틀리기 쉬운 방법: 중앙값 · 최댓값
        int differ = 0, total = 5000;
        for (int t = 0; t < total; t++) {
            int n = 1 + r.nextInt(15);
            int[] c = new int[n];
            for (int i = 0; i < n; i++) c[i] = r.nextInt(30);
            int[] s = c.clone();
            Arrays.sort(s);
            if (s[n / 2] != expectedH(c)) differ++;
        }
        int[] ex = {10, 8, 5, 4, 3}, sorted = ex.clone();
        Arrays.sort(sorted);
        System.out.println("H-Index — (틀린 방법) 정렬한 가운데 값을 답으로 하면 공식 예제는 우연히 맞지만, [10, 8, 5, 4, 3]은 가운데 " + sorted[2] + " ≠ 4. 무작위 5,000개 중 " + differ + "개가 다르다");
    }

    public static void main(String[] args) {
        checkStringDesc();
        checkHIndex();
        System.out.println("\n모두 통과 — 로컬 검증이며 프로그래머스 재채점이 아니다.");
    }
}
