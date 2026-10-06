import { useEffect, useState } from 'react';
import { audio } from '../audio/chiptune.js';

export default function Countdown({ label, sub, onDone }) {
  const [n, setN] = useState(3);

  useEffect(() => {
    if (n === 0) {
      audio.play('go');
      const t = setTimeout(onDone, 550);
      return () => clearTimeout(t);
    }
    audio.play('count');
    const t = setTimeout(() => setN(n - 1), 700);
    return () => clearTimeout(t);
  }, [n, onDone]);

  return (
    <section className="countdown" aria-live="assertive">
      <p className="eyebrow">{label}</p>
      <p className="countdown-sub">{sub}</p>
      <div key={n} className="count-num">{n === 0 ? 'GO!' : n}</div>
    </section>
  );
}
