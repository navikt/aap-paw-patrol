import { NextRequest, NextResponse } from 'next/server';
import { slettOppgavefilter } from 'lib/services/oppgaveService';

export async function POST(req: NextRequest) {
  try {
    const { id } = await req.json();
    await slettOppgavefilter(id);
    return new NextResponse(null, { status: 204 });
  } catch (err: any) {
    return new Response(err?.message, { status: 500 });
  }
}

