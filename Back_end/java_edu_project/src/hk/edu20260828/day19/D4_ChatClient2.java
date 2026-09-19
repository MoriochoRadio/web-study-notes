package hk.edu20260828.day19;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.net.Socket;

public class D4_ChatClient2 {
    private static final String SERVER_ADDRESS = "localhost";
    private static final int SERVER_PORT = 12345;

    public static void main(String[] args) {

        try (
                // 클라이언트 소켓 생성
                Socket socket = new Socket(SERVER_ADDRESS, SERVER_PORT);
                // 클라이언트 소켓으로 전달된 메시지 읽어들일 객체 생성
                BufferedReader in = new BufferedReader(new InputStreamReader(socket.getInputStream(), "UTF-8"));
                // 클라이언트 소켓으로 메시지를 출력할 객체 생성
                PrintWriter out = new PrintWriter(new OutputStreamWriter(socket.getOutputStream(), "UTF-8"), true);
                // 키보드로 입력된 메시지를 읽어들일 객체 생성
                BufferedReader stIn = new BufferedReader(new InputStreamReader(System.in, "MS949"));) {

            System.out.print("사용할 ID(대화명)를 입력하세요: ");
            String myId = stIn.readLine(); // 키보드로 ID 입력받기
            out.println(myId); // 서버에 내 ID를 가장 먼저 전송!

            // 소켓으로 전달된 메시지를 읽으들일 in객체를 스레드로 생성하여 실행: 서버에서 여러 메시지가 전달되므로 동시적으로 처리하기 위함
            new Thread(new IncomingMessagesHandler(in)).start();

            // 키보드로 입력한 내용을 한줄씩 읽어서 userInput에 저장하고 PrintWriter객체를 통해 출력한다.
            String userInput;
            while ((userInput = stIn.readLine()) != null) {
                out.println(userInput);// ChatServer 쪽으로 전달됨-> serverSocket이 accept하면서 socket객체 반환하고 데이터 받음
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private static class IncomingMessagesHandler implements Runnable {
        private BufferedReader in;

        public IncomingMessagesHandler(BufferedReader in) {
            this.in = in;
        }

        @Override
        public void run() {
            String serverMessage;
            try {
                while ((serverMessage = in.readLine()) != null) {
                    System.out.println("서버 메시지: " + serverMessage);
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
}
