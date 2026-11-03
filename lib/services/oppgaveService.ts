import { fetchProxy } from 'lib/services/fetchProxy';
import { getBaseUrlAndScopeForApp } from 'lib/services/driftService';
import { components, paths } from 'lib/types/generated/oppgave';

type FilterDriftRequest = components['schemas']['no.nav.aap.oppgave.drift.FilterDriftRequest'];
type FilterDriftsinfoDTO = components['schemas']['no.nav.aap.oppgave.drift.FilterDriftResponse'];
type FilterOversiktDTO = components['schemas']['no.nav.aap.oppgave.drift.DriftFilterResponsDTO'];
type OppgaveDriftsinfoDTO = components['schemas']['no.nav.aap.oppgave.drift.OppgaveDriftsinfoDTO'];
type OppgaveIkkeEndretDto = components['schemas']['no.nav.aap.oppgave.drift.OppgaveIkkeEndretDto'];
type OppgaverIkkeEndretQuery = NonNullable<paths['/api/drift/oppgaver-ikke-endret']['get']['parameters']['query']>;

export const hentOppgaverIkkeEndret = async (
  antallUker: OppgaverIkkeEndretQuery['antallUker'] | null = null,
  kunUreserverte: OppgaverIkkeEndretQuery['kunUreserverte'] | null = null
): Promise<OppgaveIkkeEndretDto[]> => {
  const { baseUrl, scope } = await getBaseUrlAndScopeForApp('oppgave');
  const query = new URLSearchParams();
  if (antallUker != null) query.set('antallUker', String(antallUker));
  if (kunUreserverte != null) query.set('kunUreserverte', String(kunUreserverte));
  const queryString = query.toString();
  const url = `${baseUrl}/api/drift/oppgaver-ikke-endret${queryString ? `?${queryString}` : ''}`;
  return await fetchProxy<OppgaveIkkeEndretDto[]>(url, scope, 'GET');
};

export const hentOppgaver = async (behandlingsreferanse: string) => {
  const { baseUrl, scope } = await getBaseUrlAndScopeForApp('oppgave');
  const url = `${baseUrl}/api/drift/oppgave/behandling/${behandlingsreferanse}`;
  return await fetchProxy<OppgaveDriftsinfoDTO[]>(url, scope, 'POST');
};

export const hentOppgavefiltre = async (): Promise<FilterOversiktDTO> => {
  const { baseUrl, scope } = await getBaseUrlAndScopeForApp('oppgave');
  const url = `${baseUrl}/api/drift/filter`;
  return await fetchProxy<FilterOversiktDTO>(url, scope, 'GET');
};

export const lagreOppgavefilter = async (request: FilterDriftRequest): Promise<FilterDriftsinfoDTO> => {
  const { baseUrl, scope } = await getBaseUrlAndScopeForApp('oppgave');
  const url = `${baseUrl}/api/drift/filter`;
  return await fetchProxy<FilterDriftsinfoDTO>(url, scope, 'POST', request);
};

export const slettOppgavefilter = async (id: number): Promise<void> => {
  const { baseUrl, scope } = await getBaseUrlAndScopeForApp('oppgave');
  const url = `${baseUrl}/api/drift/filter/slett`;
  await fetchProxy<undefined>(url, scope, 'POST', { id });
};
