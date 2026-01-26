import { NextRequest, NextResponse } from 'next/server';
import { hentBehandlingDriftsinfo } from 'lib/services/driftService';

interface Params {
  behandlingsreferanse: string;
}

export async function POST(_: NextRequest, { params }: { params: Promise<Params> }) {
  const { behandlingsreferanse } = await params;
  try {
    return NextResponse.json(await hentBehandlingDriftsinfo(behandlingsreferanse));
  } catch (err: any) {
    return new Response(err?.message, { status: 500 });
  }
}
