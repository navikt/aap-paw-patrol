import { NextRequest, NextResponse } from 'next/server';
import { migrerSak } from 'lib/services/driftService';

export async function POST(request: NextRequest) {
  try {
    const { saksnummer, dryRun } = await request.json();
    return NextResponse.json(await migrerSak(saksnummer, dryRun));
  } catch (err: any) {
    return new Response(err?.message, { status: 500 });
  }
}
