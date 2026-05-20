import { NextRequest, NextResponse } from 'next/server';
import { hentOppgavefiltre, lagreOppgavefilter } from 'lib/services/oppgaveService';

export async function GET() {
  try {
    return NextResponse.json(await hentOppgavefiltre());
  } catch (err: any) {
    return new Response(err?.message, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    return NextResponse.json(await lagreOppgavefilter(body));
  } catch (err: any) {
    return new Response(err?.message, { status: 500 });
  }
}
