package hk.edu20260818.day11;

public interface D1_InterfaceTest {
    // 맴버필드 선언 -> 자동으로 상수가 됨
    public int b = 50;
    public static final int A = 30;

    // 추상메서드: 그냥 작성해도 자동 추상메서드가 된다.
    public void test1();

    public abstract int test2();

    public int test3();

    // default 메서드
    public default void test5() {
        System.out.println("인터페이스에서 기능을 구현할 수 있는 메서드");
    }

    // private 메서드: 현재 Interface 내부에서 기능을 구현 -> 내부에서만 접근
    private void test6() {
        System.out.println("인터페이스 내부에서만 사용가능한 메서드.");
    }

    // static 메서드: 독립적인 기능을 제공할 떄
    static void test7() {
        System.out.println("인터페이스에서 독립적인 기능을 제공하는 메서드.");
    }

}
