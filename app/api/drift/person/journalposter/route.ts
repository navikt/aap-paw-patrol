import { NextRequest, NextResponse } from 'next/server';
import { hentJournalposterForPerson } from 'lib/services/driftService';

export async function POST(req: NextRequest) {
  const { ident } = await req.json();

  try {
    return NextResponse.json(await hentJournalposterForPerson(ident));
  } catch (err: any) {
    return new Response(err?.message, { status: 500 });
  }
}
