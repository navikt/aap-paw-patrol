import { opprettFeilrespons } from 'lib/services/feilrespons';
import { NextRequest } from 'next/server';
import { avbrytBrev } from '../../../../../../lib/services/driftService';

interface Params {
  bestillingsreferanse: string;
}

export async function POST(req: NextRequest, { params }: { params: Promise<Params> }) {
  const { bestillingsreferanse } = await params;
  const { begrunnelse } = (await req.json()) as { begrunnelse: string };

  try {
    return new Response(await avbrytBrev(bestillingsreferanse, begrunnelse), { status: 200 });
  } catch (err) {
    return opprettFeilrespons(err);
  }
}
