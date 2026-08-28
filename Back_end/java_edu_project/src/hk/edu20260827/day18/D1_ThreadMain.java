package hk.edu20260827.day18;

public class D1_ThreadMain {

    public static void main(String[] args) {
        // 스레드를 생성하는 방법2가지

        // 1.Runnable을 구현
        Runnable runObj = new D1_RunableTest();
        Thread tr1 = new Thread(runObj);
        tr1.start();
        tr1.setPriority(Thread.MAX_PRIORITY); // 우선순위범위: 1~10까지

        // 2.Thread 클래스 상속
        Thread tr2 = new D1_ThreadInheriTest();
        tr2.start();
        tr2.setPriority(Thread.MIN_PRIORITY); // 가장 하위순위 설정

        // 메인스레드
        for (int i = 0; i < 5; i++) {
            System.out.println("나는 메인 스레드다");
            try {
                Thread.sleep(500);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }

    }
}
