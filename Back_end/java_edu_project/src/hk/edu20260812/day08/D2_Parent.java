package hk.edu20260812.day08;

public class D2_Parent {

    public int a;

    public D2_Parent() {
        System.out.println("부모생성자(default)");
    }

    public D2_Parent(int a) {
        System.out.println("부모생성자(오버로딩)");
    }

    public void parentMethod() {
        System.out.println("부모의 메서드:" + getClass());
    }

    @Override
    public String toString() {
        return "D2_Parent [a=" + a + "]";
    }

}