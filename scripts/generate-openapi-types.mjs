#!/usr/bin/env node
/**
 * Generates TypeScript types from the OpenAPI specs in ./openapi using openapi-typescript,
 * and writes them to ./lib/types/generated/<app>.ts.
 *
 * Run standalone with `yarn openapi:types`, or via `yarn openapi:update`, which runs this
 * automatically after refreshing the specs.
 */
import { readdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const openApiDir = path.join(rootDir, 'openapi');
const outputDir = path.join(rootDir, 'lib', 'types', 'generated');

const specs = readdirSync(openApiDir).filter((file) => file.endsWith('.json') || file.endsWith('.yaml'));

let hadError = false;

for (const spec of specs) {
  const specPath = path.join(openApiDir, spec);
  const app = spec.replace(/\.(json|yaml)$/, '');
  const outPath = path.join(outputDir, `${app}.ts`);

  console.log(`[openapi:types] Generating types for ${spec} -> ${path.relative(rootDir, outPath)}`);

  const result = spawnSync('yarn', ['openapi-typescript', specPath, '-o', outPath], {
    stdio: 'inherit',
    cwd: rootDir,
  });

  if (result.status !== 0) {
    hadError = true;
    console.error(`[openapi:types] Failed generating types for ${spec}`);
  }
}

if (hadError) {
  process.exit(1);
}
