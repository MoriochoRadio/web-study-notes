# Web Development Study Log (Job Academy)

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
| Backend | Java daily exercises · concept cards · 12 practice problems · 199 exam-prep questions | 🔄 In progress (started 2026-08-03) |
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
└── Back_end/     # Backend (Java) track
    ├── index.html            # Java backend study-note dashboard
    ├── java_edu_project/     # Class exercises organized by date
    └── *.pptx / *.pdf        # Course materials and assignments
```

## Workflow for a New Lesson

First add the original practice code and minimal run instructions to the appropriate track. Then add a review card and a source link to the dashboard, and update its statistics, learning journey, and review/exam scope together. Finally, verify the lesson runtime and static-page behavior, run `check_internal_links.py` and the relevant inventory checker (`verify_frontend_inventory.py` or `verify_backend_inventory.py`), then commit with a message that clearly explains the change.

For track-specific details, see [`Front_end/README.md`](Front_end/README.md) and [`Back_end/README.md`](Back_end/README.md).
