package hk.edu20260820.day13;

import java.util.ArrayList;
import java.util.List;

import hk.edu20260812.day08.D1_Lotto;

public class D1_ListTest {
    public static void main(String[] args) {

        // List 사용하기
        List list1 = new ArrayList();
        list1.add("A"); // Object타입 받을 수 있다. Object o = "A"
        String a = (String) list1.get(0); // String <-- Object : 형변환해줘야 함
        System.out.println(a);

        // 제네릭을 적용하자
        // class A<E> {
        // public E obj;
        // }
        List<String> list2 = new ArrayList<>();
        list2.add("A");
        list2.add("B");
        list2.add("C");
        list2.add("D");

        System.out.println(list2.toString());

        for (int i = 0; i < list2.size(); i++) {
            System.out.println(list2.get(i));
        }

        System.out.println(list2.contains("A")); // 리스트값 검색

        // 중간에 값을 추가하는 작업들이 많으면 ArrayList는 성능 효율이 낮다.
        list2.add(1, "F");// 1번째 인덱스에 "F"를 추가
        list2.remove(0);// 0번째 인덱스의 값을 제거

        // 로또객체 저장한다면
        List<D1_Lotto> lottoList = new ArrayList<>();
        lottoList.add(new D1_Lotto());
        lottoList.add(new D1_Lotto());
        lottoList.add(new D1_Lotto());

        for (int i = 0; i < lottoList.size(); i++) {
            System.out.println(lottoList.get(i));
        }

    }
}
