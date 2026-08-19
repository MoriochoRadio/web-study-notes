package hk.edu20260818.day11;

public class D2_CalculatorChild extends D2_Calculator {

    @Override
    public int divide(int num1, int num2) {
        if (num2 != 0)
            return num1 / num2;
        return ERROR;
    }

    @Override
    public int times(int num1, int num2) {
        return num1 * num2;
    }

    public void showInfoChild() {
        System.out.println("자식클래스에서만 정의한 메서드");
    }

}
