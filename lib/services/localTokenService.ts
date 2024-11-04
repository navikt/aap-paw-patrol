import { logError } from '@navikt/aap-felles-utils';

export const hentLocalToken = async () => {
  const url = 'http://localhost:8081/token';
  try {
    return fetch(url, { method: 'POST', next: { revalidate: 0 } })
      .then((res) => res.json())
      .then((data) => data?.access_token);
  } catch (err) {
    logError('hentLocalToken feilet', err);
    return Promise.resolve('dummy-token');
  }
};
