import { opprettFeilrespons } from 'lib/services/feilrespons';
import { NextRequest } from 'next/server';
import { kjørFraSteg } from '../../../../../../lib/services/driftService';

interface Params {
  behandlingsreferanse: string;
}

export async function POST(req: NextRequest, { params }: { params: Promise<Params> }) {
  const { behandlingsreferanse } = await params;
  const { steg } = (await req.json()) as { steg: string };
  try {
    return new Response(await kjørFraSteg(behandlingsreferanse, steg), { status: 200 });
  } catch (err) {
    return opprettFeilrespons(err);
  }
}
