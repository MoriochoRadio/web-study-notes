// 22회차 JAVA 2번 — 체육복 (프로그래머스 42862) · FAIL
// 오답노트의 제출 코드 칸은 비어 있다. 아래는 원문의 "정답 풀이"를 클래스 이름만 바꿔 옮긴 것이다.
class GymSuit {
    public int solution(int n, int[] lost, int[] reserve) {
       
        int[] student = new int[n+2];
      
        for (int i = 1; i <= n; i++) student[i] = 1;

        for (int l : lost) student[l]--;

        for (int r : reserve) student[r]++;
        
        for(int i=1;i<=n;i++){
            if( (student[i]==0) && (student[i-1]==2) ){
                student[i]++;
                student[i-1]--;
            }else if( (student[i]==0) && (student[i+1]==2) ){
                student[i]++;
                student[i+1]--;
            }
        }
            
        int count=0;
        for(int i=1;i<=n;i++){
           if(student[i] >= 1){
                count++;
            }
        }
            
        return count;
    }
}
