package hk.edu20260827.day18;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.Socket;
import java.net.UnknownHostException;

public class D4_TCPClient {

    public static void main(String[] args) {
        try (
                // 클라이언트 소켓 생성(요청ip, port)
                Socket socket = new Socket("localhost", 9595);
                // 서버로 메시지 전송할때 사용할 객체
                PrintWriter out = new PrintWriter(socket.getOutputStream(), true);
                // 서버에서 전송된 메시지 읽어들일 객체
                BufferedReader in = new BufferedReader(
                        new InputStreamReader(socket.getInputStream()));
                // 클라이언트에서 키보드로 입력한 메시지 읽어들일 객체
                BufferedReader userIn = new BufferedReader(new InputStreamReader(System.in, "MS949"))) {
            System.out.println("Client:Connetion to server...");
            String inputLine;
            while ((inputLine = userIn.readLine()) != null) {
                out.println(inputLine);
                System.out.println("서버에서 전달된 메시지:" + in.readLine());
            }
        } catch (UnknownHostException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
    }
}