package hk.edu20260813.day09;

public class D1_CustomerMain {
    public static void main(String[] args) {
        // 부모의 타입으로 부모를 생성함
        D1_Customer customerJung = new D1_Customer(10001, "정우성");
        customerJung.bonusPoint = 1000;
        int price = customerJung.calcPrice(15000);
        System.out.println(customerJung.toString());

        // 자식의 타입으로 자식을 생성
        D1_VIPCustomer customerKim = new D1_VIPCustomer(10002, "김연아", 100);
        customerKim.bonusPoint = 10000;
        int price2 = customerKim.calcPrice(100000);
        System.out.println(customerKim);
    }
}
