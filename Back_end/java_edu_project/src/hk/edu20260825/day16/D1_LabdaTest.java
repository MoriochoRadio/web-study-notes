package hk.edu20260825.day16;

public class D1_LabdaTest {
    public static void main(String[] args) {
        // 익명클래스방식
        D1_ILambda lam = new D1_ILambda() {
            @Override
            public int add(int a, int b) {
                return a + b;
            }
        };
        System.out.println(lam.add(1, 2));

        // 람다식 방식
        D1_ILambda lam2 = (a, b) -> {
            return a + b;
        };
        System.out.println(lam2.add(1, 2));

        // 람다식 방식 간략하게
        D1_ILambda lam3 = (a, b) -> a + b;
        System.out.println(lam3.add(1, 2));

    }
}
