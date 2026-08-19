package hk.edu20260807.day05;

import java.util.ArrayList;
import java.util.List;

public class D3_Singleton {

    public static void main(String[] args) {
        // 참조타입끼리 형변환
        D3_Singleton sm = new D3_Singleton();
        sm.test();
        Object obj = sm; // Object 부모 객체(더 큰 개념) -> 자동 형변환
        // obj.test(); //형변환되면 설계도가 바뀌기 때문에 test()를 못찾음
        D3_Singleton afterSm = (D3_Singleton) obj; // b=(byte)200 같은거임
        afterSm.test();// 이제 설계도에 test()가 보이므로 호출 가능
        // 주의사항: 객체간에 관계가 없는 것끼리는 형변환X

        // 기본타입과 참조타입 변환
        int a = 10;
        Object obj2 = a; // 참조타입 <--- 기본타입

        Integer ii = a;// 중간 진행 과정
        // Integer iii = new Integer(a);
        Object obj3 = ii;

        // Integer.parseInt("10");
        System.out.println(obj3.toString());
        int b = (int) obj3; // 언박싱해서 정수형으로 다시 사용한다.

        List<Integer> list = new ArrayList<>();
        list.add(10);
        // list.add("가"); //자동 형변환 -> 참조타입끼리는 가능

        // 싱글턴 패턴-------------------
        // D3_SingletomTest st = new D3_SingletomTest(); //x
        D3_SingletomTest st = D3_SingletomTest.getInstance();
        D3_SingletomTest st2 = D3_SingletomTest.getInstance();

    }

    public void test() {
        System.out.println("singleton메서드");
    }
}
