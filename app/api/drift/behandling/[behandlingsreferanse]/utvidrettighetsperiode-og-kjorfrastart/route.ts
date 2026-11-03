import { opprettFeilrespons } from 'lib/services/feilrespons';
import { NextRequest } from 'next/server';
import { utvidRettighetsperiodeOgKjørFraStart } from 'lib/services/driftService';

interface Params {
  behandlingsreferanse: string;
}

export async function POST(req: NextRequest, { params }: { params: Promise<Params> }) {
  const { behandlingsreferanse } = await params;
  try {
    return new Response(await utvidRettighetsperiodeOgKjørFraStart(behandlingsreferanse), { status: 200 });
  } catch (err) {
    return opprettFeilrespons(err);
  }
}
