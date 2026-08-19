package hk.edu20260807.day05;

import java.util.Arrays;

public class D2_FinalTest {

    // 참조타입 상수 선언: 값변경 금지(X), 주소변경 금지(O)
    public static final int[] arrayNum = { 1, 2, 3, 4 };

    // 멤버필드에 static을 사용해서 상수를 정의하자
    public static final int num = 100;

    // 생성자를 통해서 값을 초기화하는 코드를 작성한다면 초기값 정의 안해도됨
    public final int num2;

    // 생성자
    public D2_FinalTest(int num2) {
        this.num2 = num2;
    }

    public static void main(String[] args) {
        int a = 5; // 값이 변경될 수 있음 -> 변수
        a = 15;

        final int b = 5; // 값이 변경되지 않음 -> 상수(상수는 대문자로 선언)
        // b = 15; // 에러발생 -> final로 선언된 변수는 값을 변경할 수 없다

        // 메서드에 파라미터를 통해 값을 변경한다면?
        int result1 = test01(20);
        int result2 = test01(40);

        // 생성자에 파라미터를 통해 값을 변경할 수 있다
        D2_FinalTest ft1 = new D2_FinalTest(100);
        D2_FinalTest ft2 = new D2_FinalTest(200);

        arrayNum[0] = 10;
        System.out.println(Arrays.toString(arrayNum));
        int[] test = { 1, 2, 3, 4, 5 };
        // arrayNum = test; // 에러발생 참조타입의 주소를 변경하려고 했다.

    }

    // 메서드에서 선언: 권장하지 않음
    public static int test01(int val) {
        final int aa = val;
        return aa;
    }
}
