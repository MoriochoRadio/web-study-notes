package hk.practice;

public class prac03 {

    public static void main(String[] args) {
        int size = 3; // 마방진 크기 (3x3, 5x5 등 홀수)
        int[][] arr = new int[size][size];

        // 1. 시작 위치: 맨 윗줄(0번째 행)의 가운데 칸(size / 2번째 열)
        int row = 0; // 행(row): 위아래(세로) 위치
        int col = size / 2; // 열(col): 좌우(가로) 위치

        // 2. 1부터 9(size * size)까지 차례대로 채우기
        for (int i = 1; i <= size * size; i++) {
            // [1] 현재 칸에 숫자 넣기
            arr[row][col] = i;

            // [2] 다음 이동할 위치 결정하기
            // 3의 배수(3, 6, 9...)를 넣은 직후라면? -> 바로 아래 줄(행 + 1)로 이동
            if (i % size == 0) {
                row++; // 아래로 1칸 (행 증가)
            }
            // 그 외에는 -> 왼쪽 위 대각선(↖)으로 이동
            else {
                row--; // 위로 1칸 (행 감소)
                col--; // 왼쪽으로 1칸 (열 감소)
            }

            // [3] 격자 밖으로 벗어났을 때 반대편 끝으로 이동 (순환)
            // 맨 위를 뚫고 나갔으면 -> 맨 아래 줄(size - 1)로 이동
            if (row < 0) {
                row = size - 1;
            }
            // 맨 왼쪽을 뚫고 나갔으면 -> 맨 오른쪽 칸(size - 1)으로 이동
            if (col < 0) {
                col = size - 1;
            }
        }

        // 3. 완성된 마방진 출력
        System.out.println("=== " + size + "x" + size + " 홀수 마방진 ===");
        for (int r = 0; r < size; r++) {
            for (int c = 0; c < size; c++) {
                System.out.print(arr[r][c] + "\t");
            }
            System.out.println(); // 줄바꿈
        }
    }
}
