import { NextRequest, NextResponse } from 'next/server';
import { hentYrkesskader } from 'lib/services/sakOgBehandlingService';

interface Params {
  behandlingsreferanse: string;
}

export async function GET(_: NextRequest, { params }: { params: Promise<Params> }) {
  const { behandlingsreferanse } = await params;
  try {
    return NextResponse.json(await hentYrkesskader(behandlingsreferanse));
  } catch (err: any) {
    return new Response(err?.message, { status: 500 });
  }
}
