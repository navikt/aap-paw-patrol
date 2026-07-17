import { NextRequest } from 'next/server';
import { AppNavn, leggTilKommentar } from 'lib/services/driftService';

interface Params {
  app: string;
  jobbid: string;
}

export async function POST(req: NextRequest, { params }: { params: Promise<Params> }) {
  const { app, jobbid } = await params;
  const { kommentar } = await req.json();
  try {
    return new Response(await leggTilKommentar(app as AppNavn, jobbid, kommentar), { status: 200 });
  } catch (err: any) {
    return new Response(err?.message, { status: 500 });
  }
}
