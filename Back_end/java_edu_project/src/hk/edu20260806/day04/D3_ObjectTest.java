package hk.edu20260806.day04;

public class D3_ObjectTest {
    public static void main(String[] args) {
        // Object 클래스: 최상위 객체
        // getClass(): 클래스의 위치를 반환한다. -> 패키지.클래스명
        String str = new String("Object");
        String str2 = "ObjectLit"; // 주로 사용되는 방식
        System.out.println(str.getClass());
        System.out.println(str2.getClass());

        D3_ObjectTest ot = new D3_ObjectTest();
        System.out.println(ot.getClass());

        // toString(): 문자열로 반환한다
        // target 객체에 "위치@hashcode(16진수)" 반환
        System.out.println(ot.toString());
        System.out.println(str.toString());

        // hashcode(): 객체의 hashcode를 반환한다. -> 10진수로 표현
        System.out.println(ot.hashCode());

        // 객체를 비교할떄 hashcode로 비교한다. --> 일반적인 객체 비교할때는 의미가 없음
        // --> equals()가 hashcode()를 이용해서 객체를 비교한다.
        System.out.println(ot.equals(str2));

        // 리터럴 방식 선언(String)
        String s = "a";
        String s2 = "a";
        System.out.println(s == s2); // 비교연산자: 객체에 주소로 비교
        System.out.println(s.equals(s2)); // hashcode로 비교

        // 객체 생성으로 선언(new String())
        String s3 = new String("a");
        System.out.println(s == s3); // false //메모리 주소가 달라서
        System.out.println(s.equals(s3)); // true --> 내용물이 같은지 봐서

    }
}
