import { useCallback, useEffect, useRef, useState } from 'react';
import { audio } from '../audio/chiptune.js';
import { getDifficulty, fmtTime } from '../lib/difficulty.js';
import ScreenMockup from './ScreenMockup.jsx';
import PixelJudge from './PixelJudge.jsx';

const HURRY_AT = 15;

export default function ScreenPlay({ level, screenIdx, difficulty, onSubmit }) {
  const screen = level.rounds[screenIdx];
  const diff = getDifficulty(difficulty);
  const [values, setValues] = useState(() => Object.fromEntries(screen.fields.map((f) => [f.id, ''])));
  const [active, setActive] = useState(screen.fields[0].id);
  const [remaining, setRemaining] = useState(diff.seconds);
  const [showContext, setShowContext] = useState(false);
  const endAt = useRef(Date.now() + diff.seconds * 1000);
  const submitted = useRef(false);
  const valuesRef = useRef(values);
  valuesRef.current = values;

  const submit = useCallback(() => {
    if (submitted.current) return;
    submitted.current = true;
    audio.stopMusic();
    const left = Math.max(0, (endAt.current - Date.now()) / 1000);
    audio.play(left > 0 ? 'clear' : 'lose');
    onSubmit(valuesRef.current, { limit: diff.seconds, remaining: Math.round(left) });
  }, [diff.seconds, onSubmit]);

  // Background music for the length of the level.
  useEffect(() => {
    audio.startMusic(diff.bpm);
    return () => audio.stopMusic();
  }, [diff.bpm]);

  // Timer
  useEffect(() => {
    let lastWhole = diff.seconds;
    const id = setInterval(() => {
      const left = Math.max(0, (endAt.current - Date.now()) / 1000);
      setRemaining(left);
      const whole = Math.ceil(left);
      if (whole !== lastWhole) {
        lastWhole = whole;
        if (whole <= 5 && whole > 0) audio.play('tick');
        if (whole === HURRY_AT) audio.setTempo(diff.bpm * 1.3);
      }
      if (left <= 0) { clearInterval(id); submit(); }
    }, 100);
    return () => clearInterval(id);
  }, [diff.seconds, diff.bpm, submit]);

  // Cmd/Ctrl + Enter submits
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); submit(); } };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [submit]);

  const pct = (remaining / diff.seconds) * 100;
  const hurry = remaining <= HURRY_AT;
  const filled = screen.fields.filter((f) => values[f.id].trim()).length;

  return (
    <section className="round" style={{ '--lv': level.brand.color }}>
      <div className="hud">
        <div className="hud-left">
          <span className="hud-level">{level.id}-{screenIdx + 1}</span>
          <span className="hud-company">{screen.title}</span>
        </div>
        <span className="hud-diff">{diff.name}</span>
        <div className={`hud-timer ${hurry ? 'hurry' : ''}`} role="timer" aria-live="off">
          {fmtTime(remaining)}
        </div>
      </div>
      <div className="timebar" aria-hidden="true"><i style={{ width: `${pct}%` }} className={hurry ? 'hurry' : ''} /></div>

      <div className="round-body">
        <div className="round-stage-col">
          <div className="round-stage">
            <ScreenMockup level={level} round={screen} values={values} active={active} />
          </div>
          <div className="judges-desk-wrap">
            <div className="judges-row">
              {level.stakeholders.map((s, i) => (
                <PixelJudge key={s.name} name={s.name} role={s.role} look={s.look} index={i} state="watching" size="sm" />
              ))}
            </div>
            <div className="judges-desk" aria-hidden="true"><span>JUDGES</span></div>
          </div>
        </div>

        <div className="round-panel">
          <div className="context-card">
            <div className="context-head">
              <span className="brand-mark" style={{ background: level.brand.color }}>{level.brand.mark}</span>
              <span>About {level.company}</span>
              <button
                type="button"
                className="link-btn"
                aria-expanded={showContext}
                aria-controls="company-details"
                onClick={() => setShowContext((v) => !v)}
              >
                {showContext ? 'Hide details' : 'Show details'}
              </button>
            </div>
            <dl id="company-details" hidden={!showContext}>
              <div><dt>The business</dt><dd>{level.business}</dd></div>
              <div><dt>The project</dt><dd>{level.project}</dd></div>
              <div><dt>Voice</dt><dd>{level.tone.label}</dd></div>
              <div>
                <dt>Judges want</dt>
                <dd>
                  <ul className="wants">
                    {level.stakeholders.map((s) => <li key={s.name}><strong>{s.name.startsWith('Dr.') ? s.name : s.name.split(' ')[0]}:</strong> {s.wants}</li>)}
                  </ul>
                </dd>
              </div>
            </dl>
          </div>

          <div className="brief-card">
            <p className="eyebrow">This screen</p>
            <h3>{screen.goal}</h3>
          </div>

          <form className="copy-form" onSubmit={(e) => { e.preventDefault(); submit(); }}>
            {screen.fields.map((f, i) => {
              const v = values[f.id];
              const over = v.length > f.max;
              const Input = f.kind === 'body' ? 'textarea' : 'input';
              return (
                <div key={f.id} className={`field ${active === f.id ? 'focused' : ''}`}>
                  <div className="field-top">
                    <label htmlFor={`f-${f.id}`}>{f.label}</label>
                    <span className={`count ${over ? 'over' : v.length > f.max * 0.85 ? 'near' : ''}`}>
                      {v.length}/{f.max}
                    </span>
                  </div>
                  <p id={`h-${f.id}`} className="field-brief">{f.hint}</p>
                  <Input
                    id={`f-${f.id}`}
                    value={v}
                    autoFocus={i === 0}
                    rows={f.kind === 'body' ? 3 : undefined}
                    aria-describedby={`h-${f.id}`}
                    onFocus={() => setActive(f.id)}
                    onChange={(e) => {
                      setValues((prev) => ({ ...prev, [f.id]: e.target.value }));
                      audio.play('type');
                    }}
                    autoComplete="off"
                    spellCheck
                  />
                </div>
              );
            })}
            <button type="submit" className="btn btn-primary btn-block">
              Show the judges <kbd>⌘/Ctrl ↵</kbd>
            </button>
            <p className="hint">{filled}/{screen.fields.length} filled. When time runs out, whatever is typed goes to the judges.</p>
          </form>
        </div>
      </div>
    </section>
  );
}
