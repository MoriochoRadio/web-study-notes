# python_agent — AI Agent 과정 실습 파일 (Day 1~7)

「AI AGENT 실습 입문 과정 1부」의 실습 폴더(`workspace-boot/python_agent`)를 그대로 옮긴 사본이다. 처음 이틀은 하루에 교안 두 개씩 진행했다 — 2026-10-19에 Day 1(변수 · 연산자 · 자료형)과 Day 2(조건 · 반복 · 함수 · 모듈 · 파일 · 예외), 2026-10-20에 Day 3(Pandas)과 Day 4(NumPy · Matplotlib · Seaborn), 2026-10-21에 Day 5(FastAPI) 하나, 2026-10-22에 Day 5 보충(DB 연동)과 Day 6~7 합본(LangChain). Day 1~4는 VS Code의 Jupyter 노트북, Day 5는 서버 코드라 `day05/main.py` 파일 하나에 교안 실습을 직접 풀었다.
[수업 진도 카드](../index.html#ai-day01) · [파이썬 · 데이터 개념 카드](../index.html#py-01) · [실습 풀이 카드](../index.html#lab-01)

## 파일

| 파일 | 내용 |
|---|---|
| `day01_실습.ipynb` | Day 1 코드 9칸 — `print("Hello")`, 계산기 + 조건식, 문자열 인덱싱 · 메서드, 이메일 정리기, 리스트 메서드 · `enumerate`, 점수 분석, 상품 목록 분석 |
| `day02_실습.ipynb` | Day 2 코드 9칸 — 삼항 · 조건 체이닝, 등급 판별기, 리스트 컴프리헨션, 구구단, BMI 함수, 로또 번호, 파일 쓰기 · 읽기, 점수 파일 + 예외처리, 종합 실습(10/20 아침 **문제 칸만** 추가 — 풀이 없음) |
| `day03_실습.ipynb` | Day 3 코드 12칸 — DataFrame 만들기, CSV · JSON 저장 · 읽기, 탐색 · 필터링, 결측치 · 중복, 컬럼 정리(rename · drop · apply), 종합 전처리 |
| `day04_실습.ipynb` | Day 4 코드 12칸 — NumPy 배열, Matplotlib 선 · 막대 · 산점도 · 꾸미기, Seaborn, `df.plot`, 종합 분석(**아직 실행 전**). 그래프가 출력(PNG)으로 저장돼 있어 파일이 크다 |
| `day05/main.py` | Day 5 FastAPI 실습 5개(첫 API · Path · Path + Query · 학생 등록 · 상품 CRUD)를 한 파일에. **`GET /products/{product_id}`가 세 번 등록돼 있어 먼저 등록된 함수만 응답한다** — [실습 27](../index.html#lab-27) |
| `day05/db_main.py` | Day 5 보충 — FastAPI + MariaDB(SQLAlchemy) 상품 CRUD. 선생님 개발 요청서(`dev_prompt.md`)대로 만든 파일. **DB 비밀번호(접속 주소 2줄 · 주석 2줄)는 `YOUR_DB_PASSWORD`로 가렸다** — [실습 28](../index.html#lab-28) |
| `day06/day0607_실습.ipynb` | Day 6~7 LangChain 12칸 — OpenAI 첫 호출, `ChatOpenAI`, PromptTemplate + Chain, `@tool`, Memory, 체인 두 개, 종합 수학 선생님 챗봇 |
| `day06/day0607_실습예제.md` | 선생님 `Day06_07_실습예제.md`(끝 줄바꿈만 다름) — 5개 Part 13문제, **아직 풀지 않음** — [체크리스트](../index.html#lab-34) |
| `day01_실습예제.md` | 선생님이 준 Day 1 실습 2시간용 추가 문제 11개(Part 1~5). **아직 풀지 않음** — [체크리스트 카드](../index.html#lab-11) |
| `memo.txt` · `scores.txt` | Day 2 파일 입출력 칸이 만든 결과 파일 |
| `items.csv` · `items.json` | Day 3 CSV 실습 결과(연필 · 지우개). JSON은 `force_ascii=False`라 한글 그대로 |
| `students.csv` · `students.json` | Day 3 교안 8쪽 예제 칸의 결과 — 이름과 달리 **상품 표**(마우스 · 키보드 · 모니터)가 들어 있다. 그 칸을 실행할 때 `df`가 바로 앞 실습의 상품 표였기 때문이다. JSON은 옵션 없이 저장돼 한글이 `마…`로 보인다 |
| `result.csv` | Day 3 종합 실습 결과(`utf-8-sig` — 첫 3바이트가 BOM이라 엑셀에서도 한글이 보인다) |

노트북은 GitHub에서 열면 코드와 저장된 출력이 함께 보인다. 직접 실행하려면 VS Code + Python 확장(Jupyter 포함)에서 열고 커널로 파이썬을 고른다. Day 3 · 4는 `pip install pandas numpy matplotlib seaborn`, Day 5는 `pip install fastapi uvicorn`(DB 연동은 `sqlalchemy pymysql` + MariaDB), Day 6~7은 `pip install langchain-openai python-dotenv`와 OpenAI API 키가 필요하다. Day 5 서버는 `day05` 폴더에서 `uvicorn main:app --reload`(안 되면 `python -m uvicorn main:app --reload`)로 띄우고 `http://127.0.0.1:8000/docs`에서 시험한다. 실습 폴더의 `__pycache__`는 실행할 때 생기는 파일이라 옮기지 않았다. **API 키가 든 `.env`는 열지도, 옮기지도 않았다** — 저장소 루트 `.gitignore`가 `.env`를 막는다. Day 6~7 노트북을 직접 돌리려면 이 폴더(또는 상위 폴더)에 자기 `.env`(`OPENAI_API_KEY=…`)를 만든다. 파일을 만드는 칸은 노트북이 있는 폴더의 csv · json · txt를 덮어쓴다.

## 실행 환경과 다시 실행한 결과

- 노트북 메타데이터의 파이썬은 **3.15.0** — 교안 권장(3.10~3.12)보다 새 버전이다. 라이브러리는 pandas **3.0.6** · NumPy 2.5.4 · Matplotlib 3.11.2 · Seaborn 0.13.2 · FastAPI 0.156.4 · Pydantic 2.14.1 · uvicorn 0.54.0(가상환경 없이 시스템 파이썬에 설치됨). 선생님 노트북은 파이썬 3.14.6으로 실행됐다.
- pandas 3.0이라 교안과 출력 모양이 조금 다르다 — `Index(['name', 'score'], dtype='str')`(교안은 `dtype` 없음), `<class 'pandas.Series'>`.
- 코드 칸을 저장소 밖 사본에서 위에서부터 차례로 다시 실행해 저장된 출력과 대조했다.
  - Day 2: **로또 번호 칸**은 무작위라 실행마다 다르고 `randint`라 번호가 겹칠 수 있다(서로 다른 번호는 `random.sample(range(1, 46), 6)`). **구구단 칸**의 저장된 출력은 while 부분이 `7 x 10 = 70`까지 10줄 — 고친 뒤 다시 실행하지 않은 것.
  - Day 1: 점수 분석 칸은 `enumerate`가 0부터이고 앞 문제의 `sort()` 뒤에 돌아 `0번째 학생: 60점`부터 나온다 — [실습 03](../index.html#lab-03).
  - Day 3: 교안 11쪽 예제 칸은 `KeyError: 'score'`(그때의 `df`가 상품 표) — [실습 14](../index.html#lab-14). 종합 칸의 저장된 출력은 `subset` 중복 제거를 넣기 전의 것이고, `result.csv`는 지금 코드의 결과(4행)와 같다. 3번 필터 결과를 담지 않아 70점 미만인 민수가 파일에 남는다 — [실습 17](../index.html#lab-17).
  - Day 4: NumPy 2번이 `scores > 2`라 다섯 개가 다 나온다(80점 이상이면 `>= 80`) — [실습 18](../index.html#lab-18). Seaborn 칸은 `savefig`를 `title`보다 먼저 불러 저장 파일에 제목이 없다 — [실습 20](../index.html#lab-20). Pandas 그래프 칸은 같은 코드가 두 번 들어 있어 그래프가 4장이다. 종합 칸은 실행 번호 · 출력이 없다(다시 실행한 결과는 [실습 22](../index.html#lab-22)).
  - Day 5: `main.py`를 저장소 밖 사본으로 uvicorn에 띄워 요청 29개를 보냈다. 실습 23 · 24 · 26의 응답과 PUT · DELETE는 문제대로였다. 반면 `GET /products/{product_id}`는 실습 25의 첫 함수가 응답해 `show_tax`가 무시되고, 없는 상품도 200이며, PUT으로 고친 상품이 보이지 않는다(서버 경고 `Duplicate Operation ID`). 실습 25 두 함수의 경로만 나눈 사본에서는 CRUD가 모두 정상이었다 — [실습 25](../index.html#lab-25) · [실습 27](../index.html#lab-27). 도전 문제의 `grade`가 `str`이라 `/students/two/15/score`도 받는다.
  - Day 5 보충: `db_main.py`는 접속 주소만 SQLite로 바꾼 저장소 밖 사본을 uvicorn으로 띄워 요청 15개를 보냈다 — 201 등록, 음수 가격 · 101자 이름 422, 목록 최신순, 없는 상품 404, 수정 · 삭제 정상(실제 MariaDB에는 연결하지 않음).
  - Day 6~7: LLM을 부르는 칸은 **다시 실행하지 않았다**(사용자 키 · 요금, 답이 매번 다름) — 노트북의 답은 그때 받은 그대로다. LLM 없이 확인되는 부분(도구 `.name`/`.description`/결과, 프롬프트 변수 검사, 체인 연결, history 2 → 4)은 가짜 모델(`FakeListChatModel`)로 실행했다. 13쪽 예제 칸은 `HumanMessage`를 import 전에 써서 위에서부터 실행하면 `NameError`([실습 32](../index.html#lab-32)), 1번 실습 칸은 저장된 출력이 지금 코드와 다르다([실습 29](../index.html#lab-29)). `calculate` 도구의 `eval`은 수식이 아닌 코드도 실행한다([개념 25](../index.html#py-25)).
  - 그 밖의 `print` 출력은 다시 실행한 것과 같았다. 그래프는 같은 종류 · 같은 데이터로 그려지는 것만 눈으로 확인했고 픽셀 단위로 대조하지는 않았다. 페이지의 그래프 그림(`../img/day04-*.png`)은 다시 실행해 만든 것이다.

## 인코딩 — 3.15와 3.12 이하 Windows의 차이

Day 2 파일 칸(`open("memo.txt", "w")`)은 교안처럼 `encoding`을 적지 않았다. 파이썬 3.15는 기본이 UTF-8이라 `memo.txt`가 UTF-8로 저장되었지만, 3.12 이하 Windows는 기본이 cp949다. UTF-8 모드를 끈 실행(`python -X utf8=0`)으로 비교하니 같은 문장이 cp949로 저장되었고, UTF-8 파일을 cp949로 읽으면 `UnicodeDecodeError`가 났다. 점수 파일 칸처럼 `encoding="utf-8"`을 적으면 버전 · OS와 상관없이 같다. → [개념 08](../index.html#py-08). Pandas의 `to_csv` · `read_csv`는 버전과 상관없이 UTF-8이 기본이다(엑셀용은 `utf-8-sig`) → [개념 10](../index.html#py-10).

## 선생님 자료와의 관계

- 선생님 레포 [`python_agent_20261019`](https://github.com/kang99king3/back_end_edu_20260629/tree/main/python_agent_20261019)에는 날짜별로 다음이 올라와 있다.
  - 10/19 커밋 5개 — Day01 · Day02 노트북, `test.py`, `Day1_실습예제.md`, `memo.txt`
  - 10/20 커밋 9개 — Day02 노트북 갱신 · `scores.txt`, Day03 노트북 · `items.csv/json` · `result.csv`, Day04 노트북 · 그래프 그림 7장(`check_13a~c.png` · `check15a/b.png` · `check16a/b.png`)
  - 10/21 커밋 5개 — `Day05/main.py`(+ 파이썬 3.14의 `__pycache__`). 종합 CRUD를 `/products17/…` 경로로 나눠 충돌을 피했고, 고정 경로를 `/courses/pupular`로 오타 내 `/courses/popular`는 422가 난다
  - 10/22 커밋 5개 — `Day05/db_main.py` · `dev_prompt.md`(AI에게 코드를 요청하는 형식의 개발 요청서), `Day06/day0607_실습.ipynb` · `Day06_07_실습예제.md`. 선생님 노트북에는 15쪽 Memory · 17쪽 종합 풀이가 아직 없다. 요청서와 코드에 DB 계정 정보가 적혀 있어 이 저장소에는 옮기지 않았다
- 이 폴더의 노트북은 선생님 노트북의 사본이 아니라 **직접 푼 것**이다(선생님 노트북은 쪽 번호 제목 칸 + 코드 칸, 이 폴더는 코드 칸만. 같은 칸은 교안 예제를 옮긴 칸뿐). Day 4 Seaborn 칸의 `savefig('check_13a.png')`는 선생님 노트북과 같은 파일 이름이다.
- 선생님 풀이와 다른 점은 실습 카드마다 적었다 — 예: Day 3 종합의 등급 기준(선생님 80 · 내 풀이 90), 필터 결과를 다시 담는지, 표준편차(`describe` 13.70 · `np.std` 12.25는 둘 다 같은 값).
- `day01_실습예제.md`는 선생님의 `Day1_실습예제.md`와 끝 줄바꿈만 다르고, `memo.txt`는 같은 내용이다. 실습예제가 정답 파일로 안내하는 `day1_실습_정답.py`는 실습 폴더와 선생님 레포 어디에도 없다.
- 강의자료(`Day1~5_강의자료.pptx` · `Day6-Day7_강의자료.pptx` · `Day6_강의자료_개념추가.pptx`)는 배포 자료라 올리지 않았다. Day 2 종합 실습(성적 처리기)은 문제 칸만 있어 [실습 10](../index.html#lab-10)에 참고 풀이와 선생님 풀이(10/20)를 적었다.
