import { NextRequest } from 'next/server';
import { AppNavn, rekjørJobb } from '../../../../../../../../lib/services/driftService';

interface Params {
  app: string;
  jobbid: string;
}

export async function GET(req: NextRequest, { params }: { params: Promise<Params> }) {
  const { app, jobbid } = await params;
  try {
    return new Response(await rekjørJobb(app as AppNavn, jobbid), { status: 200 });
  } catch (err: any) {
    return new Response(err?.message, { status: 500 });
  }
}
