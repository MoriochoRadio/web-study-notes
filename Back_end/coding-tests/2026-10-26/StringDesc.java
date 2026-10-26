// 30회차 프로그래밍 — 문자열 내림차순으로 배치하기 (프로그래머스 12917) · 원문 정답 풀이 (FAIL · 제출 코드 칸 비어 있음)
// 원문의 class Solution 은 파일 이름에 맞춰 클래스 이름만 바꿨다.
import java.util.Arrays;

class StringDesc {
    public String solution(String s) {
        // 1. 문자열을 char 배열로 변환
        char[] charArray = s.toCharArray();
        
        // 2. 오름차순 정렬 (기본 정렬)
        Arrays.sort(charArray);
        
        // 3. 정렬된 배열을 String으로 만든 후, reverse()로 뒤집어서 내림차순 완성
        return new StringBuilder(new String(charArray)).reverse().toString();
    }
}
