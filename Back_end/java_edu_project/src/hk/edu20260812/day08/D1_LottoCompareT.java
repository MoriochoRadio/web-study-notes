package hk.edu20260812.day08;

import java.util.Arrays;

// 추첨번호 -> D1_Lotto 객체 생성
// 구매번호 -> D1_LottoStore 객체 생성
public class D1_LottoCompareT {

    // 추첨번호
    public D1_Lotto lottoBall;

    // 구매한 번호(사용자 번호)
    public D1_LottoStore userBall;

    public D1_LottoCompareT() {
        this.lottoBall = new D1_Lotto();// 기본 숫자6개 생성
        this.userBall = new D1_LottoStore();// 기본 5장
    }

    public D1_LottoCompareT(int n) {
        this.lottoBall = new D1_Lotto();
        this.userBall = new D1_LottoStore(n);// n장
    }

    public D1_LottoCompareT(int m, int n) {
        this.lottoBall = new D1_Lotto(m);// 숫자 m개
        this.userBall = new D1_LottoStore(n);// n장
    }

    // 당첨번호를 확인하는 메서드 구현(각각의 로또별 당첨번호,당첨개수,등수)
    // [1,2,3,4,5,6] --> [2,3,4,6,7,8]
    // __________________[2,13,24,16,37,18]
    public void compareBall() {
        // 추첨한 번호 출력
        System.out.println("추첨번호");
        int[] lots = this.lottoBall.getLots();// [1,2,3,4,5,6]
        Arrays.sort(lots);// 정렬
        System.out.println(Arrays.toString(lots));

        // 구매자 번호 출력
        System.out.println("구매자 번호");
        D1_Lotto[] userLots = userBall.getLottoStore();// [Lotto,Lotto,Lotto,..]
        for (int i = 0; i < userLots.length; i++) {
            Arrays.sort(userLots[i].getLots());
            System.out.println(Arrays.toString(userLots[i].getLots()));
        }

        System.out.println("===========================");
        // 당첨번호 확인하기
        for (int i = 0; i < userLots.length; i++) {
            System.out.println(Arrays.toString(userLots[i].getLots()));
            int count = 0;
            for (int j = 0; j < lots.length; j++) {// 자식for문: 구매로또한장을 추첨번호와 비교
                // 구매번호[] , 추첨번호
                if (D1_LottoUtil.isSame(userLots[i].getLots(), lots[j])) {
                    System.out.print(lots[j] + " ");// 당첨번호출력
                    count++;
                }
            }
            System.out.println("당첨번호개수:" + count);
            D1_LottoUtil.lottoResult(count);
            System.out.println("------------------------------------");
        }
    }

    // // 당첨개수를 확인해서 해당 등수를 출력하는 기능
    // public void lottoResult(int count) {
    // switch (count) {
    // case 6:
    // System.out.println("1등");
    // break;
    // case 5:
    // System.out.println("2등");
    // break;
    // case 4:
    // System.out.println("3등");
    // break;
    // case 3:
    // System.out.println("4등");
    // break;
    // case 2:
    // System.out.println("5등");
    // break;
    // default:
    // System.out.println("다음기회에!!~~~");
    // break;
    // }
    // }

    // public boolean isSame(int[] a, int b) {
    // boolean isS = false;
    // for (int i = 0; i < a.length; i++) {
    // if (a[i] == b) {
    // isS = true;
    // break;
    // }
    // }
    // return isS;
    // }
}