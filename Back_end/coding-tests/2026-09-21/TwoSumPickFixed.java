// 17회차 JAVA 2번 — 두 개 뽑아서 더하기 (프로그래머스 68644) · 정정한 풀이
// 제출본에서 세 가지를 고쳤다.
//  1) temp 크기 100 -> 300 : 원소가 0~100 이므로 두 수의 합은 0~200, 고유값이 100개를 넘을 수 있다.
//  2) 중복 검사 범위를 count 까지로 한정 : 아직 채우지 않은 칸의 0 을 "이미 있는 값"으로 오인하지 않게 한다.
//  3) copyOf 로 유효 구간만 잘라낸 뒤 정렬 : 빈칸 0 을 지우려다 정답인 0 까지 지우는 일을 막는다.
import java.util.Arrays;

public class TwoSumPickFixed {
    public boolean same(int num, int[] arr, int count) {
        for (int i = 0; i < count; i++) {
            if (num == arr[i]) {
                return false;
            }
        }
        return true;
    }

    public int[] solution(int[] numbers) {
        int[] temp = new int[300];
        int count = 0;

        for (int i = 0; i < numbers.length - 1; i++) {
            for (int j = i + 1; j < numbers.length; j++) {
                int num = numbers[i] + numbers[j];
                if (same(num, temp, count)) {
                    temp[count] = num;
                    count++;
                }
            }
        }

        int[] answer = Arrays.copyOf(temp, count);
        Arrays.sort(answer);

        return answer;
    }
}
