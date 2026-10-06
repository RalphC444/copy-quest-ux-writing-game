import { useEffect } from 'react';

export default function TitleScreen({ onStart }) {
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
        Meet the client. Read the brief. Beat the clock. Write the words on three real screens,
        then face the stakeholders.
      </p>
      <button className="btn btn-primary btn-xl blink-soft" onClick={onStart}>
        Press start
      </button>
      <p className="hint">or press Enter</p>
    </section>
  );
}
