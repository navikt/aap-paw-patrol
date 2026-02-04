import { fetchProxy } from 'lib/services/fetchProxy';
import { getBaseUrlAndScopeForApp } from 'lib/services/driftService';

export const hentOppgaver = async (behandlingsreferanse: string) => {
  const { baseUrl, scope } = await getBaseUrlAndScopeForApp('oppgave');
  const url = `${baseUrl}/api/drift/oppgave/behandling/${behandlingsreferanse}`;
  return await fetchProxy<any>(url, scope, 'POST');
};
