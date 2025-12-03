import { NextRequest } from 'next/server';
import { triggProsesserBehandlingIPostmottak } from '../../../../../../lib/services/driftService';

interface Params {
  referanse: string;
}

export async function POST(req: NextRequest, { params }: { params: Promise<Params> }) {
  const { referanse } = await params;
  console.log(referanse);
  try {
    return new Response(await triggProsesserBehandlingIPostmottak(referanse), { status: 200 });
  } catch (err: any) {
    return new Response(err?.message, { status: 500 });
  }
}
