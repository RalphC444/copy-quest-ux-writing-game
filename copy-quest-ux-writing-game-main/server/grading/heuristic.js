import { pointsFor } from './points.js';

// Rule-based copy grader. Deterministic, fast, and explains every point it takes.

const DIFFICULTY = {
  easy: { strictness: 0.75, timeBonus: 3 },
  normal: { strictness: 1, timeBonus: 5 },
  hard: { strictness: 1.25, timeBonus: 8 },
};

const GLOBAL_JARGON = [
  'utilize', 'leverage', 'synergy', 'facilitate', 'commence', 'robust', 'world-class',
  'best-in-class', 'cutting-edge', 'revolutionary', 'seamless', 'empower', 'solution',
];

const VAGUE_CTAS = ['click here', 'submit', 'ok', 'okay', 'learn more', 'yes', 'no', 'continue', 'go', 'next', 'here'];

const ACTION_VERBS = [
  'add', 'book', 'browse', 'call', 'change', 'charge', 'chat', 'check', 'choose', 'claim',
  'confirm', 'connect', 'contact', 'continue', 'create', 'drive', 'email', 'explore', 'find',
  'get', 'go', 'grab', 'hold', 'import', 'join', 'keep', 'let', 'link', 'move', 'navigate',
  'notify', 'open', 'order', 'pay', 'pick', 'plan', 'preorder', 'remind', 'reschedule', 'reserve',
  'retry', 'save', 'schedule', 'see', 'select', 'send', 'set', 'show', 'sign', 'skip', 'start',
  'stay', 'tell', 'text', 'track', 'try', 'update', 'upload', 'use', 'view', 'cancel', 'back',
  'never', 'route', 'directions', 'help', "i'll", 'yes,', 'reserve',
];

const clamp = (n, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, n));
const words = (s) => (s.toLowerCase().match(/[a-z0-9$.'’:-]+/g) || []).filter((w) => /[a-z0-9]/.test(w));

function syllables(word) {
  const w = word.toLowerCase().replace(/[^a-z]/g, '');
  if (!w) return 0;
  if (w.length <= 3) return 1;
  const trimmed = w.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '').replace(/^y/, '');
  const m = trimmed.match(/[aeiouy]{1,2}/g);
  return Math.max(1, m ? m.length : 1);
}

function readingEase(text) {
  const ws = words(text);
  if (!ws.length) return 100;
  const sentences = Math.max(1, (text.match(/[.!?]+(\s|$)/g) || []).length);
  const syl = ws.reduce((a, w) => a + syllables(w), 0);
  return 206.835 - 1.015 * (ws.length / sentences) - 84.6 * (syl / ws.length);
}

const esc = (x) => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
// Multi-word phrases match with up to two words in between ("pick it up" counts as "pick up").
const has = (text, phrase) => {
  const p = phrase.toLowerCase();
  if (text.includes(p)) return true;
  const parts = p.split(/\s+/);
  if (parts.length < 2) return false;
  return new RegExp(`\\b${parts.map(esc).join('(?:\\s+\\S+){0,2}\\s+')}`).test(text);
};

function gradeField(field, raw, level, diff) {
  const text = (raw || '').trim();
  const lower = text.toLowerCase();
  const notes = [];
  const good = (t) => notes.push({ type: 'good', text: t });
  // metric: which skill the problem belongs to, so the judge who cares about it can call it out
  const fix = (t, metric) => notes.push({ type: 'fix', text: t, metric });
  const s = diff.strictness;
  const penalize = (base, amount) => base - amount * s;

  // MESSAGE: a checklist of what the brief asked this line to say
  const brief = (field.must || []).map((req) => ({
    need: req.need,
    met: Boolean(text) && req.any.some((alt) => has(lower, alt)),
    examples: req.any.slice(0, 3),
  }));

  if (!text) {
    fix('Left blank. An empty slot ships as broken UI.', 'blank');
    return {
      id: field.id, label: field.label, hint: field.hint, text, brief, notes,
      metrics: { message: 0, clarity: 0, fit: 0, voice: 0, action: field.kind === 'cta' ? 0 : null },
    };
  }

  const ws = words(text);
  const met = brief.filter((b) => b.met).length;
  let message = brief.length ? (met / brief.length) * 100 : 100;

  // FIT: length discipline
  let fit = 100;
  if (text.length > field.max) {
    const over = text.length - field.max;
    fit = penalize(100, (over / field.max) * 220 + 10);
    fix(`${over} characters over the ${field.max}-character limit. It will truncate or wrap badly.`, 'fit');
  } else if (field.kind === 'cta' && ws.length > 4) {
    fit = penalize(100, 20);
    fix('Buttons read best at 1–4 words.', 'fit');
  } else if (field.kind === 'headline' && ws.length > 9) {
    fit = penalize(100, 15);
    fix('Headline runs long. Aim for 9 words or fewer.', 'fit');
  } else if (field.kind === 'body' && ws.length < 4) {
    fit = penalize(100, 25);
    fix('Too thin. Body copy needs enough detail to help.', 'fit');
  } else if (text.length <= field.max * 0.85) {
    good('Comfortably inside the space.');
  }

  // CLARITY: readability, passive voice, jargon
  const ease = readingEase(text);
  const scored = field.kind !== 'cta' && field.kind !== 'label' && ws.length >= 6;
  let clarity = scored ? clamp(40 + (ease - 30) * 1.5) : 100;
  if (scored) {
    if (ease >= 70) good('Easy to read at a glance.');
    else if (ease < 50) fix('Dense. Use shorter words and shorter sentences.', 'clarity');
  }
  const sentences = text.split(/[.!?]+/).map((x) => x.trim()).filter(Boolean);
  const longSentence = sentences.find((x) => words(x).length > 20);
  if (longSentence) { clarity = penalize(clarity, 12); fix('One sentence runs past 20 words. Split it.', 'clarity'); }
  // Past-tense passives hide who acted ("was declined"). Present-tense states like
  // "is reserved" are fine on confirmations, so they aren't flagged.
  if (/\b(was|were|been|being)\s+\w+ed\b/i.test(text)) {
    clarity = penalize(clarity, 10);
    fix('Passive voice spotted. Say who does what.', 'clarity');
  }
  const hits = (list) => list.filter((j) => new RegExp(`\\b${j.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'i').test(text));
  const jargonHits = hits(GLOBAL_JARGON);
  if (jargonHits.length) {
    clarity = penalize(clarity, 12 * jargonHits.length);
    fix(`Jargon: ${jargonHits.map((j) => `"${j}"`).join(', ')}. Say it plainly.`, 'clarity');
  }

  // VOICE: tone rules for this brand
  let voice = 100;
  const bangs = (text.match(/!/g) || []).length;
  if (bangs > level.tone.exclamations) {
    voice = penalize(voice, 15 * (bangs - level.tone.exclamations));
    fix(level.tone.exclamations === 0 ? 'This brand does not use exclamation points.' : 'Too many exclamation points.', 'voice');
  }
  if (/\b[A-Z]{4,}\b/.test(text)) { voice = penalize(voice, 15); fix('All-caps reads as shouting.', 'voice'); }
  const brandHits = hits(level.avoid || []).filter((j) => !jargonHits.includes(j));
  if (brandHits.length) {
    voice = penalize(voice, 15 * brandHits.length);
    fix(`Off-brand for ${level.company}: ${brandHits.map((j) => `"${j}"`).join(', ')}.`, 'voice');
  }
  const fieldAvoid = (field.avoid || []).filter((a) => has(lower, a));
  if (fieldAvoid.length) {
    voice = penalize(voice, 20 * fieldAvoid.length);
    fix(`Risky wording for this screen: ${fieldAvoid.map((a) => `"${a}"`).join(', ')}.`, 'voice');
  }
  if (/[\u{1F300}-\u{1FAFF}]/u.test(text) && level.tone.serious) {
    voice = penalize(voice, 20);
    fix('Emoji undercut a serious moment.', 'voice');
  }
  if (/\b(we|us)\b/i.test(text) && !/\b(you|your)\b/i.test(text) && field.kind === 'body') {
    voice = penalize(voice, 10);
    fix('Talks about the company, not the reader. Use "you".', 'voice');
  } else if (/\b(you|your)\b/i.test(text) && field.kind !== 'cta') {
    good('Speaks directly to the reader.');
  }
  if (/\b(please note|kindly|we regret|be advised)\b/i.test(text)) {
    voice = penalize(voice, 15);
    fix('Stiff phrasing. Talk like a person.', 'voice');
  }

  // ACTION: only for buttons
  let action = null;
  if (field.kind === 'cta') {
    action = 100;
    const first = ws[0] || '';
    if (VAGUE_CTAS.includes(lower.replace(/[.!]/g, ''))) {
      action = penalize(action, 50);
      fix(`"${text}" is generic. Name what happens when they tap.`, 'action');
    } else if (!ACTION_VERBS.includes(first)) {
      action = penalize(action, 25);
      fix('Start the button with a verb.', 'action');
    } else if (ws.length === 1) {
      action = penalize(action, 15);
      fix('A one-word button doesn’t say what they get. Name the thing too.', 'action');
    } else {
      good('Starts with a clear verb.');
    }
    if (/[.]$/.test(text)) { action = penalize(action, 10); fix('Buttons do not need a period.', 'action'); }
  }
  if ((field.kind === 'headline' || field.kind === 'title') && /\.$/.test(text) && !/\.\.\.$/.test(text)) {
    voice = penalize(voice, 5);
    fix('Drop the period on headlines.', 'voice');
  }

  const m = {
    message: clamp(Math.round(message)),
    clarity: clamp(Math.round(clarity)),
    fit: clamp(Math.round(fit)),
    voice: clamp(Math.round(voice)),
    action: action === null ? null : clamp(Math.round(action)),
  };

  return { id: field.id, label: field.label, hint: field.hint, text, brief, metrics: m, notes };
}

// How one stakeholder rates one line (0-100).
// 60% the skill they care about, 40% overall craft, then scaled by how much of
// the brief the line covered: polished copy that says the wrong thing pleases no one.
export function rateLine(metrics, cares) {
  const craftKeys = ['clarity', 'fit', 'voice', 'action'].filter((k) => metrics[k] !== null);
  const craft = craftKeys.reduce((a, k) => a + metrics[k], 0) / craftKeys.length;
  const spec = metrics[cares];
  const base = spec === null || spec === undefined ? craft : 0.6 * spec + 0.4 * craft;
  const briefGate = 0.4 + 0.6 * (metrics.message / 100);
  return clamp(Math.round(base * briefGate));
}

export function letterFor(score) {
  if (score >= 93) return 'S';
  if (score >= 85) return 'A';
  if (score >= 75) return 'B';
  if (score >= 65) return 'C';
  if (score >= 50) return 'D';
  return 'F';
}

export const HAPPY_AT = 80;
export const MEH_AT = 60;

// ---------- judge comments ----------
// Each judge comments on what actually happened on this screen, in their own area.
const snip = (t, n = 44) => (t.length > n ? `${t.slice(0, n - 1).trimEnd()}…` : t);
const lowerFirst = (t) => t.charAt(0).toLowerCase() + t.slice(1);
const OPENER = {
  happy: ['Love it.', 'Yes.', 'Ship it.'],
  meh: ['Close.', 'Almost.', 'Not quite.'],
  mad: ['No.', 'Oof.', 'Hard pass.'],
};
const PRAISE = {
  message: (f) => `Your ${f} covers everything I needed.`,
  voice: (f) => `Your ${f} sounds exactly like us.`,
  clarity: (f) => `Your ${f} reads clearly in one pass.`,
  action: (f) => `Your ${f} says exactly what happens next.`,
  fit: (f) => `Your ${f} fits the space with room to spare.`,
};

const sentence = (t) => `${t.replace(/[.!?]+$/, '')}.`;

// Everything a judge could say about the lines on this screen, best candidates first.
//   own:     a problem in the judge's own skill (missed brief points, for the Message judge)
//   general: a blank line, or a missed brief point that drags every judge's score down
// Each candidate has a key, so two judges never raise the same underlying issue.
function candidates(fields, judgeIdx, cares) {
  const ranked = [...fields].sort((a, b) => a.ratings[judgeIdx].score - b.ratings[judgeIdx].score);
  const own = [];
  const general = [];
  for (const f of ranked) {
    const label = f.label.toLowerCase();
    if (!f.text) { general.push({ key: `${f.id}:blank`, text: `You left the ${label} blank.` }); continue; }
    const quoted = `“${snip(f.text)}” on the ${label}`;
    const missed = f.brief.filter((b) => !b.met);
    if (cares === 'message' && missed.length) {
      const more = missed.length > 1 ? ` That’s ${missed.length} brief points missed on one line.` : '';
      own.push({ key: `${f.id}:${missed[0].need}`, text: `${quoted} still needs to ${sentence(lowerFirst(missed[0].need))}${more}` });
    }
    f.notes.filter((n) => n.type === 'fix' && n.metric === cares)
      .forEach((n) => own.push({ key: `${f.id}:${n.text}`, text: `${quoted}. ${sentence(n.text)}` }));
    if (cares !== 'message') {
      missed.forEach((b) => general.push({ key: `${f.id}:${b.need}`, text: `${quoted} skips a brief point: ${sentence(lowerFirst(b.need))}` }));
    }
  }
  return { own, general };
}

const FINE = {
  voice: 'The tone is fine.',
  clarity: 'It reads fine.',
  action: 'The buttons are fine.',
  fit: 'The lengths are fine.',
  message: 'The facts are there.',
};

// used: issue keys other judges already raised, so three judges don't repeat one point.
function judgeComment(fields, judgeIdx, cares, mood, used) {
  const opener = OPENER[mood][judgeIdx % 3];
  const { own, general } = candidates(fields, judgeIdx, cares);
  const fresh = (list) => list.find((c) => !used.has(c.key));

  if (mood === 'happy') {
    // Delighted judges only raise a small point in their own area, if there is one.
    const nit = fresh(own);
    if (nit) return { quote: `${opener} One thing: ${nit.text}`, key: nit.key, kind: 'nit' };
    const pool = cares === 'action' ? fields.filter((f) => f.metrics.action !== null && f.text) : fields.filter((f) => f.text);
    const best = [...(pool.length ? pool : fields)].sort((a, b) => b.ratings[judgeIdx].score - a.ratings[judgeIdx].score)[0];
    return { quote: `${opener} ${PRAISE[cares](`${best.label.toLowerCase()} “${snip(best.text)}”`)}`, key: null, kind: 'praise' };
  }

  const issue = fresh(own) ?? fresh(general);
  if (issue) return { quote: `${opener} ${issue.text}`, key: issue.key, kind: 'issue' };
  // Everything worth saying is already said: be honest about what's costing points.
  return { quote: `${opener} ${FINE[cares]} The missing details are what cost you.`, key: null, kind: 'issue' };
}

// Judges hold up a card from 1 to 10, Dancing with the Stars style.
// Floors, so a card of 8+ always means the judge is delighted (80+) and you earned their star.
export const cardFor = (satisfaction) => Math.max(1, Math.min(10, Math.floor(satisfaction / 10)));

// Grades one screen (one level). Each screen is scored on its own.
export function gradeScreen(level, screenIdx, { difficulty = 'normal', answers = {}, timing = {} }) {
  const diff = DIFFICULTY[difficulty] || DIFFICULTY.normal;
  const screen = level.rounds[screenIdx];
  const people = level.stakeholders;

  const fields = screen.fields.map((f) => {
    const g = gradeField(f, answers[f.id], level, diff);
    const ratings = people.map((p) => ({ name: p.name, cares: p.cares, score: rateLine(g.metrics, p.cares) }));
    const score = Math.round(ratings.reduce((sum, r) => sum + r.score, 0) / ratings.length);
    return { ...g, ratings, score };
  });

  const avgMetric = (k) => {
    const vals = fields.map((f) => f.metrics[k]).filter((v) => v !== null && v !== undefined);
    return vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : null;
  };

  // Each judge's satisfaction = their average rating across the lines on this screen.
  const used = new Set();
  const stakeholders = people.map((sh, i) => {
    const scores = fields.map((f) => f.ratings[i].score);
    const satisfaction = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    const mood = satisfaction >= HAPPY_AT ? 'happy' : satisfaction >= MEH_AT ? 'meh' : 'mad';
    const comment = judgeComment(fields, i, sh.cares, mood, used);
    if (comment.key) used.add(comment.key);
    return {
      name: sh.name, role: sh.role, cares: sh.cares, satisfaction, card: cardFor(satisfaction), mood,
      quote: comment.quote, kind: comment.kind,
    };
  });

  const frac = timing.limit ? clamp((timing.remaining || 0) / timing.limit, 0, 1) : 0;
  const timeBonus = fields.some((f) => f.text) ? Math.round(frac * diff.timeBonus) : 0;

  // Score = average judge satisfaction + time bonus. One star per delighted judge.
  const stakeholderAvg = Math.round(stakeholders.reduce((a, s) => a + s.satisfaction, 0) / stakeholders.length);
  const total = clamp(stakeholderAvg + timeBonus);
  const stars = stakeholders.filter((s) => s.mood === 'happy').length;

  // The letter can't outrun the judges: S needs all three delighted, A needs two.
  const CAP = ['C', 'B', 'A', 'S'];
  const ORDER = ['F', 'D', 'C', 'B', 'A', 'S'];
  const raw = letterFor(total);
  const grade = ORDER[Math.min(ORDER.indexOf(raw), ORDER.indexOf(CAP[stars]))];

  const briefAll = fields.flatMap((f) => f.brief);

  return {
    levelId: level.id,
    screen: screenIdx,
    title: screen.title,
    company: level.company,
    difficulty,
    total,
    stakeholderAvg,
    timeBonus,
    grade,
    capped: grade !== raw,
    stars,
    cardTotal: stakeholders.reduce((a, s) => a + s.card, 0),
    points: pointsFor({ grade, stars, difficulty }),
    briefMet: briefAll.filter((b) => b.met).length,
    briefTotal: briefAll.length,
    metrics: {
      message: avgMetric('message'), clarity: avgMetric('clarity'), fit: avgMetric('fit'),
      voice: avgMetric('voice'), action: avgMetric('action'),
    },
    stakeholders,
    fields,
  };
}
