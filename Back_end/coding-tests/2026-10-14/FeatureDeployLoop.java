// 25회차 JAVA 2번 — 기능개발 (프로그래머스 42586) · 오답노트의 정답 풀이 "방법 2. 큐 없이 반복문 하나로"
// 원문 정답 풀이를 클래스 이름만 바꿔 옮긴 것이다.
import java.util.*;

class FeatureDeployLoop {
    public int[] solution(int[] progresses, int[] speeds) {
        List<Integer> resultList = new ArrayList<>();

        int maxDay = 0;
        int count = 0;

        for (int i = 0; i < progresses.length; i++) {
            int remain = 100 - progresses[i];
            int days = (remain % speeds[i] == 0) ? (remain / speeds[i]) : (remain / speeds[i] + 1);

            if (days > maxDay) {
                // 이전까지 모인 작업이 있다면 결과 리스트에 추가 (맨 처음 i=0일 때는 건너뜀)
                if (count > 0) {
                    resultList.add(count);
                }
                maxDay = days; // 새 기준일 설정
                count = 1;     // 새 묶음 시작
            } else {
                count++;       // 기준일 안에 끝나므로 함께 배포
            }
        }
        resultList.add(count); // 마지막 묶음 추가

        int[] answer = new int[resultList.size()];
        for (int i = 0; i < resultList.size(); i++) {
            answer[i] = resultList.get(i);
        }
        return answer;
    }
}
