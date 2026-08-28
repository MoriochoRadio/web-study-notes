package hk.edu20260828.day19;

import java.io.IOException;
import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.InetAddress;
import java.net.SocketException;

public class D2_UDPServer {
    public static void main(String[] args) {
        try (
                DatagramSocket socket = new DatagramSocket(5000);) {
            byte[] buffer = new byte[512];
            // 수신용 패킷 생성
            DatagramPacket packet = new DatagramPacket(buffer, buffer.length);
            System.out.println("server is listening on port 5000");
            while (true) {
                // 클라이언트에서 전송된 데이터를 패킷으로 받자..
                socket.receive(packet);
                String received = new String(packet.getData(), 0, packet.getLength());
                System.out.println("받은 메시지:" + received);

                // 서버에서 받은 데이터를 클라이언트로 보내보자..
                InetAddress address = packet.getAddress();
                int port = packet.getPort();
                System.out.println("address:" + address + ",port:" + port);
                packet = new DatagramPacket(buffer, buffer.length, address, port);
                socket.send(packet);// 클라이언트로 보냄
            }
        } catch (SocketException e) {
            e.printStackTrace();
        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
    }
}