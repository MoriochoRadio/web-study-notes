// 28회차 프로그래밍 1번 — 가운데 글자 가져오기 (프로그래머스 12903) · 원문 정답 풀이(substring)
// 원문의 class Solution 은 파일 이름에 맞춰 클래스 이름만 바꿨다.
class MiddleCharAnswer {
    public String solution(String s) {
        int cen = s.length() / 2;
        if (s.length() % 2 == 0) {
            return s.substring(cen - 1, cen + 1); // cen-1 부터 cen 까지 자름
        } else {
            return s.substring(cen, cen + 1);     // cen 한 글자만 자름
        }
    }
}
