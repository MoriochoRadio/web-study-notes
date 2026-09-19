package hk.edu20260828.day19;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.HashSet;
import java.util.Set;

public class D4_ChatServer2 {

    // server port 번호 정의
    private static final int PORT = 12345;
    // 각각의 클라이언트 출력용 PrintWriter객체를 모아둘 Set 설정(중복에 안전하게 Set으로 선언)
    private static Set<PrintWriter> clients = new HashSet<>();

    public static void main(String[] args) {
        System.out.println("--채팅 서버 시작--");
        // 서버소켓 생성
        try (ServerSocket serverSocket = new ServerSocket(PORT, 50, java.net.InetAddress.getLoopbackAddress());) {

            while (true) {
                // 클라이언트의 요청을 확인하고 연결하여 클라이언트 소켓 생성
                Socket clientSocket = serverSocket.accept();
                // 클라이언트 소켓 스레드 생성 및 실행: 여러 사용자 요청 처리를 위해 스레드로 실행
                new ClientHandler(clientSocket).start();
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private static class ClientHandler extends Thread {
        private Socket socket;
        // private PrintWriter out;
        // private BufferedReader in;

        // 클라이언트 소켓 객체 초기화
        public ClientHandler(Socket socket) {
            this.socket = socket;
        }

        @Override
        public void run() {
            PrintWriter myOut = null; // finally에서 명단 제거를 위해 바깥에 변수 선언

            try (
                    // 1. 소켓도 알아서 닫히게 try 자원으로 등록!
                    Socket autoCloseSocket = socket;
                    BufferedReader in = new BufferedReader(new InputStreamReader(socket.getInputStream(), "UTF-8"));
                    PrintWriter out = new PrintWriter(new OutputStreamWriter(socket.getOutputStream(), "UTF-8"),
                            true);) {
                myOut = out; // finally 블록에서 인식할 수 있도록 백업

                // client로 출력할 객체 PrinterWriter를 clients에 저장
                // 동시적으로 접근하면 오류가 발생될 여지가 있으므로 동기화 블럭 설정
                synchronized (clients) {
                    clients.add(out); // clients안에는 여러 클라이언트 Socket객체가 저장된다.
                }

                // 1. 가장 처음 들어오는 한 줄을 무조건 ID로 간주하고 읽어들임
                String clientId = in.readLine();
                System.out.println("[" + clientId + "] 님이 입장하셨습니다.");

                String message;
                while ((message = in.readLine()) != null) {
                    // 3. 받은 메시지 앞에 ID를 예쁘게 조립
                    String chatMsg = "[" + clientId + "] " + message;
                    System.out.println("받은 메시지: " + chatMsg);

                    synchronized (clients) {
                        // 채팅 참가자들 모두에게 메시지 전달
                        for (PrintWriter writer : clients) {
                            writer.println(chatMsg);
                        }
                    }
                }
            } catch (IOException e) {
                System.out.println("클라이언트 통신 에러 또는 퇴장");
            } finally {
                // 통신이 끝나거나 오류로 튕겨 나갔을 때, 단체 채팅 명단에서 이 사람을 제거함!
                if (myOut != null) {
                    synchronized (clients) {
                        clients.remove(myOut);
                    }
                }
                // 기존에 있던 socket.close()는 위쪽 try() 괄호 안에 넣었기 때문에
                // 더 이상 여기서 수동으로 닫을 필요가 없음!
            }
        }
    }
}
