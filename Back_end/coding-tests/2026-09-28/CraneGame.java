// 19회차 JAVA 2번 — 크레인 인형뽑기 게임 (프로그래머스 64061) · FAIL
// 오답노트의 제출 코드 칸은 비어 있다. 아래는 원문의 "정답 풀이"를 클래스 이름만 바꿔 옮긴 것이다.
import java.util.Stack;

class CraneGame {
    public int solution(int[][] board, int[] moves) {
        int answer = 0;
        Stack<Integer> basket = new Stack<>();
        // 1. 크레인 이동 명령을 하나씩 순서대로 실행
        for (int m : moves) {
            int col = m - 1; // 0번 인덱스에 맞추기 위해 -1
            // 2. 해당 열(col)의 맨 위(0행)부터 바닥까지 내려가며 인형 탐색
            for (int row = 0; row < board.length; row++) {
                if (board[row][col] != 0) {
                    int doll = board[row][col];
                    board[row][col] = 0; // 인형을 집었으니 빈칸(0)으로 변경
                    // 3. 바구니 맨 위 인형과 같은지 비교
                    if (!basket.isEmpty() && basket.peek() == doll) {
                        basket.pop(); // 기존 인형 제거
                        answer += 2;  // 2개 인형이 터졌으므로 +2
                    } else {
                        basket.push(doll); // 다른 인형이면 바구니에 담기
                    }
                    break; // 인형을 하나 집었으므로 다음 move로 이동
                }
            }
        }
        return answer;
    }
}
