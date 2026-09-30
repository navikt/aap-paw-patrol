/**
 * Starts one standalone HTTP server for all local mock backends. Each backend gets a
 * distinct path prefix on MOCK_API_BASE_URL to keep overlapping routes separate.
 *
 * Run with: node --experimental-strip-types mocks/run.ts (see scripts/dev-with-mocks.mjs).
 *
 * To mock another backend, see mocks/mock-specs.mjs — that's the only place that needs
 * editing; this file starts a server for every entry in MOCK_SPECS automatically.
 */
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { RequestHandler } from 'msw';
import { startMockHttpServer } from './standaloneServer.ts';
import { getMockName, MOCK_SPECS } from './mock-specs.mjs';

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

function portFromBaseUrl(raw: string): number {
  try {
    const url = new URL(raw);
    const port = url.port ? Number(url.port) : Number(url.protocol === 'https:' ? 443 : 80);
    if (!Number.isInteger(port) || port < 1 || port > 65535) {
      throw new Error(`Invalid mock API port in MOCK_API_BASE_URL: ${raw}`);
    }
    return port;
  } catch {
    throw new Error(`Invalid MOCK_API_BASE_URL: ${raw}`);
  }
}

loadEnvLocal();

async function startAll() {
  const handlers: RequestHandler[] = [];

  for (const { spec } of MOCK_SPECS) {
    const mockName = getMockName(spec);
    const handlersPath = path.join(rootDir, 'mocks', 'generated', mockName, 'handlers.ts');
    if (!existsSync(handlersPath)) {
      console.warn(`[mocks/run] Skipping ${mockName}: no generated handlers found (run yarn mock:generate first).`);
      continue;
    }
    const generated = await import(`./generated/${mockName}/handlers.ts`);
    handlers.push(...generated.handlers);
  }

  const mockBaseUrl = process.env.MOCK_API_BASE_URL ?? 'http://localhost:8080';
  startMockHttpServer(portFromBaseUrl(mockBaseUrl), handlers, 'all');
}

startAll();
