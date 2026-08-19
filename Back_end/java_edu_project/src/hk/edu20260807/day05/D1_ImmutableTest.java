package hk.edu20260807.day05;

public class D1_ImmutableTest {
    public static void main(String[] args) {
        int a = 5;
        change01(a);
        System.out.println("원본 a변수의 값은?" + a);

        D1_ImmutableTest imTest = new D1_ImmutableTest();
        change02(imTest);
        System.out.println("원본 bb변수의 값은?" + imTest.bb);
    }

    public static void change01(int a) {
        a = 10; // 받은 쪽에서 10으로 값을 변경
    }

    public int bb = 5; // 멤버필드

    public static void change02(D1_ImmutableTest imTest) {
        int aa = imTest.bb; // 실제 값을 꺼내서 저장한뒤 사용
        aa = 15;
        imTest.bb = 10; // 직접 주소로 접근해서 값을 변경하는 경우 ->원본이 저장됨
    }
}
