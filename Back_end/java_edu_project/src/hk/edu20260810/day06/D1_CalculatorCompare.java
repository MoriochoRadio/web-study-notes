package hk.edu20260810.day06;

public class D1_CalculatorCompare {
    // 은닉화(캡슐화)
    private int result; // 연산결과

    public int getResult() {
        return result;
    }

    // 연산할 때 필요한 값: 연산한 숫자2개, 연산자: "+,-,/,*"
    public void calculator(int num1, int num2, String cal) {
        // 분기형태로 실행 -> if문 ~ else
        if (cal.equals("+")) {
            D1_CalculatorA calA = new D1_CalculatorA(num1, num2);
            calA.a(); // 덧셈연산 실행
            this.result = calA.getResult(); // 은닉화: getter메서드 통해 결과 가져오기
        } else if (cal.equals("-")) {
            D1_CalculatorB calB = new D1_CalculatorB(num1, num2);
            calB.a(); // 뺄셈연산 실행
            this.result = calB.getResult();
        } else if (cal.equals("*")) {
            D1_CalculatorD calD = new D1_CalculatorD(num1, num2);
            calD.a(); // 곱셈연산 실행
            this.result = calD.getResult();
        } else if (cal.equals("/")) {
            D1_CalculatorC calC = new D1_CalculatorC(num1, num2);
            calC.a(); // 나눗셈연산 실행
            this.result = calC.getResult();
        } else {
            System.out.println("잘못된 연산자입니다.");
        }
    }
}
