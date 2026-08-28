package hk.edu20260828.day19;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.InetAddress;
import java.net.SocketException;
import java.net.UnknownHostException;

public class D2_UDPClient {

    public static void main(String[] args) {
        String hostname = "192.168.22.2";
        int port = 5000;

        try (DatagramSocket socket = new DatagramSocket();
                // 키보드로 입력된 데이터를 읽어오기 위한 스트림
                BufferedReader reader = new BufferedReader(
                        new InputStreamReader(System.in, "MS949"));) {
            InetAddress address = InetAddress.getByName(hostname);

            // 데이터를 받을때 사용할 배열
            byte[] receiveBuffer = new byte[512];

            String text = "";
            while (true) {
                System.out.println("입력하기:");
                text = reader.readLine();// 키보드로 입력한 데이터 읽기
                byte[] sendBuffer = text.getBytes();

                // 서버로 전송
                DatagramPacket packet = new DatagramPacket(sendBuffer, sendBuffer.length, address, port);
                socket.send(packet);

                // 서버에서 수신
                packet = new DatagramPacket(receiveBuffer, receiveBuffer.length);
                socket.receive(packet);// 데이터를 패킷으로 받고
                String received = new String(packet.getData(), 0, packet.getLength());
                System.out.println("받은 메시지:" + received);
            }
        } catch (SocketException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        } catch (UnknownHostException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        } catch (IOException e1) {
            // TODO Auto-generated catch block
            e1.printStackTrace();
        }
    }
}