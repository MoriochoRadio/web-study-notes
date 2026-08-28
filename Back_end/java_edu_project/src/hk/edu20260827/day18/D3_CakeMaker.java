package hk.edu20260827.day18;

public class D3_CakeMaker implements Runnable {

    private D3_CakePlate cake;

    public D3_CakeMaker() {
    }

    public D3_CakeMaker(D3_CakePlate cake) {
        this.cake = cake;
    }

    @Override
    public void run() {
        for (int i = 0; i < 30; i++) {
            cake.makeBread();
        }

    }
}