import { isLocal, logWarning } from '@navikt/aap-felles-utils';
import { getToken } from '@navikt/oasis';
import { harLeseTilgang, hentRollerForBruker } from 'lib/azure/azureUserService';
import { hentUtbetalingsmeldinger } from 'lib/services/driftService';
import { ProxyError } from 'lib/services/fetchProxy';
import { normaliserSaksnummer } from 'lib/utils/formatting';
import { headers } from 'next/headers';
import { unstable_rethrow } from 'next/navigation';
import { NextRequest, NextResponse } from 'next/server';

const responseHeaders = { 'Cache-Control': 'no-store' };

function feilrespons(status: number, detail: string) {
  return NextResponse.json(
    { type: 'about:blank', title: 'Kunne ikke hente utbetalingsmeldinger', status, detail },
    { status, headers: { ...responseHeaders, 'Content-Type': 'application/problem+json' } }
  );
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ saksnummer: string }> }) {
  try {
    if (!isLocal() && !getToken(await headers())) {
      return feilrespons(401, 'Du må logge inn for å hente utbetalingsmeldinger.');
    }

    let roller;
    try {
      roller = await hentRollerForBruker();
    } catch (error) {
      unstable_rethrow(error);
      return feilrespons(401, 'Innloggingen kunne ikke bekreftes. Logg inn på nytt.');
    }

    if (!harLeseTilgang(roller)) {
      return feilrespons(403, 'Rollen AAP_DRIFT eller AAP_DRIFT_LES er påkrevd.');
    }

    const { saksnummer } = await params;
    const normalisertSaksnummer = normaliserSaksnummer(saksnummer.trim());
    if (!/^[a-zA-Z0-9]+$/.test(normalisertSaksnummer)) {
      return feilrespons(400, 'Saksnummer må inneholde bare bokstaver og tall.');
    }

    return NextResponse.json(await hentUtbetalingsmeldinger(normalisertSaksnummer), {
      headers: responseHeaders,
    });
  } catch (error) {
    unstable_rethrow(error);
    if (error instanceof ProxyError) {
      if (error.status === 401) {
        return feilrespons(401, 'Innloggingen er utløpt. Logg inn på nytt.');
      }
      if (error.status === 403) {
        return feilrespons(403, 'Du har ikke tilgang til utbetalingsmeldingene.');
      }
      if (error.status === 404) {
        return feilrespons(404, 'Fant ingen sak med dette saksnummeret.');
      }
      if (error.status === 400) {
        return feilrespons(400, 'Utbetal kunne ikke bruke saksnummeret. Kontroller saksnummeret.');
      }
      return feilrespons(502, 'Utbetal er utilgjengelig. Prøv igjen senere.');
    }
    logWarning('Henting av utbetalingsmeldinger feilet');
    return feilrespons(500, 'Noe gikk galt. Prøv igjen senere.');
  }
}
