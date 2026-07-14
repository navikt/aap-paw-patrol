import { NextRequest, NextResponse } from 'next/server';
import { hentUtbetalingstidslinje } from 'lib/services/driftService';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ saksnummer: string }> }) {
  try {
    const { saksnummer } = await params;
    return NextResponse.json(await hentUtbetalingstidslinje(saksnummer));
  } catch (err: any) {
    return new Response(err?.message, { status: 500 });
  }
}
