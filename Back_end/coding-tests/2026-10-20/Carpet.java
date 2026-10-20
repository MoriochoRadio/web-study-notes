// 28회차 JAVA — 카펫 (프로그래머스 42842) · 원문 정답 풀이 (FAIL · 제출 코드 칸 비어 있음)
// 원문의 class Solution 은 파일 이름에 맞춰 클래스 이름만 바꿨다.
class Carpet {
    public int[] solution(int brown, int yellow) {
        int total = brown + yellow; // 전체 격자 개수 (넓이)
        
        // 세로 길이는 최소 3부터 시작합니다.
        for (int h = 3; h <= total; h++) {
            // total이 세로 길이(h)로 나누어 떨어져야 가로 길이(w)가 딱 맞아떨어집니다.
            if (total % h == 0) {
                int w = total / h; // 가로 길이
                
                // (가로 - 2) * (세로 - 2) 가 노란색 개수와 일치하는지 확인
                if ((w - 2) * (h - 2) == yellow) {
                    return new int[] { w, h };
                }
            }
        }
        
        return new int[] {};
    }
}
