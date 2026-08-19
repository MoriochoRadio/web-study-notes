package hk.edu20260814.day10;

public abstract class D2_Computer {

    // 전원 켜고, 끄는 기능들은 노트북이나 데스크탑 모두 공통 기능이라
    // 명확하게 정의할 수 있다.
    public void turnOn() {
        System.out.println("전원을 켭니다");
    }

    public void turnOff() {
        System.out.println("전원을 끕니다");
    }

    // display 기능: 컴퓨터 유형별로 다르기 때문에 여기서 구현을 못함
    public abstract void display(); // 추상메서드

    // typing기능: 컴퓨터 유형별로 다르기 때문에 구현 못함
    public abstract void typing(); // 추상메서드
}
