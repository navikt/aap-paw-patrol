import { NextRequest, NextResponse } from 'next/server';
import { hentSakDriftsinfo } from 'lib/services/driftService';

interface Params {
  saksnummer: string;
}

export async function POST(_: NextRequest, { params }: { params: Promise<Params> }) {
  const { saksnummer } = await params;
  try {
    return NextResponse.json(await hentSakDriftsinfo(saksnummer));
  } catch (err: any) {
    return new Response(err?.message, { status: 500 });
  }
}
