package hk.edu20260812.day08;

public class D2_ChildMain {

    public static void main(String[] args) {
        D2_Child child = new D2_Child();// 자식의 타입으로 자식을 생성
        child.childMethod();// 자식클래스에서 구현한 메서드호출
        child.parentMethod();// 부모 메서드도 호출 가

        D2_Parent child2 = new D2_Child();// 부모의 타입으로 자식을 생성
        // child2.childMethod();//(X)
        System.out.println("-----------------");
        child2.parentMethod();// 오버라이딩한 메서드(자식에서 구현한 메서드가 실행됨)
        D2_Child child3 = (D2_Child) child2;// 큰타입을 작은타입으로 변환
        child3.childMethod();

        // toString() -> 타겟이 기본타입이면 값을 문자열로 반환
        // -> 타겟이 참조타입이면 주소@hashcode를 문자열로 반환
        D2_Parent p = new D2_Parent();
        System.out.println(p.toString());
        System.out.println(child2);

        test(child);// parentMethod(): 5출력
        test(child2);// parentMethod(): 6출력
        test(child3);// parentMethod(): 7출력
    }

    // OOP 3대 개념 중 다형성
    // 자식객체들 : B, C, D ---> 부모객체: A 로 모두 참조 가능
    // 자식에서 재정의한 메서드들이 실행된다.
    public static void test(D2_Parent p) {
        p.parentMethod();// 오버라이딩되어 있어서 자식의 메서드가 실행

        // 만약에 자식에서만 구현된 메서드를 사용해야 된다면
        // 실제 생성된 객체타입을 확인해서 해당 타입으로 다운캐스팅한다.(형변환)
        // 설계도에 공개된 메서드만 사용가능하기 때문에
        if (p instanceof D2_Child) {
            D2_Child ch = (D2_Child) p;
            ch.childMethod();
        }
        // else if (p instanceof D2_Child2) {
        // D2_Child2 ch2 = (D2_Child2) p;
        // ch2.childMethod();
        // }
    }
}