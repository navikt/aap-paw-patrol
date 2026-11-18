import { opprettFeilrespons } from 'lib/services/feilrespons';
import { NextRequest, NextResponse } from 'next/server';
import { hentVedtakslengde } from 'lib/services/sakOgBehandlingService';

interface Params {
  behandlingsreferanse: string;
}

export async function GET(_: NextRequest, { params }: { params: Promise<Params> }) {
  const { behandlingsreferanse } = await params;
  try {
    return NextResponse.json(await hentVedtakslengde(behandlingsreferanse));
  } catch (err) {
    return opprettFeilrespons(err);
  }
}
