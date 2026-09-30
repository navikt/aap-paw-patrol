/**
 * Single source of truth for which backends get faked locally via `yarn dev:mock`.
 *
 * To mock a new backend:
 *   1. Drop its OpenAPI spec into ./openapi/<name>.json (or .yaml).
 *   2. Add one entry below with its API base URL environment variable.
 * Both mock generation and the single standalone server use this list.
 */
export const getMockName = (spec) => {
  const name = spec.replace(/\.(?:json|ya?ml)$/i, '');
  if (name === spec) {
    throw new Error(`Unsupported OpenAPI spec extension: ${spec}`);
  }
  return name;
};

export const getMockBasePath = (spec) => `/${getMockName(spec)}`;

export const MOCK_SPECS = [
  { spec: 'behandlingsflyt.json', envVar: 'BEHANDLING_API_BASE_URL' },
  { spec: 'oppgave.json', envVar: 'OPPGAVE_API_BASE_URL' },
  { spec: 'utbetal.json', envVar: 'UTBETAL_API_BASE_URL' },
  { spec: 'meldekort-backend.json', envVar: 'MELDEKORT_API_BASE_URL' },
  { spec: 'brev.json', envVar: 'BREV_API_BASE_URL' },
  { spec: 'postmottak.json', envVar: 'POSTMOTTAK_API_BASE_URL' },
  { spec: 'dokumentinnhenting.json', envVar: 'DOKUMENTINNHENTING_API_BASE_URL' },
  { spec: 'statistikk.json', envVar: 'STATISTIKK_API_BASE_URL' },
  { spec: 'api-intern.json', envVar: 'API_INTERN_BASE_URL' },
];
