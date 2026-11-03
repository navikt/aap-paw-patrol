import { opprettFeilrespons } from 'lib/services/feilrespons';
import { NextResponse } from 'next/server';
import { hentMigreringsStatus } from 'lib/services/driftService';

export async function GET() {
  try {
    return NextResponse.json(await hentMigreringsStatus());
  } catch (err) {
    return opprettFeilrespons(err);
  }
}
