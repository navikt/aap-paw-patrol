import { NextRequest, NextResponse } from 'next/server';
import { getBaseUrlAndScopeForApp } from 'lib/services/driftService';
import { fetchProxy } from 'lib/services/fetchProxy';
import { components } from 'lib/types/generated/brev';

type BrevbestillingDriftsinfoDto = components['schemas']['no.nav.aap.brev.api.BrevbestillingDriftsinfoDto'];

export async function GET(_: NextRequest, { params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;

  try {
    const { baseUrl, scope } = await getBaseUrlAndScopeForApp('brev');

    const url = `${baseUrl}/api/drift/bestillinger/${slug.join('/')}`;

    const result = await fetchProxy<BrevbestillingDriftsinfoDto[]>(url, scope, 'GET');
    if (result !== null && typeof result === 'object') {
      return NextResponse.json(result);
    }
    return new NextResponse(result, { status: 200 });
  } catch (err: any) {
    return new Response(err?.message, { status: 500 });
  }
}
