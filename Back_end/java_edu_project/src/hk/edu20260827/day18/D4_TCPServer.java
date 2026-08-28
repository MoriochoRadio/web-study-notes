package hk.edu20260827.day18;

import java.io.BufferedInputStream;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.ServerSocket;
import java.net.Socket;

public class D4_TCPServer {
    public static void main(String[] args) {
        Socket clientSocket = null; // 클라이언트 소켓
        PrintWriter out = null; // 클라이언트로 출력할때 사용할 객체
        ServerSocket serverSocket = null; // 클라이언트와 연결하는 Socket을 생성
        BufferedReader in = null; // 클라이언트에서 전달된 메시지 읽어들일 객체

        try {
            serverSocket = new ServerSocket(9595);
            System.out.println("서버가 클라이언트의 접속을 기다립니다...");
            while (true) {
                clientSocket = serverSocket.accept();
                System.out.println("클라이언트 연결됨:" + clientSocket.getInetAddress().getHostName());

                out = new PrintWriter(clientSocket.getOutputStream(), true);
                in = new BufferedReader(new InputStreamReader(clientSocket.getInputStream()));

                String inputLine;
                while ((inputLine = in.readLine()) != null) {
                    System.out.println("클라이언트 메시지:" + inputLine);
                    out.println("메시지를 잘 전달받았습니다.");
                }

            }
        } catch (IOException e) {
            e.printStackTrace();
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (out != null) {
                out.close();
            }
            if (in != null) {
                try {
                    in.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
            if (clientSocket != null) {
                try {
                    clientSocket.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
            if (serverSocket != null) {
                try {
                    serverSocket.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
    }
}
