/**
 * Entry point for the local mock backends (see mocks/standaloneServer.ts). Starts one
 * standalone HTTP server per mocked backend, listening on the same port as configured
 * in .env.local, so the Next.js app's normal fetch calls to e.g.
 * BEHANDLING_API_BASE_URL just work unmodified.
 *
 * Run with: node --experimental-strip-types mocks/run.ts (see scripts/dev-with-mocks.mjs).
 *
 * To mock another backend, see mocks/mock-specs.mjs — that's the only place that needs
 * editing; this file starts a server for every entry in MOCK_SPECS automatically.
 */
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { startMockHttpServer } from './standaloneServer.ts';
import { MOCK_SPECS } from './mock-specs.mjs';

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

function portFromBaseUrl(envVar: string): number | undefined {
  const raw = process.env[envVar];
  if (!raw) return undefined;
  try {
    const url = new URL(raw);
    return url.port ? Number(url.port) : undefined;
  } catch {
    return undefined;
  }
}

loadEnvLocal();

async function startAll() {
  for (const { envVar, outDir } of MOCK_SPECS) {
    const handlersPath = path.join(rootDir, 'mocks', 'generated', outDir, 'handlers.ts');
    if (!existsSync(handlersPath)) {
      console.warn(`[mocks/run] Skipping ${outDir}: no generated handlers found (run yarn mock:generate first).`);
      continue;
    }
    const port = portFromBaseUrl(envVar);
    if (!port) {
      console.warn(`[mocks/run] Skipping ${outDir}: ${envVar} is not set or has no port (copy .env-template to .env.local).`);
      continue;
    }
    const { handlers } = await import(`./generated/${outDir}/handlers.ts`);
    startMockHttpServer(port, handlers, outDir);
  }
}

startAll();
