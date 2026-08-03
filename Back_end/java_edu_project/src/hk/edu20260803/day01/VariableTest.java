package hk.edu20260803.day01;

public class VariableTest {
    public static void main(String[] args) {
        // 기본 타입의 특징
        // 1.정타입
        // : 기본형은 int
        byte b = 1;
        b = 127; // byte 표현범위는 -128 ~ 127
        b = -128;

        short sh = 128; // 2byte 크기
        int i = 100000; // 4byte 크기
        long l = 1000000000000000000L; // 리터럴 정수는 기본 int 형으로 인식함 , 8byte 크기 (long타입 정수는 L을 붙여줘야함)
        System.out.println("long타입 표현범위: " + l);

        byte bb = (byte) i; // byte -> int 다운캐스팅 , 원본값 손실됨
        int ii = 126;
        byte bbb = (byte) ii; // int -> byte 다운캐스팅, 원본값이 손실되지 않음
        System.out.println("바이트 타입 표현범위: " + bbb);
        System.out.println("======================");

        // 2.실수타입
        // 기본형은 double(8byte)
        double d = 15.7;
        float f = 15.77f; // 8byte크기라 f 붙여줌 , 기본적으로 double로 인식해서 컴파일러가 "double 값을 float 변수에 담으면 데이터가 손실될 수
                          // 있다!"라고 경고 띄움
        float ff = (float) (d + f); // 큰값을 작은 상자에 담는다 (down casting)

        // 3. 다른 타입끼리 연산
        int iii = (int) (i + d); // int+double -> double, 연산결과가 double이므로 강제형변환 필요

        // 4.정수끼리 연산
        byte b1 = 10;
        byte b2 = 20;
        // byte b3 = b1 + b2; // byte + byte 인데, 왜 오류가 나는가? = int타입으로 자동 캐스팅 하기 때문(컴퓨터가
        // 더 큰 숫자를 담기위함)
        // => 그래서 연산을 하기전 b1,b2 를 int 타입으로 변경해준 후 더해야한다.
        byte b3 = (byte) (b1 + b2); // 연산의 결과값은 int로 반환되므로, 그 값을 byte 타입의 b3에 담기 위해서는 강제형변환이 필요
        // 변수끼리 연산은 변하는 값이기 때문에 127을 벗어날 수 있다.
        byte b4 = 10 + 20; // 리터럴 정수는 기본 int 타입으로 인식하기 때문에 오류가 나지 않는다.
        System.out.println("바이트 타입 연산 결과: " + b4);

        // 5.
    }
}
