package hk.edu20260827.day18;

public class D3_CakeMain {

    public static void main(String[] args) {

        // 스레드들이 공유할 객체 생성
        D3_CakePlate cake = new D3_CakePlate();

        // runable구현한 클래스 생성
        D3_CakeEater eater = new D3_CakeEater(cake);
        D3_CakeMaker maker = new D3_CakeMaker(cake);

        // 스레드 객체 생성
        Thread t1 = new Thread(eater);
        Thread t2 = new Thread(maker);

        // 스레드 우선순위 1~10
        t2.setPriority(10);
        t1.setPriority(1);

        t1.start();
        t2.start();
    }
}