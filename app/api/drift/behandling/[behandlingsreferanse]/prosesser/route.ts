import { NextRequest } from 'next/server';
import { prosesserBehandling } from '../../../../../../lib/services/driftService';

interface Params {
  behandlingsreferanse: string;
}

export async function POST(req: NextRequest, { params }: { params: Promise<Params> }) {
  const { behandlingsreferanse } = await params;
  const { skalForberede } = (await req.json()) as { skalForberede: boolean };
  try {
    return new Response(await prosesserBehandling(behandlingsreferanse, skalForberede), { status: 200 });
  } catch (err: any) {
    return new Response(err?.message, { status: 500 });
  }
}
