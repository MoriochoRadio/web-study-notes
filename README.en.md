# Web Development Study Log (Job Academy)

**2026-10-20 update:** Added day 2 of the AI Agent course (Days 3–4) to the [AI Agent notes](https://moriochoradio.github.io/web-study-notes/AI_Agent/): seven concept cards on pandas (DataFrame, CSV/JSON, filtering, missing values, duplicates, `apply`), NumPy, Matplotlib and Seaborn, each compared with SQL or Java; eleven lab cards with my notebook code, a re-run, and how the teacher's solution differs (charts are re-rendered images); and 13 more quiz questions. Re-running the notebooks surfaced an example cell that raises `KeyError` because an earlier cell replaced `df`, a `students.csv` that actually holds products, a filter whose result was never assigned, a NumPy condition typo (`> 2`), a figure saved before its title was added, and the gap between `describe()`'s standard deviation (13.70, sample) and `np.std` (12.25, population). [Coding-test round 28](Back_end/coding-tests/2026-10-20/) (2 PASS, 2 FAIL) continues as ct-74–77 with Java checks (every valid carpet, 1.56 million cases) and 13 SQLite checks.

**2026-10-19 update:** A new course, "AI Agent Hands-on Intro, Part 1", started, so a third study page was added: [AI Agent notes](https://moriochoradio.github.io/web-study-notes/AI_Agent/). Day 1–2 Python (setup and venv, variables and operators, strings, lists, tuples, dicts, conditions, loops and comprehensions, functions and modules, files and exceptions) is written up as eight concept cards that compare each topic with Java, eleven lab cards (my notebook solution, a re-run, and what to fix for each slide exercise, plus a reference solution and a checklist of the teacher's extra exercises), and a 17-question shuffled quiz. The class notebooks are kept in [AI_Agent/python_agent/](AI_Agent/python_agent/); re-running them showed the effects of Python 3.15 on this machine (UTF-8 is the default file encoding, unlike 3.10–3.12 on Windows), one cell whose saved output predates an edit, and duplicate lottery numbers from `randint`. [Coding-test round 27](Back_end/coding-tests/2026-10-19/) (3 FAIL, no submitted code: remove the smallest number, a SQL NULL-replacement query, and a BFS shortest path) continues in the backend coding-test tab with Java and SQLite checks.

**2026-10-16 update:** Added day 50 (Oct 16) — REST APIs: the same board split into a Spring Boot JSON API ([12_backend_hkboard_restAPI](Back_end/web_edu_project/12_backend_hkboard_restAPI/): `@RestController`, `@RequestBody`, `@PathVariable`, `ResponseEntity`, CORS) and a Next.js front end ([12_frontend_hkboard_react](Back_end/web_edu_project/12_frontend_hkboard_react/)) that calls it with `fetch`; the teacher's final schedule-board code (top three per day with `ROW_NUMBER() OVER (PARTITION BY …)`, a `@ControllerAdvice` error page); and [coding-test round 26](Back_end/coding-tests/2026-10-16/) (2 PASS, 2 FAIL). Four web concept cards, concept-book chapter 44, journey step 32, five exam questions and both big-picture tabs were updated. With an in-memory H2 copy, the API, the CORS preflight and the whole UI flow (list → write → detail → edit → delete) worked; a missing post returned 200 with `null`, which crashed the detail page. Nothing was run against the real MariaDB or in the class IDE.

**2026-10-15 update:** Added day 49 (Oct 15) — the schedule board gained multi-delete (checkbox array, `@NotEmpty`, `rejectValue`, MyBatis `foreach` → `IN (…)`), a detail page filled through a `ModelMapper` bean, and a date helper bean called from Thymeleaf (`@util.toDates`); the class folder also has an update action and a three-item preview in each calendar cell. Three web concept cards, concept-book chapter 43, journey step 31, five exam questions and the big-picture tabs were updated. No coding test that day. Running a copy with an in-memory H2 database showed that the calendar preview prints titles unescaped (`th:utext`) — a title of `<!--` removed the next day's cell — and that `toDates` silently shows September 31 as September 30. Nothing was run against the real MariaDB or in the class IDE.

**2026-10-14 update (2):** Added day 48 (Oct 14) — adding a schedule (a date cell opens a form pre-filled through a command object; `@Validated` checks the input; the date is stored as a 12-digit string; `RedirectAttributes` sends the user back to that month) and the teacher's assignment, listing one day's schedules (including the class folder's solution note), plus [coding-test round 25](Back_end/coding-tests/2026-10-14/) (2 PASS, 2 FAIL), two web concept cards, concept-book chapter 42, journey step 30, five exam questions and the big-picture tabs. The class folder now equals the teacher's Oct 14 push except four local changes (port, DB account, `lombok.ToString`, `AND`). Running a copy with an in-memory H2 database showed that an empty `date=` mixes in schedules from the 1st to the 9th and that September 31 is accepted. Nothing was run against the real MariaDB or in the class IDE.

**2026-10-14 update:** Added day 47 (Oct 13) — the start of a schedule (calendar) board in a new Boot project, [11_schedule_springboot](Back_end/web_edu_project/11_schedule_springboot/) (DB password replaced by `YOUR_DB_PASSWORD`). The server finds the weekday of the 1st and the last day of the month with `java.util.Calendar`, and Thymeleaf draws the cells with `#numbers.sequence`. Also added two web concept cards, concept-book chapter 41, journey step 29, five exam questions, and the big-picture tabs (both dashboards). There was no coding test that day. Compared with the teacher's Oct 13 commits, the class folder was ahead (month/year navigation links and typo fixes). A copy with an in-memory H2 database matched JavaScript `Date` for all 372 months from 2000 to 2030. Nothing was run against the real MariaDB or in the class IDE.

**2026-10-13 update:** Added day 46 (Oct 12) — the teacher handed out a five-item improvement list for the [login board](Back_end/web_edu_project/10_login_board_springboot/) and the class fixed it: constructor injection everywhere, `println` replaced with `@Slf4j` logging, the upload folder moved into `application.properties` and read with `@Value`, an author check before edit/delete, and attachment add/remove on edit inside one transaction. Also [coding-test round 24](Back_end/coding-tests/2026-10-12/) (3 PASS, 1 FAIL), four web concept cards, concept-book chapter 40, journey step 28 and six exam questions. A copy of the repository source was run against the local MariaDB with two temporary members; all 21 checks passed (forged author, another member's edit/delete, a foreign file id rolled back) and the test rows were deleted afterwards. The teacher pushed "login_board10 완료" on the morning of Oct 13; the class folder already contained those changes (checked Oct 13).

**2026-10-12 update:** Added day 45 (Oct 8) — the class ran the teacher's finished [login board](Back_end/web_edu_project/10_login_board_springboot/) (sign-up and login with BCrypt, command objects with `@Validated`, multi-file upload and download, a MyBatis `resultMap` collection, a Thymeleaf layout, a Boot-style interceptor and `@ControllerAdvice`) — plus [coding-test round 23](Back_end/coding-tests/2026-10-08/) (1 PASS, 3 FAIL), five web concept cards, concept-book chapter 39, journey step 27 and six exam questions. The teacher's GitHub has no pushes after Oct 7, so nothing newer existed to pull into the class folder. Running a copy with an in-memory H2 database showed that the author is taken from a hidden form field (a logged-in user can post under another member's id) and that a post without attachments still shows "1 file". Nothing was run against the real MariaDB or in the class IDE.

**2026-10-07 update:** Added day 44 — the start of **Spring Boot**. The class rebuilt the 07 board with Boot 4.1, a MyBatis `@Mapper` interface, Thymeleaf and Lombok; the source is kept as [09_hkboard_springboot](Back_end/web_edu_project/09_hkboard_springboot/) with the DB password replaced by `YOUR_DB_PASSWORD`. Also added four web concept cards, concept-book chapter 38 (part 7, Spring Boot), journey step 26 and six exam questions. Running a copy with an in-memory H2 database both from the build folder and as a jar showed that the view names written with a leading `/` (insert form, detail, update form) return 500 only from the jar, and that multi-delete also accepts GET. Nothing was run against the real MariaDB or in the class IDE.

**2026-10-06 update:** Added day 43 — a login-check `HandlerInterceptor` for the 08 answer board (its registration is still commented out in class code) and the first JUnit 5 + spring-test classes (DAO, Service, and a MockMvc controller test) — plus [coding-test round 22](Back_end/coding-tests/2026-10-06/) (2 PASS, 2 FAIL), concept-book chapter 37, journey step 25 and six exam questions. Running the 18 class tests unchanged: 16 are still empty "Not yet implemented" stubs and 2 need the real database; enabling the interceptor sends every page except the list back to `index.jsp` because there is no login feature yet. Nothing was executed against Tomcat and the real database.

**2026-10-02 update:** Added days 41–42 — the 08 answer board now has page-number navigation (a `Paging` utility with Bootstrap pagination) and replies (shift `step`, then insert under the parent), the reply is wrapped in `@Transactional`, and DAO calls are logged through Spring AOP. The reply SQL was run from the mapper file in SQLite to check ordering, and the transaction setup was reproduced by starting the project's own Spring configuration with a fake connection: commit on success, rollback on failure, and no transaction at all when the servlet context scans every package. [Coding-test round 21](Back_end/coding-tests/2026-10-02/) (2 PASS, 2 FAIL) was added as well. Nothing was executed against Tomcat and the real database.

**2026-09-30 update:** Added days 39–40 — the new [08 answer-board project](Back_end/web_edu_project/08_answerboard_springMVC/) (refer/step/depth threading, paged list query, view-count redirect, soft delete, shared header/footer) — and [coding-test round 20](Back_end/coding-tests/2026-09-30/). The project's `log4j.xml` is not read: the POM brings Logback, which looks for `logback.xml` and falls back to its default console/DEBUG setup; this was reproduced with the same libraries. CRUD requests were not executed against Tomcat and the database.

**2026-09-28 update:** Added [day 38 notes](Back_end/index.html#class-day38) — the 07 board now maps insert, detail, update and multi-delete requests to controller methods — and [coding-test round 19](Back_end/coding-tests/2026-09-28/) (3 PASS, 1 FAIL with no submitted code). The class source for `home.do` fails on this machine because the build does not use `-parameters`, so Spring 6.1 cannot resolve an unannotated `String` parameter name; this was reproduced by calling Spring's resolver directly. CRUD requests were not executed against Tomcat and the database in this update.

**2026-09-23 update:** Added [day 37 Spring MVC/MyBatis notes](Back_end/index.html#class-day37), the current 06/07 class sources, and [coding-test round 18](Back_end/coding-tests/2026-09-23/). The original results remain two Java FAILs and two SQL PASSes. Missing Java submissions are explicitly marked; local checks cover the supplied solutions, not a regrading of those submissions. Database credentials and build artifacts are excluded.

🇰🇷 [한국어](README.md) · 🇬🇧 English

This repository keeps both the original practice code from a job academy course and review notes reorganized for rapid study. Since 2026-08, the frontend and backend tracks have been separated; each track contains source exercises, a dashboard, and its own guide.

👉 **[Go to the study dashboard](https://moriochoradio.github.io/web-study-notes/)**

## Scope and Current Review

As of the QA pass on 2026-10-02, the frontend curriculum is reflected in both the exercise source and the study dashboard. Backend materials continue to accumulate by class date as the course progresses.

| Track | Covered material | Status |
| --- | --- | --- |
| Frontend | HTML 7 · CSS 12 · JavaScript 18 (through AJAX) · React/Next.js 14 units · StockDash graduation project | ✅ Complete |
| Backend | Daily class notes through day 50 · Java concept cards · SQL 46 · web 88 (JDBC/JSP → Spring MVC → Spring Boot → REST API + React) · 12 practice problems · 77 coding-test notes · 231 exam-prep questions | 🔄 In progress (started 2026-08-03) |
| AI Agent | "AI Agent Hands-on Intro, Part 1" — days 1–4 of 10 (Python basics, pandas, NumPy, plotting): 15 concept cards · 22 lab cards · 30 quiz questions · class notebooks | 🔄 In progress (started 2026-10-19) |
| Repository hygiene | Rules exclude dependencies, Next.js build caches, environment files, and IDE files | ✅ Reviewed |

> **Study-note principle:** Every learning card follows “one-line summary → in plain words → concept → annotated code → key takeaways.” Runnable source remains in its lesson folder, while the dashboard is for quickly reviewing concepts and code flow.

## Review and Verification

The dashboard supports search, collapsing/expanding cards, dark mode, five-minute flashcards, progress tracking, and a wrong-answer notebook to reduce the time needed to find a topic again. After each class, the original exercise and its review card are checked to ensure they point to the same lesson.

| Target | Verification | Location |
| --- | --- | --- |
| Java exercises | Compile and run with `javac` | `Back_end/` code and backend dashboard |
| React and Next.js exercises | After installing dependencies, run `npm run lint`, `npm run build`, and verify locally | `Front_end/4.react/lessons/` |
| Static dashboards | Check links, search, theme behavior, and mobile layout | Root and track-level `index.html` files |
| Internal links and assets | Run `python3 scripts/check_internal_links.py` to validate local paths | `scripts/check_internal_links.py` |
| Frontend inventory | Run `python3 scripts/verify_frontend_inventory.py` to compare card, header, and statistic counts | `scripts/verify_frontend_inventory.py` |
| Backend inventory | Run `python3 scripts/verify_backend_inventory.py` to compare class, concept, assignment, journey, and statistic counts | `scripts/verify_backend_inventory.py` |
| Automated verification | Automatically validate links and inventory when HTML, documentation, or checker files change | `.github/workflows/verify-study-notes.yml` |
| Version control | Commit source and documentation only; exclude generated and secret files | `.gitignore`, `Front_end/.gitignore` |

## Internal Link Check

The repository includes a dependency-free checker for **repository-local paths** referenced by actual HTML `a`, `link`, `script`, `img`, and similar elements. Run the command below after adding a new practice file or dashboard link to catch local links or assets that could become 404s on GitHub Pages before committing. External URLs are intentionally outside this check because their availability depends on the network.

```bash
python3 scripts/check_internal_links.py
```

After adding a frontend lesson card, also run the command below. It compares the **dashboard card count**, header summary, and statistic card for HTML, CSS, JavaScript, and React/Next.js. The React graduation project is checked separately from the 14 lessons.

```bash
python3 scripts/verify_frontend_inventory.py
```

After adding a backend class day, Java concept card, practice assignment, or learning-journey step, run the command below. It checks that each section's item count matches its dashboard statistic card.

```bash
python3 scripts/verify_backend_inventory.py
```

## Automated Verification

Manual checks remain available, and the same checks now run automatically for `main` pushes and Pull Requests that include HTML, Markdown, checker scripts, or the workflow itself. The automated verification is **read-only**: it does not write repository files, alter deployment settings, or modify issues and Pull Requests. It only validates links and dashboard inventory. It can also be started manually from the repository Actions page when needed.

## Folder Structure

```text
.
├── index.html    # Study-track hub; legacy hash links remain compatible with Front_end/
├── .nojekyll     # Serves static files on GitHub Pages without Jekyll processing
├── .github/workflows/verify-study-notes.yml  # Read-only automated verification
├── Front_end/    # Frontend track (HTML · CSS · JS · React/Next.js)
│   ├── index.html        # Frontend study dashboard
│   ├── 1.html/ 2-css/ 3.javascript/ 4.react/   # Original practice code
│   └── slides/           # Lecture materials (PPT)
├── AI_Agent/     # AI Agent track (Python → Pandas → FastAPI → LangChain → RAG → Agent)
│   ├── index.html        # AI Agent study notes (concepts · labs · quiz)
│   ├── img/              # Charts re-rendered from the notebooks
│   └── python_agent/     # Class notebooks (.ipynb) and exercises
└── Back_end/     # Backend (Java) track
    ├── index.html            # Java backend study-note dashboard
    ├── java_edu_project/     # Java class exercises organized by date
    ├── sql_edu_project/      # SQL class scripts
    ├── web_edu_project/      # Web class projects 01–12 (JSP → Spring Boot → REST API + React)
    ├── coding-tests/         # Coding-test notes by round (with local verification)
    └── *.pptx / *.pdf        # Course materials and assignments
```

## Workflow for a New Lesson

First add the original practice code and minimal run instructions to the appropriate track. Then add a review card and a source link to the dashboard, and update its statistics, learning journey, and review/exam scope together. Finally, verify the lesson runtime and static-page behavior, run `check_internal_links.py` and the relevant inventory checker (`verify_frontend_inventory.py` or `verify_backend_inventory.py`), then commit with a message that clearly explains the change.

For track-specific details, see [`Front_end/README.md`](Front_end/README.md) and [`Back_end/README.md`](Back_end/README.md).
