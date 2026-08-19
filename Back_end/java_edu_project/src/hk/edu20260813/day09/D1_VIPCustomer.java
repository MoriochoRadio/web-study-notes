package hk.edu20260813.day09;

public class D1_VIPCustomer extends D1_Customer {
    private int agentID; // 담당 상담원 ID
    private double saleRatio; // 할인율

    public D1_VIPCustomer() {
        super.customerGrade = "VIP";
        super.bonusRatio = 0.05;
        this.saleRatio = 0.1;

    }

    public D1_VIPCustomer(int customerID, String customerName, int agentID) {
        super.customerID = customerID;
        super.customerName = customerName;
        super.customerGrade = "VIP";
        super.bonusRatio = 0.05;
        this.saleRatio = 0.1;
        this.agentID = agentID;
    }

    // 부모에서는 보너스 적립률만 계산하는 기능
    // -> 자식에서는 할인률도 계산하는 기능이 추가
    // -> 자식에서 기능을 재정의하자 : 오버라이딩
    @Override
    public int calcPrice(int price) {
        super.bonusPoint += price * super.bonusRatio;
        return (int) (price - (price * saleRatio)); // int로 강제 형변환
    }

    @Override
    public String toString() {
        return customerName + "고객님의 등급은 " + customerGrade
                + "보너스점수는 " + bonusPoint + "점 입니다.";
    }
}
