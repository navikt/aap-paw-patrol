import { NextRequest } from 'next/server';
import { triggProsesserBehandlingIPostmottak } from '../../../../../../lib/services/driftService';

interface Params {
  behandlingsreferanse: string;
}

export async function POST(req: NextRequest, { params }: { params: Promise<Params> }) {
  const { behandlingsreferanse } = await params;
  try {
    return new Response(await triggProsesserBehandlingIPostmottak(behandlingsreferanse), { status: 200 });
  } catch (err: any) {
    return new Response(err?.message, { status: 500 });
  }
}
