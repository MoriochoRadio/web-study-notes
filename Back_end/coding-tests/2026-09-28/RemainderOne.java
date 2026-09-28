// 19회차 JAVA 1번 — 나머지가 1이 되는 수 찾기 (프로그래머스 87389) · 제출 코드 그대로 (PASS)
// 원문의 class Solution 은 파일 이름에 맞춰 클래스 이름만 바꿨다.
class RemainderOne {
    public int solution(int n) {
        int answer = 0;
        for(int i=1;i<=n;i++){
            if(n%i==1){
                answer = i;
                break;
            }
        }
        return answer;
    }
}
