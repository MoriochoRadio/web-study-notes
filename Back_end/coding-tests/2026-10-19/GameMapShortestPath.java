// 27회차 JAVA — 게임 맵 최단거리 (프로그래머스 1844) · 원문 정답 풀이 (FAIL · 제출 코드 칸 비어 있음)
// 원문의 class Solution 은 파일 이름에 맞춰 클래스 이름만 바꿨다.
import java.util.Queue;
import java.util.LinkedList;

class GameMapShortestPath {
    public int solution(int[][] maps) {
        int n = maps.length;    // 맵의 세로 크기 (행 개수)
        int m = maps[0].length; // 맵의 가로 크기 (열 개수)
        
        // 1. 동서남북 네 방향으로 이동하기 위한 오프셋(변화량) 배열
        //    (상, 하, 좌, 우 순서)
        int[] dx = {-1, 1, 0, 0}; // 행(x)의 변화량
        int[] dy = {0, 0, -1, 1}; // 열(y)의 변화량
        
        // 2. 탐색할 좌표들을 순서대로 담아둘 대기열(Queue) 생성
        //    좌표는 x와 y 두 값이 필요하므로 int[] (정수 배열) 형태로 담습니다.
        Queue<int[]> queue = new LinkedList<>();
        
        // 3. 시작점인 (0, 0) 좌표를 큐에 넣고 탐색 시작
        queue.add(new int[]{0, 0});
        
        // 4. 큐가 빌 때까지(더 이상 갈 수 있는 길이 없을 때까지) 반복
        while (!queue.isEmpty()) {
            // 💡 큐에서 가장 먼저 들어온(가까운) 좌표를 하나 꺼냅니다.
            int[] current = queue.poll();
            int x = current[0];
            int y = current[1];
            
            // 5. 현재 위치(x, y)에서 동서남북 4방향으로 한 칸씩 이동해보기
            for (int i = 0; i < 4; i++) {
                int nx = x + dx[i]; // 이동한 후의 x 좌표
                int ny = y + dy[i]; // 이동한 후의 y 좌표
                
                // 조건 1: 맵 바깥으로 벗어났는지 확인 (범위 체크)
                if (nx < 0 || nx >= n || ny < 0 || ny >= m) {
                    continue; // 맵 밖이면 무시하고 다음 방향 탐색
                }
                
                // 조건 2: 벽이거나(0) 이미 방문한 길인지 확인
                //         (방문한 길은 거리가 2 이상으로 기록되어 있음)
                if (maps[nx][ny] == 0 || maps[nx][ny] > 1) {
                    continue; // 갈 수 없는 곳이면 무시
                }
                
                // 조건 3: 처음 가보는 길(1)인 경우!
                //         이전 위치에 기록된 칸 수에 +1을 더해서 현재 칸에 누적합니다.
                maps[nx][ny] = maps[x][y] + 1;
                
                // 다음 번에 이 위치에서 또 사방을 탐색하기 위해 큐에 좌표를 등록합니다.
                queue.add(new int[]{nx, ny});
            }
        }
        
        // 6. 목적지(우측 하단 끝: n-1, m-1)에 적힌 최종 칸 수 확인
        int answer = maps[n - 1][m - 1];
        
        // 만약 목적지의 값이 여전히 1이라면, 시작점 외에 한 번도 도달하지 못한 것이므로 -1 리턴
        // 그렇지 않다면 누적된 최단 거리(칸 수)를 리턴
        return answer == 1 ? -1 : answer;
    }
}
