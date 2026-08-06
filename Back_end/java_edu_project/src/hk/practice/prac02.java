package hk.practice;

public class prac02 {

    public static void main(String[] args) {
        int a = 12;
        for (int i = 1; i < a + 1; i++) {
            if (a % i == 0) {
                System.out.println(i);
            }
        }
    }
}
