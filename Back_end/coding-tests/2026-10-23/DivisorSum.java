// 29회차 프로그래밍 — 약수의 개수와 덧셈 (프로그래머스 77884) · 제출 코드 그대로 (PASS)
// 원문의 class Solution 은 파일 이름에 맞춰 클래스 이름만 바꿨다.
class DivisorSum {
    public int solution(int left, int right) {
    
        int sum=0;
        
        for(int i=left;i<=right;i++){
            int count = 2;
            if(i==1){
                count=1;
            }
            
            for(int j=2;j<=i/2;j++){
                if(i%j==0){
                    count++;
                }
            }
            
            if(count % 2 ==0){
                sum+=i;
            }else{
                sum-=i;
            }
        }
        
        return sum;
    }
}
