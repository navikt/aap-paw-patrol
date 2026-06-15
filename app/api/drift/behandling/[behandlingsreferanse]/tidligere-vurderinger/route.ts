import { NextRequest, NextResponse } from 'next/server';
import { hentTidligereVurderinger } from 'lib/services/sakOgBehandlingService';

interface Params {
  behandlingsreferanse: string;
}

export async function GET(req: NextRequest, { params }: { params: Promise<Params> }) {
  const { behandlingsreferanse } = await params;
  const { searchParams } = req.nextUrl;
  const førSteg = searchParams.get('førSteg') ?? undefined;
  const etterSteg = searchParams.get('etterSteg') ?? undefined;
  try {
    return NextResponse.json(await hentTidligereVurderinger(behandlingsreferanse, førSteg, etterSteg));
  } catch (err: any) {
    return new Response(err?.message, { status: 500 });
  }
}
