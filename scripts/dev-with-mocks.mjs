#!/usr/bin/env node
/**
 * Orchestrates `yarn dev:mock`:
 * 1. Generates MSW handlers from ./openapi (see generate-mocks.mjs).
 * 2. Starts the standalone fake-backend HTTP server (mocks/run.ts) as a child process.
 * 3. Starts `next dev --turbopack` as a child process.
 * Both children are killed when this process exits (e.g. Ctrl+C).
 */
import { spawn, spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getMockBasePath, MOCK_SPECS } from '../mocks/mock-specs.mjs';

const rootDir = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

function loadEnvLocal() {
  const envPath = path.join(rootDir, '.env.local');
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

loadEnvLocal();
const mockBaseUrl = (process.env.MOCK_API_BASE_URL ?? 'http://localhost:8080').replace(/\/+$/, '');
for (const { envVar, spec } of MOCK_SPECS) {
  process.env[envVar] = `${mockBaseUrl}${getMockBasePath(spec)}`;
}

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
