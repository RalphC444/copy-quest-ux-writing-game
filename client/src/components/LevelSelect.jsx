import { useState } from 'react';
import { audio } from '../audio/chiptune.js';
import { companyStars } from '../lib/progress.js';

const Stars = ({ n, max = 5 }) => (
  <span className="stars" aria-label={`Difficulty ${n} of ${max}`}>
    {Array.from({ length: max }, (_, i) => (
      <i key={i} className={i < n ? 'on' : ''} />
    ))}
  </span>
);

export default function LevelSelect({ levels, progress, onPick }) {
  const [active, setActive] = useState(null);

  const choose = (l) => {
    if (!l.playable) { audio.play('locked'); return; }
    audio.play('select');
    onPick(l.id);
  };

  return (
    <section className="level-select">
      <header className="screen-head">
        <p className="eyebrow">World 1 · Copywriting</p>
        <h2>Choose a level</h2>
      </header>

      <div className="level-grid" role="list">
        {levels.map((l) => {
          const done = l.playable ? companyStars(progress, l.id) : null;
          return (
            <div key={l.id} role="listitem" className="level-cell" style={l.brand ? { '--lv': l.brand.color } : undefined}>
              <button
                className={`level-letter ${l.playable ? '' : 'locked'} ${active === l.id ? 'active' : ''}`}
                onMouseEnter={() => { setActive(l.id); audio.play('hover'); }}
                onFocus={() => setActive(l.id)}
                onMouseLeave={() => setActive((a) => (a === l.id ? null : a))}
                onClick={() => choose(l)}
                aria-describedby={`peek-${l.id}`}
                aria-label={`Level ${l.id}: ${l.company}${l.playable ? '' : ' (locked)'}`}
              >
                <span className="glyph">{l.id}</span>
                {!l.playable && <span className="lock-tag">LOCKED</span>}
                {done?.cleared > 0 && <span className="best">★ {done.stars}/9</span>}
              </button>
              <div id={`peek-${l.id}`} className="peek" role="tooltip">
                <strong>{l.company}</strong>
                <span className="peek-genre">{l.genre}</span>
                <Stars n={l.stars} />
                <p>{l.teaser}</p>
                <em>{l.playable ? `3 levels · ${done.cleared}/3 cleared` : 'Coming soon'}</em>
              </div>
            </div>
          );
        })}
      </div>

      <p className="hint center">Hover a letter to meet the client. Levels A–D are open. E–H unlock soon.</p>
    </section>
  );
}
