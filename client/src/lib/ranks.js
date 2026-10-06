// Career ladder. XP needed to reach each rank.
export const RANKS = [
  { level: 1, title: 'Intern', xp: 0 },
  { level: 2, title: 'Junior Copywriter', xp: 500 },
  { level: 3, title: 'Copywriter', xp: 1500 },
  { level: 4, title: 'UX Writer', xp: 3000 },
  { level: 5, title: 'Senior UX Writer', xp: 5000 },
  { level: 6, title: 'Content Designer', xp: 8000 },
  { level: 7, title: 'Lead Content Designer', xp: 12000 },
  { level: 8, title: 'Content Director', xp: 17000 },
  { level: 9, title: 'Creative Director', xp: 23000 },
  { level: 10, title: 'Word Wizard', xp: 30000 },
];

export function rankFor(xp) {
  let i = 0;
  while (i < RANKS.length - 1 && xp >= RANKS[i + 1].xp) i++;
  const rank = RANKS[i];
  const next = RANKS[i + 1] || null;
  const into = xp - rank.xp;
  const span = next ? next.xp - rank.xp : 1;
  return { ...rank, next, into, span, pct: next ? Math.min(100, (into / span) * 100) : 100, toNext: next ? next.xp - xp : 0 };
}
