import { NextRequest } from 'next/server';
import { AppNavn, settAnsvarlig } from 'lib/services/driftService';

interface Params {
  app: string;
  jobbid: string;
}

export async function POST(req: NextRequest, { params }: { params: Promise<Params> }) {
  const { app, jobbid } = await params;
  const { ansvarlig } = await req.json();
  try {
    return new Response(await settAnsvarlig(app as AppNavn, jobbid, ansvarlig), { status: 200 });
  } catch (err: any) {
    return new Response(err?.message, { status: 500 });
  }
}
