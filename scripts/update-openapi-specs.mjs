#!/usr/bin/env node
/**
 * Downloads the newest openapi.json files for the backends this app talks
 * to, and writes them to ./openapi/<app>.json. See README.md for usage.
 */
import { writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const openApiDir = path.join(rootDir, 'openapi');

const SPECS = [
  { app: 'behandlingsflyt', url: 'https://aap-behandlingsflyt.intern.dev.nav.no/openapi.json' },
  { app: 'utbetal', url: 'https://aap-utbetal.intern.dev.nav.no/openapi.json' },
  { app: 'oppgave', url: 'https://aap-oppgave.intern.dev.nav.no/openapi.json' },
  { app: 'brev', url: 'https://aap-brev.intern.dev.nav.no/openapi.json' },
  {
    app: 'meldekort-backend',
    url: 'https://aap-meldekort-backend.intern.dev.nav.no/openapi.json',
  },
  { app: 'postmottak', url: 'https://aap-postmottak-backend.intern.dev.nav.no/openapi.json' },
];

async function downloadSpec({ app, url }) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Klarte ikke å hente ${url}: ${res.status} ${res.statusText}`);
  }
  const body = await res.text();
  // Validate + pretty-print so diffs stay readable.
  const json = JSON.parse(body);
  const outPath = path.join(openApiDir, `${app}.json`);
  writeFileSync(outPath, `${JSON.stringify(json, null, 2)}\n`);
  console.log(`✔ ${app} -> ${path.relative(rootDir, outPath)}`);
}

async function main() {
  const results = await Promise.allSettled(SPECS.map(downloadSpec));

  const failures = results.filter((r) => r.status === 'rejected');
  for (const failure of failures) {
    console.error(`✘ ${failure.reason.message}`);
  }
  if (failures.length > 0) {
    process.exit(1);
  }

  // Regenerate the TypeScript types derived from the specs so they stay in sync.
  const typesResult = spawnSync('node', [path.join(rootDir, 'scripts', 'generate-openapi-types.mjs')], {
    stdio: 'inherit',
    cwd: rootDir,
  });
  if (typesResult.status !== 0) {
    process.exit(typesResult.status ?? 1);
  }
}

main();
