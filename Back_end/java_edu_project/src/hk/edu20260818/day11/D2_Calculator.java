package hk.edu20260818.day11;

public abstract class D2_Calculator implements D2_Calc {

    @Override
    public int add(int num1, int num2) {
        return num1 + num2;
    }

    @Override
    public int substract(int num1, int num2) {
        return num1 - num2;
    }

    @Override
    public abstract int times(int num1, int num2);

    @Override
    public abstract int divide(int num1, int num2);

    public void showInfoParent() {
        System.out.println("부모 클래스에서만 정의한 메서드");
    }
}
