import { logError } from '@navikt/aap-felles-utils';

export const hentLocalToken = async (scope?: string) => {
  const port = scope === process.env.POSTMOTTAK_API_SCOPE ? 8071 : 8081;
  const url = `http://localhost:${port}/token`;
  try {
    return fetch(url, { method: 'POST', next: { revalidate: 0 } })
      .then((res) => res.json())
      .then((data) => data?.access_token);
  } catch (err) {
    logError('hentLocalToken feilet', err);
    return Promise.resolve('dummy-token');
  }
};  
