// 같은 요구사항을 컬렉션으로 표현한 경우 — 중복 제거와 정렬을 TreeSet 이 대신한다.
// 수업에서 배운 Set 계열 선택 기준(중복 제거는 HashSet, 중복 제거 + 정렬은 TreeSet)이 그대로 적용된다.
import java.util.TreeSet;

public class TwoSumPickTreeSet {
    public int[] solution(int[] numbers) {
        TreeSet<Integer> sums = new TreeSet<>();
        for (int i = 0; i < numbers.length - 1; i++) {
            for (int j = i + 1; j < numbers.length; j++) {
                sums.add(numbers[i] + numbers[j]);
            }
        }
        return sums.stream().mapToInt(Integer::intValue).toArray();
    }
}
