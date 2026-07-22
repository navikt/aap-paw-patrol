import { NextRequest } from 'next/server';
import { AppNavn, avbrytJobb } from 'lib/services/driftService';

interface Params {
  app: string;
  jobbid: string;
}

export async function POST(req: NextRequest, { params }: { params: Promise<Params> }) {
  const { app, jobbid } = await params;
  const body = await req.json();

  try {
    return new Response(await avbrytJobb(app as AppNavn, jobbid, body), { status: 200 });
  } catch (err: any) {
    return new Response(err?.message, { status: 500 });
  }
}
