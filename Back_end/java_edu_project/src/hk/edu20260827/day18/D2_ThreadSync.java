package hk.edu20260827.day18;

public class D2_ThreadSync {

    // Stringbuffer, Stringbuilder 를 공유하는 스레드 테스트하기
    public static StringBuilder sb = new StringBuilder();
    public static StringBuffer sf = new StringBuffer();

    public void sbTest(String s) {
        for (int i = 0; i < 1000; i++) {
            sf.append(s);
        }
        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        // 문자열의 길이 출력해서 1000인지 확인
        System.out.println(sf.length());
    }

    public static void main(String[] args) {

        // 공유객체 생성
        ShareObject so = new D2_ThreadSync().new ShareObject();
        // A와 B 스레드가 동시적으로 하나의 객체에 접근하는 상황
        // 동기화 설정하기: A스레드가 작업중이고 B스레드가 접근하려고 하면
        // A가 작업을 마칠때까지 기다려야한다.

        // 설정하는 방법 2가지: synchronized메서드, synchronized블럭
        Thread trA = new Thread() {
            @Override
            public void run() {
                synchronized (so) {
                    so.print("공");
                }
            }
        };
        Thread trB = new Thread() {
            @Override
            public void run() {
                synchronized (so) {
                    so.print("유");
                }
            }
        };
        // trA.start();
        // trB.start();

        // ======================
        // 스레드 2개를 위에 작성한것처럼 정의해서
        // sbTest() 실행해보기
        D2_ThreadSync d2 = new D2_ThreadSync();
        Thread tr1 = new Thread() {
            @Override
            public void run() {
                d2.sbTest("A"); // A를 1,000번 추가
            }
        };
        Thread tr2 = new Thread() {
            @Override
            public void run() {
                d2.sbTest("B"); // B를 1,000번 추가
            }
        };
        tr1.start();
        tr2.start();

    } // main 종료

    // 내부클래스
    class ShareObject {
        // public synchronized void print(String title)
        // 동기화 할 영역에 synchronized를 걸어주면 됨(객체에 걸어주면 그 객체에 접근한 애들만 못들어감)
        public void print(String title) {
            for (int i = 0; i < 10; i++) {
                System.out.println(title);
                try {
                    Thread.sleep(500);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        }
    }

}
