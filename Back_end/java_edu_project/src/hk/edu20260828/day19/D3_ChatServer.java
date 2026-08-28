package hk.edu20260828.day19;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;
import java.io.PrintWriter;

public class D3_ChatServer {
    // 채팅방에 접속한 모든 클라이언트의 출력 스트림(PrintWriter)을 모아두는 명단
    // 여러 스레드가 동시에 접속자 명단에 추가/삭제하므로 동기화(synchronizedSet) 필수!
    private static Set<PrintWriter> clientWriters = Collections.synchronizedSet(new HashSet<>());

    public static void main(String[] args) {
        int port = 12345;

        // 포트로 서버 소켓(가게 문) 열기
        try (ServerSocket serverSocket = new ServerSocket(port)) {
            System.out.println("채팅 서버가 " + port + "번 포트에서 시작됨");

            // 손님이 계속 들어올 수 있도록 무한 반복
            while (true) {
                // 손님이 들어올 때까지 여기서 멈춰서 기다림(대기)
                // 손님이 들어오면 대화용 'clientSocket' 이 만들어짐
                Socket clientSocket = serverSocket.accept();
                new ClientHandler(clientSocket).start();
                System.out.println("새로운 클라이언트 접속: " +
                        clientSocket.getInetAddress());
            }

        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    // 접속 중인 모든 클라이언트에게 메시지를 전달하는 방송(브로드캐스트) 메서드
    public static void broadcast(String message) {
        // 여러 스레드가 동시에 명단을 읽는 도중 오류가 나지 않도록 동기화 블록 설정
        synchronized (clientWriters) {
            for (PrintWriter writer : clientWriters) {
                writer.println(message);// 각 클라이언트의 스피커로 메시지 전송
            }
        }
    }

    // 손님 1명을 전담해서 처리할 스레드 클래스 (직원)
    static class ClientHandler extends Thread {
        private Socket socket; // 이 직원이 담당할 손님의 소켓
        private PrintWriter out;
        private BufferedReader in;
        private String nickname; // 사용자의 닉네임

        // 생성자: 메인에서 손님(소켓) 을 넘겨받음
        public ClientHandler(Socket socket) {
            this.socket = socket;
        }

        // 직원이 실제로 일하는 공간 (스레드 시작 시 자동 실행)
        @Override
        public void run() {
            try {
                // 1.소켓으로부터 입출력 스트림 생성
                in = new BufferedReader(new InputStreamReader(socket.getInputStream(), "UTF-8"));
                out = new PrintWriter(socket.getOutputStream(), true);

                // 2.전체 명단에 내 마이크 등록
                clientWriters.add(out);

                // 3. 클라이언트가 맨 처음 보낸 한 줄은 '닉네임' 으로 사용
                nickname = in.readLine();
                System.out.println(nickname + "님이 접속했습니다");
                broadcast(nickname + "님이 입장하셨습니다.");

                // 4. 이후 클라이언트가 보내는 채팅 메시지를 계속 받아서 전체 방송
                String message;
                while ((message = in.readLine()) != null) {
                    broadcast("[" + nickname + "]" + message);
                }
            } catch (IOException e) {
                System.out.println(nickname + "님 연결 종료/오류: " + e.getMessage());
            } finally {
                // 5. 손님이 나갔을 때 정리 작업
                if (out != null) {
                    clientWriters.remove(out); // 명단에서 내 마이크 제거
                }
                if (nickname != null) {
                    broadcast(nickname + "님이 나가셨습니다.");
                    System.out.println(nickname + "님이 퇴장하셨습니다.");
                }
                try {
                    socket.close(); // 소켓 닫기
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
            System.out.println("전담 스레드가 클라이언트와 대화를 시작할 준비를 합니다.");
        }
    }
}
