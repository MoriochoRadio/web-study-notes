// 24회차 JAVA 1번 — 음양 더하기 (프로그래머스 76501) · 제출 코드 그대로 (PASS)
// 원문의 class Solution 은 파일 이름에 맞춰 클래스 이름만 바꿨다.
class SignedSum {
    public int solution(int[] absolutes, boolean[] signs) {
        int answer = 0;

        for(int i=0;i<absolutes.length;i++){
            if(signs[i]==true){
                answer = answer + absolutes[i];
            } else if (signs[i] == false){
                answer = answer - absolutes[i];
            }
        }

        return answer;
    }
}
