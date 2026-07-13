import { NextResponse } from 'next/server';
import { hentUtbetalingFeilstatus } from 'lib/services/driftService';

export async function GET() {
  try {
    return NextResponse.json(await hentUtbetalingFeilstatus());
  } catch (err: any) {
    return new Response(err?.message, { status: 500 });
  }
}
