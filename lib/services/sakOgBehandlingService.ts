import { fetchProxy } from 'lib/services/fetchProxy';
import { getBaseUrlAndScopeForApp } from 'lib/services/driftService';
import { KravOgStønadsperiodeDto } from 'lib/types/kravOgStonadsperiode';
import { components } from 'lib/types/generated/behandlingsflyt';

type VilkårDriftsinfoDTO = components['schemas']['no.nav.aap.behandlingsflyt.drift.VilkårDriftsinfoDTO'];
type TilkjentYtelse2Dto =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.tilkjentytelse.TilkjentYtelse2Dto'];
type YrkesskadeDriftsinfoDto = components['schemas']['no.nav.aap.behandlingsflyt.drift.YrkesskadeDriftsinfoDto'];
// Kotlin-genererte anonyme klassenavn gir en litt uvanlig skjema-nøkkel her (kan endre seg ved
// regenerering via `yarn openapi:types` dersom backenden navngir klassen på nytt).
type DriftRettighetsinfoDto =
  components['schemas']['no.nav.aap.behandlingsflyt.drift.`DriftApiKt$driftApi$1$DriftRettighetsinfoDto`'];
type TidligereVurderingerDto =
  components['schemas']['no.nav.aap.behandlingsflyt.behandling.tidligerevurderinger.TidligereVurderingerDto'];

export const hentVilkår = async (behandlingsreferanse: string) => {
  const { baseUrl, scope } = await getBaseUrlAndScopeForApp('behandlingsflyt');
  const url = `${baseUrl}/api/drift/behandling/${behandlingsreferanse}/vilkår`;
  return await fetchProxy<VilkårDriftsinfoDTO[]>(url, scope, 'POST');
};
export const hentTilkjentYtelse = async (behandlingsreferanse: string) => {
  const { baseUrl, scope } = await getBaseUrlAndScopeForApp('behandlingsflyt');
  const url = `${baseUrl}/api/drift/behandling/${behandlingsreferanse}/tilkjent-ytelse`;
  return await fetchProxy<TilkjentYtelse2Dto>(url, scope, 'POST');
};
export const hentYrkesskader = async (behandlingsreferanse: string) => {
  const { baseUrl, scope } = await getBaseUrlAndScopeForApp('behandlingsflyt');
  const url = `${baseUrl}/api/drift/behandling/${behandlingsreferanse}/yrkesskade`;
  return await fetchProxy<YrkesskadeDriftsinfoDto[]>(url, scope, 'GET');
};
export const hentRettighetsinfo = async (behandlingsreferanse: string) => {
  const { baseUrl, scope } = await getBaseUrlAndScopeForApp('behandlingsflyt');
  const url = `${baseUrl}/api/drift/behandling/${behandlingsreferanse}/rettighetsinfo`;
  return await fetchProxy<DriftRettighetsinfoDto>(url, scope, 'POST');
};

export const hentKravOgStønadsperiode = async (behandlingsreferanse: string) => {
  const { baseUrl, scope } = await getBaseUrlAndScopeForApp('behandlingsflyt');
  const url = `${baseUrl}/api/drift/behandling/${behandlingsreferanse}/krav`;
  return await fetchProxy<KravOgStønadsperiodeDto>(url, scope, 'POST');
};

export const hentTidligereVurderinger = async (behandlingsreferanse: string, førSteg?: string, etterSteg?: string) => {
  const { baseUrl, scope } = await getBaseUrlAndScopeForApp('behandlingsflyt');
  const params = new URLSearchParams();
  if (førSteg) params.set('førSteg', førSteg);
  if (etterSteg) params.set('etterSteg', etterSteg);
  const query = params.size > 0 ? `?${params.toString()}` : '';
  const url = `${baseUrl}/api/drift/behandling/${behandlingsreferanse}/tidligere-vurderinger${query}`;
  // Merk: backend returnerer en {tidligereVurderinger: [...]}-wrapper, ikke en ren liste (se
  // TidligereVurderingerDto i openapi/behandlingsflyt.json) — det genererte skjemaet avdekket at
  // denne funksjonen tidligere var (feilaktig) typet som TidligereVurderingDto[].
  return await fetchProxy<TidligereVurderingerDto>(url, scope, 'GET');
};
