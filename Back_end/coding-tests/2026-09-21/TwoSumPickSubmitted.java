// 17회차 JAVA 2번 — 두 개 뽑아서 더하기 (프로그래머스 68644) · 제출 코드 그대로 (FAIL)
// 고치지 않고 보존한다. 무엇이 왜 틀렸는지는 CodingTest17Test 가 실제로 재현해 보여 준다.
import java.util.Arrays;

public class TwoSumPickSubmitted {
    public boolean same(int num, int[] answer) {
        for (int i = 0; i < answer.length; i++) {
            if (num == answer[i]) {
                return false;
            }
        }
        return true;
    }

    public int[] solution(int[] numbers) {
        int[] temp = new int[100];
        int count = 0;
        for (int i = 0; i < numbers.length - 1; i++) {
            for (int j = i + 1; j < numbers.length; j++) {
                int num = numbers[i] + numbers[j];
                if (same(num, temp) == true) {
                    temp[count] = numbers[i] + numbers[j];
                    count++;
                } else {
                    continue;
                }
            }
        }

        Arrays.sort(temp);

        int[] answer = new int[count];
        int count2 = 0;
        for (int i = 0; i < temp.length; i++) {
            if (temp[i] != 0) {
                answer[count2] = temp[i];
                count2++;
            }
        }

        return answer;
    }
}
