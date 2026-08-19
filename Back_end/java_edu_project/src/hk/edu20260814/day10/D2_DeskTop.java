package hk.edu20260814.day10;

//추상클래스를 상속받으면 반드시 추상메서드를 구현해야 된다.
public class D2_DeskTop extends D2_Computer {

    public D2_DeskTop() {
        super();
    }

    @Override
    public void display() {
        System.out.println("데스크탑 화면 출력");
    }

    @Override
    public void typing() {
        System.out.println("데스크탑 키보드 입력");
    }

}
