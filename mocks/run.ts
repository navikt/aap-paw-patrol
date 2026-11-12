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
import { HttpResponse, http } from 'msw';
import type { RequestHandler } from 'msw';
import type { components as UtbetalComponents } from '../lib/types/generated/utbetal.ts';
import { startMockHttpServer } from './standaloneServer.ts';
import { getMockBasePath, getMockName, MOCK_SPECS } from './mock-specs.mjs';

const rootDir = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

type UtbetalingsmeldingDto = UtbetalComponents['schemas']['no.nav.aap.utbetal.admin.UtbetalingsmeldingMedStatusDto'];

const mockUtbetalingsmeldinger: UtbetalingsmeldingDto[] = [
  {
    melding: `{
  "type": "UTBETALING",
  "saksnummer": "TEST123",
  "belop": 1250
}`,
    opprettet: '2025-04-01T12:30:00',
    referanse: '11111111-1111-4111-8111-111111111111',
    status: 'MOTTATT',
    utbetalingsmeldingType: 'UTBETALING',
  },
  {
    melding: `{
  "type": "UTBETALING",
  "saksnummer": "TEST123",
  "belop": 1250
}`,
    opprettet: '2025-04-01T12:31:00',
    referanse: '11111111-1111-4111-8111-111111111111',
    status: 'OK',
    utbetalingsmeldingType: 'UTBETALING',
  },
  {
    melding: `{
  "type": "SLETT_AVVENT_PERIODE",
  "saksnummer": "TEST123"
}`,
    opprettet: '2025-04-02T09:15:00',
    referanse: '22222222-2222-4222-8222-222222222222',
    status: 'SENDT',
    utbetalingsmeldingType: 'SLETT_AVVENT_PERIODE',
  },
];

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
  const mockBaseUrl = process.env.MOCK_API_BASE_URL ?? 'http://localhost:8080';

  for (const { spec } of MOCK_SPECS) {
    const mockName = getMockName(spec);
    if (spec === 'utbetal.json') {
      handlers.push(
        http.get(`${mockBaseUrl}${getMockBasePath(spec)}/admin/utbetalingsmelding/status`, () =>
          HttpResponse.json({
            antallPerStatus: {
              IKKE_SENDT: 12,
              SENDT: 8,
              HOS_OPPDRAG: 3,
              UKJENT_STATUS: 1,
            },
          })
        ),
        http.get(`${mockBaseUrl}${getMockBasePath(spec)}/admin/utbetalingsmelding/:saksnummer`, ({ params }) => {
          const saksnummer = String(params.saksnummer).toUpperCase();

          if (saksnummer === 'TOM') return HttpResponse.json([]);
          if (saksnummer === 'FEIL') {
            return HttpResponse.json({ detail: 'Synthetic mock service error' }, { status: 500 });
          }
          if (saksnummer === 'INGENTILGANG') {
            return HttpResponse.json({ detail: 'Synthetic mock access denied' }, { status: 403 });
          }
          if (saksnummer === 'UGYLDIGJSON') {
            return HttpResponse.json([
              {
                ...mockUtbetalingsmeldinger[0],
                melding: '{ invalid synthetic JSON',
              },
            ]);
          }

          return HttpResponse.json(mockUtbetalingsmeldinger);
        })
      );
    }

    const handlersPath = path.join(rootDir, 'mocks', 'generated', mockName, 'handlers.ts');
    if (!existsSync(handlersPath)) {
      console.warn(`[mocks/run] Skipping ${mockName}: no generated handlers found (run yarn mock:generate first).`);
      continue;
    }
    const generated = await import(`./generated/${mockName}/handlers.ts`);
    handlers.push(...generated.handlers);
  }

  startMockHttpServer(portFromBaseUrl(mockBaseUrl), handlers, 'all');
}

startAll();
