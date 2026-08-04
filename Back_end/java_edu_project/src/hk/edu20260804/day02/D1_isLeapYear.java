package hk.edu20260804.day02;

import java.util.Scanner;

//파일명이 클래스명과 동일해야 함
public class D1_isLeapYear {

    // 윤년: 1년은 365일 --> 366일인 해, 2월달의 마지막날이 29일
    // 윤년을 판단하는 조건을 확인
    // -년도가 4의 배수이면서, 100으로 나누어떨어지지 않는 수
    // -또는 400으로 나누어 떨어지는 수
    // 2026년도가 윤년인지 아닌지 확인해서 출력해보기

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("년도를 입력해주세요 : ");
        int year = sc.nextInt();
        if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
            System.out.println(year + "는 윤년입니다");
        } else {
            System.out.println(year + "는 평년입니다");
        }

        for (int i = 2000; i < 2031; i++) {
            if ((i % 4 == 0 && i % 100 != 0) || i % 400 == 0) {
                System.out.println(i + "는 윤년입니다");
            }
        }
    }

    public static boolean isLeapYear(int year) {
        if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
            return true;
        } else {
            return false;
        }
    }
}
