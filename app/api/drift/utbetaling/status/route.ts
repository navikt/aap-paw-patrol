import { opprettFeilrespons } from 'lib/services/feilrespons';
import { NextResponse } from 'next/server';
import { hentUtbetalingStatusAntall } from 'lib/services/driftService';

export async function GET() {
  try {
    return NextResponse.json(await hentUtbetalingStatusAntall());
  } catch (err) {
    return opprettFeilrespons(err);
  }
}
