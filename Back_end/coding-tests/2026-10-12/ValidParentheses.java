// 24회차 JAVA 2번 — 올바른 괄호 (프로그래머스 12909) · 오답노트의 정답 풀이
// 제출 코드(ValidParenthesesSubmitted.java)도 PASS다. 아래는 원문에 함께 적힌 정석 풀이를 클래스 이름만 바꿔 옮긴 것이다.
import java.util.Stack;

class ValidParentheses {
    boolean solution(String s) {
        Stack<Character> stack = new Stack<>();

        for (char c : s.toCharArray()) {
            if (c == '(') {
                // 열린 괄호는 무조건 스택에 쌓는다
                stack.push(c);
            } else {
                // 닫힌 괄호(')')인데 꺼낼 '('가 없다면 그 즉시 잘못된 괄호
                if (stack.isEmpty()) {
                    return false;
                }
                // 짝이 맞으므로 꺼낸다
                stack.pop();
            }
        }

        // 모든 과정을 마친 뒤 스택이 깨끗하게 비어있어야 올바른 괄호
        return stack.isEmpty();
    }
}
