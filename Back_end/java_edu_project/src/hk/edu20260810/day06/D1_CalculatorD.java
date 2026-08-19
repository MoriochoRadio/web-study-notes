package hk.edu20260810.day06;

// 곱셈기능의 클래스
public class D1_CalculatorD {
    // 계산할 값 2개를 저장할 멤버필드
    public int num1;
    public int num2;
    // 계산 결과를 저장할 멤버필드
    // 계산 결과는 중요한 값이기 때문에 외부에서 쉽게 접근하지 못하게 하자
    private int result;

    // default 생성자: 초기값 기본값으로 10,5로 셋팅하고 싶다면
    public D1_CalculatorD() {
        this(10, 5);
    }

    // 생성자 오버로딩(파라미터 2개)
    public D1_CalculatorD(int num1, int num2) {
        this.num1 = num1;
        this.num2 = num2;
    }

    // 기능 정의: 곱셈연산기능 구현
    public void a() {
        this.result = this.num1 * this.num2;
    }

    // getter 메서드: private 필드에 접근하여 값을 가져오기 위해 선언
    public int getResult() {
        return result;
    }
}
