import { audio } from '../audio/chiptune.js';
import { DIFFICULTIES, fmtTime } from '../lib/difficulty.js';
import { screenKey } from '../lib/progress.js';
import PixelJudge from './PixelJudge.jsx';

export default function LevelMap({ level, progress, difficulty, onDifficulty, onPlay, onBriefing, onBack }) {
  const unlocked = (i) => i === 0 || Boolean(progress[screenKey(level.id, i - 1)]);
  const nextUp = level.rounds.findIndex((_, i) => unlocked(i) && !progress[screenKey(level.id, i)]);

  return (
    <section className="level-map" style={{ '--lv': level.brand.color }}>
      <header className="screen-head">
        <p className="eyebrow">World {level.id} · {level.genre}</p>
        <h2>{level.company}</h2>
      </header>

      <ol className="map-path">
        {level.rounds.map((r, i) => {
          const best = progress[screenKey(level.id, i)];
          const open = unlocked(i);
          return (
            <li key={r.title} className={`map-node ${open ? '' : 'locked'} ${i === nextUp ? 'next' : ''} ${best ? 'cleared' : ''}`}>
              <button
                disabled={!open}
                onClick={() => { audio.play('go'); onPlay(i); }}
                onMouseEnter={() => open && audio.play('hover')}
                aria-label={`Level ${level.id}-${i + 1}: ${r.title}${open ? '' : ' (locked)'}`}
              >
                <span className="node-num">{level.id}-{i + 1}</span>
                <span className="node-title">{r.title}</span>
                <span className="node-goal">{r.goal}</span>
                <span className="node-foot">
                  {best ? (
                    <>
                      <span className={`node-grade grade-${best.grade}`}>{best.grade}</span>
                      <span className="stars" aria-label={`${best.stars} of 3 stars`}>
                        {[0, 1, 2].map((s) => <i key={s} className={s < best.stars ? 'on' : ''} />)}
                      </span>
                    </>
                  ) : (
                    <span className="node-status">{open ? 'Play' : `Clear ${level.id}-${i} to unlock`}</span>
                  )}
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      <div className="map-lower">
        <div className="diff-pick" role="radiogroup" aria-label="Difficulty">
          <span className="eyebrow">Difficulty</span>
          <div className="diff-row">
            {DIFFICULTIES.map((d) => (
              <button
                key={d.id}
                role="radio"
                aria-checked={difficulty === d.id}
                className={`diff-chip ${difficulty === d.id ? 'picked' : ''}`}
                onClick={() => { onDifficulty(d.id); audio.play('select'); }}
              >
                <strong>{d.name}</strong>
                <span>{fmtTime(d.seconds)} · ×{d.mult} XP</span>
              </button>
            ))}
          </div>
        </div>

        <div className="map-judges">
          <span className="eyebrow">Your judges</span>
          <div className="judges-row small">
            {level.stakeholders.map((s, i) => (
              <PixelJudge key={s.name} name={s.name} look={s.look} index={i} size="sm" />
            ))}
          </div>
        </div>
      </div>

      <div className="wizard-actions">
        <button className="btn btn-ghost" onClick={() => { audio.play('back'); onBack(); }}>Level select</button>
        <button className="btn btn-ghost" onClick={onBriefing}>Replay briefing</button>
      </div>
    </section>
  );
}
