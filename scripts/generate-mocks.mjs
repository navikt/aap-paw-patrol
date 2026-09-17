#!/usr/bin/env node
/**
 * Generates MSW mock handlers from the OpenAPI specs in ./openapi using msw-auto-mock.
 *
 * To mock another backend, see mocks/mock-specs.mjs — that's the only place that needs editing.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { MOCK_SPECS } from '../mocks/mock-specs.mjs';

const rootDir = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const openApiDir = path.join(rootDir, 'openapi');
const outputDir = path.join(rootDir, 'mocks', 'generated');

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
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

loadEnvLocal();

// Default max-array-length is intentionally lower than msw-auto-mock's own default (20):
// arrays of near-random OpenAPI-schema-shaped objects get long and hard to skim through when
// testing manually. Override with MOCK_MAX_ARRAY_LENGTH in .env.local if you want longer lists.
const maxArrayLength = process.env.MOCK_MAX_ARRAY_LENGTH ?? '3';

// By default msw-auto-mock generates *dynamic* mocks: every request re-runs faker and returns
// fresh random data. That breaks any flow that round-trips an id from one response into a later
// request/URL (e.g. clicking a behandling sets `?behandlingref=<uuid>` in the URL; reloading that
// URL re-fetches sak-info, which - with dynamic mocks - returns a brand new random `behandlinger`
// list that almost never contains that uuid again, so the page silently shows nothing for it).
// `--static` bakes one fixed faker-generated response into the handlers file at generate time
// instead, so ids/relations stay stable across requests until you rerun `yarn mock:generate`.
// Set MOCK_STATIC=false in .env.local if you specifically want fresh random data per request.
const useStaticMocks = (process.env.MOCK_STATIC ?? 'true') !== 'false';

/**
 * msw-auto-mock emits route patterns containing literal non-ASCII characters taken
 * straight from the OpenAPI paths (e.g. "/drift/api/jobb/sisteKjørte"). MSW matches
 * requests against `Request.url`, and the WHATWG URL/Request implementation *always*
 * percent-encodes non-ASCII path segments (there is no way to get a literal "ø" back
 * out of `url.pathname`), so a pattern containing a raw "ø" can never match a real
 * request. Percent-encode any non-ASCII characters found in the `${baseURL}...`
 * route-pattern template literals so they line up with what incoming requests look like.
 */
function encodeNonAsciiPercent(value) {
  return value.replace(/[^\x00-\x7F]/g, (ch) => encodeURIComponent(ch));
}

function postProcessHandlers(target) {
  const handlersPath = path.join(target, 'handlers.ts');
  if (!existsSync(handlersPath)) return;
  const original = readFileSync(handlersPath, 'utf8');
  const patched = original.replace(/`\$\{baseURL\}([^`]*)`/g, (_match, pathPart) => {
    return '`${baseURL}' + encodeNonAsciiPercent(pathPart) + '`';
  });
  if (patched !== original) {
    writeFileSync(handlersPath, patched, 'utf8');
  }
}

let hadError = false;

for (const { spec, envVar, outDir } of MOCK_SPECS) {
  const specPath = path.join(openApiDir, spec);
  if (!existsSync(specPath)) {
    console.warn(`[mock:generate] Skipping ${spec}: not found in ${openApiDir}`);
    continue;
  }

  const rawBaseUrl = process.env[envVar];
  if (!rawBaseUrl) {
    console.warn(`[mock:generate] Skipping ${spec}: ${envVar} is not set (copy .env-template to .env.local).`);
    continue;
  }
  const baseUrl = rawBaseUrl.replace(/\/+$/, '');
  const target = path.join(outputDir, outDir);
  mkdirSync(target, { recursive: true });

  console.log(`[mock:generate] Generating mocks for ${spec} -> ${path.relative(rootDir, target)} (baseUrl=${baseUrl})`);

  const cliArgs = ['msw-auto-mock', specPath, '-o', target, '--typescript', '--base-url', baseUrl, '-m', maxArrayLength];
  if (useStaticMocks) {
    cliArgs.push('--static');
  }

  const result = spawnSync('yarn', cliArgs, { stdio: 'inherit', cwd: rootDir });

  if (result.status !== 0) {
    hadError = true;
    console.error(`[mock:generate] Failed generating mocks for ${spec}`);
    continue;
  }

  postProcessHandlers(target);
}

if (hadError) {
  process.exit(1);
}
