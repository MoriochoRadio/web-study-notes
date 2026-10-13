// 24회차 JAVA 2번 — 올바른 괄호 (프로그래머스 12909) · 제출 코드 그대로 (PASS)
// 원문의 class Solution 은 파일 이름에 맞춰 클래스 이름만 바꿨다. 오답노트에 함께 적힌 정석 풀이는 ValidParentheses.java
import java.util.Stack;

class ValidParenthesesSubmitted {
    boolean solution(String s) {

        Stack<Character> stack = new Stack<>();

        int t = s.length();
        int i = 0;
        while(true){
            if(i==t) break;
            if(stack.isEmpty() || ( stack.peek() == s.charAt(i) ) ){
                stack.push(s.charAt(i));
                i++;
            }else if(s.charAt(i) == ')' && stack.peek() == '('){
                stack.pop();
                i++;
            }else{
                stack.push(s.charAt(i));
                i++;
            }
        }
        System.out.println(stack);
        if(stack.isEmpty())return true;
        else return false;
    }
}
