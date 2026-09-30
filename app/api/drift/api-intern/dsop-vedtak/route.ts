import { NextRequest, NextResponse } from 'next/server';
import { fetchProxy } from '../../../../../lib/services/fetchProxy';
import { getBaseUrlAndScopeForApp } from '../../../../../lib/services/driftService';
import { paths } from 'lib/types/generated/api-intern';

type DsopResponse = paths['/kelvin/dsop/vedtak-test']['post']['responses'][200]['content']['application/json'];

export async function POST(req: NextRequest) {
  const { baseUrl, scope } = await getBaseUrlAndScopeForApp('api-intern');
  const body = await req.json();
  try {
    return NextResponse.json(await fetchProxy<DsopResponse>(`${baseUrl}/kelvin/dsop/vedtak-test`, scope, 'POST', body));
  } catch (err: any) {
    return new Response(err?.message, { status: 500 });
  }
}
