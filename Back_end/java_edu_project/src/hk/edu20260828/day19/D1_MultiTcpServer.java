package hk.edu20260828.day19;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.ServerSocket;
import java.net.Socket;

public class D1_MultiTcpServer {
    public static void main(String[] args) {
        try (ServerSocket serverSocket = new ServerSocket(9595);) {
            System.out.println("server is running now...");
            while (true) {
                Socket clientSocket = serverSocket.accept();
                System.out.println("클라이언트 연결됨:" + clientSocket.getInetAddress().getHostName());

                new ServerThread(clientSocket).start();
            }

        } catch (Exception e) {
            // TODO: handle exception
            e.printStackTrace();
        }
    }// main 종료

    // 내부클래스로 스레드 클래스 작성(static으로 정의)
    static class ServerThread extends Thread {
        Socket clientSocket = null;

        public ServerThread() {

        }

        public ServerThread(Socket clientSocket) {
            this.clientSocket = clientSocket;
        }

        @Override
        public void run() {
            try (
                    // close() 생략하려면 괄호에 정의되어야 한다.
                    // autoCloseSocket은 임의의 변수에다 등록만 해두면 됨
                    Socket autoCloseSocket = clientSocket;
                    PrintWriter out = new PrintWriter(clientSocket.getOutputStream(), true);
                    BufferedReader in = new BufferedReader(new InputStreamReader(clientSocket.getInputStream()));) {
                String inputLine;
                while ((inputLine = in.readLine()) != null) {
                    System.out.println("클라이언트로부터 전달받은 메시지:" + inputLine);
                    out.println("보낸 메시지:" + inputLine);
                }

            } catch (IOException e) {

            }

        }
    }
}