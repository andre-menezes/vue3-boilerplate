import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const args = process.argv.slice(2);

const vitest = spawn('node', ['./node_modules/vitest/vitest.mjs', ...args, '--root', root], {
  cwd: root,
  stdio: 'inherit',
  shell: false,
});

vitest.on('exit', (code) => {
  process.exit(code ?? 1);
});
