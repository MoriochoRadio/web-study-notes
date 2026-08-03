package hk.edu20260803.day01; //파일의 폴더 구조(경로), 최상단에 위치

//명명법
//클래스명: 파스칼
public class HelloJava {

    // main 메서드: java코드를 실행시켜줌
    // public: 접근지정자
    // static: 내장 메모리 (static 메모리에 저장된다)
    // void: 반환값 없음
    // main: 메서드명
    // args: 매개변수
    // 메서드명: 카멜방식 (첫글자 소문자, 뒤 글자마다 대문자)
    // 변수명: 카멜방식 (첫글자 소문자, 뒤 글자마다 대문자)
    // 상수명: 스네이크 방식(모두 대문자)

    // 멤버필드: static을 붙이면 static메모리에 저장됨
    // 상수선언: 대문자
    public static final int NUMBER = 10000;
    public int number = 10;

    // 매개변수, 지역변수: main메서드 안의 괄호안에 있는 변수들은 stack메모리에 저장됨
    public static void main(String[] args) { // static으로 메모리에 이미 올라가 있음. 그래서 다른 static이 없는 메서드를
                                             // 여기에 넣어서 실행하려고 하면 안됨
        System.out.println("Hello Java");

        testMethod();
    }

    // 메서드 선언: 카멜
    public static void testMethod() {
        // 변수명: 카멜
        boolean isS = true;
        int i = 100;
        i = 200;
        final int TEST = 10; // final: 상수로 선언됨. 변경 불가능

        System.out.println("메서드 실행결과: " + i);

    }
}
