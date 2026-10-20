// 28회차 프로그래밍 1번 — 가운데 글자 가져오기 (프로그래머스 12903) · 제출 코드 그대로 (PASS)
// 원문의 class Solution 은 파일 이름에 맞춰 클래스 이름만 바꿨다.
class MiddleChar {
    public String solution(String s) {
        int cen = s.length() % 2;
        String st = "";
        if(cen % 2 == 0){
            return st+s.charAt(s.length()/2-1) + s.charAt(s.length()/2);
        }else{
            return st+s.charAt(s.length()/2);
        }
        
    }
}
