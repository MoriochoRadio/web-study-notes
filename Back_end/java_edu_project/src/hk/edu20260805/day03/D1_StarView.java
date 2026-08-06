package hk.edu20260805.day03;

public class D1_StarView {
    public static void main(String[] args) {
        for (int i = 0; i < 6; i++) {
            for (int j = 0; j < i; j++) {
                System.out.print("*");
            }
            System.out.println();
        }

        System.out.println();

        for (int i = 1; i <= 6; i++) {
            for (int j = 6; j > i; j--) {
                System.out.print("*");
            }
            System.out.println(" ");
        }

        System.out.println();

        int line = 5;
        for (int i = 0; i < line; i++) {
            for (int j = 0; j < line - 1 - i; j++) {
                System.out.print(" ");
            }
            for (int k = 0; k < i * 2 + 1; k++) {
                System.out.print("*");
            }
            System.out.println();
        }

        System.out.println();

        for (int i = 0; i < 6; i++) {
            for (int j = 0; j < 6 - i - 1; j++) {
                System.out.print(" ");
            }
            for (int k = 0; k < i; k++) {
                System.out.print("*");
            }
            System.out.println();
        }

        System.out.println();

        for (int i = 0; i < 6; i++) {
            for (int k = 0; k < i; k++) {
                System.out.print(" ");
            }
            for (int j = 0; j < 6 - i - 1; j++) {
                System.out.print("*");
            }

            System.out.println();
        }

        // 10 8 6 4 2 -> 10 + (n-1)* -2

        int a = 5;
        for (int i = a; i > 0; i--) {
            for (int k = 0; k < 5 - i; k++) {
                System.out.print(" ");
            }
            for (int j = 0; j < i * 2 - 1; j++) {
                System.out.print("*");
            }

            System.out.println();
        }

        System.out.println();

        int c = 5;
        for (int i = 0; i < c; i++) {
            for (int j = c; j > i + 1; j--) {
                System.out.print(" ");
            }
            for (int k = 0; k < 2 * i + 1; k++) {
                System.out.print("*");
            }
            System.out.println();
        }
        for (int i = 4; i > 0; i--) {
            for (int j = 0; j < 5 - i; j++) {
                System.out.print(" ");
            }
            for (int k = 0; k < i * 2 - 1; k++) {
                System.out.print("*");
            }
            System.out.println();
        }

        System.out.println();

        // 등차수열공식으로 하면 ++로 다 할 수 있음
        for (int i = 0; i < 5; i++) {
            for (int j = 0; j < 5 - (i + 1); j++) {
                System.out.print(" ");
            }
            for (int k = 0; k < (i + 1) * 2 - 1; k++) {
                System.out.print("*");
            }
            System.out.println();
        }

    }

}
