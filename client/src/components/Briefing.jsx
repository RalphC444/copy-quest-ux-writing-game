import { useEffect, useRef, useState } from 'react';
import { audio } from '../audio/chiptune.js';
import PixelJudge from './PixelJudge.jsx';

const CARES = {
  voice: 'Brand voice',
  clarity: 'Clarity',
  message: 'Getting the facts in',
  action: 'Clear next steps',
  fit: 'Brevity',
};

function useTypewriter(text, speed = 18) {
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

export default function Briefing({ level, onDone, onBack }) {
  const steps = [
    { key: 'business', tab: 'The business', speaker: 'Client file', text: level.business },
    { key: 'project', tab: 'The project', speaker: 'Project brief', text: level.project },
    { key: 'people', tab: 'The judges', speaker: 'Your judges', text: `Three judges will score every screen you write, out of 10. The voice for this job: ${level.tone.label.toLowerCase()}.` },
  ];
  const [step, setStep] = useState(0);
  const current = steps[step];
  const [shown, done, skip] = useTypewriter(current.text);
  const nextRef = useRef(null);

  const advance = () => {
    if (!done) { skip(); return; }
    audio.play('select');
    if (step < steps.length - 1) setStep(step + 1);
    else onDone();
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); advance(); }
      if (e.key === 'Escape') onBack();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  useEffect(() => { if (done) nextRef.current?.focus(); }, [done]);

  return (
    <section className="briefing" style={{ '--lv': level.brand.color }}>
      <header className="screen-head">
        <p className="eyebrow">Level {level.id} · Mission briefing</p>
        <h2>{level.company}</h2>
      </header>

      <ol className="wizard-steps" aria-label="Briefing steps">
        {steps.map((s, i) => (
          <li key={s.key} className={i === step ? 'current' : i < step ? 'done' : ''} aria-current={i === step ? 'step' : undefined}>
            <span className="pip">{i + 1}</span>
            {s.tab}
          </li>
        ))}
      </ol>

      <div className="dialog-box" onClick={advance}>
        <div className="speaker">
          <span className="brand-mark" style={{ background: level.brand.color }}>{level.brand.mark}</span>
          {current.speaker}
        </div>
        <p className="dialog-text" aria-live="polite">
          {shown}
          {!done && <span className="caret" aria-hidden="true" />}
        </p>

        {current.key === 'people' && done && (
          <ul className="party">
            {level.stakeholders.map((s, i) => (
              <li key={s.name} className="party-card" style={{ animationDelay: `${i * 140}ms` }}>
                <PixelJudge name={s.name} look={s.look} index={i} size="md" plate={false} />
                <div>
                  <strong>{s.name}</strong>
                  <span className="role">{s.role}</span>
                  <p>“{s.wants}”</p>
                  <span className="chip">Judges: {CARES[s.cares]}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="wizard-actions">
        <button className="btn btn-ghost" onClick={() => { audio.play('back'); step === 0 ? onBack() : setStep(step - 1); }}>
          {step === 0 ? 'Level select' : 'Back'}
        </button>
        <button ref={nextRef} className="btn btn-primary" onClick={advance}>
          {!done ? 'Skip' : step < steps.length - 1 ? 'Next' : 'To the level map'}
        </button>
      </div>
    </section>
  );
}
