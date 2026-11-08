import { useEffect, useState } from 'react';

// Pixel-art environments, one per business. Drawn on a 160×90 grid and scaled up,
// so every rect is a chunky "pixel". Groups with an anim-* class get gentle motion.
// Full-width bands (sky, ground, road) are drawn far past the grid's edges, so on
// screens wider than 16:9 the world keeps going instead of showing empty space.

const W = 160;
const GROUND = 62;

let k = 0;
const BLEED = 640;
const r = (x, y, w, h, fill) => {
  const full = x === 0 && w === W;
  return <rect key={k++} x={full ? -BLEED : x} y={y} width={full ? W + BLEED * 2 : w} height={h} fill={fill} />;
};
const label = (x, y, text, fill, size = 4.2) => (
  <text key={k++} x={x} y={y} fill={fill} fontSize={size} fontFamily="'Press Start 2P', monospace" textAnchor="middle">{text}</text>
);

function sky(colors) {
  const band = GROUND / colors.length;
  return colors.map((c, i) => r(0, Math.floor(i * band), W, Math.ceil(band) + 1, c));
}

function cloud(x, y, c = '#ffffff') {
  return [r(x, y + 2, 18, 3, c), r(x + 3, y, 9, 2, c), r(x + 12, y + 1, 4, 1, c)];
}

function stars(seed, color = '#ffffff') {
  const out = [];
  for (let i = 0; i < 26; i++) {
    const x = (i * 37 + seed * 11) % W;
    const y = (i * 23 + seed * 7) % 40;
    [-2, -1, 0, 1, 2].forEach((tile) => out.push(r(x + tile * W + (tile ? 7 : 0), y, 1, 1, color)));
  }
  return out;
}

// Stepped triangle, drawn in 2px rows.
function mountain(cx, top, base, color, snow) {
  const out = [];
  const h = GROUND - top;
  for (let y = top; y < GROUND; y += 2) {
    const w = Math.max(2, Math.round(((y - top) / h) * base));
    out.push(r(cx - w / 2, y, w, 2, y < top + 8 && snow ? snow : color));
  }
  return out;
}

function pine(x, y, c = '#2f5d3a') {
  return [r(x + 3, y, 2, 2, c), r(x + 2, y + 2, 4, 3, c), r(x + 1, y + 5, 6, 3, c), r(x, y + 8, 8, 3, c), r(x + 3, y + 11, 2, 3, '#5b3a22')];
}

function roundTree(x, y, leaf, trunk = '#5b3a22') {
  return [r(x + 2, y, 8, 2, leaf), r(x, y + 2, 12, 7, leaf), r(x + 2, y + 9, 8, 2, leaf), r(x + 5, y + 11, 2, 6, trunk)];
}

const SCENES = {
  // Brightloaf Bakery: warm morning on a brick high street
  A: () => [
    ...sky(['#ffd9ad', '#ffc89c', '#ffb68c', '#f7a17f']),
    r(124, 6, 12, 12, '#fff1c1'), r(122, 8, 16, 8, '#fff1c1'),
    <g key={k++} className="anim-cloud">{cloud(14, 10, '#fff6ea')}{cloud(80, 16, '#fff6ea')}</g>,
    r(0, 32, 26, 30, '#e3977a'), r(136, 28, 24, 34, '#e3977a'),
    r(30, 20, 100, 3, '#7a2f22'), r(32, 23, 96, 39, '#b5523b'),
    ...[30, 36, 58].map((y) => r(32, y, 96, 1, '#9c4330')),
    r(52, 25, 56, 9, '#3b1d0b'), label(80, 31.6, 'BRIGHTLOAF', '#ffd28a'),
    ...Array.from({ length: 11 }, (_, i) => r(36 + i * 8, 36, 8, 5, i % 2 ? '#c8692b' : '#f6efe2')),
    ...Array.from({ length: 11 }, (_, i) => r(37 + i * 8, 41, 6, 1, i % 2 ? '#c8692b' : '#f6efe2')),
    r(40, 44, 36, 14, '#ffe9c2'), r(44, 52, 8, 4, '#c07a3a'), r(54, 51, 9, 5, '#a8622b'), r(65, 52, 8, 4, '#c07a3a'), r(40, 56, 36, 1, '#7a4a20'),
    r(84, 43, 14, 19, '#6b3420'), r(87, 46, 8, 6, '#ffe9c2'), r(95, 53, 1, 2, '#ffd28a'),
    r(104, 44, 20, 14, '#ffe9c2'), r(108, 51, 12, 5, '#f4a6b8'), r(110, 49, 8, 2, '#fff8f0'),
    r(112, 10, 8, 10, '#7a2f22'),
    <g key={k++} className="anim-steam">{r(114, 4, 3, 3, '#ffffffaa')}{r(117, 0, 3, 3, '#ffffff77')}</g>,
    r(18, 34, 2, 28, '#3b2a20'), r(15, 31, 8, 4, '#ffe08a'),
    r(0, GROUND, W, 6, '#d8c3a5'), r(0, 68, W, 1, '#a8927a'), r(0, 69, W, 21, '#5c4a42'),
    ...[8, 40, 72, 104, 136].map((x) => r(x, 79, 14, 1, '#e8d9b8')),
    r(134, 56, 18, 2, '#6b3420'), r(135, 58, 1, 4, '#3b2a20'), r(150, 58, 1, 4, '#3b2a20'),
  ],

  // Ledgerly: office tower at dusk in the financial district
  B: () => [
    ...sky(['#26346f', '#3a4c95', '#6a6db3', '#c48fb8']),
    ...stars(2, '#dfe6ff'),
    r(18, 6, 6, 6, '#f3f0d0'),
    r(0, 34, 20, 28, '#1d2550'), r(22, 28, 14, 34, '#222c5c'), r(116, 30, 16, 32, '#222c5c'), r(134, 24, 26, 38, '#1d2550'),
    r(56, 12, 48, 50, '#2c3e6b'), r(54, 10, 52, 3, '#1a274a'),
    r(62, 4, 36, 7, '#2f6fed'), label(80, 9.6, 'LEDGERLY', '#ffffff', 3.8),
    <g key={k++} className="anim-blink">
      {Array.from({ length: 28 }, (_, i) => {
        const col = i % 4;
        const row = Math.floor(i / 4);
        const lit = (i * 7) % 5 < 3;
        return r(60 + col * 11, 16 + row * 6, 7, 3, lit ? '#ffd36e' : '#1b2a4d');
      })}
    </g>,
    r(72, 52, 16, 10, '#9cc3ff'), r(79, 52, 1, 10, '#2c3e6b'),
    r(8, 34, 32, 18, '#f3f6fd'), r(12, 44, 4, 5, '#2f6fed'), r(18, 40, 4, 9, '#2f6fed'), r(24, 42, 4, 7, '#2f6fed'), r(30, 37, 4, 12, '#35a37a'), r(22, 52, 2, 10, '#3a3f5c'),
    r(0, GROUND, W, 28, '#3a3f5c'), r(0, GROUND, W, 2, '#4a5070'),
    ...roundTree(120, 46, '#2f7a5a'), ...roundTree(140, 48, '#2f7a5a'),
  ],

  // Northwind Health: a calm clinic on a clear day
  C: () => [
    ...sky(['#bfe6f2', '#a9dcec', '#99d4e6', '#cdeee0']),
    r(20, 6, 10, 10, '#fff7cf'),
    <g key={k++} className="anim-cloud">{cloud(56, 8)}{cloud(118, 14)}</g>,
    ...mountain(30, 40, 70, '#9fd0b5'), ...mountain(130, 42, 80, '#9fd0b5'),
    r(40, 24, 84, 3, '#1f8a70'), r(42, 27, 80, 35, '#f7fbfa'), r(42, 34, 80, 2, '#1f8a70'),
    r(58, 14, 48, 10, '#ffffff'), r(58, 23, 48, 1, '#1f8a70'), label(86, 21, 'NORTHWIND', '#1f8a70', 3.6),
    r(62, 15, 2, 7, '#1f8a70'), r(59.5, 17.5, 7, 2, '#1f8a70'),
    ...[46, 60, 96, 110].map((x) => r(x, 39, 10, 8, '#cfe9f5')),
    r(74, 42, 16, 20, '#cfe9f5'), r(81, 42, 2, 20, '#1f8a70'),
    ...roundTree(10, 44, '#4f9d6b'), ...roundTree(136, 44, '#4f9d6b'),
    r(0, GROUND, W, 28, '#a7d18f'), r(72, GROUND, 20, 28, '#e8e2d0'),
    r(112, 58, 16, 2, '#7a5a43'), r(113, 60, 1, 3, '#5b3a22'), r(126, 60, 1, 3, '#5b3a22'),
  ],

  // Voltway: highway charging stop at night
  D: () => [
    ...sky(['#120b2e', '#1d1247', '#2b1a63', '#3b2380']),
    <g key={k++} className="anim-twinkle">{stars(4)}</g>,
    r(128, 6, 8, 8, '#e9e4ff'), r(126, 8, 2, 4, '#e9e4ff'),
    ...mountain(24, 36, 70, '#22184a'), ...mountain(140, 40, 60, '#22184a'),
    r(56, 20, 48, 8, '#160f3a'), label(80, 26, 'VOLTWAY', '#c9bcff', 4),
    r(30, 28, 100, 4, '#6b4dff'), r(30, 32, 100, 1, '#c9bcff'),
    r(34, 33, 3, 29, '#4a3a9a'), r(123, 33, 3, 29, '#4a3a9a'),
    ...[48, 74, 100].flatMap((x) => [r(x, 44, 8, 18, '#e8e6ff'), r(x + 8, 50, 2, 6, '#222')]),
    <g key={k++} className="anim-blink">{[48, 74, 100].map((x) => r(x + 2, 47, 4, 3, '#35e08a'))}</g>,
    r(82, 52, 30, 7, '#ff5f6d'), r(88, 47, 18, 5, '#ff7a86'), r(90, 48, 14, 3, '#9ad0ff'),
    r(85, 58, 6, 4, '#111'), r(102, 58, 6, 4, '#111'),
    r(0, GROUND, W, 28, '#2a2540'), ...[6, 38, 70, 102, 134].map((x) => r(x, 76, 16, 2, '#f2e86d')),
  ],

  // Harbor Bank: harbor at sunset with a columned bank and a lighthouse
  E: () => [
    ...sky(['#ffad7a', '#ff8f6e', '#e8738b', '#a85c9e']),
    r(98, 44, 22, 10, '#ffd27a'), r(102, 41, 14, 3, '#ffd27a'),
    <g key={k++} className="anim-cloud">{cloud(20, 10, '#ffd3c2')}{cloud(70, 6, '#ffd3c2')}</g>,
    r(0, 50, 92, 8, '#7a5a43'), r(0, 58, 92, 4, '#5e4433'),
    r(32, 6, 28, 4, '#d7cfba'), r(22, 10, 48, 4, '#d7cfba'), r(12, 14, 68, 4, '#d7cfba'),
    r(14, 18, 64, 6, '#0f6e8c'), label(46, 22.8, 'HARBOR BANK', '#f3efe3', 3.5),
    r(14, 24, 64, 26, '#e9e2d0'),
    ...[18, 30, 54, 66].map((x) => r(x, 26, 4, 22, '#fffaf0')),
    r(40, 34, 12, 16, '#0f6e8c'),
    r(132, 18, 10, 36, '#f5f5f5'), r(132, 24, 10, 5, '#d64545'), r(132, 36, 10, 5, '#d64545'),
    r(130, 12, 14, 6, '#2b2b2b'),
    <g key={k++} className="anim-blink">{r(134, 13, 6, 4, '#ffe27a')}</g>,
    r(0, 54, W, 36, '#2c6e8f'), r(92, 54, 68, 0.5, '#4f95b5'),
    <g key={k++} className="anim-wave">
      {[8, 30, 52, 74, 96, 118, 140].map((x, i) => r(x, 62 + (i % 3) * 7, 10, 1, '#5ba7c8'))}
    </g>,
    r(98, 60, 24, 5, '#8b5a3c'), r(100, 65, 20, 1, '#5e3a24'), r(109, 46, 1, 14, '#3a2a20'), r(110, 47, 8, 12, '#fff6ea'),
  ],

  // Quill: a bright writing studio with a giant quill on the roof
  F: () => [
    ...sky(['#ead9f6', '#dcc6ef', '#cfb5e8', '#f5d9e6']),
    <g key={k++} className="anim-cloud">{cloud(10, 12)}{cloud(120, 8)}</g>,
    ...[0, 1, 2, 3, 4, 5, 6].map((i) => r(70 + i * 3, 14 - i * 2, 4, 4, '#a8457f')),
    r(72, 16, 3, 3, '#7a2f5c'), r(69, 18, 2, 2, '#2a0f22'),
    r(44, 20, 72, 6, '#a8457f'), label(80, 25, 'QUILL', '#fbf2f7', 4.2),
    r(44, 26, 72, 36, '#fbf2f7'),
    r(50, 30, 60, 24, '#d7c4ef'), r(80, 30, 1, 24, '#fbf2f7'),
    r(58, 44, 16, 7, '#2a0f22'), r(56, 51, 20, 2, '#3d1b33'), r(60, 45, 12, 5, '#f5e6ff'),
    r(88, 42, 2, 9, '#5b3a22'), r(85, 40, 8, 3, '#ffd36e'),
    r(98, 46, 8, 7, '#7a5a43'), r(97, 40, 10, 6, '#5fae6e'),
    <g key={k++} className="anim-float">
      {r(12, 30, 24, 11, '#ffffff')}{r(16, 41, 4, 2, '#ffffff')}{r(16, 33, 16, 1, '#a8457f')}{r(16, 36, 11, 1, '#a8457f')}
      {r(124, 26, 24, 11, '#ffffff')}{r(140, 37, 4, 2, '#ffffff')}{r(128, 29, 14, 1, '#a8457f')}{r(128, 32, 16, 1, '#a8457f')}
    </g>,
    r(0, GROUND, W, 28, '#cdb8d9'), r(74, GROUND, 12, 28, '#e9dcef'),
    ...roundTree(18, 46, '#8fbf8a'), ...roundTree(130, 46, '#8fbf8a'),
  ],

  // Trailhead Outdoors: a log-cabin gear shop under the peaks
  G: () => [
    ...sky(['#9fd3f0', '#b6def2', '#cfe8f0', '#f2e7c9']),
    <g key={k++} className="anim-cloud">{cloud(100, 6)}</g>,
    ...mountain(36, 12, 90, '#6f8fa8', '#ffffff'), ...mountain(120, 18, 100, '#5f7f99', '#ffffff'),
    ...pine(4, 44), ...pine(14, 46), ...pine(136, 44), ...pine(146, 47),
    r(50, 28, 60, 6, '#4a2f1e'), r(56, 24, 48, 4, '#4a2f1e'),
    r(54, 34, 52, 28, '#8a5a36'), ...[38, 42, 46, 50, 54, 58].map((y) => r(54, y, 52, 1, '#6e4527')),
    r(62, 36, 36, 7, '#f3e9d2'), label(80, 41.6, 'TRAILHEAD', '#3f7d3a', 3.4),
    r(74, 46, 12, 16, '#4a2f1e'), r(58, 46, 10, 8, '#ffe9b0'), r(92, 46, 10, 8, '#ffe9b0'),
    r(118, 58, 2, 4, '#e09a2d'), r(116, 56, 6, 2, '#e09a2d'), r(114, 54, 10, 2, '#e09a2d'), r(112, 52, 14, 2, '#e09a2d'),
    r(0, GROUND, W, 28, '#7fa45a'),
    r(70, GROUND, 20, 8, '#c9b07a'), r(60, 70, 22, 8, '#c9b07a'), r(50, 78, 22, 12, '#c9b07a'),
    <g key={k++} className="anim-blink">{r(128, 64, 4, 2, '#ff7a2d')}{r(129, 62, 2, 2, '#ffd36e')}</g>,
    r(126, 66, 8, 1, '#5b3a22'),
  ],

  // Orbit Air: terminal, control tower and a plane on the move
  H: () => [
    ...sky(['#7ec8f2', '#95d2f4', '#b0dff6', '#d8eefa']),
    <g key={k++} className="anim-cloud">{cloud(6, 14)}{cloud(96, 8)}</g>,
    <g key={k++} className="anim-fly">
      {r(20, 14, 30, 5, '#ffffff')}{r(48, 15, 4, 3, '#ffffff')}{r(20, 9, 5, 5, '#d64545')}
      {r(30, 18, 12, 3, '#c9d3dc')}{[28, 32, 36, 40, 44].map((x) => r(x, 15, 2, 1, '#5a7a9a'))}{r(20, 18, 30, 1, '#d64545')}
    </g>,
    r(122, 16, 10, 46, '#e7ecf0'), r(118, 8, 18, 8, '#5a7a9a'), r(119, 10, 16, 3, '#bfe3ff'), r(126, 3, 2, 5, '#5a7a9a'),
    <g key={k++} className="anim-blink">{r(126, 2, 2, 2, '#ff4d4d')}</g>,
    r(36, 28, 48, 7, '#d64545'), label(60, 33.6, 'ORBIT AIR', '#ffffff', 3.8),
    r(8, 35, 104, 27, '#f1f4f6'), r(8, 39, 104, 11, '#9fd0ee'),
    ...[24, 44, 64, 84].map((x) => r(x, 39, 1, 11, '#f1f4f6')),
    r(100, 50, 22, 4, '#c9d3dc'),
    r(0, GROUND, W, 4, '#8fbf6a'), r(0, 66, W, 24, '#4a4f57'),
    ...[6, 30, 54, 78, 102, 126, 150].map((x) => r(x, 77, 12, 2, '#f5f5f5')),
  ],
};

export const SCENE_GLOW = {
  A: '#f7a17f', B: '#6a6db3', C: '#99d4e6', D: '#6b4dff',
  E: '#e8738b', F: '#cfb5e8', G: '#9fd3f0', H: '#7ec8f2',
};

// Picks how a full-window scene fits: wider than 16:9 shows the whole scene (sky and
// ground run off the sides); narrower fills the window by cropping the sides.
export function useWindowFit() {
  const calc = () => (window.innerWidth / window.innerHeight >= 16 / 9 ? 'meet' : 'slice');
  const [fit, setFit] = useState(calc);
  useEffect(() => {
    const onResize = () => setFit(calc());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return fit;
}

// fit 'meet' never crops the scene (extra width shows the extended sky and ground);
// fit 'slice' fills a tall box by cropping the sides.
export default function WorldScene({ id, className = '', fit = 'meet' }) {
  k = 0;
  const draw = SCENES[id];
  if (!draw) return null;
  return (
    <svg className={`world-scene ${className}`} viewBox="0 0 160 90" shapeRendering="crispEdges" preserveAspectRatio={`xMidYMid ${fit}`} aria-hidden="true">
      {draw()}
    </svg>
  );
}
