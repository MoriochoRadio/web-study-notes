package hk.edu20260810.day06;

import java.util.Scanner;
import java.util.regex.Pattern;

public class D3_CalculatorMain {
    public static void main(String[] args) {
        // D3_Calculator
        D3_Calculator calcu = new D3_Calculator();
        // Scanner 객체 생성
        Scanner scanner = new Scanner(System.in);
        // 계속 입력받아서 실행되도록 while문 이용해서 처리
        while (true) {
            System.out.println("계산할 문자열을 입력해주세요 : ");
            String s = scanner.nextLine();

            // 정규표현식
            if (Pattern.matches("^[0-9][0-9]*[+|\\-|*|/][0-9]*[0-9]$", s)) {

                // 예시) "5+10" 문자열을 입력받았다면?
                // 객체명.calcu("5+10") 실행해서 결과 출력하기
                calcu.calcu(s);
            } else {
                System.out.println("올바른 사칙연산식이 아닙니다.");
            }
            if (s.equals("0")) {
                break;
            }
        }
        scanner.close();
    }
}
