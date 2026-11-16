import { hentPostmottakVurderinger } from 'lib/services/driftService';
import { NextRequest, NextResponse } from 'next/server';
import { opprettFeilrespons } from 'lib/services/feilrespons.ts';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ referanse: string }> }) {
  try {
    const { referanse } = await params;
    return NextResponse.json(await hentPostmottakVurderinger(referanse));
  } catch (err) {
    return opprettFeilrespons(err);
  }
}
