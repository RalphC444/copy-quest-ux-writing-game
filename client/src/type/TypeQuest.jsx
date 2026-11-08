import { useEffect, useMemo, useState } from 'react';
import { TYPE_LEVELS, SCALE, WEIGHTS, FONTS } from './levels.js';
import { gradeType } from './grade.js';
import './type.css';

const DEFAULT = { size: 14, weight: 400, tone: 'high', upper: false, tabular: false };
const TONE_LABEL = { high: 'Strong', medium: 'Medium', low: 'Quiet', accent: 'Accent' };

function Canvas({ level, styles, font, blur, selected, onSelect, label }) {
  return (
    <div className="tq-canvas-wrap">
      {label && <p className="tq-canvas-label">{label}</p>}
      <div className={`tq-canvas${blur ? ' blur' : ''}`} style={{ fontFamily: `'${font}', system-ui, sans-serif` }}>
        {level.elements.map((e) => {
          const s = styles[e.id];
          return (
            <button
              key={e.id}
              type="button"
              className={`tq-el tone-${s.tone}${selected === e.id ? ' sel' : ''}`}
              style={{
                gridArea: e.area, fontSize: s.size, fontWeight: s.weight,
                textTransform: s.upper ? 'uppercase' : 'none', letterSpacing: s.upper ? '0.06em' : 0,
                fontVariantNumeric: s.tabular ? 'tabular-nums' : 'proportional-nums',
              }}
              onClick={() => onSelect?.(e.id)}
              disabled={!onSelect}
            >
              {e.role === 'action' ? <span className="tq-btn">{e.text}</span> : e.text}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function TypeQuest({ onAI }) {
  const level = TYPE_LEVELS[0];
  const fresh = () => Object.fromEntries(level.elements.map((e) => [e.id, { ...DEFAULT }]));
  const [styles, setStyles] = useState(fresh);
  const [selected, setSelected] = useState(level.target);
  const [font, setFont] = useState(FONTS[0]);
  const [blur, setBlur] = useState(false);
  const [left, setLeft] = useState(level.seconds);
  const [result, setResult] = useState(null);
  const [ai, setAi] = useState(null);

  useEffect(() => {
    if (result) return;
    if (left <= 0) { submit(); return; }
    const t = setTimeout(() => setLeft((l) => l - 1), 1000);
    return () => clearTimeout(t);
  }, [left, result]);

  const sel = level.elements.find((e) => e.id === selected);
  const set = (patch, all = false) => setStyles((st) => {
    const next = { ...st };
    const ids = all ? level.elements.filter((e) => e.role === sel.role).map((e) => e.id) : [selected];
    ids.forEach((id) => { next[id] = { ...next[id], ...patch }; });
    return next;
  });
  const [applyGroup, setApplyGroup] = useState(true);
  const expert = useMemo(() => Object.fromEntries(level.elements.map((e) => [e.id, e.expert])), [level]);

  function submit() {
    const r = gradeType(level, styles);
    setResult(r);
    if (onAI) onAI(level, styles, r).then(setAi).catch(() => setAi(null));
  }
  function retry() { setStyles(fresh()); setResult(null); setAi(null); setLeft(level.seconds); setBlur(false); }

  return (
    <section className="tq">
      <header className="tq-brief">
        <div>
          <p className="eyebrow">Level {level.id} · {level.client}</p>
          <h2>{level.title}</h2>
          <p>{level.brief}</p>
          <p className="tq-task"><strong>Task:</strong> {level.task}</p>
        </div>
        {!result && <div className={`tq-timer${left <= 15 ? ' low' : ''}`}>{Math.floor(left / 60)}:{String(left % 60).padStart(2, '0')}</div>}
      </header>

      <div className="tq-toolbar">
        <label>Font <select value={font} onChange={(e) => setFont(e.target.value)}>{FONTS.map((f) => <option key={f}>{f}</option>)}</select></label>
        <button className={`btn${blur ? ' btn-primary' : ''}`} onClick={() => setBlur((b) => !b)} aria-pressed={blur}>Blur test</button>
        {!result && <button className="btn" onClick={retry}>Reset</button>}
      </div>

      {!result ? (
        <div className="tq-work">
          <Canvas level={level} styles={styles} font={font} blur={blur} selected={selected} onSelect={setSelected} />
          <aside className="tq-panel">
            <p className="tq-sel">Editing: <strong>{sel.text}</strong> <span>({sel.role})</span></p>
            <label className="tq-check"><input type="checkbox" checked={applyGroup} onChange={(e) => setApplyGroup(e.target.checked)} /> Apply to all “{sel.role}” items</label>
            <p className="tq-h">Size</p>
            <div className="tq-chips">{SCALE.map((v) => <button key={v} className={styles[selected].size === v ? 'on' : ''} onClick={() => set({ size: v }, applyGroup)}>{v}</button>)}</div>
            <p className="tq-h">Weight</p>
            <div className="tq-chips">{WEIGHTS.map((v) => <button key={v} className={styles[selected].weight === v ? 'on' : ''} onClick={() => set({ weight: v }, applyGroup)}>{v === 400 ? 'Regular' : v === 500 ? 'Medium' : 'Bold'}</button>)}</div>
            <p className="tq-h">Emphasis</p>
            <div className="tq-chips">{Object.keys(TONE_LABEL).map((v) => <button key={v} className={styles[selected].tone === v ? 'on' : ''} onClick={() => set({ tone: v }, applyGroup)}>{TONE_LABEL[v]}</button>)}</div>
            <label className="tq-check"><input type="checkbox" checked={styles[selected].upper} onChange={(e) => set({ upper: e.target.checked }, applyGroup)} /> Uppercase</label>
            {sel.numeric && <label className="tq-check"><input type="checkbox" checked={styles[selected].tabular} onChange={(e) => set({ tabular: e.target.checked }, applyGroup)} /> Tabular numbers</label>}
            <p className="hint">Tip: squint, or hit Blur test. Whatever survives the blur is your hierarchy.</p>
            <button className="btn btn-primary btn-xl" onClick={submit}>Face the judges</button>
          </aside>
        </div>
      ) : (
        <div className="tq-result">
          <div className="tq-score"><span className={`tq-grade g-${result.grade}`}>{result.grade}</span><strong>{result.total}/100</strong></div>
          <ul className="tq-skills">{result.skills.map((s) => <li key={s.name}><span>{s.name}</span><meter min="0" max="20" value={s.score} /> {s.score}/20</li>)}</ul>
          <p className="hint">Eye path: {result.ranking.join(' → ')}</p>
          <ul className="tq-notes">{result.notes.map((n, i) => <li key={i} className={n.bad ? 'bad' : 'good'}><strong>{n.skill}:</strong> {n.text}</li>)}</ul>
          {ai && (
            <div className="tq-ai">
              <h3>Design director’s notes</h3>
              <p>{ai.summary}</p>
              {ai.strength && <p><strong>Strength:</strong> {ai.strength}</p>}
              {ai.focus && <p><strong>Work on:</strong> {ai.focus}</p>}
            </div>
          )}
          <div className="tq-compare">
            <Canvas level={level} styles={styles} font={font} blur={blur} label="Yours" />
            <Canvas level={level} styles={expert} font={font} blur={blur} label="Expert reference" />
          </div>
          <div className="tq-actions"><button className="btn btn-primary" onClick={retry}>Try again</button></div>
        </div>
      )}
    </section>
  );
}
