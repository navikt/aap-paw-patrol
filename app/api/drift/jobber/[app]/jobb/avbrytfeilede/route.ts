import { opprettFeilrespons } from 'lib/services/feilrespons';
import { AppNavn, avbrytFeiledeJobber } from 'lib/services/driftService';
import { NextRequest } from 'next/server';

interface Params {
  app: string;
}

export async function GET(req: NextRequest, { params }: { params: Promise<Params> }) {
  const { app } = await params;
  try {
    return new Response(await avbrytFeiledeJobber(app as AppNavn), { status: 200 });
  } catch (err) {
    return opprettFeilrespons(err);
  }
}
