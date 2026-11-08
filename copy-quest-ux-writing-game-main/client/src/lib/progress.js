// Best result per level (one screen), kept in this browser only.
const KEY = 'copy-quest:levels';
const ORDER = ['F', 'D', 'C', 'B', 'A', 'S'];

export function loadProgress() {
  try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; }
}

export const screenKey = (levelId, screenIdx) => `${levelId}-${screenIdx + 1}`;

export function recordResult(key, grade, total, stars) {
  const all = loadProgress();
  const prev = all[key];
  if (!prev || ORDER.indexOf(grade) > ORDER.indexOf(prev.grade) || total > prev.total) {
    all[key] = { grade, total, stars };
    try { localStorage.setItem(KEY, JSON.stringify(all)); } catch { /* storage unavailable */ }
  }
  return all;
}

// Stars earned across a company's screens (best run per screen).
export function companyStars(progress, levelId, screens = 3) {
  let stars = 0;
  let cleared = 0;
  for (let i = 0; i < screens; i++) {
    const p = progress[screenKey(levelId, i)];
    if (p) { cleared++; stars += p.stars || 0; }
  }
  return { stars, cleared };
}

// Player XP, kept in this browser until the API gets a database.
const PLAYER_KEY = 'copy-quest:player';

export function loadPlayer() {
  try { return { xp: 0, runs: 0, ...JSON.parse(localStorage.getItem(PLAYER_KEY)) }; } catch { return { xp: 0, runs: 0 }; }
}

export function addXp(amount) {
  const p = loadPlayer();
  const next = { ...p, xp: p.xp + amount, runs: p.runs + 1 };
  try { localStorage.setItem(PLAYER_KEY, JSON.stringify(next)); } catch { /* storage unavailable */ }
  return next;
}

// Worlds unlock in order: World A is always open, and each later world opens
// once every level of the world before it has been cleared.
export function worldUnlocked(levels, progress, index) {
  if (index <= 0) return true;
  const prev = levels[index - 1];
  if (!prev?.playable) return false;
  return companyStars(progress, prev.id).cleared >= 3;
}

// Worlds whose briefing cutscene has played. Later visits go straight to the level map.
const BRIEFED_KEY = 'copy-quest:briefed';
export function hasBriefed(levelId) {
  try { return Boolean(JSON.parse(localStorage.getItem(BRIEFED_KEY))?.[levelId]); } catch { return false; }
}
export function markBriefed(levelId) {
  try {
    const all = JSON.parse(localStorage.getItem(BRIEFED_KEY)) || {};
    all[levelId] = true;
    localStorage.setItem(BRIEFED_KEY, JSON.stringify(all));
  } catch { /* storage unavailable */ }
}

const VIEW_KEY = 'copy-quest:select-view';
export function loadSelectView() {
  try { return localStorage.getItem(VIEW_KEY) || 'world'; } catch { return 'world'; }
}
export function saveSelectView(v) {
  try { localStorage.setItem(VIEW_KEY, v); } catch { /* storage unavailable */ }
}
