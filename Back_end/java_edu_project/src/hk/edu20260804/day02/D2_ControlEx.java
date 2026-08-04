package hk.edu20260804.day02;

import java.util.Random;
import java.util.Scanner;

public class D2_ControlEx {
    public static void main(String[] args) {

        // System.out.print("========2단==========\n");
        // // 구구단
        // // 2단
        // for (int i = 1; i <= 9; i++) {
        // System.out.printf("\"2X%d=%d\"", i, 2 * i);
        // System.out.println();
        // }

        // System.out.print("=========2~9단==========\n");

        // // 2~9단
        // for (int i = 2; i <= 9; i++) {
        // for (int j = 1; j <= 9; j++) {
        // System.out.printf("%dx%d=%d", i, j, i * j);
        // System.out.print("\t");
        // }
        // System.out.println();
        // }

        // System.out.print("=========짝수단만==========\n");

        // // 2~9단 출력하는데 짝수단만 출력
        // for (int i = 2; i <= 9; i += 2) {
        // for (int j = 1; j <= 9; j++) {
        // System.out.printf("%dx%d=%d", i, j, i * j);
        // System.out.print("\t");
        // }
        // System.out.println();
        // }

        // System.out.print("=========홀수단만==========\n");

        // // 2~9단 출력하는데 홀수단만 출력
        // for (int i = 3; i <= 9; i += 2) {
        // for (int j = 1; j <= 9; j++) {
        // System.out.printf("%dx%d=%d", i, j, i * j);
        // System.out.print("\t");
        // }
        // System.out.println();
        // }

        // System.out.print("=========100까지 합==========\n");

        // // 1~100까지의 합 출력
        // int sum = 0;
        // for (int i = 1; i <= 100; i++) {
        // sum += i;
        // }
        // System.out.println(sum);

        // System.out.print("=========4의 배수의 총합==========\n");

        // // 1~100까지의 수 중에 4의 배수의 총합 출력
        // int sum2 = 0;
        // for (int i = 1; i <= 100; i++) {
        // if (i % 4 == 0) {
        // sum2 += i;
        // }
        // }
        // System.out.println(sum2);

        // System.out.print("=========두 주사위==========\n");
        // // 주사위 두개의 합이 5이면 실행을 멈추고
        // // 5가 아니면 계속 실행되게 코드를 작성하자
        // // 1~6까지의 숫자로 구성, 랜덤하게 숫자 생성하는 기능
        // // Math객체사용

        // boolean stop = true;
        // while (stop) {
        // int first = (int) (Math.random() * 6) + 1;
        // int second = (int) (Math.random() * 6) + 1;
        // System.out.printf("%d + %d = %d\n", first, second, first + second);
        // if (first + second == 5) {
        // stop = false;
        // System.out.println("주사위의 합 5");
        // break;
        // }
        // }

        // Random random = new Random();
        // boolean stop2 = true;
        // while (stop2) {
        // int first2 = random.nextInt(6) + 1;
        // int second2 = random.nextInt(6) + 1;
        // System.out.printf("%d + %d = %d\n", first2, second2, first2 + second2);
        // if (first2 + second2 == 5) {
        // stop2 = false;
        // System.out.println("주사위의 합 5");
        // break;
        // }

        // }

        // // Scanner 클래스: 키보드로 입력받는 기능에 활용해 볼 수 있는 객체
        // Scanner scan = new Scanner(System.in);

        // int num = 0;
        // System.out.print("숫자를 입력하세요 : ");
        // num = Integer.parseInt(scan.nextLine());
        // System.out.println("입력결과값:" + num);
        // System.out.println("또입력받기:");
        // int num2 = Integer.parseInt(scan.nextLine());
        // System.out.println("입력결과값:" + num2);

        // scan.close();

        Scanner sc = new Scanner(System.in);
        boolean start = true;
        int savemoney = 0;

        while (start) {
            System.out.println("옵션을 선택하세요");
            System.out.println("---------------------");
            System.out.println("1.예금 2.출금 3.잔고 4.종료");
            System.out.print("선택 >> ");
            int select = Integer.parseInt(sc.nextLine());
            switch (select) {
                case 1:
                    System.out.println("예금액 : ");
                    int saveTemp = Integer.parseInt(sc.nextLine());
                    savemoney += saveTemp;
                    break;
                case 2:
                    System.out.println("출금액 : ");
                    int outTemp = Integer.parseInt(sc.nextLine());
                    if (outTemp > savemoney) {
                        System.out.println("잔고가 부족합니다");
                    } else {
                        savemoney -= outTemp;
                    }
                    break;
                case 3:
                    System.out.println("잔고 : " + savemoney);
                    break;
                case 4:
                    System.out.println("종료합니다");
                    start = false;
                    break;
                default:
                    System.out.println("잘못된 입력입니다");
                    break;
            }

        }

    }
}
