package hk.edu20260814.day10;

public class D1_Eagle extends D1_Animal {

    // 부모의 메서드를 자식이 재정의 한다.
    @Override
    public void move() {
        System.out.println("독수리는 하늘을 납니다.");

    }

    // 자식에서만 정의한 메서드
    public void eat() {
        System.out.println("새를 먹어요");
    }
}
