// 17회차 JAVA 1번 — 자릿수 더하기 (프로그래머스 12931) · 제출 코드 그대로
// 10으로 나눈 나머지가 1의 자리, 10으로 나누면 그 자리를 버린다. 이를 0이 될 때까지 반복한다.
public class DigitSum {
    public int solution(int n) {
        int answer = 0;

        while (n > 0) {
            answer += n % 10;
            n /= 10;
        }

        return answer;
    }
}
