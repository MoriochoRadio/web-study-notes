package hk.edu20260818.day11.day11_2;

public class EvenMagicSquare extends MagicSquare {
    public EvenMagicSquare() {
        super(4);
    }

    public EvenMagicSquare(int n) {
        super(n);
    }

    public void make() {
        makeA();
        makeB();
    }

    // 1~16까지 숫자를 차례대로 저장하기
    public void makeA() {
        int n = magic.length;
        // int count = 1;
        // for (int i = 0; i < n; i++) {
        // for (int j = 0; j < n; j++) {
        // magic[i][j] = count++;
        // }
        // }

        // 1~16까지의 숫자 1,2,3,4,5,...16 --> 2차원배열에 저장
        // [i/col][i%col]
        for (int i = 0; i < n * n; i++) {
            magic[i / n][i % n] = i + 1;
        }
    }

    // 범위에 맞는 위치에 반대로 숫자 저장하기
    public void makeB() {
        int n = magic.length;
        // 16~1까지의 숫자를 입력

        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                // 노란색 영역 (ppt그림에서)
                if ((i >= 0 && i < n / 4) || (i >= n / 4 * 3 && i < n)) {
                    if (j >= n / 4 && j < n / 4 * 3) { // j인덱스 조건
                        magic[i][j] = (n * n) - (i * n + j); // i*col+j -> 0,1,2,3,4,5...15
                    }
                } else { // 주황색 영역(ppt그림에서)
                    if ((j >= 0 && j < n / 4) || (j >= n / 4 * 3 && j < n)) {
                        magic[i][j] = (n * n) - (i * n + j);
                    }
                }
            }

        }
    }

}
