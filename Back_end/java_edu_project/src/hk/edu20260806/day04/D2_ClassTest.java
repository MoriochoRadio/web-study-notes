package hk.edu20260806.day04;

public class D2_ClassTest {
    // 멤버필드: 클래스에서 데이터를 저장해서 사용하는 저장공간 개념
    // -> 객체가 사라지지 않는 한 항상 유지 됨
    public int number; // 인스턴스 멤버필드 (변수)
    public static int staticNumber; // 클래스 변수

    // 기본 생성자(deafult생성자) 파라미터 없음, 생략 가능,
    // //멤버필드 초기화나 초기 실행할 작업
    // 아래와 같이 파라미터가 있는 생성자를 추가하면 default생성자 생략 못함
    public D2_ClassTest() {
        // 자기 자신의 생성자 호출
        // 객체 생성할때 default 생성자를 호출하면 10으로 초기화함
        // this.number10;
        this(10);
    }

    // 생성자 오버로딩: 파라미터의 개수와 타입을 다르게 해서 생성자나 메서드 이름을 같게 사용
    public D2_ClassTest(int number) {
        // super:부모, this:자기자신 클래스
        this.number = number; // this->이 객체 자신을 의미. 멤버필드 number를 지칭
    }

    // 메서드: 인스턴스 메서드
    public void methodTest() {
        System.out.println("인스턴스에 관련된 기능을 정의한다");
    }

    // 메서드: 클래스 메서드
    public static void stmethodTest() {
        System.out.println("메서드영역 메모리에 생성되어 공통기능을 정의한다.");
    }
}
