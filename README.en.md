# Web Development Study Log (Job Academy)

🇰🇷 [한국어](README.md) · 🇬🇧 English

This repository keeps both the original practice code from a job academy course and review notes reorganized for rapid study. Since 2026-08, the frontend and backend tracks have been separated; each track contains source exercises, a dashboard, and its own guide.

👉 **[Go to the study dashboard](https://moriochoradio.github.io/web-study-notes/)**

## Scope and Current Review

As of the repository review on 2026-08-13, the frontend curriculum is reflected in both the exercise source and the study dashboard. Backend materials continue to accumulate by class date as the course progresses.

| Track | Covered material | Status |
| --- | --- | --- |
| Frontend | HTML 7 · CSS 12 · JavaScript 18 (through AJAX) · React/Next.js 14 units · StockDash graduation project | ✅ Complete |
| Backend | Java daily exercises · concept cards · 12 practice problems · 102 exam-prep questions | 🔄 In progress (started 2026-08-03) |
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
| Version control | Commit source and documentation only; exclude generated and secret files | `.gitignore`, `Front_end/.gitignore` |

## Internal Link Check

The repository includes a dependency-free checker for **repository-local paths** referenced by actual HTML `a`, `link`, `script`, `img`, and similar elements. Run the command below after adding a new practice file or dashboard link to catch local links or assets that could become 404s on GitHub Pages before committing. External URLs are intentionally outside this check because their availability depends on the network.

```bash
python3 scripts/check_internal_links.py
```

## Folder Structure

```text
.
├── index.html    # Study-track hub; legacy hash links remain compatible with Front_end/
├── .nojekyll     # Serves static files on GitHub Pages without Jekyll processing
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

First add the original practice code and minimal run instructions to the appropriate track. Then add a review card and a source link to the dashboard, and update its statistics, learning journey, and review/exam scope together. Finally, verify the lesson runtime and static-page behavior, then commit with a message that clearly explains the change.

For track-specific details, see [`Front_end/README.md`](Front_end/README.md) and [`Back_end/README.md`](Back_end/README.md).
