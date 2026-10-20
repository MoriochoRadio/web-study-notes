# python_agent — AI Agent 과정 실습 노트북 (Day 1~4)

「AI AGENT 실습 입문 과정 1부」의 실습 폴더(`workspace-boot/python_agent`)를 그대로 옮긴 사본이다. 지금까지는 하루에 교안 두 개씩 진행했다 — 2026-10-19에 Day 1(변수 · 연산자 · 자료형)과 Day 2(조건 · 반복 · 함수 · 모듈 · 파일 · 예외), 2026-10-20에 Day 3(Pandas)과 Day 4(NumPy · Matplotlib · Seaborn). 교안 실습 문제를 VS Code의 Jupyter 노트북에서 직접 풀었다.
[수업 진도 카드](../index.html#ai-day01) · [파이썬 · 데이터 개념 카드](../index.html#py-01) · [실습 풀이 카드](../index.html#lab-01)

## 파일

| 파일 | 내용 |
|---|---|
| `day01_실습.ipynb` | Day 1 코드 9칸 — `print("Hello")`, 계산기 + 조건식, 문자열 인덱싱 · 메서드, 이메일 정리기, 리스트 메서드 · `enumerate`, 점수 분석, 상품 목록 분석 |
| `day02_실습.ipynb` | Day 2 코드 9칸 — 삼항 · 조건 체이닝, 등급 판별기, 리스트 컴프리헨션, 구구단, BMI 함수, 로또 번호, 파일 쓰기 · 읽기, 점수 파일 + 예외처리, 종합 실습(10/20 아침 **문제 칸만** 추가 — 풀이 없음) |
| `day03_실습.ipynb` | Day 3 코드 12칸 — DataFrame 만들기, CSV · JSON 저장 · 읽기, 탐색 · 필터링, 결측치 · 중복, 컬럼 정리(rename · drop · apply), 종합 전처리 |
| `day04_실습.ipynb` | Day 4 코드 12칸 — NumPy 배열, Matplotlib 선 · 막대 · 산점도 · 꾸미기, Seaborn, `df.plot`, 종합 분석(**아직 실행 전**). 그래프가 출력(PNG)으로 저장돼 있어 파일이 크다 |
| `day01_실습예제.md` | 선생님이 준 Day 1 실습 2시간용 추가 문제 11개(Part 1~5). **아직 풀지 않음** — [체크리스트 카드](../index.html#lab-11) |
| `memo.txt` · `scores.txt` | Day 2 파일 입출력 칸이 만든 결과 파일 |
| `items.csv` · `items.json` | Day 3 CSV 실습 결과(연필 · 지우개). JSON은 `force_ascii=False`라 한글 그대로 |
| `students.csv` · `students.json` | Day 3 교안 8쪽 예제 칸의 결과 — 이름과 달리 **상품 표**(마우스 · 키보드 · 모니터)가 들어 있다. 그 칸을 실행할 때 `df`가 바로 앞 실습의 상품 표였기 때문이다. JSON은 옵션 없이 저장돼 한글이 `마…`로 보인다 |
| `result.csv` | Day 3 종합 실습 결과(`utf-8-sig` — 첫 3바이트가 BOM이라 엑셀에서도 한글이 보인다) |

노트북은 GitHub에서 열면 코드와 저장된 출력이 함께 보인다. 직접 실행하려면 VS Code + Python 확장(Jupyter 포함)에서 열고 커널로 파이썬을 고른다. Day 3 · 4는 `pip install pandas numpy matplotlib seaborn`이 필요하다. 파일을 만드는 칸은 노트북이 있는 폴더의 csv · json · txt를 덮어쓴다.

## 실행 환경과 다시 실행한 결과

- 노트북 메타데이터의 파이썬은 **3.15.0** — 교안 권장(3.10~3.12)보다 새 버전이다. 라이브러리는 pandas **3.0.6** · NumPy 2.5.4 · Matplotlib 3.11.2 · Seaborn 0.13.2(가상환경 없이 시스템 파이썬에 설치됨). 선생님 노트북은 파이썬 3.14.6으로 실행됐다.
- pandas 3.0이라 교안과 출력 모양이 조금 다르다 — `Index(['name', 'score'], dtype='str')`(교안은 `dtype` 없음), `<class 'pandas.Series'>`.
- 코드 칸을 저장소 밖 사본에서 위에서부터 차례로 다시 실행해 저장된 출력과 대조했다.
  - Day 2: **로또 번호 칸**은 무작위라 실행마다 다르고 `randint`라 번호가 겹칠 수 있다(서로 다른 번호는 `random.sample(range(1, 46), 6)`). **구구단 칸**의 저장된 출력은 while 부분이 `7 x 10 = 70`까지 10줄 — 고친 뒤 다시 실행하지 않은 것.
  - Day 1: 점수 분석 칸은 `enumerate`가 0부터이고 앞 문제의 `sort()` 뒤에 돌아 `0번째 학생: 60점`부터 나온다 — [실습 03](../index.html#lab-03).
  - Day 3: 교안 11쪽 예제 칸은 `KeyError: 'score'`(그때의 `df`가 상품 표) — [실습 14](../index.html#lab-14). 종합 칸의 저장된 출력은 `subset` 중복 제거를 넣기 전의 것이고, `result.csv`는 지금 코드의 결과(4행)와 같다. 3번 필터 결과를 담지 않아 70점 미만인 민수가 파일에 남는다 — [실습 17](../index.html#lab-17).
  - Day 4: NumPy 2번이 `scores > 2`라 다섯 개가 다 나온다(80점 이상이면 `>= 80`) — [실습 18](../index.html#lab-18). Seaborn 칸은 `savefig`를 `title`보다 먼저 불러 저장 파일에 제목이 없다 — [실습 20](../index.html#lab-20). Pandas 그래프 칸은 같은 코드가 두 번 들어 있어 그래프가 4장이다. 종합 칸은 실행 번호 · 출력이 없다(다시 실행한 결과는 [실습 22](../index.html#lab-22)).
  - 그 밖의 `print` 출력은 다시 실행한 것과 같았다. 그래프는 같은 종류 · 같은 데이터로 그려지는 것만 눈으로 확인했고 픽셀 단위로 대조하지는 않았다. 페이지의 그래프 그림(`../img/day04-*.png`)은 다시 실행해 만든 것이다.

## 인코딩 — 3.15와 3.12 이하 Windows의 차이

Day 2 파일 칸(`open("memo.txt", "w")`)은 교안처럼 `encoding`을 적지 않았다. 파이썬 3.15는 기본이 UTF-8이라 `memo.txt`가 UTF-8로 저장되었지만, 3.12 이하 Windows는 기본이 cp949다. UTF-8 모드를 끈 실행(`python -X utf8=0`)으로 비교하니 같은 문장이 cp949로 저장되었고, UTF-8 파일을 cp949로 읽으면 `UnicodeDecodeError`가 났다. 점수 파일 칸처럼 `encoding="utf-8"`을 적으면 버전 · OS와 상관없이 같다. → [개념 08](../index.html#py-08). Pandas의 `to_csv` · `read_csv`는 버전과 상관없이 UTF-8이 기본이다(엑셀용은 `utf-8-sig`) → [개념 10](../index.html#py-10).

## 선생님 자료와의 관계

- 선생님 레포 [`python_agent_20261019`](https://github.com/kang99king3/back_end_edu_20260629/tree/main/python_agent_20261019)에는 10/19 커밋 5개(Day01 · Day02 노트북, `test.py`, `Day1_실습예제.md`, `memo.txt`)와 10/20 커밋 9개(Day02 노트북 갱신 · `scores.txt`, Day03 노트북 · `items.csv/json` · `result.csv`, Day04 노트북 · 그래프 그림 7장 `check_13a~c.png` · `check15a/b.png` · `check16a/b.png`)가 있다.
- 이 폴더의 노트북은 선생님 노트북의 사본이 아니라 **직접 푼 것**이다(선생님 노트북은 쪽 번호 제목 칸 + 코드 칸, 이 폴더는 코드 칸만. 같은 칸은 교안 예제를 옮긴 칸뿐). Day 4 Seaborn 칸의 `savefig('check_13a.png')`는 선생님 노트북과 같은 파일 이름이다.
- 선생님 풀이와 다른 점은 실습 카드마다 적었다 — 예: Day 3 종합의 등급 기준(선생님 80 · 내 풀이 90), 필터 결과를 다시 담는지, 표준편차(`describe` 13.70 · `np.std` 12.25는 둘 다 같은 값).
- `day01_실습예제.md`는 선생님의 `Day1_실습예제.md`와 끝 줄바꿈만 다르고, `memo.txt`는 같은 내용이다. 실습예제가 정답 파일로 안내하는 `day1_실습_정답.py`는 실습 폴더와 선생님 레포 어디에도 없다.
- 강의자료(`Day1~4_강의자료.pptx`)는 배포 자료라 올리지 않았다. Day 2 종합 실습(성적 처리기)은 문제 칸만 있어 [실습 10](../index.html#lab-10)에 참고 풀이와 선생님 풀이(10/20)를 적었다.
