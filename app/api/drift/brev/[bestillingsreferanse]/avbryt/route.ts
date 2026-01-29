import { NextRequest } from 'next/server';
import { avbrytBrev } from '../../../../../../lib/services/driftService';

interface Params {
  bestillingsreferanse: string;
}

export async function POST(req: NextRequest, { params }: { params: Promise<Params> }) {
  const { bestillingsreferanse } = await params;
  try {
    return new Response(await avbrytBrev(bestillingsreferanse), { status: 200 });
  } catch (err: any) {
    return new Response(err?.message, { status: 500 });
  }
}
