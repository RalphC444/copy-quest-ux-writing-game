// Rule-based hierarchy grading. Five skills, 20 points each.
import { TONES } from './levels.js';

export const weightOf = (s) => s.size * Math.pow(s.weight / 400, 0.7) * TONES[s.tone] * (s.tone === 'accent' ? 1.15 : 1) * (s.upper ? 0.95 : 1);
const key = (s) => `${s.size}|${s.weight}|${s.tone}|${s.upper}`;

export function gradeType(level, styles) {
  const els = level.elements.map((e) => ({ ...e, s: styles[e.id] }));
  const by = Object.fromEntries(els.map((e) => [e.id, e]));
  const ranked = [...els].sort((a, b) => weightOf(b.s) - weightOf(a.s));
  const notes = [];
  const skills = [];

  // 1. Focus: task target must be the clear winner.
  let focus = 0;
  const t = weightOf(by[level.target].s), top2 = ranked[1] === by[level.target] ? weightOf(ranked[0].s) : weightOf(ranked[1].s);
  if (ranked[0].id === level.target) {
    const ratio = t / top2;
    focus = ratio >= 1.4 ? 20 : ratio >= 1.15 ? 15 : 10;
    if (ratio < 1.4) notes.push({ skill: 'Focus', bad: true, text: `${by[level.target].text} wins, but only just. Push the gap to at least 1.4× the next element.` });
    else notes.push({ skill: 'Focus', text: 'The P&L is the first thing the eye lands on. Nailed the task.' });
  } else {
    focus = ranked.slice(0, 3).some((e) => e.id === level.target) ? 6 : 0;
    notes.push({ skill: 'Focus', bad: true, text: `“${ranked[0].text}” is louder than the thing users came for. Turn it down or turn the target up.` });
  }
  if (ranked[1]?.id !== level.secondary && ranked[0].id !== level.secondary) {
    focus = Math.max(0, focus - 4);
    notes.push({ skill: 'Focus', bad: true, text: 'Total value should be the clear second read. Something else is competing for it.' });
  }
  skills.push({ name: 'Focus', score: focus });

  // 2. Scale: few sizes, meaningful steps.
  const sizes = [...new Set(els.map((e) => e.s.size))].sort((a, b) => a - b);
  let scale = 20;
  if (sizes.length > 5) { scale -= (sizes.length - 5) * 5; notes.push({ skill: 'Scale', bad: true, text: `${sizes.length} different sizes. Dense screens read calmer with 4 or 5.` }); }
  const tight = sizes.slice(1).filter((v, i) => v / sizes[i] < 1.15).length;
  if (tight) { scale -= tight * 4; notes.push({ skill: 'Scale', bad: true, text: 'Some sizes are too close to tell apart. If it isn’t clearly different, make it the same.' }); }
  if (scale === 20) notes.push({ skill: 'Scale', text: `A tight scale: ${sizes.join(', ')}px.` });
  skills.push({ name: 'Scale', score: Math.max(0, scale) });

  // 3. Grouping: same role, same style (Gestalt similarity); labels quieter than values.
  const roles = [...new Set(els.map((e) => e.role))];
  let broken = roles.filter((r) => new Set(els.filter((e) => e.role === r).map((e) => key(e.s))).size > 1);
  let group = 20 - broken.length * 5;
  if (broken.length) notes.push({ skill: 'Grouping', bad: true, text: `Matching items are styled differently (${broken.join(', ')}). Similar things should look similar.` });
  [['pnlLabel', 'pnl'], ['totalLabel', 'total']].forEach(([l, v]) => {
    if (weightOf(by[l].s) >= weightOf(by[v].s)) { group -= 5; notes.push({ skill: 'Grouping', bad: true, text: `The label “${by[l].text}” is as loud as its number. Labels should whisper.` }); }
  });
  if (group === 20) notes.push({ skill: 'Grouping', text: 'Clean groups: rows, headers and labels each have one consistent style.' });
  skills.push({ name: 'Grouping', score: Math.max(0, group) });

  // 4. Data: tabular numbers, quiet meta and headers.
  const nums = els.filter((e) => e.numeric), off = nums.filter((e) => !e.s.tabular);
  let data = 20 - Math.min(12, off.length * 2);
  if (off.length) notes.push({ skill: 'Data', bad: true, text: `${off.length} numbers aren’t tabular, so digits won’t line up in columns. Fintech readers scan by column.` });
  const loudMeta = els.filter((e) => (e.role === 'meta' || e.role === 'th') && weightOf(e.s) > weightOf(by.s0.s));
  if (loudMeta.length) { data -= 6; notes.push({ skill: 'Data', bad: true, text: 'Headers or timestamps are louder than the data itself. Chrome should step back.' }); }
  if (data === 20) notes.push({ skill: 'Data', text: 'Numbers align and the chrome steps back.' });
  skills.push({ name: 'Data', score: Math.max(0, data) });

  // 5. Action: button findable but not stealing the show; accent used sparingly.
  const tr = by.trade.s;
  let action = 20;
  if (tr.weight < 500 && tr.tone !== 'accent') { action -= 8; notes.push({ skill: 'Action', bad: true, text: 'Trade looks like plain text. Give it weight or the accent so it reads as clickable.' }); }
  if (weightOf(tr) > t) { action -= 8; notes.push({ skill: 'Action', bad: true, text: 'Trade is louder than the P&L. Actions should be findable, not shouting.' }); }
  const accents = new Set(els.filter((e) => e.s.tone === 'accent').map((e) => e.role)).size;
  if (accents > 2) { action -= 6; notes.push({ skill: 'Action', bad: true, text: 'Accent colour is everywhere, so it means nothing. Save it for one or two things.' }); }
  if (action === 20) notes.push({ skill: 'Action', text: 'Trade is easy to find without fighting the data.' });
  skills.push({ name: 'Action', score: Math.max(0, action) });

  const total = skills.reduce((a, s) => a + s.score, 0);
  const grade = total >= 90 ? 'S' : total >= 80 ? 'A' : total >= 65 ? 'B' : total >= 50 ? 'C' : 'D';
  return { total, grade, skills, notes, ranking: ranked.slice(0, 3).map((e) => e.text) };
}
