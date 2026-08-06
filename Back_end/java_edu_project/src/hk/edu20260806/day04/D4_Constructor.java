package hk.edu20260806.day04;

public class D4_Constructor {

    // 티비객체
    // private은 클래스 내부에서만 접근 가능
    private int size = 0; // 중요한 데이터 -->private 선언
    public String color = "검정석"; // 색상

    // default 생성자: 단독으로 사용한다면 생략 가능 -> 오버로딩을 하면 생략 못함
    public D4_Constructor() {
        // this.size = 24;
        // this.color = "검정색";
        // System.out.println(); //생성자는 가장 처음에 실행되어야 하므로 첫줄에 작성
        this(24, "검정색"); // 생성자 호출은 반드시 첫줄에 작성
    }

    // 생성자 오버로딩
    public D4_Constructor(int size) {
        // 멤버필드size = 파라미터 size
        this.size = size;
    }

    public D4_Constructor(int size, String color) {
        // 멤버필드size = 파라미터 size
        this.size = size;
        this.color = color;
    }

    // private으로 선언한 맴버필드는 어떻게 접근할까?->getter, setter메서드를 사용한다

    public int getSize(int pw) {
        // 조건에 따라 값을 반환한다. ex: 비밀번호를 알고 있다면 반환
        if (pw == 1234) {
            return size;
        } else {
            System.out.println("잘못된 비밀번호");
            return -1;
        }
    }

    public void setSize(int size) {
        this.size = size;
    }

}
