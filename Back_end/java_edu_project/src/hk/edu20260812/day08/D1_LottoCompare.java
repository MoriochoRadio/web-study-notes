package hk.edu20260812.day08;

import java.util.Arrays;

public class D1_LottoCompare {

    // 로또 객체와 로또가게 객체 2개만 선언
    D1_Lotto lot = new D1_Lotto();
    D1_LottoStore store = new D1_LottoStore(5);

    public void checkLotto() {
        int[] winLotto = lot.getLots();
        Arrays.sort(winLotto);
        D1_Lotto[] storeLotto = store.getLottoStore();

        System.out.println("=== 추첨번호 ===");
        System.out.println(Arrays.toString(winLotto));
        System.out.println();
        System.out.println("=== 구매번호 ===");
        for (int i = 0; i < storeLotto.length; i++) {
            Arrays.sort(storeLotto[i].getLots());
            System.out.println(Arrays.toString(storeLotto[i].getLots()));
        }
        System.out.println();
        System.out.println("=== 당첨결과 ===");

        for (int i = 0; i < storeLotto.length; i++) {
            int match = 0;
            String winNum = "";

            for (int j = 0; j < storeLotto[i].lots.length; j++) {
                for (int k = 0; k < winLotto.length; k++) {
                    if (storeLotto[i].lots[j] == winLotto[k]) {
                        match++;
                        winNum += storeLotto[i].lots[j] + " ";
                    }
                }
            }

            String rank = "";
            switch (match) {
                case 6:
                    rank = "1등";
                    break;
                case 5:
                    rank = "2등";
                    break;
                case 4:
                    rank = "3등";
                    break;
                case 3:
                    rank = "4등";
                    break;
                case 2:
                    rank = "5등";
                    break;
                default:
                    rank = "꽝";
                    break;
            }

            System.out.println(Arrays.toString(storeLotto[i].getLots())
                    + " : 당첨번호: " + winNum
                    + ", 당첨수:" + match + "개, " + rank);
        }
    }
}
