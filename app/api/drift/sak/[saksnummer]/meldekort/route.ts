import { NextRequest, NextResponse } from 'next/server';
import { getBaseUrlAndScopeForApp } from 'lib/services/driftService';
import { fetchProxy } from 'lib/services/fetchProxy';

export async function POST(_: NextRequest, { params }: { params: Promise<{ saksnummer: string }> }) {
  const { saksnummer } = await params;

  try {
    const { baseUrl, scope } = await getBaseUrlAndScopeForApp('meldekort');

    const url = `${baseUrl}/api/drift/sak/${saksnummer}/meldekort`;

    return NextResponse.json(await fetchProxy<any>(url, scope, 'GET'));
  } catch (err: any) {
    return new Response(err?.message, { status: 500 });
  }
}
