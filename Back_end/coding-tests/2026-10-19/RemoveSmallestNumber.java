// 27회차 프로그래밍 1번 — 제일 작은 수 제거하기 (프로그래머스 12935) · 원문 정답 풀이 (FAIL · 제출 코드 칸 비어 있음)
// 원문의 class Solution 은 파일 이름에 맞춰 클래스 이름만 바꿨다.
class RemoveSmallestNumber {
    public int[] solution(int[] arr) {
        // 1. 길이가 1 이하인 경우 [-1] 리턴
        if (arr.length <= 1) {
            return new int[] {-1};
        }

        // 2. 배열에서 가장 작은 값 찾기
        int min = arr[0];
        for (int i = 1; i < arr.length; i++) {
            if (arr[i] < min) {
                min = arr[i];
            }
        }

        // 3. 가장 작은 수를 제외한 나머지 원소들을 새 배열에 담기 (원래 순서 유지)
        int[] ans = new int[arr.length - 1];
        int index = 0;
        for (int i = 0; i < arr.length; i++) {
            if (arr[i] == min) {
                continue; // 최솟값과 같으면 건너뜀
            }
            ans[index++] = arr[i];
        }

        return ans;
    }
}
