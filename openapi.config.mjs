export const OPENAPI_PATH_PREFIXES = ['/drift', '/motor', '/api/drift', '/api/motor'];

export const OPENAPI_SPECS = [
  {
    app: 'behandlingsflyt',
    url: 'https://aap-behandlingsflyt.intern.dev.nav.no/openapi.json',
    envVar: 'BEHANDLING_API_BASE_URL',
  },
  {
    app: 'oppgave',
    url: 'https://aap-oppgave.intern.dev.nav.no/openapi.json',
    envVar: 'OPPGAVE_API_BASE_URL',
  },
  {
    app: 'utbetal',
    url: 'https://aap-utbetal.intern.dev.nav.no/openapi.json',
    envVar: 'UTBETAL_API_BASE_URL',
    extraPaths: [
      '/admin/status',
      '/admin/migrering/status',
      '/admin/utbetalingstidslinje/{saksnummer}',
      '/admin/utbetalingsmelding/status',
      '/admin/utbetalingsmelding/{saksnummer}',
      '/migrering',
      '/migrering/sak',
    ],
  },
  {
    app: 'meldekort-backend',
    url: 'https://aap-meldekort-backend.intern.dev.nav.no/openapi.json',
    envVar: 'MELDEKORT_API_BASE_URL',
  },
  {
    app: 'brev',
    url: 'https://aap-brev.intern.dev.nav.no/openapi.json',
    envVar: 'BREV_API_BASE_URL',
  },
  {
    app: 'postmottak',
    url: 'https://aap-postmottak-backend.intern.dev.nav.no/openapi.json',
    envVar: 'POSTMOTTAK_API_BASE_URL',
  },
  {
    app: 'dokumentinnhenting',
    url: 'https://aap-dokumentinnhenting.intern.dev.nav.no/openapi.json',
    envVar: 'DOKUMENTINNHENTING_API_BASE_URL',
  },
  {
    app: 'statistikk',
    url: 'https://aap-statistikk.intern.dev.nav.no/openapi.json',
    envVar: 'STATISTIKK_API_BASE_URL',
  },
  {
    app: 'api-intern',
    url: 'https://aap-api.intern.dev.nav.no/openapi.json',
    envVar: 'API_INTERN_BASE_URL',
    extraPaths: ['/kelvin/dsop/vedtak-test', '/maksimumUtenUtbetaling'],
  },
].map((config) => ({ ...config, spec: `${config.app}.json` }));

export const getMockName = (spec) => {
  const name = spec.replace(/\.(?:json|ya?ml)$/i, '');
  if (name === spec) {
    throw new Error(`Unsupported OpenAPI spec extension: ${spec}`);
  }
  return name;
};

export const getMockBasePath = (spec) => `/${getMockName(spec)}`;
