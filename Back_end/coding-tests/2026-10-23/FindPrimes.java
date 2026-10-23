// 29회차 JAVA — 소수 찾기 (프로그래머스 42839) · 원문 정답 풀이 (FAIL · 제출 코드 칸 비어 있음)
// 원문의 class Solution 은 파일 이름에 맞춰 클래스 이름만 바꿨다.
import java.util.HashSet;

class FindPrimes {
    // 1. 중복을 제거하며 숫자를 담을 바구니 (Set)
    HashSet<Integer> numberSet = new HashSet<>();
    boolean[] visited; // 종이 조각을 이미 사용했는지 체크하는 배열

    public int solution(String numbers) {
        visited = new boolean[numbers.length()];
        
        // [1단계] 모든 숫자 조합 만들기 시작 (현재까지 만든 문자열 "", 원본 문자열 numbers)
        dfs("", numbers);
        
        // [3단계] 만들어진 숫자들 중 소수가 몇 개인지 세기
        int count = 0;
        for (int num : numberSet) {
            if (isPrime(num)) {
                count++;
            }
        }
        
        return count;
    }

    // [1단계 & 2단계 함수] 재귀를 이용해 모든 숫자 조합을 만들고 Set에 넣기
    public void dfs(String current, String numbers) {
        // 빈 문자열이 아니면 숫자로 변환해서 Set에 저장
        // Integer.parseInt를 쓰면 "011" -> 11로 자동 변환됨!
        if (!current.equals("")) {
            numberSet.add(Integer.parseInt(current));
        }

        // 남은 종이 조각 중에서 하나씩 붙여보기
        for (int i = 0; i < numbers.length(); i++) {
            if (!visited[i]) { // 아직 안 쓴 종이 조각이라면
                visited[i] = true; // 사용했다고 표시
                dfs(current + numbers.charAt(i), numbers); // 뒤에 숫자를 붙여서 다음 단계로!
                visited[i] = false; // 돌아온 뒤에는 다른 조합을 위해 다시 '안 씀'으로 되돌림 (백트래킹)
            }
        }
    }

    // [3단계 함수] 소수 판별하기 (제곱근 탐색법 활용)
    public boolean isPrime(int n) {
        if (n < 2) return false; // 0과 1은 소수가 아님
        
        // 2부터 제곱근(i * i <= n)까지 나누어떨어지는지 확인
        for (int i = 2; i * i <= n; i++) {
            if (n % i == 0) {
                return false; // 하나라도 나누어떨어지면 소수가 아님
            }
        }
        return true; // 무사히 통과하면 소수!
    }
}
