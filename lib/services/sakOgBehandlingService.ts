import { fetchProxy } from 'lib/services/fetchProxy';
import { getBaseUrlAndScopeForApp } from 'lib/services/driftService';
import { TidligereVurderingDto } from 'lib/types/tidligereVurderinger';

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
export const hentYrkesskader = async (behandlingsreferanse: string) => {
  const { baseUrl, scope } = await getBaseUrlAndScopeForApp('behandlingsflyt');
  const url = `${baseUrl}/api/drift/behandling/${behandlingsreferanse}/yrkesskade`;
  return await fetchProxy<any>(url, scope, 'GET');
};
export const hentRettighetsinfo = async (behandlingsreferanse: string) => {
  const { baseUrl, scope } = await getBaseUrlAndScopeForApp('behandlingsflyt');
  const url = `${baseUrl}/api/drift/behandling/${behandlingsreferanse}/rettighetsinfo`;
  return await fetchProxy<any>(url, scope, 'POST');
};

export const hentTidligereVurderinger = async (behandlingsreferanse: string, førSteg?: string, etterSteg?: string) => {
  const { baseUrl, scope } = await getBaseUrlAndScopeForApp('behandlingsflyt');
  const params = new URLSearchParams();
  if (førSteg) params.set('førSteg', førSteg);
  if (etterSteg) params.set('etterSteg', etterSteg);
  const query = params.size > 0 ? `?${params.toString()}` : '';
  const url = `${baseUrl}/api/drift/behandling/${behandlingsreferanse}/tidligere-vurderinger${query}`;
  return await fetchProxy<TidligereVurderingDto[]>(url, scope, 'GET');
};
