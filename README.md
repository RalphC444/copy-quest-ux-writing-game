# Copy Quest

A UX copywriting game. Pick a client (levels A–H), read the briefing, choose a difficulty, then write the copy for three real product screens against the clock. After round 3, the stakeholders grade you.

## Run it

```bash
npm run install:all   # first time only
npm run dev           # API on :5050, game on http://localhost:5180
```

Production-style: `npm run build && npm start`. The server then serves the built client on http://localhost:5050.

### Optional: Creative Director notes from Claude

Copy `server/.env.example` to `server/.env` and set `ANTHROPIC_API_KEY`. The results screen then shows an **Ask for notes** button that returns a written critique and rewrites of your three weakest lines. Scoring never depends on it.

## How it plays

1. **World select:** big letters A–H, one per company. Hover a letter to preview the client. A–D are playable and E–H are locked teasers.
2. **Briefing wizard:** the business, the project, and the three judges (the stakeholders). Each judge scores one skill.
3. **Level map:** each screen is a level (A-1, A-2, A-3). Levels unlock in order. Pick a difficulty: Easy 4:00, Normal 2:30 or Hard 1:15. Harder means a stricter grader and more XP.
4. **Play:** a 3-2-1 countdown, then the music starts and the timer runs. Copy appears live in the screen mockup as you type. Context about the company stays on screen, and the judges watch from their desk.
5. **Judging** (after every level): after a drumroll, each judge raises a cardboard scorecard from 1 to 10, Dancing with the Stars style. You then get your grade, stars, XP, and a line-by-line breakdown.

### Scoring

Your score is the judges' average rating (0–100) plus a time bonus. Each card is that judge's rating divided by 10, rounded down, so a card of 8 or higher means that judge is delighted and earns you a star. An S needs all three judges delighted, and an A needs two.

### Judges' looks

Each judge is a pixel character. Skin, hair, outfit and glasses are picked from their name, so they always look the same. To set any part on purpose, add `look` to a stakeholder in `server/data/levels.js`, for example `look: { style: 'long', glasses: true }`. Facial hair only appears with `mustache: true`.

### Points and ranks

Every judged level (screen) earns XP: grade points (S 500, A 400, B 300, C 200, D 100, F 0) plus 100 per star, multiplied by difficulty (Easy ×1, Normal ×1.5, Hard ×2). The rules live in `server/grading/points.js`.

XP moves you up a career ladder of 10 ranks, from Intern (0 XP) through Junior Copywriter (500), Copywriter (1,500), UX Writer (3,000) and on up to Word Wizard (30,000). The ladder is in `client/src/lib/ranks.js`. Your rank shows in the top bar, and the results screen shows points earned and any promotion. XP is saved in the browser until MongoDB is added.

### How stakeholders rate a line

Each stakeholder judges one skill: Message, Clarity, Fit, Voice or Action. Their rating of a line is 60% that skill and 40% overall craft. That number is then scaled by how much of the brief the line covered, from 40% if it covered nothing to 100% if it covered everything. Polished copy that says the wrong thing pleases no one.

## Project layout

```
server/
  index.js              Express API: /api/levels, /api/grade, /api/critique, /api/runs
  data/levels.js        All level content: companies, stakeholders, screens, field rules
  grading/heuristic.js  Rule-based grader (deterministic, explains every point)
  grading/ai.js         Optional Claude critique
  store/runs.js         In-memory run history (swap for a Mongoose model later)
client/
  src/App.jsx           Game state machine (title → select → briefing → difficulty → rounds → results)
  src/components/       One component per screen, plus ScreenMockup (the fake product UIs)
  src/audio/chiptune.js Web Audio music and sound effects, no audio files
scripts/dev.mjs         Starts both servers together
```

## Adding or unlocking a level

Edit `server/data/levels.js`. Set `playable: true`, then add `business`, `project`, `tone`, `stakeholders` and three `rounds`. Each round picks a `layout` (`hero`, `card`, `confirm`, `form`, `dialog`, `empty`, `notification`, `summary`), and each field declares:

- `kind`: `headline`, `body`, `cta`, `label` or `title`. This changes how the field is graded.
- `slot`: where the copy appears in the mockup.
- `max`: the character limit.
- `must`: groups of acceptable phrases. Each group counts toward the Message score.
- `avoid`: risky words for this screen.

## Adding MongoDB later

Only `server/store/runs.js` touches storage. Replace `saveRun` and `listRuns` with Mongoose calls and leave the routes as they are. Level content can move to a collection the same way, behind `getLevel`.

## Troubleshooting

If `npm run dev` fails with "Cannot find native binding" or a rollup or esbuild error: a parent folder probably has a `node_modules/.bin/node` (for example, `node` listed as a dependency in `~/package.json`). npm puts that Node ahead of your system Node. `scripts/dev.mjs` works around this, but the clean fix is to remove that `node` dependency.
