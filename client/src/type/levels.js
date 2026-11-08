// Type Quest levels. Layout is fixed: you only control type, so every point is about hierarchy.
// role groups elements that should look alike (Gestalt similarity). expert = reference styling.
export const SCALE = [11, 12, 14, 16, 20, 24, 32, 40];
export const WEIGHTS = [400, 500, 700];
export const TONES = { high: 1, medium: 0.72, low: 0.5, accent: 1 };
export const FONTS = ['Roboto', 'Inter', 'IBM Plex Sans'];

const base = { size: 14, weight: 400, tone: 'high', upper: false, tabular: false };
const el = (id, text, role, area, expert, extra = {}) => ({ id, text, role, area, expert: { ...base, ...expert }, ...extra });

export const TYPE_LEVELS = [
  {
    id: 'T1',
    client: 'Ledgerline',
    title: 'Portfolio dashboard',
    brief: 'Traders open this screen dozens of times a day. They need today’s P&L first, total value second, and everything else should step back.',
    task: 'Make today’s P&L findable in under 2 seconds.',
    target: 'pnl',
    secondary: 'total',
    seconds: 120,
    elements: [
      el('app', 'LEDGERLINE', 'meta', 'a', { size: 12, weight: 700, tone: 'medium', upper: true }),
      el('updated', 'Updated 14:32 ET', 'meta', 'b', { size: 12, tone: 'low' }),
      el('pnlLabel', 'Today’s P&L', 'label', 'c', { size: 12, weight: 500, tone: 'medium', upper: true }),
      el('pnl', '+$1,284.50 (+0.52%)', 'hero', 'd', { size: 40, weight: 700, tone: 'accent', tabular: true }, { numeric: true }),
      el('totalLabel', 'Total value', 'label', 'e', { size: 12, weight: 500, tone: 'medium', upper: true }),
      el('total', '$248,391.07', 'kpi', 'f', { size: 24, weight: 500, tone: 'high', tabular: true }, { numeric: true }),
      el('trade', 'Trade', 'action', 'g', { size: 14, weight: 700, tone: 'accent' }),
      el('hSym', 'Symbol', 'th', 'h1', { size: 11, weight: 500, tone: 'low', upper: true }),
      el('hQty', 'Qty', 'th', 'h2', { size: 11, weight: 500, tone: 'low', upper: true }),
      el('hVal', 'Value', 'th', 'h3', { size: 11, weight: 500, tone: 'low', upper: true }),
      el('hChg', 'Change', 'th', 'h4', { size: 11, weight: 500, tone: 'low', upper: true }),
      ...[['AAPL', '120', '$27,384.00', '+1.2%'], ['MSFT', '45', '$19,112.85', '−0.4%'], ['NVDA', '60', '$8,391.40', '+3.1%']]
        .flatMap(([s, q, v, c], i) => [
          el(`s${i}`, s, 'sym', `r${i}a`, { size: 14, weight: 500 }),
          el(`q${i}`, q, 'cell', `r${i}b`, { size: 14, tabular: true }, { numeric: true }),
          el(`v${i}`, v, 'cell', `r${i}c`, { size: 14, tabular: true }, { numeric: true }),
          el(`c${i}`, c, 'cell', `r${i}d`, { size: 14, tabular: true }, { numeric: true }),
        ]),
    ],
  },
];
