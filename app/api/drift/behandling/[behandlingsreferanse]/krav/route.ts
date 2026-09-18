import { NextRequest, NextResponse } from 'next/server';
import { hentKravOgStønadsperiode } from 'lib/services/sakOgBehandlingService';

interface Params {
  behandlingsreferanse: string;
}

export async function POST(_: NextRequest, { params }: { params: Promise<Params> }) {
  const { behandlingsreferanse } = await params;
  try {
    return NextResponse.json(await hentKravOgStønadsperiode(behandlingsreferanse));
  } catch (err: any) {
    return new Response(err?.message, { status: 500 });
  }
}
