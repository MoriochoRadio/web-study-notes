package hk.edu20260818.day11;

public class D1_InterfaceMain {
    public static void main(String[] args) {
        D1_InterfaceChild it = new D1_InterfaceChild();
        it.test1();
        it.test2();
        it.test5();
        D1_InterfaceTest.test7(); // static 메서드

        // 인라인 방식
        // 익명 클래스 -> 이름이 없는 클래스 정의 -> 재활용X
        // interface는 자체적으로 객체 생성X
        D1_InterfaceTest it2 = new D1_InterfaceTest() {
            @Override
            public void test1() {
                System.out.println("인라인 익명클래스에서 구현한 test1");
            }

            @Override
            public int test2() {
                System.out.println("인라인 익명클래스에서 구현한 test2");
                return 0;
            }

            @Override
            public int test3() {
                System.out.println("인라인 익명클래스에서 구현한 test3");
                return 0;
            }

            @Override
            public void test5() {
                System.out.println("인라인 익명클래스에서 구현한 test5");
            }
        };
    }
}
