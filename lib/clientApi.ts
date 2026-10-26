import { AppNavn } from 'lib/services/driftService';
import type { paths as ApiInternPaths } from 'lib/types/generated/api-intern';
import type { paths as BehandlingsflytPaths } from 'lib/types/generated/behandlingsflyt';
import type { paths as BrevPaths } from 'lib/types/generated/brev';
import type { paths as DokumentinnhentingPaths } from 'lib/types/generated/dokumentinnhenting';
import type { paths as MeldekortBackendPaths } from 'lib/types/generated/meldekort-backend';
import type { paths as OppgavePaths } from 'lib/types/generated/oppgave';
import type { paths as PostmottakPaths } from 'lib/types/generated/postmottak';
import type { paths as StatistikkPaths } from 'lib/types/generated/statistikk';
import type { paths as UtbetalPaths } from 'lib/types/generated/utbetal';

type OpenApiResponse<Operation> = Operation extends { responses: { 200: { content: infer Content } } }
  ? Content extends { 'application/json': infer Body }
    ? Body
    : undefined
  : undefined;

type TypedFetchResponse<Operation> = Omit<Response, 'json'> & {
  json(): Promise<OpenApiResponse<Operation>>;
};

type FetchResult<Operation> = Promise<TypedFetchResponse<Operation>>;

export type FetchJsonBody<FetchPromise> =
  FetchPromise extends Promise<infer FetchResponse>
    ? FetchResponse extends { json(): Promise<infer Body> }
      ? Body
      : never
    : never;

export type FetchJsonItem<FetchPromise> = FetchJsonBody<FetchPromise> extends (infer Item)[] ? Item : never;

function fetchTyped<Operation>(input: RequestInfo | URL, init?: RequestInit): FetchResult<Operation> {
  return fetch(input, init) as FetchResult<Operation>;
}

export function kjørJobb(
  appNavn: AppNavn,
  jobbId: number
): FetchResult<StatistikkPaths['/drift/api/jobb/{jobbId}/kjor']['post']> {
  return fetchTyped<StatistikkPaths['/drift/api/jobb/{jobbId}/kjor']['post']>(
    `/api/drift/jobber/${appNavn}/jobb/${jobbId}/kjor`,
    { method: 'POST' }
  );
}

export function rekjørJobb(
  appNavn: AppNavn,
  jobbId: number
): FetchResult<StatistikkPaths['/drift/api/jobb/rekjor/{jobbId}']['get']> {
  return fetchTyped<StatistikkPaths['/drift/api/jobb/rekjor/{jobbId}']['get']>(
    `/api/drift/jobber/${appNavn}/jobb/rekjor/${jobbId}`,
    { method: 'GET' }
  );
}

export function rekjørFeiledeJobber(
  appNavn: AppNavn
): FetchResult<StatistikkPaths['/drift/api/jobb/rekjorAlleFeilede']['get']> {
  return fetchTyped<StatistikkPaths['/drift/api/jobb/rekjorAlleFeilede']['get']>(
    `/api/drift/jobber/${appNavn}/jobb/rekjorfeilede`,
    { method: 'GET' }
  );
}

export function avbrytAlleFeiledeJobber(
  appNavn: AppNavn
): FetchResult<StatistikkPaths['/drift/api/jobb/avbrytAlleFeilede']['get']> {
  return fetchTyped<StatistikkPaths['/drift/api/jobb/avbrytAlleFeilede']['get']>(
    `/api/drift/jobber/${appNavn}/jobb/avbrytfeilede`,
    { method: 'GET' }
  );
}

export function avbrytKjørendeJobb(
  appNavn: AppNavn,
  jobbId: number,
  begrunnelse: string
): FetchResult<StatistikkPaths['/drift/api/jobb/avbryt/{jobbId}']['post']> {
  return fetchTyped<StatistikkPaths['/drift/api/jobb/avbryt/{jobbId}']['post']>(
    `/api/drift/jobber/${appNavn}/jobb/avbryt/${jobbId}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ begrunnelse }),
    }
  );
}

export function leggTilKommentar(
  appNavn: AppNavn,
  jobbId: number,
  kommentar: string
): FetchResult<StatistikkPaths['/drift/api/jobb/{jobbId}/leggTilKommentar']['post']> {
  return fetchTyped<StatistikkPaths['/drift/api/jobb/{jobbId}/leggTilKommentar']['post']>(
    `/api/drift/jobber/${appNavn}/jobb/${jobbId}/leggTilKommentar`,
    {
      method: 'POST',
      body: JSON.stringify({ kommentar }),
    }
  );
}

export function kjørFraSteg(
  behandlingsreferanse: string,
  steg: string
): FetchResult<BehandlingsflytPaths['/api/drift/behandling/{referanse}/kjor-fra-steg']['post']> {
  return fetchTyped<BehandlingsflytPaths['/api/drift/behandling/{referanse}/kjor-fra-steg']['post']>(
    `/api/drift/behandling/${behandlingsreferanse}/kjorfrasteg/`,
    {
      method: 'POST',
      body: JSON.stringify({ steg }),
    }
  );
}

export function prosesserBehandling(
  behandlingsreferanse: string,
  skalForberede: boolean
): FetchResult<BehandlingsflytPaths['/api/drift/behandling/{referanse}/prosesser']['post']> {
  return fetchTyped<BehandlingsflytPaths['/api/drift/behandling/{referanse}/prosesser']['post']>(
    `/api/drift/behandling/${behandlingsreferanse}/prosesser/`,
    {
      method: 'POST',
      body: JSON.stringify({ skalForberede }),
    }
  );
}

export function utvidRettighetsperiodeOgKjørFraStart(
  behandlingsreferanse: string
): FetchResult<
  BehandlingsflytPaths['/api/drift/behandling/{referanse}/utvid-rettighetsperiode-og-kjor-fra-start']['post']
> {
  return fetchTyped<
    BehandlingsflytPaths['/api/drift/behandling/{referanse}/utvid-rettighetsperiode-og-kjor-fra-start']['post']
  >(`/api/drift/behandling/${behandlingsreferanse}/utvidrettighetsperiode-og-kjorfrastart/`, { method: 'POST' });
}

export function avbrytBrev(
  bestillingsreferanse: string,
  begrunnelse: string
): FetchResult<BehandlingsflytPaths['/api/drift/brev/{brevbestillingReferanse}/avbryt']['post']> {
  return fetchTyped<BehandlingsflytPaths['/api/drift/brev/{brevbestillingReferanse}/avbryt']['post']>(
    `/api/drift/brev/${bestillingsreferanse}/avbryt/`,
    {
      method: 'POST',
      body: JSON.stringify({ begrunnelse }),
    }
  );
}

export function oppdaterPersonIdenter(
  saksnummer: string
): FetchResult<BehandlingsflytPaths['/api/drift/sak/{saksnummer}/oppdater-person-identer']['post']> {
  return fetchTyped<BehandlingsflytPaths['/api/drift/sak/{saksnummer}/oppdater-person-identer']['post']>(
    `/api/drift/sak/${saksnummer}/oppdater-person-identer`,
    { method: 'POST' }
  );
}

export function tilbakestillRettighetsperiodeForTrukketSak(
  saksnummer: string
): FetchResult<BehandlingsflytPaths['/api/drift/sak/{saksnummer}/tilbakestill-rettighetsperiode-trukket-sak']['post']> {
  return fetchTyped<
    BehandlingsflytPaths['/api/drift/sak/{saksnummer}/tilbakestill-rettighetsperiode-trukket-sak']['post']
  >(`/api/drift/sak/${saksnummer}/tilbakestill-rettighetsperiode-trukket-sak`, { method: 'POST' });
}

export function oppdaterMeldeperioder(
  saksnummer: string
): FetchResult<BehandlingsflytPaths['/api/drift/sak/{saksnummer}/oppdater-meldeperioder']['post']> {
  return fetchTyped<BehandlingsflytPaths['/api/drift/sak/{saksnummer}/oppdater-meldeperioder']['post']>(
    `/api/drift/sak/${saksnummer}/oppdater-meldeperioder`,
    { method: 'POST' }
  );
}

export function hentDsopVedtak(
  personIdent: string,
  fomDato: string,
  tomDato: string
): FetchResult<ApiInternPaths['/kelvin/dsop/vedtak-test']['post']> {
  return fetchTyped<ApiInternPaths['/kelvin/dsop/vedtak-test']['post']>(`/api/drift/api-intern/dsop-vedtak`, {
    method: 'POST',
    body: JSON.stringify({ personIdent, fomDato, tomDato }),
  });
}

export function hentMaksimumUtenUtbetaling(
  personidentifikator: string,
  fraOgMedDato: string,
  tilOgMedDato: string
): FetchResult<ApiInternPaths['/maksimumUtenUtbetaling']['post']> {
  return fetchTyped<ApiInternPaths['/maksimumUtenUtbetaling']['post']>(`/api/drift/api-intern/maksimumUtenUtbetaling`, {
    method: 'POST',
    body: JSON.stringify({ personidentifikator, fraOgMedDato, tilOgMedDato }),
  });
}

export function hentSakDriftsinfo(
  saksnummer: string
): FetchResult<BehandlingsflytPaths['/api/drift/sak/{saksnummer}/info']['post']> {
  return fetchTyped<BehandlingsflytPaths['/api/drift/sak/{saksnummer}/info']['post']>(
    `/api/drift/sak/${saksnummer}/info`,
    { method: 'POST' }
  );
}

export function hentMottatteDokumenter(
  saksnummer: string
): FetchResult<BehandlingsflytPaths['/api/drift/sak/{saksnummer}/mottatte-dokumenter']['post']> {
  return fetchTyped<BehandlingsflytPaths['/api/drift/sak/{saksnummer}/mottatte-dokumenter']['post']>(
    `/api/drift/sak/${saksnummer}/mottatte-dokumenter`,
    { method: 'POST' }
  );
}

export function hentMeldekortDriftsinfo(
  saksnummer: string
): FetchResult<MeldekortBackendPaths['/api/drift/sak/{saksnummer}/meldekort']['get']> {
  return fetchTyped<MeldekortBackendPaths['/api/drift/sak/{saksnummer}/meldekort']['get']>(
    `/api/drift/sak/${saksnummer}/meldekort`,
    { method: 'POST' }
  );
}

export function hentVilkår(
  behandlingsreferanse: string
): FetchResult<BehandlingsflytPaths['/api/drift/behandling/{referanse}/vilkår']['post']> {
  return fetchTyped<BehandlingsflytPaths['/api/drift/behandling/{referanse}/vilkår']['post']>(
    `/api/drift/behandling/${behandlingsreferanse}/vilkar`,
    { method: 'POST' }
  );
}

export function hentRettighetsinfo(
  behandlingsreferanse: string
): FetchResult<BehandlingsflytPaths['/api/drift/behandling/{referanse}/rettighetsinfo']['post']> {
  return fetchTyped<BehandlingsflytPaths['/api/drift/behandling/{referanse}/rettighetsinfo']['post']>(
    `/api/drift/behandling/${behandlingsreferanse}/rettighetsinfo`,
    { method: 'POST' }
  );
}

export function hentKravOgStønadsperiode(
  behandlingsreferanse: string
): FetchResult<BehandlingsflytPaths['/api/drift/behandling/{referanse}/krav']['post']> {
  return fetchTyped<BehandlingsflytPaths['/api/drift/behandling/{referanse}/krav']['post']>(
    `/api/drift/behandling/${behandlingsreferanse}/krav`,
    { method: 'POST' }
  );
}

export function hentTilkjentYtelse(
  behandlingsreferanse: string
): FetchResult<BehandlingsflytPaths['/api/drift/behandling/{referanse}/tilkjent-ytelse']['post']> {
  return fetchTyped<BehandlingsflytPaths['/api/drift/behandling/{referanse}/tilkjent-ytelse']['post']>(
    `/api/drift/behandling/${behandlingsreferanse}/tilkjent-ytelse`,
    { method: 'POST' }
  );
}

export function hentYrkesskader(
  behandlingsreferanse: string
): FetchResult<BehandlingsflytPaths['/api/drift/behandling/{referanse}/yrkesskade']['get']> {
  return fetchTyped<BehandlingsflytPaths['/api/drift/behandling/{referanse}/yrkesskade']['get']>(
    `/api/drift/behandling/${behandlingsreferanse}/yrkesskade`,
    { method: 'GET' }
  );
}

export function hentTidligereVurderinger(
  behandlingsreferanse: string,
  førSteg: string,
  etterSteg: string
): FetchResult<BehandlingsflytPaths['/api/drift/behandling/{referanse}/tidligere-vurderinger']['get']> {
  const params = new URLSearchParams();
  if (førSteg) params.set('førSteg', førSteg);
  if (etterSteg) params.set('etterSteg', etterSteg);
  const query = params.size > 0 ? `?${params.toString()}` : '';
  return fetchTyped<BehandlingsflytPaths['/api/drift/behandling/{referanse}/tidligere-vurderinger']['get']>(
    `/api/drift/behandling/${behandlingsreferanse}/tidligere-vurderinger${query}`,
    { method: 'GET' }
  );
}

export function hentOppgaver(
  behandlingsreferanse: string
): FetchResult<OppgavePaths['/api/drift/oppgave/behandling/{referanse}']['post']> {
  return fetchTyped<OppgavePaths['/api/drift/oppgave/behandling/{referanse}']['post']>(
    `/api/drift/oppgave/behandling/${behandlingsreferanse}`,
    { method: 'POST' }
  );
}

export function triggProsesserbehandlingIPostmottak(
  referanse: string
): FetchResult<PostmottakPaths['/api/drift/behandling/{referanse}/prosesser']['post']> {
  return fetchTyped<PostmottakPaths['/api/drift/behandling/{referanse}/prosesser']['post']>(
    `/api/drift/postmottak/${referanse}/prosesser`,
    { method: 'POST', body: JSON.stringify({}) }
  );
}

export function hentJournalpostInfo(
  journalpostId: string
): FetchResult<PostmottakPaths['/api/drift/journalpost/{referanse}/info']['get']> {
  return fetchTyped<PostmottakPaths['/api/drift/journalpost/{referanse}/info']['get']>(
    `/api/drift/postmottak/${journalpostId}/info`,
    { method: 'GET' }
  );
}

export function kopierJournalpost(
  journalpostId: string
): FetchResult<PostmottakPaths['/api/drift/journalpost/{referanse}/kopier-journalpost']['post']> {
  return fetchTyped<PostmottakPaths['/api/drift/journalpost/{referanse}/kopier-journalpost']['post']>(
    `/api/drift/postmottak/${journalpostId}/kopier-journalpost`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }
  );
}

export function hentJournalposterForPerson(
  ident: string
): FetchResult<PostmottakPaths['/api/drift/person/journalposter/søk']['post']> {
  return fetchTyped<PostmottakPaths['/api/drift/person/journalposter/søk']['post']>(`/api/drift/person/journalposter`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ident }),
  });
}

export function hentBehandler(
  saksnummer: string,
  fritekst: string
): FetchResult<DokumentinnhentingPaths['/drift/api/syfo/behandleroppslag/search']['post']> {
  return fetchTyped<DokumentinnhentingPaths['/drift/api/syfo/behandleroppslag/search']['post']>(
    `/api/drift/dokumentinnhenting/syfo/behandleroppslag/search`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ saksnummer, fritekst }),
    }
  );
}

export function hentDialogmeldinger(
  saksnummer: string
): FetchResult<DokumentinnhentingPaths['/drift/api/sak/{saksnummer}/dialogmelding']['post']> {
  return fetchTyped<DokumentinnhentingPaths['/drift/api/sak/{saksnummer}/dialogmelding']['post']>(
    `/api/drift/dokumentinnhenting/sak/${saksnummer}/dialogmelding`,
    { method: 'POST' }
  );
}

export function hentOppgavefiltre(): FetchResult<OppgavePaths['/api/drift/filter']['get']> {
  return fetchTyped<OppgavePaths['/api/drift/filter']['get']>(`/api/drift/oppgave/filter`, { method: 'GET' });
}

export function hentUtbetalingStatus(): FetchResult<UtbetalPaths['/admin/status']['get']> {
  return fetchTyped<UtbetalPaths['/admin/status']['get']>(`/api/drift/utbetaling/feilstatus`, { method: 'GET' });
}

export function hentMigreringsStatus(): FetchResult<UtbetalPaths['/admin/migrering/status']['get']> {
  return fetchTyped<UtbetalPaths['/admin/migrering/status']['get']>(`/api/drift/utbetaling/migrering`, {
    method: 'GET',
  });
}

export function startMigreringAntall(
  maxAntall: number,
  dryRun: boolean
): FetchResult<UtbetalPaths['/migrering']['post']> {
  return fetchTyped<UtbetalPaths['/migrering']['post']>(`/api/drift/utbetal/migrer/antall`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ maxAntall, dryRun }),
  });
}

export function startMigreringEnkeltSak(
  saksnummer: string,
  dryRun: boolean
): FetchResult<UtbetalPaths['/migrering/sak']['post']> {
  return fetchTyped<UtbetalPaths['/migrering/sak']['post']>(`/api/drift/utbetal/migrer/sak`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ saksnummer, dryRun }),
  });
}

export function hentUtbetalingstidslinje(
  saksnummer: string
): FetchResult<UtbetalPaths['/admin/utbetalingstidslinje/{saksnummer}']['get']> {
  return fetchTyped<UtbetalPaths['/admin/utbetalingstidslinje/{saksnummer}']['get']>(
    `/api/drift/utbetaling/tidslinje/${saksnummer}`,
    { method: 'GET' }
  );
}

export function lagreOppgavefilter(
  request: NonNullable<OppgavePaths['/api/drift/filter']['post']['requestBody']>['content']['application/json']
): FetchResult<OppgavePaths['/api/drift/filter']['post']> {
  return fetchTyped<OppgavePaths['/api/drift/filter']['post']>(`/api/drift/oppgave/filter`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });
}

export function slettOppgavefilter(id: number): FetchResult<OppgavePaths['/api/drift/filter/slett']['post']> {
  return fetchTyped<OppgavePaths['/api/drift/filter/slett']['post']>(`/api/drift/oppgave/filter/slett`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id }),
  });
}

export function hentBrevbestillingerForSak(
  saksnummer: string
): FetchResult<BrevPaths['/api/drift/bestillinger/sak/{saksnummer}']['get']> {
  return fetchTyped<BrevPaths['/api/drift/bestillinger/sak/{saksnummer}']['get']>(
    `/api/drift/brev/bestillinger/sak/${saksnummer}`,
    { method: 'GET' }
  );
}

export function hentBrevbestillingerForBehandling(
  behandlingReferanse: string
): FetchResult<BrevPaths['/api/drift/bestillinger/behandling/{referanse}']['get']> {
  return fetchTyped<BrevPaths['/api/drift/bestillinger/behandling/{referanse}']['get']>(
    `/api/drift/brev/bestillinger/behandling/${behandlingReferanse}`,
    { method: 'GET' }
  );
}
