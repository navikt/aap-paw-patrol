import { NextRequest, NextResponse } from 'next/server';
import { getBaseUrlAndScopeForApp } from 'lib/services/driftService';
import { fetchProxy } from 'lib/services/fetchProxy';
import { components } from 'lib/types/generated/behandlingsflyt';

type PersonSøkDriftsinfoDto = components['schemas']['no.nav.aap.behandlingsflyt.drift.PersonSøkDriftsinfoDto'];

export async function POST(req: NextRequest) {
  const body = await req.json();

  try {
    const { baseUrl, scope } = await getBaseUrlAndScopeForApp('behandlingsflyt');
    const url = `${baseUrl}/api/drift/person`;

    return NextResponse.json(await fetchProxy<PersonSøkDriftsinfoDto>(url, scope, 'POST', body));
  } catch (err: any) {
    return new Response(err?.message, { status: 500 });
  }
}
