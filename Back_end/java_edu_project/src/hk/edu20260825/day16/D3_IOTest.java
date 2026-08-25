package hk.edu20260825.day16;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

public class D3_IOTest {
    public static void main(String[] args) {

        test01();
    }

    private static void test01() {

        InputStream in = null; // 입력 스트림
        OutputStream out = null; // 출력 스트림

        try {
            in = new FileInputStream(
                    "C:\\Antigravity26_06\\Back_end\\java_edu_project\\src\\hk\\edu20260825\\temp\\test.txt");

            out = new FileOutputStream(
                    "C:\\Antigravity26_06\\Back_end\\java_edu_project\\src\\hk\\edu20260825\\temp\\test2.txt");

            int i = 0;
            while ((i = in.read()) != -1) { // read만 하면 1바이트만 읽고 끝난다(while로 반복해서 읽어야함)
                // 읽을게 없으면 -1을 리턴한다(io에서는)
                System.out.println(i);
                out.write(i); // 파일출력(byte단위로)
            }

        } catch (FileNotFoundException e) {
            e.printStackTrace();

        } catch (IOException e) {
            e.printStackTrace();
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            try {
                // 마지막에 실행됐던 스트림부터 닫는다
                if (out != null)
                    out.close();
                if (in != null)
                    in.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
}
