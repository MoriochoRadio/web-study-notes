package hk.edu20260814.day10;

public class D3_OddMagicSquare {
    public int[][] magic;

    // 생성자 오버로딩
    public D3_OddMagicSquare() {
        this(3);
    }

    public D3_OddMagicSquare(int n) {
        this.magic = new int[n][n];
    }

    public void make() {
        int n = magic.length;
        int x = 0;
        int y = n / 2; // y의 중간값을 구할 수 있다.
        magic[x][y] = 1;// 3x3일경우 (0,1) 위치에 1을 넣고 시작

        for (int i = 2; i <= n * n; i++) {
            // 값 변경전에 원본값을 저장
            int tempX = x;
            int tempY = y;

            if (x - 1 < 0) { // x-1 했을때 음수이면
                x = n - 1; // x인덱스의 최대값으로 이동
            } else {
                x--;
            }

            if (y - 1 < 0) {
                y = n - 1;
            } else {
                y--;
            }

            if (magic[x][y] != 0) {// 이미 수가 채워져 있다면
                // 원레 위치로 이동해서 x+1
                x = tempX + 1;
                y = tempY;
            }

            magic[x][y] = i;
        }
    }

    // 마방진 증명 확인 코드 작성하기
    // 가로의 합 구하는 기능
    public int line(int i) {
        int sum = 0;
        for (int j = 0; j < magic.length; j++) {
            sum += magic[i][j];
        }
        return sum;
    }

    // 세로의 합
    public int upline(int i) {
        int sum = 0;
        for (int j = 0; j < magic.length; j++) {
            sum += magic[j][i];
        }
        return sum;
    }

    // 대각선의 합 (왼쪽 -> 오른쪽)
    public int diagonal() {
        int sum = 0;
        for (int i = 0; i < magic.length; i++) {
            sum += magic[i][i];
        }
        return sum;
    }

    // 대각선의 합 (오른쪽 -> 왼쪽)
    public int diagonal2() {
        int sum = 0;
        for (int i = 0; i < magic.length; i++) {
            sum += magic[i][magic.length - 1 - i];
        }
        return sum;
    }

    public boolean isCheck() {
        boolean isC = true;
        // 기준은 3X3 마방진
        // 합을 구하는 메서드 4개의 결과를 구함 -> 가로세로6개, 대각선 2개
        // 3*2+2=8, 4*2+2 = 10...
        int n = magic.length;
        int[] ma = new int[n * 2 + 2]; // 배열의 길이 정의(가로,세로,대각선 2개)

        // 각각의 결과를 배열ma에 저장
        for (int i = 0; i < n; i++) {
            ma[i] = line(i); // ma[0],ma[1],ma[2] -> 가로값
            ma[i + n] = upline(i); // ma[3],ma[4],ma[5] -> 세로값
        }
        ma[n * 2] = diagonal(); // ma[6] -> 대각선 값
        ma[n * 2 + 1] = diagonal2(); // ma[7] -> 대각선 값

        // 배열의 모든 값이 동일한지 확인
        for (int i = 1; i < ma.length; i++) {
            if (ma[i] != ma[0]) {
                isC = false;
                break;
            }
        }

        return isC;
    }

}
