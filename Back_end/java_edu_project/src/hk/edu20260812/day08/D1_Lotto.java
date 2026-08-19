package hk.edu20260812.day08;

//Loto 클래스 --> 로또 한장
public class D1_Lotto {

    // 번호 6개가 저장될 배열
    public int[] lots;

    // 생성자: 클래스의 멤버필드를 초기화
    public D1_Lotto() {
        // this.lots = new int[6];
        this(6);
    }

    // 생성자 오버로딩
    public D1_Lotto(int n) {
        this.lots = new int[n];
        makeLotto();// 객체생성하자마자 번호6개 추가하기
    }

    // 1~45까지 숫자를 랜덤하게 생성하는 메서드
    public int makeBall() {
        return (int) (Math.random() * 45) + 1;
    }

    // 배열에 로또 번호 6 개를 넣어주는 메서드
    public void makeLotto() {
        int count = 0;
        while (count < lots.length) {
            int b = makeBall(); // 랜덤숫자 생성
            if (!isSame(lots, b)) {
                lots[count++] = b;
            }
        }

    }

    // 중복된 번호가 있는지 판별하는 메서드
    public boolean isSame(int[] a, int b) {
        boolean isS = false;
        for (int i = 0; i < a.length; i++) {
            if (a[i] == b) {
                isS = true;
                break;
            }
        }
        return isS;
    }

    public int[] getLots() {
        return lots;
    }

}
