import { audio } from '../audio/chiptune.js';
import { DIFFICULTIES, fmtTime } from '../lib/difficulty.js';
import { screenKey } from '../lib/progress.js';
import PixelJudge from './PixelJudge.jsx';

export default function LevelMap({ level, progress, difficulty, onDifficulty, onPlay, onBriefing, onBack }) {
  const unlocked = (i) => i === 0 || Boolean(progress[screenKey(level.id, i - 1)]);
  const nextUp = level.rounds.findIndex((_, i) => unlocked(i) && !progress[screenKey(level.id, i)]);

  return (
    <section className="level-map" style={{ '--lv': level.brand.color }}>
      <button className="link-btn back-link" onClick={() => { audio.play('back'); onBack(); }}>← Level select</button>

      {/* Details: read-only context about the client */}
      <div className="map-details">
        <div className="map-details-head">
          <span className="brand-mark lg" style={{ background: level.brand.color }}>{level.brand.mark}</span>
          <div>
            <p className="eyebrow">World {level.id} · {level.genre}</p>
            <h2>{level.company}</h2>
          </div>
          <button className="link-btn" onClick={onBriefing}>Replay briefing</button>
        </div>
        <dl className="map-facts">
          <div><dt>The business</dt><dd>{level.business}</dd></div>
          <div><dt>The project</dt><dd>{level.project}</dd></div>
          <div><dt>Voice</dt><dd>{level.tone.label}</dd></div>
        </dl>
        <div className="map-judges">
          <p className="facts-label">Your judges</p>
          <ul>
            {level.stakeholders.map((s, i) => (
              <li key={s.name}>
                <PixelJudge name={s.name} look={s.look} index={i} size="sm" plate={false} />
                <span>
                  <strong>{s.name}</strong>
                  <em>{s.role}</em>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Actions: choose difficulty, then play a level */}
      <div className="map-levels">
        <div className="map-levels-head">
          <h3>Levels</h3>
          <div className="diff-row" role="radiogroup" aria-label="Difficulty">
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
                  <span className="node-body">
                    <span className="node-title">{r.title}</span>
                    <span className="node-goal">{r.goal}</span>
                  </span>
                  <span className="node-foot">
                    {best ? (
                      <>
                        <span className={`node-grade grade-${best.grade}`}>{best.grade}</span>
                        <span className="stars" aria-label={`${best.stars} of 3 stars`}>
                          {[0, 1, 2].map((s) => <i key={s} className={s < best.stars ? 'on' : ''} />)}
                        </span>
                        <span className="node-status">Replay</span>
                      </>
                    ) : (
                      <span className="node-status">{open ? 'Play ▶' : `Clear ${level.id}-${i} to unlock`}</span>
                    )}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
