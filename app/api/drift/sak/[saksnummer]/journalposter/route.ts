import { logWarning } from '@navikt/aap-felles-utils';
import { NextRequest, NextResponse } from 'next/server';
import { getBaseUrlAndScopeForApp } from 'lib/services/driftService';
import { opprettFeilrespons } from 'lib/services/feilrespons';
import { fetchProxy } from 'lib/services/fetchProxy';
import type { components } from 'lib/types/generated/postmottak';
import { normaliserSaksnummer } from 'lib/utils/formatting';

type SakJournalposterDto = components['schemas']['no.nav.aap.postmottak.api.drift.SakJournalposterDto'];

export async function GET(_: NextRequest, { params }: { params: Promise<{ saksnummer: string }> }) {
  const { saksnummer } = await params;
  const normalisertSaksnummer = normaliserSaksnummer(saksnummer.trim());

  if (!/^[a-zA-Z0-9]+$/.test(normalisertSaksnummer)) {
    logWarning('Ugyldig saksnummer ved henting av journalposter');
    return new NextResponse('Ugyldig saksnummer', { status: 400 });
  }

  try {
    const { baseUrl, scope } = await getBaseUrlAndScopeForApp('postmottak');
    const url = `${baseUrl}/api/drift/sak/${encodeURIComponent(normalisertSaksnummer)}/journalposter`;
    return NextResponse.json(await fetchProxy<SakJournalposterDto>(url, scope, 'GET'));
  } catch (err) {
    return opprettFeilrespons(err);
  }
}
