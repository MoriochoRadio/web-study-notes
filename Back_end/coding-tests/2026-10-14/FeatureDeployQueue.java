// 25회차 JAVA 2번 — 기능개발 (프로그래머스 42586) · FAIL · 오답노트의 정답 풀이 "방법 1. 큐(Queue)"
// 원문 제출 코드 칸에는 이 문제가 아니라 24회차 '올바른 괄호' 제출 코드(../2026-10-12/ValidParenthesesSubmitted.java)가
// 공백만 다르고 그대로 들어 있다. 아래는 원문 정답 풀이를 클래스 이름만 바꿔 옮긴 것이다.
import java.util.*;

class FeatureDeployQueue {
    public int[] solution(int[] progresses, int[] speeds) {
        Queue<Integer> queue = new LinkedList<>();

        // 1. 각 작업의 완료까지 걸리는 일수를 계산하여 큐에 삽입
        for (int i = 0; i < progresses.length; i++) {
            int remain = 100 - progresses[i];
            int days = (remain % speeds[i] == 0) ? (remain / speeds[i]) : (remain / speeds[i] + 1);
            queue.offer(days);
        }

        List<Integer> resultList = new ArrayList<>();

        // 2. 큐에서 하나씩 꺼내며 배포 묶음 계산
        int maxDay = queue.poll(); // 첫 번째 작업의 소요일을 기준일로 설정
        int count = 1;

        while (!queue.isEmpty()) {
            int currentDay = queue.poll();

            if (currentDay <= maxDay) {
                // 기준일보다 일찍 또는 동시에 끝난 경우 함께 배포
                count++;
            } else {
                // 기준일보다 늦게 끝나는 경우, 이전 묶음을 배포 리스트에 기록
                resultList.add(count);
                maxDay = currentDay; // 새로운 기준일 갱신
                count = 1;           // 묶음 개수 1로 초기화
            }
        }
        resultList.add(count); // 마지막으로 남아있던 묶음 기록

        // 3. ArrayList를 int[] 배열로 변환
        int[] answer = new int[resultList.size()];
        for (int i = 0; i < resultList.size(); i++) {
            answer[i] = resultList.get(i);
        }

        return answer;
    }
}
