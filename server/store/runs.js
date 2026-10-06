// In-memory run history. Swap this module for a Mongoose model when MongoDB is added;
// the route handlers only call saveRun() and listRuns().
const runs = [];

export function saveRun(run) {
  const saved = { id: String(runs.length + 1), createdAt: new Date().toISOString(), ...run };
  runs.unshift(saved);
  if (runs.length > 200) runs.pop();
  return saved;
}

export function listRuns({ levelId, limit = 20 } = {}) {
  return runs.filter((r) => !levelId || r.levelId === levelId).slice(0, limit);
}
