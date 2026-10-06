import { useEffect } from 'react';
import { RANKS, rankFor } from '../lib/ranks.js';

const SKILLS = [
  { name: 'Message', text: 'Say everything the brief needs, and nothing it doesn’t.' },
  { name: 'Clarity', text: 'Plain words and short sentences anyone can follow.' },
  { name: 'Fit', text: 'Make every line fit the space on the screen.' },
  { name: 'Voice', text: 'Sound like the brand, whether that’s warm or calm.' },
  { name: 'Action', text: 'Write buttons that say exactly what happens next.' },
];

export default function TitleScreen({ onStart, xp = 0 }) {
  const current = rankFor(xp);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onStart(); } };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onStart]);

  return (
    <section className="title-screen">
      <p className="eyebrow">A UX writing game</p>
      <h1 className="title-logo">
        <span>COPY</span>
        <span>QUEST</span>
      </h1>
      <p className="title-pitch">
        Meet the client. Read the brief. Beat the clock. Write the words for real product screens,
        then face the judges.
      </p>
      <button className="btn btn-primary btn-xl blink-soft" onClick={onStart}>
        Press start
      </button>
      <p className="hint">or press Enter</p>

      <div className="title-learn">
        <h2>How you get better</h2>
        <p className="learn-lead">
          Every screen trains the same five skills working copywriters use. The judges score each one,
          and your results show exactly which line missed and why, so you know what to fix on the next screen.
        </p>
        <ul className="skill-tiles">
          {SKILLS.map((s) => (
            <li key={s.name}>
              <strong>{s.name}</strong>
              <span>{s.text}</span>
            </li>
          ))}
        </ul>

        <p className="learn-lead">
          The clients get tougher as you go: a bakery that needs warmth, a finance app that needs trust,
          a clinic that needs calm, and a charging app that needs speed. Better copy earns more XP,
          and XP moves you up the ladder.
        </p>
        <ol className="rank-ladder" aria-label="Rank ladder">
          {RANKS.map((r) => (
            <li key={r.level} className={r.level === current.level ? 'now' : r.level < current.level ? 'past' : ''}>
              <span>{r.level}</span>{r.title}
            </li>
          ))}
        </ol>
        <p className="hint">
          You’re {/^[AEIO]/.test(current.title) ? 'an' : 'a'} <strong>{current.title}</strong>
          {current.next ? `. ${current.toNext.toLocaleString()} XP to ${current.next.title}.` : '. Top rank.'}
        </p>
      </div>
    </section>
  );
}
