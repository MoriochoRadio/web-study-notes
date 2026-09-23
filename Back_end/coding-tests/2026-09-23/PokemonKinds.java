import java.util.HashSet;

// 오답노트의 정답 풀이. FAIL 제출본을 복원한 코드가 아님.
public class PokemonKinds {
    public int solution(int[] nums) {
        int maxPick = nums.length / 2;
        HashSet<Integer> pocket = new HashSet<>();
        for (int num : nums) {
            pocket.add(num);
        }
        int kindCount = pocket.size();
        if (kindCount > maxPick) {
            return maxPick;
        } else {
            return kindCount;
        }
    }
}
