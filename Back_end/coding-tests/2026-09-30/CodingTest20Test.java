// 20회차 자바 두 문제를 로컬에서 확인한다. 프로그래머스 재채점이 아니다.
import java.util.*;

public class CodingTest20Test {

    // ---------- x만큼 간격이 있는 n개의 숫자 ----------
    static void checkXInterval() {
        XInterval target = new XInterval();
        int checked = 0;
        Random r = new Random(20260930L);
        int[] xs = {-10_000_000, -1, 0, 1, 2, 10_000_000};
        for (int x : xs) for (int n = 1; n <= 1000; n++) { expectX(target, x, n); checked++; }
        for (int k = 0; k < 20_000; k++) { expectX(target, r.nextInt(20_000_001) - 10_000_000, 1 + r.nextInt(1000)); checked++; }
        System.out.println("x만큼 간격 — " + String.format("%,d", checked) + "개 입력 통과 (경계 x 6개 × n 1~1000 + 무작위 20,000)");

        // long 이 왜 필요한가 — 가장 큰 경우 x = 10,000,000, n = 1000 → 마지막 값 100억
        int x = 10_000_000, n = 1000;
        long last = target.solution(x, n)[n - 1];
        int wrongInt = x * n;                 // int 끼리 곱하면 21억을 넘는 순간 넘친다
        long lateCast = (long) (x * n);       // 넘친 뒤에 long 으로 바꿔도 이미 늦다
        long rightCast = (long) x * n;        // 곱하기 전에 long 으로 바꿔야 한다
        System.out.println("  최대 입력의 마지막 값: 제출 코드 " + last
            + " / int 곱셈 " + wrongInt + " / (long)(x*n) " + lateCast + " / (long)x*n " + rightCast);
    }
    static void expectX(XInterval t, int x, int n) {
        long[] got = t.solution(x, n);
        if (got.length != n) throw new AssertionError("길이 x=" + x + " n=" + n);
        for (int i = 0; i < n; i++) {
            long want = (long) x * (i + 1);          // 기댓값: 곱셈으로 따로 계산
            if (got[i] != want) throw new AssertionError("x=" + x + " n=" + n + " i=" + i + ": " + got[i] + " != " + want);
        }
    }

    // ---------- 숫자 문자열과 영단어 ----------
    static final String[] WORDS = {"zero","one","two","three","four","five","six","seven","eight","nine"};

    /** 문제가 입력을 만드는 방식 그대로: 원래 숫자의 자릿수마다 숫자 또는 영단어를 고른다. */
    static String encode(String digits, Random r) {
        StringBuilder sb = new StringBuilder();
        for (char c : digits.toCharArray()) sb.append(r.nextBoolean() ? String.valueOf(c) : WORDS[c - '0']);
        return sb.toString();
    }

    static void checkNumberWords() {
        NumberWords target = new NumberWords();
        String[][] official = {{"one4seveneight","1478"},{"23four5six7","234567"},{"2three45sixseven","234567"},{"123","123"}};
        for (String[] ex : official) {
            int got = target.solution(ex[0]);
            if (got != Integer.parseInt(ex[1])) throw new AssertionError(ex[0] + " → " + got);
        }
        System.out.println("숫자 문자열과 영단어 — 공식 예제 4개 통과");

        Random r = new Random(20260930L);
        int checked = 0;
        while (checked < 50_000) {
            int value = 1 + r.nextInt(2_000_000_000);          // 반환값 범위 1 ~ 2,000,000,000
            if (r.nextInt(4) == 0) value = 1 + r.nextInt(1000); // 짧은 수도 섞는다
            String s = encode(Integer.toString(value), r);
            if (s.length() > 50) continue;                       // s 길이 ≤ 50
            int got = target.solution(s);
            if (got != value) throw new AssertionError(s + " → " + got + " (기대 " + value + ")");
            checked++;
        }
        // 가장 긴 경우와 0 이 섞인 경우
        int[] edge = {2_000_000_000, 1_000_000_000, 1_010_101_010, 1};
        for (int v : edge) {
            StringBuilder allWords = new StringBuilder();
            for (char c : Integer.toString(v).toCharArray()) allWords.append(WORDS[c - '0']);
            if (target.solution(allWords.toString()) != v) throw new AssertionError("경계 " + v);
        }
        System.out.println("숫자 문자열과 영단어 — 무작위 인코딩 50,000개 + 경계 4개 통과 (전부 영단어인 20억 = \""
            + "twozerozerozerozerozerozerozerozerozero\")");

        // 자바 String 은 불변 — 재대입을 빼면 아무것도 바뀌지 않는다
        String text = "banana";
        text.replace("a", "o");
        String before = text;
        text = text.replace("a", "o");
        System.out.println("  replace 결과를 다시 담지 않으면: " + before + " / 담으면: " + text);
    }

    public static void main(String[] args) {
        checkXInterval();
        checkNumberWords();
        System.out.println("모두 통과 — 로컬 검증이며 프로그래머스 채점 기록이 아니다.");
    }
}
