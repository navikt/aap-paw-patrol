import { opprettFeilrespons } from 'lib/services/feilrespons';
import { NextRequest } from 'next/server';
import { kopierJournalpostIPostmottak } from 'lib/services/driftService';

interface Params {
  referanse: string;
}

export async function POST(_: NextRequest, { params }: { params: Promise<Params> }) {
  const { referanse } = await params;

  try {
    return Response.json(await kopierJournalpostIPostmottak(referanse), { status: 200 });
  } catch (err) {
    return opprettFeilrespons(err);
  }
}
