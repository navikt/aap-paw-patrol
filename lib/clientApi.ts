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

export function avbrytKjørendeJobb(appNavn: AppNavn, jobbId: number) {
  return fetch(`/api/drift/jobber/${appNavn}/jobb/avbryt/${jobbId}`, { method: 'GET' });
}

export function kjørFraSteg(behandlingsreferanse: string, steg: string) {
  return fetch(`/api/drift/behandling/${behandlingsreferanse}/kjorfrasteg/`, {
    method: 'POST',
    body: JSON.stringify({ steg }),
  });
}

export function avbrytBrev(bestillingsreferanse: string, begrunnelse: string) {
  return fetch(`/api/drift/brev/${bestillingsreferanse}/avbryt/`, {
    method: 'POST',
    body: JSON.stringify({ begrunnelse }),
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

export function hentVilkår(behandlingsreferanse: string) {
  return fetch(`/api/drift/behandling/${behandlingsreferanse}/vilkar`, {
    method: 'POST',
  });
}

export function hentOppgaver(behandlingsreferanse: string) {
  return fetch(`/api/drift/oppgave/behandling/${behandlingsreferanse}`, {
    method: 'POST',
  });
}

export function triggProsesserbehandlingIPostmottak(referanse: string) {
  return fetch(`/api/drift/postmottak/${referanse}/prosesser`, { method: 'POST', body: JSON.stringify({}) });
}
