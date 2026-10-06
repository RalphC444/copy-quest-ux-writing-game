import { useEffect, useRef, useState } from 'react';
import { audio } from '../audio/chiptune.js';
import { DIFFICULTIES, fmtTime } from '../lib/difficulty.js';
import WorldScene, { useWindowFit } from './WorldScene.jsx';
import PixelJudge from './PixelJudge.jsx';

function useTypewriter(text, speed = 22) {
  const [shown, setShown] = useState('');
  const timer = useRef(null);
  const done = shown.length >= text.length;
  useEffect(() => {
    setShown('');
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) { setShown(text); return undefined; }
    let i = 0;
    timer.current = setInterval(() => {
      i += 1;
      setShown(text.slice(0, i));
      if (i % 3 === 0) audio.play('type');
      if (i >= text.length) clearInterval(timer.current);
    }, speed);
    return () => clearInterval(timer.current);
  }, [text, speed]);
  const skip = () => { clearInterval(timer.current); setShown(text); };
  return [shown, done, skip];
}

/**
 * The mission briefing, played as a cutscene over the world's environment.
 * mode 'intro': first visit; ends by starting level 1.
 * mode 'replay': from the level map; ends by returning to the map.
 */
export default function Cutscene({ level, mode = 'intro', difficulty, onDifficulty, onStart, onExit }) {
  const first = level.rounds[0];
  const beats = [
    { speaker: 'The client', text: level.business, title: true },
    { speaker: 'The project', text: level.project },
    ...level.stakeholders.map((s, i) => ({ speaker: s.name, role: s.role, text: `“${s.wants}”`, judge: i })),
    mode === 'intro'
      ? { speaker: 'Your first job', text: `Level ${level.id}-1, ${first.title}. ${first.goal} The voice: ${level.tone.label.toLowerCase()}.`, final: true }
      : { speaker: 'That’s the brief', text: 'Head back to the level map to pick up where you left off.', final: true },
  ];
  const [beat, setBeat] = useState(0);
  const current = beats[beat];
  const [shown, done, finishLine] = useTypewriter(current.text);
  const nextRef = useRef(null);
  const fit = useWindowFit();

  useEffect(() => {
    audio.startMusic(92);
    return () => audio.stopMusic();
  }, []);

  useEffect(() => { if (done) nextRef.current?.focus(); }, [done, beat]);

  const advance = () => {
    if (!done) { finishLine(); return; }
    if (current.final) return;
    audio.play('select');
    setBeat((b) => b + 1);
  };
  const skip = () => { audio.play('select'); setBeat(beats.length - 1); };
  const finish = () => {
    audio.stopMusic();
    audio.play('go');
    if (mode === 'intro') onStart(); else onExit();
  };

  useEffect(() => {
    const onKey = (e) => {
      if ((e.key === 'Enter' || e.key === ' ') && !current.final) { e.preventDefault(); advance(); }
      if (e.key === 'Escape' && !current.final) skip();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const speaking = current.judge;

  return (
    <section className="cutscene" style={{ '--lv': level.brand.color }} aria-label={`Mission briefing: ${level.company}`}>
      <div className={`cut-scene-wrap beat-${Math.min(beat, 3)}`}>
        <WorldScene id={level.id} fit={fit} />
      </div>
      <div className="cut-shade" aria-hidden="true" />
      <div className="letterbox top" aria-hidden="true" />
      <div className="letterbox bottom" aria-hidden="true" />

      <div className="cut-top">
        <span className="cut-label">Mission briefing · World {level.id}</span>
        {!current.final && <button className="cut-skip" onClick={skip}>Skip briefing</button>}
      </div>

      {current.title && (
        <div className="cut-title" key={`t-${beat}`}>
          <p>World {level.id} · {level.genre}</p>
          <h1>{level.company}</h1>
        </div>
      )}

      {speaking !== undefined && (
        <div className="cut-judges">
          {level.stakeholders.map((s, i) => (
            <div key={s.name} className={`cut-judge ${i === speaking ? 'speaking' : 'quiet'}`}>
              <PixelJudge name={s.name} role={s.role} look={s.look} index={i} size="lg" mood={i === speaking ? 'happy' : 'neutral'} />
            </div>
          ))}
        </div>
      )}

      <div className="cut-dialog" onClick={!current.final ? advance : undefined}>
        <div className="cut-speaker">
          <span className="brand-mark" style={{ background: level.brand.color }}>{level.brand.mark}</span>
          <span>{current.speaker}</span>
          {current.role && <em>{current.role}</em>}
        </div>
        <p className="cut-text" aria-live="polite">
          {shown}
          {!done && <span className="caret" aria-hidden="true" />}
        </p>

        {current.final && done && mode === 'intro' && (
          <div className="cut-final">
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
            <button ref={nextRef} className="btn btn-go" onClick={finish}>Start level {level.id}-1</button>
          </div>
        )}
        {current.final && done && mode === 'replay' && (
          <div className="cut-final">
            <button ref={nextRef} className="btn btn-primary" onClick={finish}>Back to level map</button>
          </div>
        )}

        {!current.final && (
          <div className="cut-foot">
            <ol className="cut-pips" aria-label={`Part ${beat + 1} of ${beats.length}`}>
              {beats.map((b, i) => <li key={i} className={i === beat ? 'now' : i < beat ? 'done' : ''} />)}
            </ol>
            <button ref={nextRef} className="btn btn-primary" onClick={(e) => { e.stopPropagation(); advance(); }}>
              {done ? 'Next' : 'Show all'}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
