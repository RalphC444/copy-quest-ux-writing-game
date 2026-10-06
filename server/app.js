// The Express app with every /api route. index.js runs it locally;
// api/index.js (repo root) serves it as a Vercel function.
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { levels, levelSummary, getLevel } from './data/levels.js';
import { gradeScreen } from './grading/heuristic.js';
import { aiEnabled, critique } from './grading/ai.js';
import { saveRun, listRuns } from './store/runs.js';

const app = express();
app.use(cors());
app.use(express.json({ limit: '200kb' }));

app.get('/api/health', (_req, res) => res.json({ ok: true, ai: aiEnabled }));

app.get('/api/levels', (_req, res) => res.json(levels.map(levelSummary)));

app.get('/api/levels/:id', (req, res) => {
  const level = getLevel(req.params.id);
  if (!level) return res.status(404).json({ error: 'No level with that letter.' });
  if (!level.playable) return res.status(403).json({ error: `Level ${level.id} is locked.` });
  res.json(level);
});

// Validates { levelId, screen } and returns the level, or sends a 400.
function screenFrom(req, res) {
  const level = getLevel(req.body?.levelId);
  const screen = Number(req.body?.screen);
  if (!level?.playable || !Number.isInteger(screen) || !level.rounds[screen]) {
    res.status(400).json({ error: 'Choose a playable level and screen to grade.' });
    return null;
  }
  return { level, screen };
}

app.post('/api/grade', (req, res) => {
  const found = screenFrom(req, res);
  if (!found) return;
  const result = gradeScreen(found.level, found.screen, req.body);
  const run = saveRun({ levelId: `${found.level.id}-${found.screen + 1}`, difficulty: result.difficulty, total: result.total, grade: result.grade });
  res.json({ ...result, runId: run.id });
});

app.post('/api/critique', async (req, res) => {
  const found = screenFrom(req, res);
  if (!found) return;
  if (!aiEnabled) return res.status(503).json({ error: 'AI notes are off. Add ANTHROPIC_API_KEY to server/.env to turn them on.' });
  try {
    const result = gradeScreen(found.level, found.screen, req.body);
    const notes = await critique(found.level, found.screen, result);
    if (!notes) return res.status(502).json({ error: 'The director had no notes this time. Try again.' });
    res.json(notes);
  } catch (err) {
    console.error('critique failed:', err?.status ?? '', err?.message);
    res.status(502).json({ error: 'Could not reach the Creative Director. Check the API key and try again.' });
  }
});

app.get('/api/runs', (req, res) => res.json(listRuns({ levelId: req.query.level })));

export default app;
