import { useEffect, useState } from 'react';
import { audio } from '../audio/chiptune.js';
import { companyStars, worldUnlocked } from '../lib/progress.js';
import WorldScene, { SCENE_GLOW, useWindowFit } from './WorldScene.jsx';

// A pixel chevron with an even 2px stroke. Points right; mirrored for left.
const CHEVRON = [[1, 0], [2, 1], [3, 2], [4, 3], [5, 4], [6, 5], [5, 6], [4, 7], [3, 8], [2, 9], [1, 10]];
const Chevron = ({ dir }) => (
  <svg viewBox="0 0 9 12" width="18" height="24" shapeRendering="crispEdges" aria-hidden="true">
    {CHEVRON.map(([x, y]) => (
      <rect key={y} x={dir === 'left' ? 8 - x - 2 : x} y={y} width="2" height="2" fill="currentColor" />
    ))}
  </svg>
);

// World select as a little environment per business. Arrows page between worlds;
// the next world's scene wipes in over the current one. The details panel stays put.
export default function WorldSelect({ levels, progress, onPick, onTheme, onClassic }) {
  // Always opens on World A; the arrows reach any world the player has unlocked.
  const [view, setView] = useState({ idx: 0, prev: null, dir: 1 });
  const world = levels[view.idx];
  const open = world && world.playable && worldUnlocked(levels, progress, view.idx);
  const done = world ? companyStars(progress, world.id) : { stars: 0, cleared: 0 };
  // On phones the scene sits above the details at 16:9; on larger screens it fills the window.
  const windowFit = useWindowFit();
  const [narrow, setNarrow] = useState(() => window.innerWidth <= 720);
  useEffect(() => {
    const onResize = () => setNarrow(window.innerWidth <= 720);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  const sceneFit = narrow ? 'meet' : windowFit;

  useEffect(() => { if (world) onTheme?.(SCENE_GLOW[world.id]); }, [world, onTheme]);
  useEffect(() => () => onTheme?.(null), [onTheme]);

  const go = (step) => {
    const idx = view.idx + step;
    if (idx < 0 || idx >= levels.length) return;
    audio.play('select');
    setView({ idx, prev: view.idx, dir: step });
  };

  const jump = (idx) => {
    if (idx === view.idx) return;
    audio.play('select');
    setView({ idx, prev: view.idx, dir: idx > view.idx ? 1 : -1 });
  };

  const enter = () => {
    if (!open) { audio.play('locked'); return; }
    audio.play('go');
    onPick(world.id);
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
      if (e.key === 'Enter') enter();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  if (!world) return null;
  const prevWorld = view.prev !== null ? levels[view.prev] : null;

  return (
    <section className="world-select" aria-label="World select">
      {/* Full-screen environment */}
      <div className="world-bg">
        {prevWorld && <WorldScene key={`prev-${prevWorld.id}`} id={prevWorld.id} fit={sceneFit} className="scene-under" />}
        <WorldScene
          key={`cur-${world.id}`}
          id={world.id}
          fit={sceneFit}
          className={`scene-over ${view.prev !== null ? (view.dir > 0 ? 'wipe-from-right' : 'wipe-from-left') : ''} ${open ? '' : 'scene-locked'}`}
        />
        {!open && (
          <div className="scene-lock" aria-hidden="true">
            <span>LOCKED</span>
          </div>
        )}
        <button className="world-arrow left" onClick={() => go(-1)} disabled={view.idx === 0} aria-label="Previous world"><Chevron dir="left" /></button>
        <button className="world-arrow right" onClick={() => go(1)} disabled={view.idx === levels.length - 1} aria-label="Next world"><Chevron dir="right" /></button>
      </div>
      <div className="world-scrim top" aria-hidden="true" />
      <div className="world-scrim bottom" aria-hidden="true" />

      {/* Overlays */}
      <header className="world-top">
        <div>
          <p className="eyebrow">World select</p>
          <h2>Choose a client</h2>
        </div>
        <button className="link-btn" onClick={onClassic}>Classic grid view</button>
      </header>

      <div className="world-bottom">
        <div className="world-details" aria-live="polite">
          <div className="world-info">
            <p className="eyebrow">World {world.id} · {world.genre}</p>
            <h3>{world.company}</h3>
            <p>{world.teaser}</p>
            <div className="world-meta">
              <span className="stars" aria-label={`Difficulty ${world.stars} of 5`}>
                {Array.from({ length: 5 }, (_, i) => <i key={i} className={i < world.stars ? 'on' : ''} />)}
              </span>
              <span>Difficulty</span>
              <span className="dot" aria-hidden="true">·</span>
              <span>{done.cleared}/3 levels cleared</span>
              <span className="dot" aria-hidden="true">·</span>
              <span>★ {done.stars}/9</span>
            </div>
          </div>
          <div className="world-cta">
            {open ? (
              <button className="btn btn-primary" onClick={enter}>
                {done.cleared > 0 ? 'Continue' : 'Enter world'}
              </button>
            ) : (
              <p className="lock-note">Clear all 3 levels of World {levels[view.idx - 1]?.id} to unlock.</p>
            )}
          </div>
        </div>

        <nav className="world-dots" aria-label="Worlds">
          {levels.map((l, i) => {
            const unlocked = l.playable && worldUnlocked(levels, progress, i);
            return (
              <button
                key={l.id}
                className={`world-dot ${i === view.idx ? 'current' : ''} ${unlocked ? '' : 'locked'}`}
                onClick={() => jump(i)}
                aria-label={`World ${l.id}: ${l.company}${unlocked ? '' : ' (locked)'}`}
                aria-current={i === view.idx ? 'true' : undefined}
              >
                {l.id}
              </button>
            );
          })}
        </nav>
        <p className="world-hint">Use ← → to browse worlds. Press Enter to play.</p>
      </div>
    </section>
  );
}
