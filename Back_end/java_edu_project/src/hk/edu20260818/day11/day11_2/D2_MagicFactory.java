package hk.edu20260818.day11.day11_2;

import java.util.Scanner;

public class D2_MagicFactory {

    // singleton pattern 적용
    private static D2_MagicFactory magicFactory;

    private D2_MagicFactory() {
    }

    public static D2_MagicFactory getInstance() {
        if (magicFactory == null) {
            magicFactory = new D2_MagicFactory();
        }
        return magicFactory;
    }

    // Factory pattern
    // 원하는 마방진 요청을 확인해서 해당 객체를 반환해 주는 기능
    public Interface_Magic factory() {
        Interface_Magic magic = null;

        System.out.println("원하는 마방진을 입력하세요(숫자형식)");
        Scanner scan = new Scanner(System.in);
        int num = scan.nextInt(); // 입력 대기 -> 입력완료하면 다음 코드로 넘어감

        if (num < 3) {
            System.out.println("3이상 숫자를 입력하세요");
        } else if (num % 2 == 1) {
            magic = new OddMagicSquare(num);
        } else if (num % 4 == 0) {
            magic = new EvenMagicSquare(num);
        } else if (num % 4 == 2) {
            magic = new D1_SixMagicSquare(num);
        }
        scan.close();
        return magic;
    }

}
