import { NextRequest, NextResponse } from 'next/server';
import { getBaseUrlAndScopeForApp } from 'lib/services/driftService';
import { fetchProxy } from 'lib/services/fetchProxy';
import { components } from 'lib/types/generated/meldekort-backend';

type MeldekortstatusDto = components['schemas']['no.nav.aap.meldekort.MeldekortstatusDto'];

export async function POST(_: NextRequest, { params }: { params: Promise<{ saksnummer: string }> }) {
  const { saksnummer } = await params;

  try {
    const { baseUrl, scope } = await getBaseUrlAndScopeForApp('meldekort');

    const url = `${baseUrl}/api/drift/sak/${saksnummer}/meldekort`;

    return NextResponse.json(await fetchProxy<MeldekortstatusDto>(url, scope, 'GET'));
  } catch (err: any) {
    return new Response(err?.message, { status: 500 });
  }
}
