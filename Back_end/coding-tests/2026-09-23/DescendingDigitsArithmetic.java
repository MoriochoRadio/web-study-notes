import java.util.Arrays;

// 오답노트의 두 번째 정답 풀이: 나머지와 정수 나눗셈으로 자릿수 분리.
public class DescendingDigitsArithmetic {
    public long solution(long n) {
        long[] arr = new long[String.valueOf(n).length()];
        long num = n;
        int count = 0;
        while (num > 0) {
            arr[count++] = num % 10;
            num /= 10;
        }
        Arrays.sort(arr);
        String ans = "";
        for (int i = arr.length - 1; i >= 0; i--) {
            ans = ans + arr[i];
        }
        return Long.parseLong(ans);
    }
}
