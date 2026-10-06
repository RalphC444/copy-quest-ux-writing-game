// Local server: the API, plus the built client when client/dist exists (npm start).
import express from 'express';
import path from 'node:path';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import app from './app.js';
import { aiEnabled } from './grading/ai.js';

const dist = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../client/dist');
if (existsSync(dist)) {
  app.use(express.static(dist));
  app.get(/^\/(?!api).*/, (_req, res) => res.sendFile(path.join(dist, 'index.html')));
}

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`Copy Quest API on http://localhost:${PORT} (AI notes ${aiEnabled ? 'on' : 'off'})`));
