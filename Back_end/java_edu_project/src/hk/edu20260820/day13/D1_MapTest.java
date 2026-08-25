package hk.edu20260820.day13;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Set;

public class D1_MapTest {
    public static void main(String[] args) {
        // Map -> k:v, k:v,...
        // JS -> js객체형태, JSON형태와 비슷한 구조
        // Map->JSON형태로 변환할 수 있다.

        Map<String, String> map = new HashMap<>();
        map.put("하나", "한경");
        map.put("둘", "닷컴");
        map.put("셋", "교육센터");
        map.put("셋", "교육센터"); // key는 중복할 수 없다.
        System.out.println(map.get("하나") + "," + map.get("둘"));

        // Map에서 일괄적으로 데이터를 가져오려면
        Set<String> setKeyMap = map.keySet(); // key들만 Set에 담아 반환
        // 1.iterator pattern 사용할 경우
        Iterator<String> iter = setKeyMap.iterator();// Iterator를 사용한 이유는 순차적으로 하나씩 데이터를 Set에서
                                                     // 가져오기 위해서
        while (iter.hasNext()) {
            System.out.println(map.get(iter.next())); // key로 value를 가져온다.
        }

        // 2.향상된 for문 사용할 경우
        for (String s : setKeyMap) {
            System.out.println(map.get(s));
        }

    }
}
