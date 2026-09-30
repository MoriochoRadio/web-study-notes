// 20회차 JAVA 2번 — 숫자 문자열과 영단어 (프로그래머스 81301) · FAIL
// 오답노트의 제출 코드 칸은 비어 있다. 아래는 원문의 "정답 풀이"를 클래스 이름만 바꿔 옮긴 것이다.
class NumberWords {
    public int solution(String s) {
        // 1. 0부터 9까지의 영단어를 인덱스 번호에 맞춰 순서대로 배열에 선언
        String[] words = {
            "zero", "one", "two", "three", "four",
            "five", "six", "seven", "eight", "nine"
        };
        // 2. 0부터 9까지 돌면서 문자열 s 안에 해당 영단어가 있으면 숫자로 교체
        for (int i = 0; i < words.length; i++) {
            // String.valueOf(i) 또는 Integer.toString(i)로 숫자 i를 문자열로 바꿈
            s = s.replace(words[i], Integer.toString(i));
        }
        // 3. 모든 영단어가 숫자로 바뀐 문자열(예: "1478")을 정수(int)로 변환하여 반환
        return Integer.parseInt(s);
    }
}
