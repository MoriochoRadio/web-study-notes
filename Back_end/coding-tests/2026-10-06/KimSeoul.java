// 22회차 JAVA 1번 — 서울에서 김서방 찾기 (프로그래머스 12919) · 제출 코드 그대로 (PASS)
// 원문의 class Solution 은 파일 이름에 맞춰 클래스 이름만 바꿨다.
class KimSeoul {
    public String solution(String[] seoul) {
        String answer = "김서방은 ";
        for(int i =0;i<seoul.length;i++){
            if(seoul[i].equals("Kim")){
                answer = answer+(Integer.toString(i))+"에 있다";
            }
        }
        return answer;
    }
}
