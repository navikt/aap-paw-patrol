import { NextRequest, NextResponse } from 'next/server';
import { getBaseUrlAndScopeForApp } from 'lib/services/driftService';
import { fetchProxy } from 'lib/services/fetchProxy';

export async function POST(_: NextRequest, { params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;

  try {
    const { baseUrl, scope } = await getBaseUrlAndScopeForApp('behandlingsflyt');

    const url = `${baseUrl}/api/drift/sak/${slug.join('/')}`;

    const result = await fetchProxy<any>(url, scope, 'POST');
    if (result !== null && typeof result === 'object') {
      return NextResponse.json(result);
    }
    return new NextResponse(result, { status: 200 });
  } catch (err: any) {
    return new Response(err?.message, { status: 500 });
  }
}
