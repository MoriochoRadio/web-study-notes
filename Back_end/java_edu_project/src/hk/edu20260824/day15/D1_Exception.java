package hk.edu20260824.day15;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;

public class D1_Exception {
    public static void main(String[] args) {

        // exTest1("오");
        // exTest2("오");

        // 예외를 던지면
        try {
            UserExceptionTest(12);
        } catch (D1_UserException e) {
            System.out.println("예외가 발생했습니다");
            e.printStackTrace();
        }
    }

    public static void exTest1(String s) {
        int a = 0;

        try {
            a = Integer.parseInt(s);// <-- 예외가 발생될 여지가 있는 코드
        } catch (NumberFormatException e) {
            System.out.println("예외가 발생했습니다");
            // e.printStackTrace(); //예외의 원인을 자세하게 출력해주는 메서드
        } catch (Exception ee) { // 만약에 넘버포멧익셉션 외 다른 예외가 발생하면 큰 부모로 다 잡아
            ee.printStackTrace();
        }
        System.out.println(a);

    }

    public static void exTest2(String s) {
        int i = 0;
        String ss = "스트링";
        int[] array = { 1, 2, 3, 4, 5 };
        try {
            i = Integer.parseInt(s);
            ss = ss.substring(0, 2);
            int a = array[5];
        } catch (NumberFormatException e) {
            System.out.println("문자가 숫자형태로 변환되지 않았습니다.");
            e.printStackTrace();
        } catch (StringIndexOutOfBoundsException e) {
            System.out.println("문자열의 범위를 벗어났습니다.");
            e.printStackTrace();
        } catch (ArrayIndexOutOfBoundsException e) {
            System.out.println("배열의 범위를 벗어났습니다.");
            e.printStackTrace();
        } catch (Exception e) {
            System.out.println("나머지 모든 예외를 처리한다");
            e.printStackTrace();
        } finally {
            ss = ss.substring(0, 2);
            System.out.println(ss);
        }

        System.out.println("오류발생해도 프로그램은 종료되지 않는다.");

    }

    // 새로 추가된 기능: 리소스관련 객체 선언 (try-with-resources)
    // InputStream 객체는 AutoCloseable을 구현하고 있어 try() 안에서 선언하면 자동으로 close() 됩니다.
    public static void exTest4() {
        try (java.io.InputStream in = new FileInputStream("url")) {
            in.read();
        } catch (IOException e) {
            e.printStackTrace();
        } catch (Exception e) {
            e.printStackTrace();
        }
        // 리소스 연결을 닫아주는 close()를 반드시 처리해줘야 하는데 생략이 가능함
        // } finally {
        // try {
        // in.close();}
        // }
    }

    public static void UserExceptionTest(int a) throws D1_UserException {
        // 숫자를 받아서 1~10까지의 숫자를 받을 수 있다
        if (!(a > 0 && a < 11)) {// 1~10의 범위를 벗어난 숫자를 받는다면
            throw new D1_UserException("1부터 10까지의 숫자만 입력가능");
        }

    }

    public void exTest3() {
        InputStreamReader in = new InputStreamReader(System.in);
        try {
            in.read();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

}
