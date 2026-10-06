// Starts the API (port 5050) and the Vite client (port 5173) together.
// Uses the system Node rather than any `node` package that npm puts on PATH
// from a parent node_modules/.bin, so native tools (esbuild, rollup) match the CPU.
import { spawn, execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const exe = process.platform === 'win32' ? 'node.exe' : 'node';
const systemNode = (process.env.PATH || '')
  .split(path.delimiter)
  .filter((dir) => dir && !dir.includes('node_modules'))
  .map((dir) => path.join(dir, exe))
  .find((p) => existsSync(p)) || process.execPath;

// If npm launched us through an Intel (Rosetta) Node on Apple Silicon, children
// inherit that architecture. Run them natively so arm64 binaries load.
const underRosetta = (() => {
  if (process.platform !== 'darwin' || process.arch !== 'x64') return false;
  try { return execFileSync('/usr/sbin/sysctl', ['-n', 'hw.optional.arm64']).toString().trim() === '1'; } catch { return false; }
})();
const launch = (args, opts) => (underRosetta
  ? spawn('/usr/bin/arch', ['-arm64', systemNode, ...args], opts)
  : spawn(systemNode, args, opts));

const procs = [
  { name: 'api', color: 33, cwd: 'server', args: ['--watch', 'index.js'] },
  { name: 'web', color: 36, cwd: 'client', args: ['node_modules/vite/bin/vite.js'] },
].map(({ name, color, cwd, args }) => {
  const child = launch(args, { cwd: path.join(root, cwd), env: process.env });
  const tag = `\x1b[${color}m[${name}]\x1b[0m `;
  const pipe = (stream, out) => stream.on('data', (buf) => {
    buf.toString().split('\n').filter(Boolean).forEach((line) => out.write(tag + line + '\n'));
  });
  pipe(child.stdout, process.stdout);
  pipe(child.stderr, process.stderr);
  child.on('exit', (code) => {
    console.log(`${tag}exited (${code ?? 'signal'})`);
    shutdown();
  });
  return child;
});

let closing = false;
function shutdown() {
  if (closing) return;
  closing = true;
  procs.forEach((p) => p.exitCode === null && p.kill());
  setTimeout(() => process.exit(0), 300);
}
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
