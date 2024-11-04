import { AppNavn } from 'lib/services/driftService';

export function rekjørJobb(appNavn: AppNavn, jobbId: number) {
  return fetch(`/api/drift/${appNavn}/jobb/rekjor/${jobbId}`, { method: 'GET' });
}

export function rekjørFeiledeJobber(appNavn: AppNavn) {
  return fetch(`/api/drift/${appNavn}/jobb/rekjorfeilede`, { method: 'GET' });
}

export function avbrytKjørendeJobb(appNavn: AppNavn, jobbId: number) {
  return fetch(`/api/drift/${appNavn}/jobb/avbryt/${jobbId}`, { method: 'GET' });
}
