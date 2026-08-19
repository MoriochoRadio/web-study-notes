package hk.edu20260818.day11.day11_2;

public class OddMagicSquare extends MagicSquare {

    public OddMagicSquare() {
        super(3);
    }

    public OddMagicSquare(int n) {
        this.magic = new int[n][n];
    }

    public void make() {
        int n = magic.length;
        int x = 0;
        int y = n / 2;// y의 중간 값을 구할 수 있다.
        magic[x][y] = 1;// 3X3마방진일 경우 (0,1) 위치에 1을 넣고 시작

        for (int i = 2; i <= n * n; i++) {

            // 값 변경전에 원본값을 저장
            int tempX = x;
            int tempY = y;

            if (x - 1 < 0) {// x-1했을때 음수이면
                x = n - 1;// x인덱스의 최대값으로 이동
            } else {
                x--;
            }

            if (y - 1 < 0) {// x-1했을때 음수이면
                y = n - 1;// x인덱스의 최대값으로 이동
            } else {
                y--;
            }

            if (magic[x][y] != 0) {// 이동한 위치에 값이 존재한다면
                // 원래 위치로 이동해서 x+1
                x = tempX + 1;
                y = tempY;
            }

            magic[x][y] = i;
        }
    }

    // 마방진 출력하기
    public void magicPrint() {

        for (int i = 0; i < magic.length; i++) {
            for (int j = 0; j < magic.length; j++) {
                System.out.print(magic[i][j] + "\t");
            }
            System.out.print(sumCol(i));
            System.out.println();
        }
        for (int i = 0; i < magic.length; i++) {
            System.out.print(sumRow(i) + "\t");
        }
        // 마방진 증명 확인하기
        System.out.println();
        System.out.println("마방진 증명여부:" + isCheck());

    }

}