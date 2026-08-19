package hk.edu20260812.day08;

import java.util.Arrays;

public class D1_LottoStore {
    public D1_Lotto[] lottos;

    public D1_LottoStore() {
        this(5);
    }

    public D1_LottoStore(int count) {
        this.lottos = new D1_Lotto[count];

        for (int i = 0; i < lottos.length; i++) {
            lottos[i] = new D1_Lotto();
        }
    }

    public void printLotto() {
        for (int i = 0; i < lottos.length; i++) {

            System.out.println(Arrays.toString(lottos[i].getLots()));
        }
    }

    public D1_Lotto[] getLottoStore() {
        return lottos;
    }

}
