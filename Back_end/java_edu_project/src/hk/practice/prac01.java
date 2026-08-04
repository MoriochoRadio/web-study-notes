package hk.practice;

public class prac01 {
    public static void main(String[] args) {
        for (int i = 0; i < 6; i++) {
            for (int j = 0; j < i; j++) {
                System.out.print("*");
            }
            System.out.println();
        }

        System.out.println();

        for (int i = 1; i < 6; i++) {
            for (int j = 6; j > i; j--) {
                System.out.print("*");
            }
            System.out.println();
        }

        int line = 5;
        for (int i = 0; i < line; i++) {
            for (int j = 0; j < line - 1 - i; j++) {
                System.out.print(" ");
            }
            for (int k = 0; k < 2 * i + 1; k++) {
                System.out.print("*");
            }
            System.out.println();
        }

        for (int i = 0; i < 6; i++) {
            for (int j = 0; j < 6 - i; j++) {
                System.out.print(" ");
            }
            for (int k = 0; k < i; k++) {
                System.out.print("*");
            }
            System.out.println();
        }

        System.out.println();

        for (int k = 0; k < 6; k++) {
            for (int i = 0; i < k; i++) {
                System.out.print(" ");
            }
            for (int i = 6; i > k; i--) {
                System.out.print("*");
            }
            System.out.println();
        }

        System.out.println();

        int a = 5;
        for (int i = a; i > 0; i--) {
            for (int k = 0; k < a - i; k++) {
                System.out.print(" ");
            }
            for (int j = 0; j < 2 * i - 1; j++) {
                System.out.print("*");
            }

            System.out.println();
        }

        System.out.println();

        int c = 5; // 위쪽 피라미드 높이

        // 1. 위쪽 정피라미드 (i = 0 ~ 4)
        for (int i = 0; i < c; i++) {
            for (int k = 0; k < c - 1 - i; k++) {
                System.out.print(" ");
            }
            for (int j = 0; j < 2 * i + 1; j++) {
                System.out.print("*");
            }
            System.out.println();
        }

        // 2. 아래쪽 역피라미드 (i = 3 ~ 0) i = a - 2 부터 시작해서 가운데 줄 중복 방지!
        for (int i = c - 2; i >= 0; i--) {
            for (int k = 0; k < c - 1 - i; k++) {
                System.out.print(" ");
            }
            for (int j = 0; j < 2 * i + 1; j++) {
                System.out.print("*");
            }
            System.out.println();
        }

    }
}
