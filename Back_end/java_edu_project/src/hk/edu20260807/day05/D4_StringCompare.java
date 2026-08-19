package hk.edu20260807.day05;

public class D4_StringCompare {
    public static void main(String[] args) {
        // 리터럴과 리터럴 비교
        String s1 = "java";
        String s2 = "java";
        System.out.println((s1 == s2) + ":" + (s1.equals(s2)));

        // 객체와 객체 비교
        String obj1 = new String("java");
        String obj2 = new String("java");
        System.out.println((obj1 == obj2) + ":" + (obj1.equals(obj2)));

        // 객체와 리터럴
        System.out.println((s1 == obj1) + ":" + (s1.equals(obj1)));

        // 메모리 효율이 안좋음 (권잘하지 않음)
        String ss = "a";
        for (int i = 0; i < 10; i++) {
            ss += "a";
        }
        System.out.println("ss" + ss.hashCode());

        // 이렇게 해야 효율적임
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < 10000; i++) {
            sb.append("a");
        }
        String result = sb.toString();
        System.out.println("result" + result.hashCode());

        // String 특징: immutable -> 값을 변경할 수 없다.
        // String이 생성된 시점부터 메모리에 고정됨
        String s = "java";// 원본
        String sss = s;// 복사본
        sss = "자바";// 값을 변경
        System.out.println(s); // 원본은 그대로
        String s4 = s.replace("j", "o");// 원본이 바뀌지 않는다
        System.out.println(s4); // 바뀐 내용을 사용하려면 재할당받아야 한다
        System.out.println(s);
    }
}
