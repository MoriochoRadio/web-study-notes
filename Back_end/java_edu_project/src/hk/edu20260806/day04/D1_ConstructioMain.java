package hk.edu20260806.day04;

public class D1_ConstructioMain {
    public static void main(String[] args) {

        D4_Constructor tv = new D4_Constructor();
        D4_Constructor tv2 = new D4_Constructor(70);
        D4_Constructor tv3 = new D4_Constructor(60, "노랑색");
        // 생성자 이용 안하고, 직접 멤버필드에 접근해서 초기화 할경우 불편하다
        D4_Constructor tv4 = new D4_Constructor();
        tv4.color = "파란색";
        tv4.setSize(24); // private이라 메서드 통해 값 추가
    }
}
