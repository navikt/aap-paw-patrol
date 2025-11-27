import { fetchProxy } from 'lib/services/fetchProxy';
import { Behandler } from 'lib/types';

const dokumentinnhentingApiBaseUrl = process.env.DOKUMENTINNHENTING_API_BASE_URL ?? '';
const dokumentinnhentingApiScope = process.env.DOKUMENTINNHENTING_API_SCOPE ?? '';

export async function hentBehandleroppslag(body: { saksnummer: string, fritekst: string }) {
  const url = `${dokumentinnhentingApiBaseUrl}/drift/api/syfo/behandleroppslag/search`;
  return await fetchProxy<Behandler[]>(url, dokumentinnhentingApiScope, 'POST', body);
}
