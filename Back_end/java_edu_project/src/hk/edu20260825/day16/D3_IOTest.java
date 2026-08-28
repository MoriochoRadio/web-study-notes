package hk.edu20260825.day16;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.DataOutputStream;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.io.UnsupportedEncodingException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

public class D3_IOTest {
    public static void main(String[] args) {

        // test01();
        // test02();
        // test02_2();
        // test03();
        // test04();
        test05();
    }

    private static void test01() {

        // InputStream in = null; // 입력 스트림
        // OutputStream out = null; // 출력 스트림

        // try {
        // in = new FileInputStream(
        // "C:\\Antigravity26_06\\Back_end\\java_edu_project\\src\\hk\\edu20260825\\temp\\test.txt");

        // out = new FileOutputStream(
        // "C:\\Antigravity26_06\\Back_end\\java_edu_project\\src\\hk\\edu20260825\\temp\\test2.txt");

        // int i = 0;
        // while ((i = in.read()) != -1) { // read만 하면 1바이트만 읽고 끝난다(while로 반복해서 읽어야함)
        // // 읽을게 없으면 -1을 리턴한다(io에서는)
        // System.out.println(i);
        // out.write(i); // 파일출력(byte단위로)
        // }

        // } catch (FileNotFoundException e) {
        // e.printStackTrace();

        // } catch (IOException e) {
        // e.printStackTrace();
        // } catch (Exception e) {
        // e.printStackTrace();
        // } finally {
        // try {
        // // 마지막에 실행됐던 스트림부터 닫는다
        // if (out != null)
        // out.close();
        // if (in != null)
        // in.close();
        // } catch (IOException e) {
        // e.printStackTrace();
        // }
        // }

        // try with resource 문법 사용으로 finally 생략가능
        // -> 반드시 닫아줘야하는 작업(close()실행) 이 필요한 객체들에 대해 생략시켜줄 수 있다.
        try (
                InputStream in = new FileInputStream(
                        "C:\\Antigravity26_06\\Back_end\\java_edu_project\\src\\hk\\edu20260825\\temp\\test.txt");
                OutputStream out = new FileOutputStream(
                        "C:\\Antigravity26_06\\Back_end\\java_edu_project\\src\\hk\\edu20260825\\temp\\test2.txt");) {
            int i = 0;
            while ((i = in.read()) != -1) {
                System.out.println(i);
                out.write(i);
            }
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    // filter: 보조스트림을 이용해서 출력하기
    private static void test02() {
        String s = "파일을 기록합니다.";
        String ss = "파일을 문자단위로 기록합니다.";
        try (
                // data 출력하는 파이프 생성
                OutputStream out = new FileOutputStream(
                        "C:\\Antigravity26_06\\Back_end\\java_edu_project\\src\\hk\\edu20260825\\temp\\test3.txt");
                OutputStreamWriter ow = new OutputStreamWriter(out, "utf-8");
                BufferedWriter bw = new BufferedWriter(ow);) {
            // 1단계: 스트림만 사용할 경우
            // out.write(s.getBytes()); // 문자열을 byte단위로 쪼개서 처리함

            // 2단계 :writer를 사용할 경우
            // -file바이트 출력 스트림 -> 문자기반 출력 필터를 끼우고 실행(알아서 쪼개서 처리함)
            // ow.write(ss);

            // 3단계: 버퍼를 사용할 경우
            // 성능향상: 문자하나마다 출력 처리 -> 많은 양의 문자를 모아서 한번에 출력(기본 8kb씩 저장해서 출력)
            // -Writer 출력 스트림 -> 버퍼를 끼우고 실행(효율좋음)
            bw.write(ss);
            bw.newLine(); // 줄바꿈
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    // filter: 보조스트림사용
    public static void test02_2() {
        String s = "파일을 기록합니다.";
        try (
                OutputStream out = new FileOutputStream(
                        "C:\\Antigravity26_06\\Back_end\\java_edu_project\\src\\hk\\edu20260825\\temp\\test4.txt");
                // filter: 기본 데이터 타입을 이진데이터로 출력(자바프로그램끼리 주고받고 처리할때 사용)
                DataOutputStream ds = new DataOutputStream(out);) {
            // ds.writeUTF(s);
            ds.write(s.getBytes());
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    // 한번에 읽을 때 크기를 설정해서 읽고 쓰기
    private static void test03() {
        try (
                InputStream in = new FileInputStream(
                        "C:\\Antigravity26_06\\Back_end\\java_edu_project\\src\\hk\\edu20260825\\temp\\images.jpg");
                OutputStream out = new FileOutputStream(
                        "C:\\Antigravity26_06\\Back_end\\java_edu_project\\src\\hk\\edu20260825\\temp\\copy.jpg");

        ) { // 10바이트 단위로 읽기
            byte[] b = new byte[10];
            int i = 0;
            while ((i = in.read(b)) != -1) { // i에 저장되는 값은 읽은 개수
                // out.write(b); //그전에 읽었던 배열의 데이터가 남아있을수있음
                out.write(b, 0, i); // 읽은 개수만큼만 출력 -> 안정적(권장)
            }
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private static void test04() {
        try (
                InputStreamReader in = new InputStreamReader(System.in, "MS949");
                OutputStreamWriter out = new OutputStreamWriter(System.out);) {
            char[] ch = new char[512]; // 2b*512 = 1024byte(1kb)
            int i = 0;
            while ((i = in.read(ch)) != -1) {
                System.out.println("입력된 값:");
                out.write(ch, 0, i);
                out.flush(); // 강제로 데이터를 밀어내서 출력하는 기능: System.out(콘솔출력)은 다 채워질떄까지 출력 안함.
            }

        } catch (IOException e) {
            e.printStackTrace();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    // 과제: 다이어리 구현하기
    // - 키보드로 입력받아서 메모장에 출력되도록 구현해보자
    // -한줄 입력하고 엔터 --> 메모장에 출력: 다음에 입력한 내용이 이어서 출력되도록 하기
    // - "exit" 를 입력하면 종료

    private static void test05() {

        try (
                // 키보드 입력: InputStreamReader -> BufferedReader (한 줄씩 읽기용)
                InputStreamReader in = new InputStreamReader(System.in, "MS949");
                BufferedReader br = new BufferedReader(in);

                // 파일 출력: FileOutputStream(..., true) -> OutputStreamWriter -> BufferedWriter
                // (이어쓰기용)
                FileOutputStream out = new FileOutputStream(
                        "C:\\Antigravity26_06\\Back_end\\java_edu_project\\src\\hk\\edu20260825\\temp\\test5.txt",
                        true); // true: 기존 내용 뒤에 이어쓰기
                OutputStreamWriter ow = new OutputStreamWriter(out, "utf-8");
                BufferedWriter bw = new BufferedWriter(ow);) {
            System.out.println("입력시작. (exit 입력 시 종료)");

            String msg = "";

            // 한 줄씩 입력받기
            while ((msg = br.readLine()) != null) {
                // exit 입력 시 종료
                if (msg.equals("exit")) {
                    System.out.println("종료합니다.");
                    break;
                }

                // 메모장에 한 줄 쓰고 줄바꿈
                bw.write(msg);
                bw.newLine();
                bw.flush(); // 버퍼 비우기(파일에 즉시 기록)
            }

        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private static void test05_1() {
        String url = "C:\\Antigravity26_06\\Back_end\\java_edu_project\\src\\hk\\edu20260825\\temp\\test_diary.txt";
        try (
                InputStreamReader in = new InputStreamReader(System.in, "MS949");
                OutputStreamWriter out = new FileWriter(url, true)) { // true 설정: 이어쓰기 모드
            char[] ch = new char[512];
            int i = 0;
            System.out.println("입력하세요");
            while ((i = in.read(ch)) != -1) {
                String s = new String(ch, 0, i);// [e,x,i,t] -> "exit"
                // eq~igno~case():대소문자 구분없이 비교
                // 입력값에 엔터키(\r\n)까지 함께 읽혀오기때문에 trim()이용해서 제거
                if (s.trim().equalsIgnoreCase("exit")) {
                    System.out.println("다이어리를 종료합니다.");
                    break;
                }
                out.write(ch, 0, i);
                out.flush();
            }
        } catch (UnsupportedEncodingException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
    }

}
