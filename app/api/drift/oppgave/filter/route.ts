import { opprettFeilrespons } from 'lib/services/feilrespons';
import { NextRequest, NextResponse } from 'next/server';
import { hentOppgavefiltre, lagreOppgavefilter } from 'lib/services/oppgaveService';

export async function GET() {
  try {
    return NextResponse.json(await hentOppgavefiltre());
  } catch (err) {
    return opprettFeilrespons(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    return NextResponse.json(await lagreOppgavefilter(body));
  } catch (err) {
    return opprettFeilrespons(err);
  }
}
