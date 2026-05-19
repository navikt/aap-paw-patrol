import { NextResponse } from 'next/server';
import { hentOppgavefiltre } from 'lib/services/oppgaveService';

export async function GET() {
  try {
    return NextResponse.json(await hentOppgavefiltre());
  } catch (err: any) {
    return new Response(err?.message, { status: 500 });
  }
}

