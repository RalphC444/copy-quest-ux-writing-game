import { useState } from 'react';
import { audio } from '../audio/chiptune.js';
import { companyStars, worldUnlocked } from '../lib/progress.js';

const Stars = ({ n, max = 5 }) => (
  <span className="stars" aria-label={`Difficulty ${n} of ${max}`}>
    {Array.from({ length: max }, (_, i) => (
      <i key={i} className={i < n ? 'on' : ''} />
    ))}
  </span>
);

// Classic view of world select, kept as a backup to the WorldSelect environments.
export default function LevelSelect({ levels, progress, onPick, onWorldView }) {
  const [active, setActive] = useState(null);

  const isOpen = (l, i) => l.playable && worldUnlocked(levels, progress, i);

  const choose = (l, i) => {
    if (!isOpen(l, i)) { audio.play('locked'); return; }
    audio.play('select');
    onPick(l.id);
  };

  return (
    <section className="level-select">
      <header className="screen-head">
        <p className="eyebrow">Classic view</p>
        <h2>Choose a world</h2>
        <button className="link-btn" onClick={onWorldView}>Back to world view</button>
      </header>

      <div className="level-grid" role="list">
        {levels.map((l, i) => {
          const open = isOpen(l, i);
          const done = l.playable ? companyStars(progress, l.id) : null;
          return (
            <div key={l.id} role="listitem" className="level-cell" style={l.brand ? { '--lv': l.brand.color } : undefined}>
              <button
                className={`level-letter ${open ? '' : 'locked'} ${active === l.id ? 'active' : ''}`}
                onMouseEnter={() => { setActive(l.id); audio.play('hover'); }}
                onFocus={() => setActive(l.id)}
                onMouseLeave={() => setActive((a) => (a === l.id ? null : a))}
                onClick={() => choose(l, i)}
                aria-describedby={`peek-${l.id}`}
                aria-label={`Level ${l.id}: ${l.company}${open ? '' : ' (locked)'}`}
              >
                <span className="glyph">{l.id}</span>
                {!open && <span className="lock-tag">LOCKED</span>}
                {done?.cleared > 0 && <span className="best">★ {done.stars}/9</span>}
              </button>
              <div id={`peek-${l.id}`} className="peek" role="tooltip">
                <strong>{l.company}</strong>
                <span className="peek-genre">{l.genre}</span>
                <Stars n={l.stars} />
                <p>{l.teaser}</p>
                <em>{open ? `3 levels · ${done.cleared}/3 cleared` : i > 0 ? `Clear World ${levels[i - 1].id} to unlock` : 'Coming soon'}</em>
              </div>
            </div>
          );
        })}
      </div>

      <p className="hint center">Hover a letter to meet the client. Start with World A. Clearing all three levels of a world unlocks the next.</p>
    </section>
  );
}
