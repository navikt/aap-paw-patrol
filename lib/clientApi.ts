import { AppNavn } from 'lib/services/driftService';

async function fetchProxy<ResponseBody>(
  url: string,
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
  body?: object
): Promise<ResponseBody | undefined> {
  try {
    const res = await fetch(url, {
      method,
      body: body && JSON.stringify(body),
    });

    const data = await res.json();

    if (res.ok) {
      return data;
    } else {
      console.error(data.message);
      return undefined;
    }
  } catch (e) {
    throw new Error('Noe gikk galt.');
  }
}

export function rekjørJobb(appNavn: AppNavn, jobbId: number) {
  return fetch(`/api/drift/${appNavn}/jobb/rekjor/${jobbId}`, { method: 'GET' });
}

export function rekjørFeiledeJobber(appNavn: AppNavn) {
  return fetch('/api/drift/${appNavn}/jobb/rekjorfeilede', { method: 'GET' });
}

export function avbrytKjørendeJobb(appNavn: AppNavn, jobbId: number) {
  return fetch(`/api/drift/${appNavn}/jobb/avbryt/${jobbId}`, { method: 'GET' });
}
