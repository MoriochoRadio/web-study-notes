// 20회차 JAVA 1번 — x만큼 간격이 있는 n개의 숫자 (프로그래머스 12954) · 제출 코드 그대로 (PASS)
// 원문의 class Solution 은 파일 이름에 맞춰 클래스 이름만 바꿨다.
class XInterval {
    public long[] solution(int x, int n) {
        long[] answer = new long[n];
        answer[0]=x;
        for(int i=1;i<answer.length;i++){
            answer[i]= answer[i-1]+x;
        }
        return answer;
    }
}
