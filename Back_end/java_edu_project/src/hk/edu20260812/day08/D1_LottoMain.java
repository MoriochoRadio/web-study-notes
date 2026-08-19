package hk.edu20260812.day08;

import java.util.Arrays;

public class D1_LottoMain {

    public static void main(String[] args) {
        D1_Lotto lotto = new D1_Lotto(); // 객체생성할 때 생성자 호출시 번호 6개 자동추가

        // lotto.makeLotto();
        System.out.println(Arrays.toString(lotto.getLots()));

        // 별도에 클래스를 만들어서.. 로또를 여러장 관리하는 기능 구현
        D1_Lotto[] lottoStore = new D1_Lotto[5];
        D1_Lotto[] lottoStore2 = new D1_Lotto[] {
                new D1_Lotto(),
                new D1_Lotto(),
                new D1_Lotto(),
                new D1_Lotto(),
                new D1_Lotto()
        };

        for (int i = 0; i < lottoStore2.length; i++) {
            System.out.println(Arrays.toString(lottoStore2[i].getLots()));
        }

        System.out.println();

        D1_LottoCompare lottoCompare = new D1_LottoCompare();
        lottoCompare.checkLotto();

        D1_LottoCompareT lottoCompare2 = new D1_LottoCompareT();
        lottoCompare2.compareBall();

    }

}
