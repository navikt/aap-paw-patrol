import { NextRequest } from 'next/server';
import { fetchProxy } from '../../../../../lib/services/fetchProxy';
import { getBaseUrlAndScopeForApp } from '../../../../../lib/services/driftService';

export async function POST(req: NextRequest) {
  const { baseUrl, scope } = await getBaseUrlAndScopeForApp("api-intern");
  const body = await req.json()
  try {
    return new Response(await fetchProxy(`${baseUrl}/kelvin/dsop/vedtak`, scope, 'POST', body));
  } catch (err: any) {
    return new Response(err?.message, { status: 500 });
  }
}
