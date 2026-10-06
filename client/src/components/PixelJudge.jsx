// A chunky pixel-art judge who holds up a cardboard scorecard, Dancing with the Stars style.
// Skin, hair, outfit and glasses are picked from the judge's name so they stay the same every
// time you meet them. Anything set in the stakeholder's `look` (in server/data/levels.js) wins.
// Facial hair is never random; it only appears when `look.mustache` is true. The face follows their mood.

const SKIN = ['#f2c9a0', '#d9a172', '#a86b45', '#7a4a2c', '#f6dcc0'];
const HAIR = ['#2b1a12', '#6b3b1f', '#d9a441', '#b8b8c6', '#c2452d', '#1d1d2b'];
const SHIRT = ['#3d7fe0', '#e0533d', '#35a37a', '#8a5be0', '#e09a2d', '#d14d8a'];
const STYLES = ['short', 'bun', 'bald', 'spiky', 'long', 'afro'];
const INK = '#1b1020';

function hash(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}

export function lookFor(name, index = 0, overrides = {}) {
  const h = hash(name);
  return {
    skin: SKIN[h % SKIN.length],
    hair: HAIR[(h >>> 3) % HAIR.length],
    shirt: SHIRT[(h >>> 6) % SHIRT.length],
    style: STYLES[((h >>> 9) + index) % STYLES.length],
    glasses: ((h >>> 12) % 3) === 0,
    mustache: false,
    ...overrides,
  };
}

// [x, y, w, h, color]
function sprite(look, { mood, holding }) {
  const r = [];
  const px = (x, y, w, h, c) => r.push([x, y, w, h, c]);
  const { skin, hair, shirt } = look;

  // body
  px(3, 15, 14, 11, shirt);
  px(8, 14, 4, 1, skin);
  px(9, 15, 2, 2, skin);
  // arms
  if (holding) {
    px(1, 3, 2, 13, shirt); px(17, 3, 2, 13, shirt);
    px(1, 0, 2, 3, skin); px(17, 0, 2, 3, skin);
  } else {
    px(1, 15, 2, 7, shirt); px(17, 15, 2, 7, shirt);
    px(1, 22, 2, 2, skin); px(17, 22, 2, 2, skin);
  }
  // head
  px(5, 4, 10, 10, skin);
  px(4, 8, 1, 2, skin); px(15, 8, 1, 2, skin); // ears

  // hair
  switch (look.style) {
    case 'bun': px(5, 3, 10, 2, hair); px(5, 5, 1, 2, hair); px(14, 5, 1, 2, hair); px(8, 1, 4, 2, hair); break;
    case 'bald': px(5, 6, 1, 3, hair); px(14, 6, 1, 3, hair); px(7, 5, 2, 1, '#ffffff66'); break;
    case 'spiky': px(5, 3, 10, 2, hair); [5, 7, 9, 11, 13].forEach((x, i) => px(x, i % 2 ? 1 : 2, 1, i % 2 ? 2 : 1, hair)); break;
    case 'long': px(5, 3, 10, 2, hair); px(4, 4, 1, 10, hair); px(15, 4, 1, 10, hair); px(5, 5, 1, 2, hair); px(14, 5, 1, 2, hair); break;
    case 'afro': px(4, 1, 12, 4, hair); px(3, 3, 1, 6, hair); px(16, 3, 1, 6, hair); px(5, 5, 1, 1, hair); px(14, 5, 1, 1, hair); break;
    default: px(5, 3, 10, 2, hair); px(5, 5, 1, 2, hair); px(14, 5, 1, 2, hair);
  }

  // glasses go under the eyes
  if (look.glasses) {
    px(5, 7, 10, 1, INK);
    px(6, 7, 3, 3, '#cfe8ff'); px(11, 7, 3, 3, '#cfe8ff');
  }

  // eyes + brows
  if (mood === 'happy') {
    px(6, 8, 1, 1, INK); px(7, 7, 1, 1, INK); px(8, 8, 1, 1, INK);
    px(11, 8, 1, 1, INK); px(12, 7, 1, 1, INK); px(13, 8, 1, 1, INK);
  } else if (mood === 'meh') {
    px(6, 8, 2, 1, INK); px(12, 8, 2, 1, INK);
    px(6, 6, 2, 1, hair); px(12, 6, 2, 1, hair);
  } else if (mood === 'mad') {
    px(7, 8, 1, 1, INK); px(12, 8, 1, 1, INK);
    px(6, 6, 1, 1, INK); px(7, 6, 1, 1, INK); px(8, 7, 1, 1, INK);
    px(13, 6, 1, 1, INK); px(12, 6, 1, 1, INK); px(11, 7, 1, 1, INK);
    px(6, 10, 1, 1, '#e8606088'); px(13, 10, 1, 1, '#e8606088');
  } else if (mood === 'nervous') {
    px(7, 7, 1, 2, INK); px(12, 7, 1, 2, INK);
    px(15, 5, 1, 2, '#8fd3ff'); // sweat drop
  } else {
    px(7, 7, 1, 2, INK); px(12, 7, 1, 2, INK);
  }

  // nose
  px(10, 9, 1, 1, '#00000022');

  // mouth
  if (mood === 'happy') {
    px(6, 10, 1, 1, '#ff8fa3aa'); px(13, 10, 1, 1, '#ff8fa3aa');
    px(7, 10, 1, 1, INK); px(12, 10, 1, 1, INK);
    px(8, 11, 4, 2, INK); px(9, 12, 2, 1, '#e05a6a');
  } else if (mood === 'meh') {
    px(8, 11, 4, 1, INK);
  } else if (mood === 'mad') {
    px(8, 11, 4, 1, INK); px(7, 12, 1, 1, INK); px(12, 12, 1, 1, INK);
  } else if (mood === 'nervous') {
    px(8, 11, 1, 1, INK); px(9, 12, 1, 1, INK); px(10, 11, 1, 1, INK); px(11, 12, 1, 1, INK);
  } else {
    px(9, 11, 2, 1, INK);
  }

  if (look.mustache) { px(7, 10, 6, 1, hair); px(6, 11, 1, 1, hair); px(13, 11, 1, 1, hair); }
  return r;
}

// 5×7 bitmap digits, drawn like a fat marker on cardboard.
const DIGITS = {
  0: ['01110', '10001', '10011', '10101', '11001', '10001', '01110'],
  1: ['00100', '01100', '00100', '00100', '00100', '00100', '01110'],
  2: ['01110', '10001', '00001', '00010', '00100', '01000', '11111'],
  3: ['11110', '00001', '00001', '01110', '00001', '00001', '11110'],
  4: ['00010', '00110', '01010', '10010', '11111', '00010', '00010'],
  5: ['11111', '10000', '11110', '00001', '00001', '10001', '01110'],
  6: ['00110', '01000', '10000', '11110', '10001', '10001', '01110'],
  7: ['11111', '00001', '00010', '00100', '01000', '01000', '01000'],
  8: ['01110', '10001', '10001', '01110', '10001', '10001', '01110'],
  9: ['01110', '10001', '10001', '01111', '00001', '00010', '01100'],
};

function PixelNumber({ value }) {
  const chars = String(value ?? '').split('');
  if (!chars.length) return null;
  const width = chars.length * 6 - 1;
  return (
    <svg className="pixel-number" viewBox={`0 0 ${width} 7`} shapeRendering="crispEdges" aria-hidden="true">
      {chars.flatMap((ch, ci) => (DIGITS[ch] || []).flatMap((row, y) => row.split('').map((bit, x) => (
        bit === '1' ? <rect key={`${ci}-${x}-${y}`} x={ci * 6 + x} y={y} width="1.06" height="1.06" fill="currentColor" /> : null
      ))))}
    </svg>
  );
}

/**
 * state: 'watching' (no card), 'holding' (card face-down), 'revealed' (card shows the number)
 */
export default function PixelJudge({ name, role, look: overrides, index = 0, state = 'watching', mood = 'neutral', card, size = 'md', plate = true }) {
  const look = lookFor(name, index, overrides);
  const holding = state !== 'watching';
  const face = state === 'revealed' ? mood : state === 'holding' ? 'nervous' : 'neutral';
  const tilt = [-5, 3, -2][index % 3];

  return (
    <figure className={`judge judge-${size} ${state} mood-${state === 'revealed' ? mood : 'none'}`} style={{ '--tilt': `${tilt}deg`, '--delay': `${index * 120}ms` }}>
      {holding && (
        <div className="card-wrap" aria-hidden={state !== 'revealed'}>
          <div className="card">
            <div className="card-face card-back" />
            <div className="card-face card-front"><PixelNumber value={card} /></div>
          </div>
        </div>
      )}
      <svg className="sprite" viewBox="0 0 20 26" shapeRendering="crispEdges" role="img" aria-label={`${name}${state === 'revealed' ? `, holds up ${card}` : ''}`}>
        {sprite(look, { mood: face, holding }).map(([x, y, w, h, c], i) => (
          <rect key={i} x={x} y={y} width={w} height={h} fill={c} />
        ))}
      </svg>
      {plate && (
        <figcaption className="nameplate">
          <strong>{name}</strong>
          {role && <span>{role}</span>}
        </figcaption>
      )}
    </figure>
  );
}
