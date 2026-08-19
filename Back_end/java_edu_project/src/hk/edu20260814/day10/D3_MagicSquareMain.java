package hk.edu20260814.day10;

public class D3_MagicSquareMain {
    public static void main(String[] args) {
        D3_OddMagicSquare odd = new D3_OddMagicSquare(7);
        odd.make();

        int[][] magic = odd.magic;
        for (int i = 0; i < magic.length; i++) {
            for (int j = 0; j < magic[i].length; j++) {
                System.out.print(magic[i][j] + "\t");
            }
            System.out.print(odd.line(i) + "\t");
            System.out.println();
        }
        for (int i = 0; i < magic.length; i++) {
            System.out.print(odd.upline(i) + "\t");
        }
        System.out.println();
        System.out.println("대각선 합 왼->오 : " + odd.diagonal());
        System.out.println("대각선 합 오->왼 : " + odd.diagonal2());
        System.out.println("마방진 확인 결과: " + odd.isCheck());
    }
}
