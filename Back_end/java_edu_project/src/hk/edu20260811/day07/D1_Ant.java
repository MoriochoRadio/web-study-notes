package hk.edu20260811.day07;

import java.util.Scanner;

public class D1_Ant {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.println("개미 문자열을 입력해주세요 : ");
        String ant = sc.nextLine();
        System.out.println("몇번째까지? : ");
        int total = sc.nextInt();

        // String ant = "1";
        // int total = 10;
        int count = 1;
        for (int i = 0; i < total; i++) {
            String next = "";
            ant = ant + " ";
            for (int j = 0; j < ant.length() - 1; j++) {
                if (ant.charAt(j) == ant.charAt(j + 1)) {
                    count++;
                } else {
                    next = next + ant.charAt(j) + count;
                    count = 1;
                }
            }
            ant = next;
            System.out.println(ant);

        }

    }
}
