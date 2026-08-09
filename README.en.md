# Web Development Study Log (Job Academy)

🇰🇷 [한국어](README.md) · 🇬🇧 English

A repository organizing the practice code and study notes from a job academy course.
Since 2026-08, the frontend and backend tracks are managed in separate folders.

👉 **[Go to the study dashboard](https://moriochoradio.github.io/web-study-notes/)**

## Scope

| Track | Contents | Status |
| --- | --- | --- |
| Frontend | HTML 7 · CSS 12 · JavaScript 18 (through AJAX) · React/Next.js 14 units + graduation project StockDash | ✅ Complete |
| Backend | Java — daily class exercises + prep/review notes (concept cards, 12 practice problems, 102 exam-prep questions) | 🔄 In progress (started 2026-08-03) |

## Why Organize It This Way — Q&A

**Q. Why build a dashboard instead of just piling up code?**
Because the goal is review. Every note follows the format "one-line summary → in plain words → concept → annotated code → key takeaways",
and search, flashcards, progress tracking, and a wrong-answer notebook make things easy to look up again later.

**Q. Why split the folders into Front_end / Back_end?**
Because there are two tracks. Each folder has its own dashboard (`index.html`) and README,
and the root `index.html` only handles a redirect for backward-compatible links.

**Q. Is the code in the notes verified?**
Yes. All the Java code was compiled and run with `javac` to confirm the results (actual console output is attached in the dashboard),
and the frontend notes are also verified by rendering on a local server before pushing.

## Folder Structure

```
.
├── index.html    # Redirects to the Front_end/ dashboard (backward-compatible links)
├── Front_end/    # Frontend track (HTML · CSS · JS · React/Next.js — complete)
│   ├── index.html        # The study dashboard itself
│   ├── 1.html/ 2-css/ 3.javascript/ 4.react/   # Practice code
│   └── slides/           # Lecture materials (PPT)
└── Back_end/     # Backend (Java) track (in progress — started 2026-08-03)
    ├── index.html            # Java backend study note dashboard
    ├── java_edu_project/     # Class practice code (packages by date)
    └── *.pptx / *.pdf        # Course materials, assignments
```

For details on each track, see [`Front_end/README.md`](Front_end/README.md) ·
[`Back_end/README.md`](Back_end/README.md).
