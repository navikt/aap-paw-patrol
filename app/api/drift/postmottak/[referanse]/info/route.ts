import { NextRequest } from 'next/server';
import { hentJournalpostInfo } from 'lib/services/driftService';

interface Params {
  referanse: string;
}

export async function GET(_: NextRequest, { params }: { params: Promise<Params> }) {
  const { referanse } = await params;

  try {
    return Response.json(await hentJournalpostInfo(referanse), { status: 200 });
  } catch (err: any) {
    return new Response(err?.message, { status: 500 });
  }
}


