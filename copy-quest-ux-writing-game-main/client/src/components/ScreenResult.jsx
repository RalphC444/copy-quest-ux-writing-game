import { useEffect, useRef, useState } from 'react';
import { api } from '../lib/api.js';
import { audio } from '../audio/chiptune.js';
import { recordResult, screenKey, loadPlayer, addXp } from '../lib/progress.js';
import { rankFor } from '../lib/ranks.js';
import { getDifficulty } from '../lib/difficulty.js';
import PixelJudge from './PixelJudge.jsx';

const GRADE_LINE = {
  S: 'Legendary. Frame this and hang it in the studio.',
  A: 'Ship it. Minor polish at most.',
  B: 'Solid draft. A revision pass gets it there.',
  C: 'Workable, but the judges have notes.',
  D: 'Back to the whiteboard.',
  F: 'The judges are speechless. Not in a good way.',
};
const SHORT = { message: 'Message', clarity: 'Clarity', fit: 'Fit', voice: 'Voice', action: 'Action' };
const tone = (v) => (v >= 80 ? 'good' : v >= 60 ? 'warn' : 'bad');
const REVEAL_GAP = 900;

function XpPanel({ result, xp, difficulty }) {
  const { points } = result;
  const now = rankFor(xp.after);
  const was = rankFor(xp.before);
  const fromPct = xp.rankUp ? 0 : was.pct;
  return (
    <div className={`panel xp-panel ${xp.rankUp ? 'ranked-up' : ''}`}>
      <div className="xp-earned">
        <h3>Points earned</h3>
        <ul className="xp-math">
          <li><span>Grade {result.grade}</span><strong>+{points.grade}</strong></li>
          <li><span>{result.stars} {result.stars === 1 ? 'star' : 'stars'}</span><strong>+{points.stars}</strong></li>
          <li><span>{difficulty} difficulty</span><strong>×{points.multiplier}</strong></li>
          <li className="xp-total"><span>Total</span><strong>+{points.total.toLocaleString()} XP</strong></li>
        </ul>
      </div>
      <div className="xp-rank">
        {xp.rankUp && <p className="rank-up-banner">Promoted!</p>}
        <p className="eyebrow">Level {now.level}</p>
        <p className="xp-rank-title">{now.title}</p>
        <span className="xp-track big" aria-hidden="true">
          <i style={{ '--from': `${fromPct}%`, width: `${now.pct}%` }} />
        </span>
        <p className="muted xp-next">
          {xp.after.toLocaleString()} XP
          {now.next ? ` · ${now.toNext.toLocaleString()} to ${now.next.title}` : ' · top rank'}
        </p>
      </div>
    </div>
  );
}

function FieldReview({ f }) {
  return (
    <li>
      <div className="fr-top">
        <span className="fr-label">{f.label}</span>
        <span className={`fr-score ${tone(f.score)}-text`}>{f.score}</span>
      </div>
      <p className="fr-hint">Brief: {f.hint}</p>
      <blockquote className={f.text ? '' : 'blank'}>{f.text || 'Left blank'}</blockquote>

      <div className="fr-grid">
        <div>
          <h4>Brief checklist · {f.brief.filter((b) => b.met).length}/{f.brief.length}</h4>
          <ul className="checklist">
            {f.brief.map((b) => (
              <li key={b.need} className={b.met ? 'met' : 'missed'}>
                <span className="tick" aria-label={b.met ? 'Hit' : 'Missed'}>{b.met ? '✓' : '✗'}</span>
                <span>
                  {b.need}
                  {!b.met && <em> · words that count: {b.examples.map((x) => `“${x}”`).join(', ')}</em>}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4>Skills</h4>
          <ul className="skill-chips">
            {Object.entries(f.metrics).filter(([, v]) => v !== null).map(([k, v]) => (
              <li key={k} className={tone(v)}><span>{SHORT[k]}</span><strong>{v}</strong></li>
            ))}
          </ul>
          <h4>Judges</h4>
          <ul className="rating-row">
            {f.ratings.map((rt) => (
              <li key={rt.name} title={`${rt.name} (judges ${SHORT[rt.cares].toLowerCase()})`}>
                <span>{rt.name.startsWith('Dr.') ? rt.name : rt.name.split(' ')[0]}</span>
                <strong className={`${tone(rt.score)}-text`}>{rt.score}</strong>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {f.notes.length > 0 && (
        <>
          <h4>Craft notes</h4>
          <ul className="notes">
            {f.notes.map((n, j) => <li key={j} className={n.type}>{n.text}</li>)}
          </ul>
        </>
      )}
    </li>
  );
}

export default function ScreenResult({
  level, screenIdx, difficulty, answers, timing, onProgress, onPlayer, onNext, onRetry, onMap,
}) {
  const screen = level.rounds[screenIdx];
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [shown, setShown] = useState(0); // judges revealed so far
  const [xp, setXp] = useState(null);
  const asked = useRef(false);
  const timers = useRef([]);
  const payload = { levelId: level.id, screen: screenIdx, difficulty, answers, timing };
  const done = result && shown >= result.stakeholders.length;
  const isLast = screenIdx === level.rounds.length - 1;

  useEffect(() => {
    if (asked.current) return;
    asked.current = true;
    audio.play('drumroll');
    const minWait = new Promise((r) => setTimeout(r, 1300));
    Promise.all([api.grade(payload), minWait])
      .then(([r]) => {
        setResult(r);
        onProgress(recordResult(screenKey(level.id, screenIdx), r.grade, r.total, r.stars));
        const before = loadPlayer().xp;
        const player = addXp(r.points.total);
        onPlayer(player);
        setXp({ before, after: player.xp, rankUp: rankFor(player.xp).level > rankFor(before).level });
        r.stakeholders.forEach((s, i) => {
          timers.current.push(setTimeout(() => {
            setShown(i + 1);
            audio.play('card', s.card);
          }, (i + 1) * REVEAL_GAP));
        });
      })
      .catch((e) => setError(e.message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!done) return undefined;
    const t = setTimeout(() => audio.play(xp?.rankUp || result.total >= 75 ? 'win' : result.total >= 50 ? 'ok' : 'lose'), 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const skip = () => { timers.current.forEach(clearTimeout); setShown(result?.stakeholders.length ?? 0); };

  if (error) {
    return (
      <section className="results">
        <h2>The judges could not score this</h2>
        <p>{error}</p>
        <button className="btn btn-primary" onClick={onMap}>Level map</button>
      </section>
    );
  }

  const diff = getDifficulty(difficulty);
  const people = result?.stakeholders ?? level.stakeholders.map((s) => ({ ...s, card: null, mood: 'neutral' }));

  return (
    <section className="results" style={{ '--lv': level.brand.color }}>
      <header className="screen-head compact">
        <p className="eyebrow">Level {level.id}-{screenIdx + 1} · {screen.title}</p>
        <h2>{done ? 'The judges have spoken' : 'Judges, your scores'}</h2>
      </header>

      <div className="judging-stage">
        <div className="judges-row big">
          {people.map((s, i) => (
            <PixelJudge
              key={s.name}
              name={s.name}
              role={s.role}
              look={level.stakeholders[i].look}
              index={i}
              size="lg"
              state={i < shown ? 'revealed' : 'holding'}
              mood={s.mood}
              card={s.card}
            />
          ))}
        </div>
        <div className="judges-desk">
          <span>JUDGES</span>
          {done && <span className="desk-total">{result.cardTotal}<small>/30</small></span>}
        </div>
        <div className="quotes-row" aria-live="polite">
          {people.map((s, i) => (
            <p key={s.name} className={`judge-quote ${i < shown ? 'show' : ''} mood-${s.mood}`}>
              {i < shown ? s.quote : ''}
            </p>
          ))}
        </div>
        {!done && result && <button className="btn btn-ghost skip-btn" onClick={skip}>Skip</button>}
      </div>

      {done && (
        <>
          <div className="grade-hero">
            <div className={`grade-letter grade-${result.grade}`}>{result.grade}</div>
            <div className="grade-meta">
              <p className="eyebrow">{level.company} · {diff.name}</p>
              <h2>{result.total}<small>/100</small></h2>
              <p className="grade-line">{GRADE_LINE[result.grade]}</p>
              <span className="stars big" aria-label={`${result.stars} of 3 stars`}>
                {[0, 1, 2].map((i) => <i key={i} className={i < result.stars ? 'on' : ''} />)}
              </span>
            </div>
            <dl className="score-math">
              <div><dt>Judges' average</dt><dd>{result.stakeholderAvg}</dd></div>
              <div><dt>Time bonus</dt><dd>+{result.timeBonus}</dd></div>
              <div><dt>Brief points hit</dt><dd>{result.briefMet}/{result.briefTotal}</dd></div>
              <p>
                Your score is the judges' average rating plus a time bonus. Each card is that judge's rating out of 10.
                A judge holding up 8 or more earns you a star.
                {result.capped && ` Capped at ${result.grade}: ${result.stars === 2 ? 'an S needs all three judges delighted.' : result.stars === 1 ? 'an A needs two delighted.' : 'a B needs at least one delighted.'}`}
              </p>
            </dl>
          </div>

          <div className="result-actions">
            {!isLast && <button className="btn btn-primary btn-xl" onClick={onNext}>Next level: {level.id}-{screenIdx + 2}</button>}
            {isLast && <p className="world-clear">World {level.id} complete!</p>}
            <button className="btn btn-ghost" onClick={onRetry}>Retry {level.id}-{screenIdx + 1}</button>
            <button className="btn btn-ghost" onClick={onMap}>Level map</button>
          </div>

          {xp && <XpPanel result={result} xp={xp} difficulty={diff.name} />}

          <div className="panel">
            <h3>Line by line</h3>
            <ul className="field-reviews">
              {result.fields.map((f) => <FieldReview key={f.id} f={f} />)}
            </ul>
          </div>

        </>
      )}
    </section>
  );
}
