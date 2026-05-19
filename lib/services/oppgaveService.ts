import { fetchProxy } from 'lib/services/fetchProxy';
import { getBaseUrlAndScopeForApp } from 'lib/services/driftService';
import { FilterOversiktDTO } from 'lib/types/oppgave';

export const hentOppgaver = async (behandlingsreferanse: string) => {
  const { baseUrl, scope } = await getBaseUrlAndScopeForApp('oppgave');
  const url = `${baseUrl}/api/drift/oppgave/behandling/${behandlingsreferanse}`;
  return await fetchProxy<any>(url, scope, 'POST');
};

export const hentOppgavefiltre = async (): Promise<FilterOversiktDTO> => {
  const { baseUrl, scope } = await getBaseUrlAndScopeForApp('oppgave');
  const url = `${baseUrl}/api/drift/filter`;
  return await fetchProxy<FilterOversiktDTO>(url, scope, 'GET');
};