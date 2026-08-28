package hk.edu20260828.day19;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.net.Socket;

public class D3_ChatClient {
    public static void main(String[] args) {
        String serverIp = "localhost"; // 접속할 서버 IP
        int port = 12345; // 서버 포트 번호

        try {
            // 1. 서버에 접속
            Socket socket = new Socket(serverIp, port);
            System.out.println("서버에 연결되었습니다!");

            // 2. 키보드 입력 스트림 (윈도우 한글 입력을 위해 MS949 설정)
            BufferedReader keyboard = new BufferedReader(new InputStreamReader(System.in, "MS949"));

            // 3. 서버로 전송할 출력 스트림 (UTF-8)
            PrintWriter out = new PrintWriter(new OutputStreamWriter(socket.getOutputStream(), "UTF-8"), true);

            // 4. 서버로부터 수신할 입력 스트림 (UTF-8)
            BufferedReader in = new BufferedReader(new InputStreamReader(socket.getInputStream(), "UTF-8"));

            // 5. 최초 1회 대화명(닉네임) 입력받아 서버로 전송
            System.out.print("사용할 대화명을 입력하세요: ");
            String nickname = keyboard.readLine();
            out.println(nickname); // 서버에 닉네임 전송!

            // 6. 서버에서 오는 메시지를 실시간으로 수신하여 출력하는 별도 스레드 시작
            Thread receiveThread = new Thread(() -> {
                try {
                    String serverMessage;
                    // 서버가 보낸 메시지가 올 때마다 계속 읽어서 화면에 출력
                    while ((serverMessage = in.readLine()) != null) {
                        System.out.println(serverMessage);
                    }
                } catch (IOException e) {
                    System.out.println("서버와의 연결이 끊어졌습니다.");
                }
            });
            receiveThread.start(); // 수신 스레드 출동!

            // 7. 메인 스레드는 키보드 입력을 계속 읽어서 서버로 전송 (송신 전용)
            String userInput;
            while ((userInput = keyboard.readLine()) != null) {
                out.println(userInput); // 서버로 채팅 메시지 전송
            }

        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
