/**
 * Single source of truth for which backends get faked locally via `yarn dev:mock`.
 *
 * To mock a new backend:
 *   1. Drop its OpenAPI spec into ./openapi/<name>.json (or .yaml).
 *   2. Add one entry below. `envVar` must match the `*_API_BASE_URL` env var used for that
 *      backend in lib/services/driftService.ts -> getBaseUrlAndScopeForApp (and .env-template).
 * That's it — both `yarn mock:generate` (scripts/generate-mocks.mjs) and the standalone mock
 * HTTP servers (mocks/run.ts) read from this same list, so there's nothing else to wire up.
 */
export const MOCK_SPECS = [
  { spec: 'behandlingsflyt.json', envVar: 'BEHANDLING_API_BASE_URL', outDir: 'behandlingsflyt' },
  { spec: 'oppgave.json', envVar: 'OPPGAVE_API_BASE_URL', outDir: 'oppgave' },
  { spec: 'utbetal.json', envVar: 'UTBETAL_API_BASE_URL', outDir: 'utbetal' },
    { spec: 'meldekort-backend.json', envVar: 'MELDEKORT_API_BASE_URL', outDir: 'meldekort-backend' },        
];
