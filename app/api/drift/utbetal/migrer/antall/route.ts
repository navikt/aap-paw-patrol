import { opprettFeilrespons } from 'lib/services/feilrespons';
import { NextRequest, NextResponse } from 'next/server';
import { migrerAntallSaker } from 'lib/services/driftService';

export async function POST(request: NextRequest) {
  try {
    const { maxAntall, dryRun } = await request.json();
    return NextResponse.json(await migrerAntallSaker(maxAntall, dryRun));
  } catch (err) {
    return opprettFeilrespons(err);
  }
}
