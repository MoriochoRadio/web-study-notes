// 21회차 JAVA 2번 — 모의고사 (프로그래머스 42840) · FAIL
// 오답노트의 제출 코드 칸은 비어 있다. 아래는 원문의 "정답 풀이"를 클래스 이름만 바꿔 옮긴 것이다.
import java.util.ArrayList;

class MockExam {
    public int[] solution(int[] answers) {
        // 1. 수포자 3인방의 찍기 패턴 정의
        int[] p1 = {1, 2, 3, 4, 5};
        int[] p2 = {2, 1, 2, 3, 2, 4, 2, 5};
        int[] p3 = {3, 3, 1, 1, 2, 2, 4, 4, 5, 5};

        // 2. 맞힌 문제 수를 저장할 점수 변수
        int score1 = 0, score2 = 0, score3 = 0;

        // 3. 정답 채점 (루프 1개로 세 사람 동시에 채점)
        for (int i = 0; i < answers.length; i++) {
            if (answers[i] == p1[i % p1.length]) score1++;
            if (answers[i] == p2[i % p2.length]) score2++;
            if (answers[i] == p3[i % p3.length]) score3++;
        }

        // 4. 세 사람 중 가장 높은 점수(최고점) 구하기
        int maxScore = Math.max(score1, Math.max(score2, score3));

        // 5. 최고점을 받은 사람 번호를 ArrayList에 담기 (크기를 미리 모르므로)
        ArrayList<Integer> list = new ArrayList<>();
        if (score1 == maxScore) list.add(1);
        if (score2 == maxScore) list.add(2);
        if (score3 == maxScore) list.add(3);

        // 6. ArrayList -> int[] 배열로 변환하여 반환
        int[] result = new int[list.size()];
        for (int i = 0; i < list.size(); i++) {
            result[i] = list.get(i);
        }

        return result;
    }
}
