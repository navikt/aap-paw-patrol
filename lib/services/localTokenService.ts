import { logError } from '@navikt/aap-felles-utils';

export async function hentLocalToken(scope: string) {
  try {
    const params = new URLSearchParams({
      aud: scope,
      NAVident: 'Z123456',
    });

    const url = new URL('https://fakedings.intern.dev.nav.no/fake/aad?' + params.toString());
    return fetch(url, { method: 'POST', next: { revalidate: 0 } }).then((token) => token.text());
  } catch (err) {
    logError('hentLocalToken feilet', err);
    return Promise.resolve('dummy-token');
  }
}
