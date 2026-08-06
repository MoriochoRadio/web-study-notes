package hk.edu20260806.day04;

public class D1_divisor {

    public D1_divisor() {
        // 기본적으로 생성자 호출은 맨 윗줄에 작성
        super(); // 부모생성자를 호출 ->Object 클래스가 부모임. 매개변수가 없으면 기본적으로 Object()호출
        // this(); // 같이 작성할 수 없다
    }

    public static void main(String[] args) {
        D1_divisor d = new D1_divisor();
        d.divisor(12);
        System.out.println("최대공약수1:" + getGcd1(12, 18));
        System.out.println("최대공약수2:" + getGcd2(12, 18));
        lowestMultiple(12, 18);

        // amicable은 non-static메서드이기떄문에 객체생성해서 객체명.메서드로 호출한다.
        d.amicable(1, 1000);
        d.perfectnum(1, 1000);
    }

    // 약수를 구하는 메서드
    public void divisor(int a) {
        for (int i = 1; i < a + 1; i++) {
            if (a % i == 0) {
                System.out.print((i == a) ? i : i + ",");
            }
        }
        System.out.println();
    }

    // 최대공약수 구하는 메서드 유클리드 호제법
    public static int getGcd(int a, int b) {
        while (b != 0) {
            int r = a % b;
            a = b;
            b = r;
        }
        return a;
    }

    // 뺄셈 방식 유클리드 호제법
    public static int getGcd1(int a, int b) {
        while (a != b) {
            if (a > b) {
                a = a - b;
            } else {
                b = b - a;
            }
        }
        return a;
    }

    // 유클리드 호제법 재귀호출
    public static int getGcd2(int a, int b) {
        if (b == 0) {
            return a;
        }
        return getGcd2(b, a % b);
    }

    // 최소공배수
    public static void lowestMultiple(int a, int b) {
        int gcd = getGcd1(a, b);
        int lowestMultiple = (a * b) / gcd;
        System.out.println("최소공배수:" + lowestMultiple);
    }

    // 진약수 합
    public static int sumDivisor(int a) {
        int sum = 0;
        for (int i = 1; i < a; i++) {
            if (a % i == 0) {
                sum += i;
            }
        }
        return sum;
    }

    // 친화수
    public void amicable(int s, int e) {
        for (int i = s; i <= e; i++) {
            if (i != sumDivisor(i) && i == sumDivisor(sumDivisor(i))) {
                System.out.printf("%d와 %d는 친화수 관계입니다.\n", i, sumDivisor(i));
            }
        }
    }

    // 완전수
    public void perfectnum(int s, int e) {
        for (int i = s; i <= e; i++) {
            if (i == sumDivisor(i)) {
                System.out.println(i + "는 완전수입니다.");
            }
        }
    }
}
