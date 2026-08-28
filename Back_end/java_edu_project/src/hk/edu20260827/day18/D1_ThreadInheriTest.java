package hk.edu20260827.day18;

public class D1_ThreadInheriTest extends Thread {
    @Override
    public void run() {
        for (int i = 0; i < 50; i++) {
            System.out.println("나는 Thread를 상속받은 스레드다");
            try {
                Thread.sleep(500);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }
}
