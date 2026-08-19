package hk.edu20260819.day12;

import java.util.ArrayList;
import java.util.List;

public class D3_GBox<T> {
    private T item;

    public void set(T item) {
        this.item = item;
    }

    public T get() {
        return item;
    }

    public static void main(String[] args) {
        // String타입으로 정의
        D3_GBox<String> strBox = new D3_GBox<>();
        strBox.set("Hello~~~");
        System.out.println(strBox.get());

        // Integer타입으로 정의
        D3_GBox<Integer> intBox = new D3_GBox<>();
        intBox.set(1000);
        System.out.println(intBox.get());

        // 와일드카드: <? extends T> T와 T의 하위타입들: 읽기전용
        List<? extends Number> numbers = new ArrayList<Integer>();
        // numbers.add(100);// 추가,수정작업 X

        List<Integer> num = new ArrayList<>();
        num.add(100);
        num.add(101);
        num.add(102);

        numbers = num;// 값이 있는 객체를 참조시킨다.
        System.out.println(numbers.get(0));

        // printList2(num);
        printList1(num);
    }

    // 다형성 활용하기
    // List에 저장되면 타입간에 계층구조가 깨짐 -> 와일드 카드로 처리하면 계층구조 유지
    public static void printList1(List<? extends Number> list) {
        Integer i = (Integer) list.get(0);
        System.out.println(i);
    }

    public static void printList2(List<Number> list) {

    }
}