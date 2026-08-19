package hk.edu20260812.day08;

//문법: extends , 다중상속X
public class D2_Child extends D2_Parent {

    public String s = "나는 자식의 맴버필드 값이야";

    public D2_Child() {
        this(5);
        System.out.println("자식생성자(default)");
    }

    public D2_Child(int a) {
        super(a);// 부모가 먼저 생성된후 자식이 생성된다.
        System.out.println("자식생성자(오버로딩)");
    }

    public void childMethod() {
        parentMethod();// 부모메서드를 자식의메서드처럼 사용가능
        System.out.println("자식클래스에서 정의된 메서드:" + getClass());
    }

    // 부모의 메서드를 자식이 재정의하는 기능
    @Override
    public void parentMethod() {
        System.out.println("부모메서드를 자식이 재정의한 메서드");
    }

    // Object클래스에 구현된 메서드
    @Override
    public String toString() {
        // return "나는 Child객체야~~";
        return s;
    }

}