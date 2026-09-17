import { logWarning } from '@navikt/aap-felles-utils';

export async function hentLocalToken(scope: string) {
  try {
    const params = new URLSearchParams({
      aud: scope,
      NAVident: 'Z123456',
      groups: 'drift-rolle',
    });

    const url = new URL('https://fakedings.intern.dev.nav.no/fake/aad?' + params.toString());
    const token = await fetch(url, { method: 'POST', next: { revalidate: 0 } });
    return await token.text();
  } catch (err) {
    logWarning('hentLocalToken feilet', err);
    return Promise.resolve('dummy-token');
  }
}
