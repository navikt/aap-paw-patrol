#!/usr/bin/env node
/**
 * Orchestrates `yarn dev:mock`:
 * 1. Generates MSW handlers from ./openapi (see generate-mocks.mjs).
 * 2. Starts the standalone fake-backend HTTP servers (mocks/run.ts) as a child process.
 * 3. Starts `next dev --turbopack` as a child process.
 * Both children are killed when this process exits (e.g. Ctrl+C).
 */
import { spawn, spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

console.log('[dev:mock] Generating mock handlers from OpenAPI specs...');
const generate = spawnSync('node', ['scripts/generate-mocks.mjs'], { stdio: 'inherit', cwd: rootDir });
if (generate.status !== 0) {
  process.exit(generate.status ?? 1);
}

const children = [];

function killChildren() {
  for (const child of children) {
    if (!child.killed) {
      child.kill('SIGTERM');
    }
  }
}

process.on('SIGINT', () => {
  killChildren();
  process.exit(0);
});
process.on('SIGTERM', () => {
  killChildren();
  process.exit(0);
});

const mockServers = spawn('node', ['--experimental-strip-types', 'mocks/run.ts'], {
  stdio: 'inherit',
  cwd: rootDir,
});
children.push(mockServers);

const nextDev = spawn('yarn', ['next', 'dev', '--turbopack'], {
  stdio: 'inherit',
  cwd: rootDir,
});
children.push(nextDev);

let exiting = false;
function handleExit(code) {
  if (exiting) return;
  exiting = true;
  killChildren();
  process.exit(code ?? 0);
}

mockServers.on('exit', (code) => handleExit(code));
nextDev.on('exit', (code) => handleExit(code));
