import { opprettFeilrespons } from 'lib/services/feilrespons';
import { NextRequest } from 'next/server';
import { ettersendDokumentForPerson } from 'lib/services/driftService';


export async function POST(req: NextRequest, ) {

  const payload = await req.json();
  try {
    return Response.json(await ettersendDokumentForPerson(payload), { status: 200 });
  } catch (err) {
    return opprettFeilrespons(err);
  }
}
