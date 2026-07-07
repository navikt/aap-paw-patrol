import { AppNavn } from 'lib/services/driftService';

export function kjørJobb(appNavn: AppNavn, jobbId: number) {
  return fetch(`/api/drift/jobber/${appNavn}/jobb/${jobbId}/kjor`, { method: 'POST' });
}

export function rekjørJobb(appNavn: AppNavn, jobbId: number) {
  return fetch(`/api/drift/jobber/${appNavn}/jobb/rekjor/${jobbId}`, { method: 'GET' });
}

export function rekjørFeiledeJobber(appNavn: AppNavn) {
  return fetch(`/api/drift/jobber/${appNavn}/jobb/rekjorfeilede`, { method: 'GET' });
}

export function avbrytAlleFeiledeJobber(appNavn: AppNavn) {
  return fetch(`/api/drift/jobber/${appNavn}/jobb/avbrytfeilede`, { method: 'GET' });
}

export function avbrytKjørendeJobb(appNavn: AppNavn, jobbId: number) {
  return fetch(`/api/drift/jobber/${appNavn}/jobb/avbryt/${jobbId}`, { method: 'GET' });
}

export function kjørFraSteg(behandlingsreferanse: string, steg: string) {
  return fetch(`/api/drift/behandling/${behandlingsreferanse}/kjorfrasteg/`, {
    method: 'POST',
    body: JSON.stringify({ steg }),
  });
}

export function prosesserBehandling(behandlingsreferanse: string, skalForberede: Boolean) {
  return fetch(`/api/drift/behandling/${behandlingsreferanse}/prosesser/`, {
    method: 'POST',
    body: JSON.stringify({ skalForberede }),
  });
}

export function utvidRettighetsperiodeOgKjørFraStart(behandlingsreferanse: string) {
  return fetch(`/api/drift/behandling/${behandlingsreferanse}/utvidrettighetsperiode-og-kjorfrastart/`, {
    method: 'POST',
  });
}

export function avbrytBrev(bestillingsreferanse: string, begrunnelse: string) {
  return fetch(`/api/drift/brev/${bestillingsreferanse}/avbryt/`, {
    method: 'POST',
    body: JSON.stringify({ begrunnelse }),
  });
}

export function oppdaterPersonIdenter(saksnummer: string) {
  return fetch(`/api/drift/sak/${saksnummer}/oppdater-person-identer`, {
    method: 'POST',
  });
}

export function oppdaterMeldeperioder(saksnummer: string) {
  return fetch(`/api/drift/sak/${saksnummer}/oppdater-meldeperioder`, {
    method: 'POST',
  });
}

export function hentDsopVedtak(personIdent: string, fomDato: string, tomDato: string) {
  return fetch(`/api/drift/api-intern/dsop-vedtak`, {
    method: 'POST',
    body: JSON.stringify({ personIdent, fomDato, tomDato }),
  });
}

export function hentMaksimumUtenUtbetaling(personidentifikator: string, fraOgMedDato: string, tilOgMedDato: string) {
  return fetch(`/api/drift/api-intern/maksimumUtenUtbetaling`, {
    method: 'POST',
    body: JSON.stringify({ personidentifikator, fraOgMedDato, tilOgMedDato }),
  });
}

export function hentSakDriftsinfo(saksnummer: string) {
  return fetch(`/api/drift/sak/${saksnummer}/info`, {
    method: 'POST',
  });
}

export function hentMottatteDokumenter(saksnummer: string) {
  return fetch(`/api/drift/sak/${saksnummer}/mottatte-dokumenter`, {
    method: 'POST',
  });
}

export function hentMeldekortDriftsinfo(saksnummer: string) {
  return fetch(`/api/drift/sak/${saksnummer}/meldekort`, {
    method: 'POST',
  });
}

export function hentVilkår(behandlingsreferanse: string) {
  return fetch(`/api/drift/behandling/${behandlingsreferanse}/vilkar`, {
    method: 'POST',
  });
}

export function hentRettighetsinfo(behandlingsreferanse: string) {
  return fetch(`/api/drift/behandling/${behandlingsreferanse}/rettighetsinfo`, {
    method: 'POST',
  });
}

export function hentTilkjentYtelse(behandlingsreferanse: string) {
  return fetch(`/api/drift/behandling/${behandlingsreferanse}/tilkjent-ytelse`, {
    method: 'POST',
  });
}

export function hentTidligereVurderinger(behandlingsreferanse: string, førSteg?: string, etterSteg?: string) {
  const params = new URLSearchParams();
  if (førSteg) params.set('førSteg', førSteg);
  if (etterSteg) params.set('etterSteg', etterSteg);
  const query = params.size > 0 ? `?${params.toString()}` : '';
  return fetch(`/api/drift/behandling/${behandlingsreferanse}/tidligere-vurderinger${query}`, { method: 'GET' });
}

export function hentOppgaver(behandlingsreferanse: string) {
  return fetch(`/api/drift/oppgave/behandling/${behandlingsreferanse}`, {
    method: 'POST',
  });
}

export function triggProsesserbehandlingIPostmottak(referanse: string) {
  return fetch(`/api/drift/postmottak/${referanse}/prosesser`, { method: 'POST', body: JSON.stringify({}) });
}

export function hentJournalpostInfo(journalpostId: string) {
  return fetch(`/api/drift/postmottak/${journalpostId}/info`, { method: 'GET' });
}

export function hentBehandler(saksnummer: string, fritekst: string) {
  return fetch(`/api/drift/dokumentinnhenting/syfo/behandleroppslag/search`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ saksnummer, fritekst }),
  });
}

export function hentDialogmeldinger(saksnummer: string) {
  return fetch(`/api/drift/dokumentinnhenting/sak/${saksnummer}/dialogmelding`, {
    method: 'POST',
  });
}

export function hentOppgavefiltre() {
  return fetch(`/api/drift/oppgave/filter`, { method: 'GET' });
}

export function lagreOppgavefilter(request: object) {
  return fetch(`/api/drift/oppgave/filter`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });
}

export function slettOppgavefilter(id: number) {
  return fetch(`/api/drift/oppgave/filter/slett`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id }),
  });
}

export function hentBrevbestillingerForSak(saksnummer: string) {
  return fetch(`/api/drift/brev/bestillinger/sak/${saksnummer}`, { method: 'GET' });
}

export function hentBrevbestillingerForBehandling(behandlingReferanse: string) {
  return fetch(`/api/drift/brev/bestillinger/behandling/${behandlingReferanse}`, { method: 'GET' });
}
