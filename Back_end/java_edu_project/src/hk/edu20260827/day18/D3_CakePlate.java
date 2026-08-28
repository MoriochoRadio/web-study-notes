package hk.edu20260827.day18;

public class D3_CakePlate {

    private int breadCount = 0;

    // eatBread()가 10개 모두 소진(notifyAll)-> wait()
    // -> makeBread()가실행 10모두 만듦(notifyAll)->wait()
    public synchronized void eatBread() {
        if (breadCount < 1) {
            System.out.println("빵이 모자라서 기다려야 함");
            try {
                wait();// 스레드를 일시정지
            } catch (InterruptedException e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
            }
        }
        breadCount--;
        System.out.println("빵을 1개 먹음. 총 " + breadCount + "개 남음");
        notifyAll();// 모든 스레드를 실행대기로 설정
    }

    public synchronized void makeBread() {
        if (breadCount >= 10) {
            System.out.println("빵이 남아요!");
            try {
                wait();// 스레드를 일시정지
            } catch (InterruptedException e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
            }
        }
        breadCount++;
        System.out.println("빵을 1개 더 만듦. 총 " + breadCount + "개");
        notifyAll();// 모든 스레드를 실행대기로 설정
    }
}