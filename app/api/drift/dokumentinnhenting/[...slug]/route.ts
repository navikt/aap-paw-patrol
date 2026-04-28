import { NextRequest, NextResponse } from 'next/server';
import { getBaseUrlAndScopeForApp } from 'lib/services/driftService';
import { fetchProxy } from 'lib/services/fetchProxy';

export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;

  try {
    const body = req.headers.get('content-length') !== '0' ? await req.json() : undefined;
    const { baseUrl, scope } = await getBaseUrlAndScopeForApp('dokumentinnhenting');

    const url = `${baseUrl}/drift/api/${slug.join('/')}`;

    return NextResponse.json(await fetchProxy<any>(url, scope, 'POST', body));
  } catch (err: any) {
    return new Response(err?.message, { status: 500 });
  }
}
