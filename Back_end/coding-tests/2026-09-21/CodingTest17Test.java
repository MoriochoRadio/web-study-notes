// 17회차 자바 두 문제를 한 번에 확인한다.
//  - 자릿수 더하기: 제출 코드를 독립적으로 만든 기댓값과 비교한다.
//  - 두 개 뽑아서 더하기: 제출 코드가 "왜" 실패하는지를 재현하고, 정정본 두 가지가 맞는지 확인한다.
// 기댓값은 TreeSet 도 배열 누적도 아닌 boolean 존재표로 따로 만든다. 검증 대상과 방식을 겹치지 않게 한다.
import java.util.Arrays;
import java.util.Random;

public class CodingTest17Test {

    /** 0~100 두 수의 합은 0~200 뿐이므로, 존재 여부만 표시했다가 작은 값부터 모은다. */
    static int[] expectedSums(int[] numbers) {
        boolean[] seen = new boolean[201];
        for (int i = 0; i < numbers.length - 1; i++)
            for (int j = i + 1; j < numbers.length; j++)
                seen[numbers[i] + numbers[j]] = true;
        int size = 0;
        for (boolean present : seen) if (present) size++;
        int[] result = new int[size];
        int at = 0;
        for (int value = 0; value < seen.length; value++) if (seen[value]) result[at++] = value;
        return result;
    }

    /** 자릿수 합을 문자열로 따로 구한다 — 나눗셈·나머지를 쓰지 않는 다른 방법. */
    static int expectedDigitSum(int n) {
        int sum = 0;
        for (char c : Integer.toString(n).toCharArray()) sum += c - '0';
        return sum;
    }

    static void checkDigitSum() {
        DigitSum target = new DigitSum();
        for (int n = 1; n <= 1_000_000; n++) {
            int actual = target.solution(n);
            int expected = expectedDigitSum(n);
            if (actual != expected)
                throw new AssertionError("자릿수 더하기 " + n + ": " + actual + " != " + expected);
        }
        for (int n : new int[] {1, 9, 10, 987654, 1_000_000, 9_999_999, 10_000_000}) {
            int actual = target.solution(n);
            int expected = expectedDigitSum(n);
            if (actual != expected)
                throw new AssertionError("자릿수 더하기 " + n + ": " + actual + " != " + expected);
        }
        System.out.println("자릿수 더하기 — 1~1,000,000 전수 + 상한 부근 통과");
    }

    static void reproduceSubmittedFailures() {
        TwoSumPickSubmitted submitted = new TwoSumPickSubmitted();

        // ① 합이 0인 값이 사라진다 — 아직 채우지 않은 칸의 0 과 구분하지 못하기 때문.
        int[] zeroCase = {0, 0, 1};
        int[] got = submitted.solution(zeroCase);
        int[] want = expectedSums(zeroCase);
        System.out.println("  [0,0,1] 기대 " + Arrays.toString(want) + " / 제출본 " + Arrays.toString(got));
        if (Arrays.equals(got, want))
            throw new AssertionError("제출본이 0 을 잃지 않았다 — 재현 조건을 다시 확인할 것");

        // ② 고유한 합이 100개를 넘으면 temp 를 벗어난다.
        int[] overflowCase = new int[100];
        for (int i = 0; i < overflowCase.length; i++) overflowCase[i] = i; // 0~99, 길이 100 (문제 제한 안)
        System.out.println("  0~99 (길이 100) 고유한 합 " + expectedSums(overflowCase).length + "개");
        try {
            submitted.solution(overflowCase);
            throw new AssertionError("제출본이 배열 범위를 벗어나지 않았다 — 재현 조건을 다시 확인할 것");
        } catch (ArrayIndexOutOfBoundsException e) {
            System.out.println("  제출본 → ArrayIndexOutOfBoundsException: " + e.getMessage());
        }
        System.out.println("두 개 뽑아서 더하기 — 제출본의 실패 두 가지를 재현함");
    }

    static void checkFixed() {
        TwoSumPickFixed fixed = new TwoSumPickFixed();
        TwoSumPickTreeSet treeSet = new TwoSumPickTreeSet();

        int[][] official = {{2, 1, 3, 4, 1}, {5, 0, 2, 7}};
        for (int[] numbers : official) compare(fixed, treeSet, numbers);

        // 원소 0~3 으로 만들 수 있는 길이 2~5 배열을 전부 확인한다.
        for (int length = 2; length <= 5; length++) {
            int total = (int) Math.pow(4, length);
            for (int code = 0; code < total; code++) {
                int[] numbers = new int[length];
                int rest = code;
                for (int i = 0; i < length; i++) { numbers[i] = rest % 4; rest /= 4; }
                compare(fixed, treeSet, numbers);
            }
        }

        // 제한 범위(길이 2~100, 값 0~100) 안에서 무작위로 확인한다.
        Random random = new Random(20260921L);
        for (int trial = 0; trial < 5000; trial++) {
            int[] numbers = new int[2 + random.nextInt(99)];
            for (int i = 0; i < numbers.length; i++) numbers[i] = random.nextInt(101);
            compare(fixed, treeSet, numbers);
        }

        // 경계: 전부 0 / 전부 100 / 길이 상한
        compare(fixed, treeSet, new int[] {0, 0});
        compare(fixed, treeSet, new int[] {100, 100});
        int[] maxLength = new int[100];
        for (int i = 0; i < maxLength.length; i++) maxLength[i] = i % 101;
        compare(fixed, treeSet, maxLength);

        System.out.println("두 개 뽑아서 더하기 — 정정본·TreeSet본 모두 통과");
    }

    static void compare(TwoSumPickFixed fixed, TwoSumPickTreeSet treeSet, int[] numbers) {
        int[] expected = expectedSums(numbers);
        int[] fixedResult = fixed.solution(numbers);
        if (!Arrays.equals(fixedResult, expected))
            throw new AssertionError("정정본 " + Arrays.toString(numbers)
                    + ": " + Arrays.toString(fixedResult) + " != " + Arrays.toString(expected));
        int[] treeSetResult = treeSet.solution(numbers);
        if (!Arrays.equals(treeSetResult, expected))
            throw new AssertionError("TreeSet본 " + Arrays.toString(numbers)
                    + ": " + Arrays.toString(treeSetResult) + " != " + Arrays.toString(expected));
    }

    public static void main(String[] args) {
        checkDigitSum();
        reproduceSubmittedFailures();
        checkFixed();
        System.out.println("모두 통과 — 로컬 검증이며 프로그래머스 채점 기록이 아니다.");
    }
}
