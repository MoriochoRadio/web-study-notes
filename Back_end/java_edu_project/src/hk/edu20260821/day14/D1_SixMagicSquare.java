package hk.edu20260821.day14;

import hk.edu20260818.day11.day11_2.OddMagicSquare;

public class D1_SixMagicSquare {

    private int[][] magic;

    public D1_SixMagicSquare() {
        this(6);
    }

    public D1_SixMagicSquare(int n) {
        this.magic = new int[n][n];
    }

    public void make() {
        makeA();
        makeB();
        makeCD();
        multi();
        makeAdd();
    }

    // A영역구현하기
    // n : 배열의 길이
    // j인덱스의 n/4이 되는 영역을 3으로 채우는 기능
    // i인덱스의 n/4이 되는 위치에서 j+1을 해서 3을 채우자
    private void makeA() {
        int n = magic.length;

        for (int i = 0; i < n / 2; i++) {
            for (int j = 0; j < n / 4; j++) {
                if (i == 2) {
                    magic[i][j + 1] = 3;
                } else {
                    magic[i][j] = 3;
                }
            }
        }
    }

    // B영역
    // 개념 : 2로 채우다가 마지막 열에만 1로 채운다.
    // 먼저 1로 모두 채우고 그리고 해당 범위만큼 2로 채우자.
    private void makeB() {
        int n = magic.length;
        // 1을 먼저 채우자
        for (int i = 0; i < n / 2; i++) {
            for (int j = 0; j < n / 2; j++) {
                magic[i][j + n / 2] = 1;
            }
        }
        // 2를 채우자
        for (int i = 0; i < n / 2; i++) {
            for (int j = 0; j < n / 2 - (n / 4 - 1); j++) {
                magic[i][j + n / 2] = 2;
            }
        }

    }

    // C영역: A지역에서 0 -> 3, 3 -> 0으로 변경
    // D영역: B지역에서 1 -> 2, 2 -> 1로 변경
    private void makeCD() {
        // C영역
        int n = magic.length;

        for (int i = 0; i < n / 2; i++) {
            for (int j = 0; j < n / 2; j++) {
                if (magic[i][j] == 3) {
                    magic[i + n / 2][j] = 0;
                } else if (magic[i][j] == 0) {
                    magic[i + n / 2][j] = 3;
                }

                // D영역에 값 추가
                if (magic[i][j + n / 2] == 1) {
                    magic[i + n / 2][j + n / 2] = 2;
                } else if (magic[i][j + n / 2] == 2) {
                    magic[i + n / 2][j + n / 2] = 1;
                }
            }
        }

    }

    // 각 자리에 값에, (n/2)*(n/2)계산 결과를 각각 곱한다.
    private void multi() {
        int n = magic.length;
        int m = (n / 2) * (n / 2);

        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                magic[i][j] *= m;
            }
        }

    }

    // 각각의 영역에 대해 홀수 마방진의 값을 더하자
    // 4개의 영역 --> 10마방진의 경우 5홀수마방진을 더해야 된다.
    // 홀수마방진 다시 구현할 필요 없음 --> OddMagicSquare 구현했음
    private void makeAdd() {
        int n = magic.length;

        OddMagicSquare odd = new OddMagicSquare(n / 2);
        odd.make();
        int[][] oddMagic = odd.getMagic();

        for (int i = 0; i < n / 2; i++) {
            for (int j = 0; j < n / 2; j++) {
                magic[i][j] += oddMagic[i][j];
                magic[i][j + n / 2] += oddMagic[i][j];
                magic[i + n / 2][j] += oddMagic[i][j];
                magic[i + n / 2][j + n / 2] += oddMagic[i][j];
            }
        }
    }

    public static void main(String[] args) {
        D1_SixMagicSquare six = new D1_SixMagicSquare(10);
        six.make();
        for (int i = 0; i < six.magic.length; i++) {
            for (int j = 0; j < six.magic.length; j++) {
                System.out.print(six.magic[i][j] + "\t");
            }
            System.out.println();
        }
    }
}