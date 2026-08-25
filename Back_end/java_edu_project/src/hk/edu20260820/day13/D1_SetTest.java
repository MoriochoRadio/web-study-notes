package hk.edu20260820.day13;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Set;

public class D1_SetTest {
    public static void main(String[] args) {
        Set<String> set = new HashSet<>();
        set.add("한");
        set.add("국");
        set.add("경");
        set.add("제");
        set.add("제");

        // 향상된 for문
        for (String s : set) {
            System.out.println(s);
        }

        // Iterator
        Iterator<String> iter = set.iterator(); // Set -> Iterator 객체로 변환
        while (iter.hasNext()) { // 값을 확인한다
            String str = iter.next(); // 값을 꺼낸다
            System.out.println(str);
        }

        // 꺼내는 다른 방법: List로 변환 -> 원하는값만 가져올 수 있다.
        List<String> list = new ArrayList<>(set);
        System.out.println(list.get(2));

    }

}
