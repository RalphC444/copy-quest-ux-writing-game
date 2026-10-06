import { useRef } from 'react';

// Renders a fake product screen. Every copy slot is editable in place: click it and type.
// Edits flow through onEdit, so the mockup and the brief form on the right stay in sync.

const SINGLE_LINE = new Set(['headline', 'title', 'cta', 'label']);

function Slot({ slot, fields, values, active, onEdit, onFocusField, as: Tag = 'span', className = '' }) {
  const ref = useRef(null);
  const field = fields.find((f) => f.slot === slot);
  if (!field) return null;
  const value = values[field.id];
  const over = value && value.length > field.max;
  const singleLine = SINGLE_LINE.has(field.kind);

  return (
    <Tag
      className={`slot ${className} ${value ? 'filled' : 'empty'} ${active === field.id ? 'active' : ''} ${over ? 'over' : ''}`}
      onClick={() => ref.current?.focus()}
    >
      {/* The ::after mirror sizes the box to the text, so the editor grows as you type */}
      <span className="grow" data-value={`${value || field.label} `}>
        <textarea
          ref={ref}
          rows={1}
          value={value}
          placeholder={field.label}
          aria-label={`${field.label} (on the screen)`}
          spellCheck
          onFocus={() => onFocusField?.(field.id)}
          onKeyDown={(e) => { if (singleLine && e.key === 'Enter' && !e.metaKey && !e.ctrlKey) e.preventDefault(); }}
          onChange={(e) => onEdit?.(field.id, singleLine ? e.target.value.replace(/\n/g, ' ') : e.target.value)}
        />
      </span>
    </Tag>
  );
}

function Phone({ children, brand, dim }) {
  return (
    <div className="device phone">
      <div className="phone-notch" />
      <div className="statusbar"><span>9:41</span><span>●●● ▮</span></div>
      <div className={`screen ${dim ? 'dim' : ''}`}>
        <div className="app-bar">
          <span className="app-mark" style={{ background: brand.color }}>{brand.mark}</span>
        </div>
        {children}
      </div>
    </div>
  );
}

export default function ScreenMockup({ level, round, values, active, onEdit, onFocusField }) {
  const { brand } = level;
  const s = round.static || {};
  const p = { fields: round.fields, values, active, onEdit, onFocusField };
  const vars = { '--b': brand.color, '--b-ink': brand.ink, '--b-surface': brand.surface };

  let body;
  switch (round.layout) {
    case 'hero':
      body = (
        <div className="device browser">
          <div className="browser-chrome"><i /><i /><i /><span className="url">{level.company.toLowerCase().replace(/\s+/g, '')}.com</span></div>
          <div className="screen">
            <nav className="site-nav">
              <span className="app-mark" style={{ background: brand.color }}>{brand.mark}</span>
              <span className="site-name">{level.company}</span>
              <span className="site-links">{s.nav?.map((n) => <span key={n}>{n}</span>)}</span>
            </nav>
            <div className="hero">
              <div className="hero-copy">
                <Slot slot="headline" as="h1" className="m-h1" {...p} />
                <Slot slot="body" as="p" className="m-body" {...p} />
                <Slot slot="cta" className="m-btn" {...p} />
              </div>
              <div className="hero-art" aria-hidden="true"><span /><span /><span /></div>
            </div>
          </div>
        </div>
      );
      break;

    case 'card':
      body = (
        <Phone brand={brand}>
          <div className="m-card">
            <div className="m-img stripes" aria-hidden="true">
              <Slot slot="label" className="m-badge" {...p} />
            </div>
            <div className="m-card-body">
              <div className="m-row"><strong>{s.product}</strong><span className="m-muted">{s.price}</span></div>
              <Slot slot="body" as="p" className="m-body" {...p} />
              <Slot slot="cta" className="m-btn wide" {...p} />
            </div>
          </div>
        </Phone>
      );
      break;

    case 'confirm':
      body = (
        <Phone brand={brand}>
          <div className="m-center">
            <div className="m-check" aria-hidden="true">✓</div>
            <Slot slot="headline" as="h1" className="m-h1 center" {...p} />
            <dl className="m-receipt">
              {(s.rows || [['Order', s.order], ['Shop', s.shop], ['Pickup', s.window]]).map(([k, v]) => (
                <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
              ))}
            </dl>
            <Slot slot="body" as="p" className="m-body center" {...p} />
            <Slot slot="cta" className="m-btn wide" {...p} />
          </div>
        </Phone>
      );
      break;

    case 'form':
      body = (
        <Phone brand={brand}>
          <div className="m-pad">
            <span className="m-step">{s.step}</span>
            <Slot slot="headline" as="h1" className="m-h1" {...p} />
            <Slot slot="body" as="p" className="m-body" {...p} />
            <ul className="m-list">{s.banks?.map((b) => <li key={b}>{b}<span>›</span></li>)}</ul>
            <Slot slot="cta" className="m-btn wide" {...p} />
          </div>
        </Phone>
      );
      break;

    case 'dialog':
      body = (
        <Phone brand={brand} dim>
          <div className="m-ghost-ui" aria-hidden="true"><i /><i /><i /><i /></div>
          <div className="m-dialog">
            <Slot slot="title" as="h2" className="m-h2" {...p} />
            <Slot slot="body" as="p" className="m-body" {...p} />
            <Slot slot="cta" className="m-btn wide" {...p} />
            <Slot slot="secondary" className="m-link" {...p} />
          </div>
        </Phone>
      );
      break;

    case 'empty':
      body = (
        <Phone brand={brand}>
          <div className="m-tabs">{s.tabs?.map((t, i) => <span key={t} className={i === 0 ? 'on' : ''}>{t}</span>)}</div>
          <div className="m-center">
            <div className="m-empty-art" aria-hidden="true" />
            <Slot slot="headline" as="h1" className="m-h1 center" {...p} />
            <Slot slot="body" as="p" className="m-body center" {...p} />
            <Slot slot="cta" className="m-btn" {...p} />
          </div>
        </Phone>
      );
      break;

    case 'notification':
      body = (
        <div className="device phone lock">
          <div className="phone-notch" />
          <div className="screen lockscreen">
            <div className="lock-time">8:02</div>
            <div className="lock-date">Monday, March 9</div>
            <div className="m-notif">
              <div className="m-notif-head">
                <span className="app-mark sm" style={{ background: brand.color }}>{brand.mark}</span>
                <span>{s.app}</span><span className="m-muted">now</span>
              </div>
              <Slot slot="title" as="strong" className="m-notif-title" {...p} />
              <Slot slot="body" as="p" className="m-body" {...p} />
              <div className="m-notif-actions">
                <Slot slot="cta" className="m-chip" {...p} />
                <span className="m-chip ghost">Dismiss</span>
              </div>
            </div>
          </div>
        </div>
      );
      break;

    case 'summary':
      body = (
        <Phone brand={brand}>
          <div className="m-pad">
            <Slot slot="headline" as="h1" className="m-h1" {...p} />
            <div className="m-stats">
              {s.stats?.map(([k, v]) => <div key={k}><span>{k}</span><strong>{v}</strong></div>)}
            </div>
            <Slot slot="body" as="p" className="m-body" {...p} />
            <div className="m-upsell">
              <Slot slot="upsell" as="p" className="m-body" {...p} />
              <Slot slot="cta" className="m-btn wide" {...p} />
            </div>
          </div>
        </Phone>
      );
      break;

    default:
      body = null;
  }

  return <div className="mockup" style={vars}>{body}</div>;
}
