package hk.edu20260818.day11;

public class D1_InterfaceChild implements D1_InterfaceTest {

    @Override
    public void test1() {
        System.out.println("메서드구현해야 함");
    }

    @Override
    public int test2() {

        return 0;
    }

    @Override
    public int test3() {

        return 0;
    }

    public void test4() {
        System.out.println("자식에서 따로 구현한 메서드");
    }

    // default 메서드를 재정의해서 사용
    @Override
    public void test5() {
        System.out.println("인터페이스의 디폴트 메서드를 오버라이딩 할 수 있다.");
    }

}
