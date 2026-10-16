// 26회차 JAVA 1번 — 없는 숫자 더하기 (프로그래머스 86051) · 제출 코드 그대로 (PASS)
// 원문의 class Solution 은 파일 이름에 맞춰 클래스 이름만 바꿨다.
class MissingNumbersSum {
    public int solution(int[] numbers) {
        int sum = 45;
        
        for(int i=0;i<numbers.length;i++){
            sum= sum-numbers[i];
        }
        
        return sum;
    }
}
