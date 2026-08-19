package hk.edu20260818.day11;

public class D2_CalculatorMain {
    public static void main(String[] args) {
        D2_Calc calc = new D2_CalculatorChild(); // 인터페이스 타입으로 자식생성
        D2_Calculator calc2 = new D2_CalculatorChild(); // 추상클래스 타입으로 자식 생성

        System.out.println("calc:" + calc.add(5, 5));
        // showInfo~() 호출못함
        calc2.showInfoParent(); // 부모클래스 타입이므로 부모에 공개된 메서드까지 호출 가능

        D2_CalculatorChild calc3 = (D2_CalculatorChild) calc2; // 형변환 -> 업캐스팅
        calc3.showInfoChild(); // 자식클래스에 메서드를 사용하려면 자식타입으로 형변환해야 된다.

    }
}
