package hk.edu20260810.day06;

public class D3_Calculator {
    // 연산을 하기 위한 숫자 2개를 저장할 맴버필드
    public int num1;
    public int num2;

    // ========paramInt()메서드 구현에 대한 설명======
    // main()에서 scanner 이용해서 키보드로 값을 입력받기:
    // "5+10" , "5*20" 하나의 문자열로 입력받기
    // 맴버필드 초기화:문자열에서 정수를 추출하여, 맴버필드 num1,num2에 저장하는 기능 구현
    // "5+10" --> 5, 10 추출 5+10 을 실행해야 15가 구해짐
    // String을 int형으로 변환
    // String s는"5+10" , String cal은 "+","/","-","*" 사칙연산자

    public void paramInt(String s, String cal) {
        // s-> "5+10" -> "5"만 추출해서 정수형으로 변환하여 num1에 저장
        if (s.indexOf(cal) != -1) {
            num1 = Integer.parseInt(s.substring(0, s.indexOf(cal)));
            // s-> "5+10" -> "10"만 추출해서 정수형으로 변환하여 num2에 저장
            // s.length()가 아니라 연산자 길이(cal.length())를 더해야 함!
            num2 = Integer.parseInt(s.substring(s.indexOf(cal) + cal.length()));
        }
    }

    // +,-,*,/를 실행하는 메서드 4개를 수정없이 그냥 사용해야 함
    public int a(int a, int b) {
        System.out.println("덧셈을 실행합니다.");
        return a + b;
    }

    public int b(int a, int b) {
        System.out.println("뺄셈을 실행합니다.");
        return a - b;
    }

    public int c(int a, int b) {
        System.out.println("곱셈을 실행합니다.");
        return a * b;
    }

    public int d(int a, int b) {
        System.out.println("나눗셈을 실행합니다.");
        return a / b;
    }

    // 입력받은 값에 해당하는 위에 주어진 사칙연산 메서드를 실행하는 메서드
    // 키워드: indexOf() 검색대상이 없으면 -1을 리턴 --> 검색대상이 있다면? 조건식은?
    // if 분기로 해당되는 사칙연산 메서드 실행하기: s값에서 "+"존재하면 +연산 메서드 실행, "-"가 존재하면...
    // paramInt()메서드 활용하여 맴버필드 초기화
    public void calcu(String s) { // s에 전달되는 아규먼트는 "5+10"과 같은 문자열
        if (s.indexOf("+") != -1) {
            paramInt(s, "+");
            System.out.println(a(num1, num2));
        } else if (s.indexOf("-") != -1) {
            paramInt(s, "-");
            System.out.println(b(num1, num2));
        } else if (s.indexOf("*") != -1) {
            paramInt(s, "*");
            System.out.println(c(num1, num2));
        } else if (s.indexOf("/") != -1) {
            paramInt(s, "/");
            System.out.println(d(num1, num2));
        } else {
            System.out.println("올바른 사칙연산식이 아닙니다.");
        }
    }
}