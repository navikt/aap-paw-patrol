import { NextRequest, NextResponse } from 'next/server';
import { getBaseUrlAndScopeForApp } from 'lib/services/driftService';
import { fetchProxy } from 'lib/services/fetchProxy';

export async function POST(req: NextRequest) {
  const body = await req.json();

  try {
    const { baseUrl, scope } = await getBaseUrlAndScopeForApp('behandlingsflyt');
    const url = `${baseUrl}/api/drift/person`;

    return NextResponse.json(await fetchProxy<unknown>(url, scope, 'POST', body));
  } catch (err: any) {
    return new Response(err?.message, { status: 500 });
  }
}
