package hk.edu20260805.day03;

public class D2_MethodTest {
    // main 메서드는 프로그램을 실행시키는 진입점(시작점)
    // 구현된 메서드를 실행시켜주는 메서드
    public static void main(String[] args) {
        // static 메서드 사용: 클래스명.메서드() 호출해서 사용
        D2_MethodTest.test01();

        // non-static 메서드 사용: 객체생성후 메서드 호출
        D2_MethodTest methodTest = new D2_MethodTest();
        methodTest.test02();
    }

    // 메서드의 유형
    // 1.static과 non-static 유형
    public static void test01() {
        System.out.println("static 메서드");
        // test01() 은 이미 메모리에 올라가 있음
        // test02() 는 메모리에 올라가 있지 않음
        // non-static을 사용못함->객체생성이나, static으로 만들면 사용가능
        D2_MethodTest methodTest = new D2_MethodTest();
        methodTest.test02();
    }

    // non-static 메서드 -> 객체생성해야지만 사용 가능
    public void test02() {
        System.out.println("non-static 메서드");
    }

    // 2. 매개변수와 반환유무에 따른 유형
    // 매개변수 없음, 반환값 없음
    public int test03() {
        return 0;// 반환타입을 설정했다면 반드시 해당 타입을 반환
    }

    // 반환타입X는 코드만 실행하고 끝내는 경우
    public void test04() {

    }

    // 3. 파라미터 O/X : 외부로부터 값을 받아서 뭔가 실행하려고
    public int test05(int a, int b) {
        int res = 0;
        if (a > b) {
            res = a;
        } else {
            res = b;
        }
        return res;
    }

}
