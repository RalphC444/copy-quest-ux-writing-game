import { rankFor } from '../lib/ranks.js';

export default function RankBadge({ xp }) {
  const r = rankFor(xp);
  return (
    <div className="rank-badge" title={r.next ? `${r.toNext.toLocaleString()} XP to ${r.next.title}` : 'Top rank reached'}>
      <span className="rank-lv">LV {r.level}</span>
      <span className="rank-body">
        <span className="rank-title">{r.title}</span>
        <span className="xp-track" aria-hidden="true"><i style={{ width: `${r.pct}%` }} /></span>
        <span className="rank-xp">{xp.toLocaleString()} XP{r.next ? ` · next at ${r.next.xp.toLocaleString()}` : ''}</span>
      </span>
    </div>
  );
}
