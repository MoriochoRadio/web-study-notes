// 21회차 자바 두 문제를 로컬에서 확인한다. 프로그래머스 재채점이 아니다.
import java.util.*;

public class CodingTest21Test {

    // ---------- 문자열을 정수로 바꾸기 ----------
    static void checkStringToInt() {
        StringToInt target = new StringToInt();
        int checked = 0;
        // s 길이 1~5, 맨 앞은 부호(+, -)일 수 있고, 0으로 시작하지 않는다 → 가능한 입력을 전부 넣어 본다
        for (int v = -9999; v <= 99999; v++) {
            expectInt(target, Integer.toString(v), v); checked++;
            if (v > 0 && v <= 9999) { expectInt(target, "+" + v, v); checked++; }
        }
        System.out.println("문자열을 정수로 바꾸기 — 가능한 입력 " + String.format("%,d", checked) + "개 전부 통과 (-9999 ~ 99999, \"+1234\" 꼴 포함)");
        try {
            Integer.parseInt("12a4");
        } catch (NumberFormatException e) {
            System.out.println("  숫자가 아닌 글자가 섞이면: " + e.getClass().getSimpleName() + " — " + e.getMessage());
        }
    }
    static void expectInt(StringToInt t, String s, int want) {
        int got = t.solution(s);
        if (got != want) throw new AssertionError(s + " → " + got);
    }

    // ---------- 모의고사 ----------
    /** 기댓값: 사람마다 따로 채점하고, 최고점인 사람을 번호 순으로 모은다. */
    static int[] reference(int[] answers) {
        int[][] pats = {{1,2,3,4,5},{2,1,2,3,2,4,2,5},{3,3,1,1,2,2,4,4,5,5}};
        int[] score = new int[3];
        for (int p = 0; p < 3; p++)
            for (int i = 0; i < answers.length; i++)
                if (answers[i] == pats[p][i % pats[p].length]) score[p]++;
        int max = Arrays.stream(score).max().getAsInt();
        List<Integer> who = new ArrayList<>();
        for (int p = 0; p < 3; p++) if (score[p] == max) who.add(p + 1);
        return who.stream().mapToInt(Integer::intValue).toArray();
    }
    /** 흔한 실수: 동점자를 else if 로 고르면 한 명만 남는다. */
    static int[] withElseIf(int[] answers) {
        int[] all = reference(answers);   // 최고점 계산은 같다고 두고 고르는 방식만 바꾼다
        Set<Integer> top = new HashSet<>(); for (int x : all) top.add(x);
        List<Integer> list = new ArrayList<>();
        if (top.contains(1)) list.add(1);
        else if (top.contains(2)) list.add(2);
        else if (top.contains(3)) list.add(3);
        return list.stream().mapToInt(Integer::intValue).toArray();
    }

    static void checkMockExam() {
        MockExam target = new MockExam();
        int[][][] official = {{{1,2,3,4,5},{1}}, {{1,3,2,4,2},{1,2,3}}};
        for (int[][] ex : official) {
            int[] got = target.solution(ex[0]);
            if (!Arrays.equals(got, ex[1])) throw new AssertionError(Arrays.toString(ex[0]) + " → " + Arrays.toString(got));
        }
        System.out.println("모의고사 — 공식 예제 2개 통과");

        Random r = new Random(20261002L);
        int checked = 0, ties = 0;
        for (int k = 0; k < 20_000; k++) {
            int len = (k < 200) ? 10_000 : 1 + r.nextInt(30);    // 최대 길이 10,000 도 섞는다
            int[] a = new int[len];
            for (int i = 0; i < len; i++) a[i] = 1 + r.nextInt(5);
            int[] want = reference(a);
            if (want.length > 1) ties++;
            if (!Arrays.equals(target.solution(a), want)) throw new AssertionError("불일치 " + Arrays.toString(a));
            checked++;
        }
        System.out.println("모의고사 — 무작위 " + String.format("%,d", checked) + "개 통과 (길이 10,000 짜리 200개 포함, 동점자 있는 경우 " + String.format("%,d", ties) + "개)");

        int[] tie = {1,3,2,4,2};
        System.out.println("  동점 예제 [1,3,2,4,2]: 정답 풀이 " + Arrays.toString(target.solution(tie))
            + " / else if 로 고르면 " + Arrays.toString(withElseIf(tie)));
        int[] s = {2, 2, 2};   // 세 사람 점수
        int[] sorted = s.clone(); Arrays.sort(sorted);
        System.out.println("  점수 배열을 정렬하면 " + Arrays.toString(sorted) + " — 누가 몇 번 수포자였는지 정보가 사라진다");
    }

    public static void main(String[] args) {
        checkStringToInt();
        checkMockExam();
        System.out.println("모두 통과 — 로컬 검증이며 프로그래머스 채점 기록이 아니다.");
    }
}
