package hk.edu20260824.day15;

//내가 필요한 Exception 클래스를 만들때는 Exception을 상속받아 생성
//예외이름을 
public class D1_UserException extends Exception {
    public D1_UserException() {
        this("UserException 오류 입니다.");
    }

    public D1_UserException(String msg) {
        super(msg);
    }
}
