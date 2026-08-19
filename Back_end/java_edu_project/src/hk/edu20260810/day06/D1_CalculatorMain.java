package hk.edu20260810.day06;

public class D1_CalculatorMain {
    public static void main(String[] args) {
        int num1 = 50;
        int num2 = 20;
        String[] cals = { "+", "-", "*", "/" };
        D1_CalculatorCompare calcu = new D1_CalculatorCompare();

        for (int i = 0; i < cals.length; i++) {
            String cal = cals[i];

            calcu.calculator(num1, num2, cal);
            System.out.printf("%d와 %d의 %s 연산 결과 : %d \n", num1, num2, cal, calcu.getResult());
        }
    }
}
