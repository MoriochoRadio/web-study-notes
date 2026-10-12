// 23회차 JAVA 2번 — 같은 숫자는 싫어 (프로그래머스 12906) · FAIL
// 오답노트의 제출 코드 칸은 비어 있다. 아래는 원문의 "정답 풀이"를 클래스 이름만 바꿔 옮긴 것이다.
import java.util.*;
import java.util.Stack;

public class NoSameNumber {
    public int[] solution(int []arr) {
        Stack<Integer> stack = new Stack<>();
        
        for (int i = 0; i < arr.length; i++) {
            // [핵심 조건]
            // 1. stack.isEmpty(): 스택이 비어있으면 첫 원소이므로 바로 추가
            // 2. stack.peek() != arr[i]: 스택의 맨 위(직전 원소)와 현재 원소가 다를 때만 추가
            // (자바의 || 연산자는 앞이 true면 뒤의 peek()을 검사하지 않으므로 빈 스택 에러가 나지 않음)
            if (stack.isEmpty() || stack.peek() != arr[i]) {
                stack.push(arr[i]);    
            } 
            // [참고] 아래 else if는 현재 숫자와 직전 숫자가 같을 때 실행됩니다.
            // 스택에서 꺼냈다가(pop) 똑같은 값을 다시 넣고 있으므로(push),
            // 이 블록 전체를 아예 지워버려도(즉, 같은 숫자면 아무것도 안 함) 똑같이 통과합니다.
            else if (!stack.isEmpty() && arr[i - 1] == arr[i]) {
                stack.pop();
                stack.push(arr[i]);
            } 
        }
        
        // 중복이 제거된 스택의 크기만큼 반환할 배열 선언
        int[] ans = new int[stack.size()];
        
        // Stack은 Vector를 상속받았기 때문에 get(i)로 바닥부터 인덱스 순서대로 복사 가능
        for (int i = 0; i < ans.length; i++) {
            ans[i] = stack.get(i);
        }
        
        return ans;
    }
}
