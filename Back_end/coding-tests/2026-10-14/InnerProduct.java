// 25회차 JAVA 1번 — 내적 (프로그래머스 70128) · 제출 코드 그대로 (PASS)
// 원문의 class Solution 은 파일 이름에 맞춰 클래스 이름만 바꿨다.
class InnerProduct {
    public int solution(int[] a, int[] b) {
        int answer = 0;

        for(int i=0;i<a.length;i++){
            answer = answer+a[i]*b[i];
        }

        return answer;
    }
}
