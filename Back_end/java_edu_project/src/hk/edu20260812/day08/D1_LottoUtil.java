package hk.edu20260812.day08;

public class D1_LottoUtil {

    // 중복체크 기능과, 등수 출력 기능은 공통기능이라고 생각하고
    // -> static메서드로 선언해서 사용해보자

    // 당첨개수를 확인해서 해당 등수를 출력하는 기능
    public static void lottoResult(int count) {
        switch (count) {
            case 6:
                System.out.println("1등");
                break;
            case 5:
                System.out.println("2등");
                break;
            case 4:
                System.out.println("3등");
                break;
            case 3:
                System.out.println("4등");
                break;
            case 2:
                System.out.println("5등");
                break;
            default:
                System.out.println("다음기회에!!~~~");
                break;
        }
    }

    public static boolean isSame(int[] a, int b) {
        boolean isS = false;
        for (int i = 0; i < a.length; i++) {
            if (a[i] == b) {
                isS = true;
                break;
            }
        }
        return isS;
    }
}