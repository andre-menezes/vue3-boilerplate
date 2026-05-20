import { spawn } from 'node:child_process';

const root = new URL('..', import.meta.url);
const baseURL = 'http://127.0.0.1:8080';
const args = process.argv.slice(2);

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForServer(url, timeoutMs = 30_000) {
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {
      // Server is still starting.
    }

    await wait(500);
  }

  throw new Error(`Timed out waiting for ${url}`);
}

function run(command, commandArgs, options = {}) {
  return spawn(command, commandArgs, {
    cwd: root,
    stdio: 'inherit',
    shell: false,
    ...options,
  });
}

const vite = run('node', [
  './node_modules/vite/bin/vite.js',
  '--host',
  '127.0.0.1',
  '--port',
  '8080',
  '--strictPort',
]);

const stopVite = () => {
  if (!vite.killed) {
    vite.kill();
  }
};

process.on('exit', stopVite);
process.on('SIGINT', () => {
  stopVite();
  process.exit(130);
});
process.on('SIGTERM', () => {
  stopVite();
  process.exit(143);
});

try {
  await waitForServer(baseURL);

  const playwright = run('node', ['./node_modules/playwright/cli.js', 'test', ...args]);

  const exitCode = await new Promise((resolve) => {
    playwright.on('exit', (code) => resolve(code ?? 1));
  });

  stopVite();
  process.exit(exitCode);
} catch (error) {
  stopVite();
  console.error(error);
  process.exit(1);
}
