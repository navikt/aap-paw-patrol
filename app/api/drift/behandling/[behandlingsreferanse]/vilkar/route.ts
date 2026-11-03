import { opprettFeilrespons } from 'lib/services/feilrespons';
import { NextRequest, NextResponse } from 'next/server';
import { hentVilkår } from 'lib/services/sakOgBehandlingService';

interface Params {
  behandlingsreferanse: string;
}

export async function POST(_: NextRequest, { params }: { params: Promise<Params> }) {
  const { behandlingsreferanse } = await params;
  try {
    return NextResponse.json(await hentVilkår(behandlingsreferanse));
  } catch (err) {
    return opprettFeilrespons(err);
  }
}
