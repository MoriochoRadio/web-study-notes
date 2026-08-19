package hk.edu20260807.day05;

public class D3_SingletomTest {
    // static을 붙인 이유는 getInstance메서드가 static이라서
    private static D3_SingletomTest st;

    private D3_SingletomTest() {// 외부에서 접근 못함 --> new를 못함

    }

    public static D3_SingletomTest getInstance() {
        if (st == null) { // 객체가 생성되지 않았을때만 생성하자
            st = new D3_SingletomTest();
        }

        return st;

    }
}
