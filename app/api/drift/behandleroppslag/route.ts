import { NextRequest, NextResponse } from 'next/server';
import { hentBehandleroppslag } from 'lib/services/oppslagService';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const res = await hentBehandleroppslag(body);

    return NextResponse.json(res, { status: 200 });
  } catch (err: any) {
    return new Response(err?.message, { status: 500 });
  }
}
