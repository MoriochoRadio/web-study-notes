import java.util.Arrays;

// 오답노트의 정답 풀이를 실행 가능한 클래스로 정리. 제출 코드는 원문에 없음.
public class DescendingDigitsString {
    public long solution(long n) {
        String[] arr = String.valueOf(n).split("");
        Arrays.sort(arr);
        StringBuilder sb = new StringBuilder();
        for (int i = arr.length - 1; i >= 0; i--) {
            sb.append(arr[i]);
        }
        return Long.parseLong(sb.toString());
    }
}
