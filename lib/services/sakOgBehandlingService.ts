import { fetchProxy } from 'lib/services/fetchProxy';
import { getBaseUrlAndScopeForApp } from 'lib/services/driftService';

export const hentVilkår = async (behandlingsreferanse: string) => {
  const { baseUrl, scope } = await getBaseUrlAndScopeForApp('behandlingsflyt');
  const url = `${baseUrl}/api/drift/behandling/${behandlingsreferanse}/vilkår`;
  return await fetchProxy<any>(url, scope, 'POST');
};
export const hentTilkjentYtelse = async (behandlingsreferanse: string) => {
  const { baseUrl, scope } = await getBaseUrlAndScopeForApp('behandlingsflyt');
  const url = `${baseUrl}/api/drift/behandling/${behandlingsreferanse}/tilkjent-ytelse`;
  return await fetchProxy<any>(url, scope, 'POST');
};
