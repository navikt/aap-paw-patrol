import { logWarning } from '@navikt/aap-felles-utils';
import { hentFeilmelding } from 'lib/utils/feil';

export function opprettFeilrespons(feil: unknown): Response {
  logWarning('Kall til drift-API feilet', feil);
  return new Response(hentFeilmelding(feil), { status: 500 });
}
