package hk.edu20260819.day12;

import hk.edu20260818.day11.day11_2.MagicSquare;

public class D1_NestedClassTest {
    // 인스턴스 멤버필드: D1_NestedClassTest를 객체생성했을때 사용할 수 있다.
    public int a = 5;
    public int b = 10;
    // 정적 멤버필드
    public static int aa = 7;
    public static int bb = 3;

    // 정적 내부 클래스: 독립적으로 사용 가능
    static class StaticInnerClass {
        public String message;

        public StaticInnerClass(String message) {
            this.message = message;
        }

        public int getResult() {
            int result = aa + bb; // static 필드만 접근 가능하다.
            return result;
        }
    }

    // 인스턴스 내부 클래스
    class InnerClass {
        public String message;

        public InnerClass(String message) {
            this.message = message;
        }

        public int getResult() {
            int result = a + b;
            return result;
        }
    }

    public void nestedMethod() {
        int c = 5;
        class LocalInnerClass {
            public int number;

            public LocalInnerClass(int number) {
                this.number = number;
            }

            public int getLic() {
                int ss = c;
                return ss;
            }
        }
        // c=50; 값이 변경되는 코드가 있다면 오류발생 -> 번경여지가 없는 변수여야 한다.
        LocalInnerClass licObj = new LocalInnerClass(200);
        System.out.println("지역내부클래스: " + licObj.getLic());
    }

    public static void main(String[] args) {
        // 정적내부 클래스: 일반 클래스처럼 객체 생성해서 사용한다.
        StaticInnerClass sic = new StaticInnerClass("정적내부클래스");
        System.out.println(sic.getResult());

        // 인스턴스 내부 클래스: 외부클래스를 먼저 객체 생성하고, 내부클래스를 생성해야 사용할 수 있다.
        InnerClass inner = new D1_NestedClassTest().new InnerClass("내부클래스");
        System.out.println(inner.getResult());

        // 익명클래스: 인터페이스로 구현할때 그 위치에서 메서드등을 구현해서 객체생성한다.
        // -> 클래스를 따로 정의하지 않고 사용하기 때문에 이름이 없고, 외부에서 사용 못함
        MagicSquare magic = new MagicSquare() {
            @Override
            public void make() {

            }

            @Override
            public void magicPrint() {

            }

        };

        magic.make();
        magic.magicPrint();

    }
}
