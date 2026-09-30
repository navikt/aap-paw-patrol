import { NextRequest, NextResponse } from 'next/server';
import { fetchProxy } from '../../../../../lib/services/fetchProxy';
import { getBaseUrlAndScopeForApp } from '../../../../../lib/services/driftService';
import { paths } from 'lib/types/generated/api-intern';

type MediumResponse = paths['/maksimumUtenUtbetaling']['post']['responses'][200]['content']['application/json'];

export async function POST(req: NextRequest) {
  const { baseUrl, scope } = await getBaseUrlAndScopeForApp('api-intern');
  const body = await req.json();
  try {
    return NextResponse.json(
      await fetchProxy<MediumResponse>(`${baseUrl}/maksimumUtenUtbetaling`, scope, 'POST', body)
    );
  } catch (err: any) {
    return new Response(err?.message, { status: 500 });
  }
}
