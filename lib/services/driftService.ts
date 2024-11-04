import { fetchProxy, isLocal } from 'lib/services/fetchProxy';

export type AppNavn = 'behandlingsflyt' | 'brev';

interface BaseUrlAndScope {
  baseUrl: string;
  scope: string;
}

// TODO: Importere fra swaggerdoc
export interface JobbInfo {
  /** Format: int32 */
  'antallFeilendeFors\u00F8k': number;
  beskrivelse: string;
  feilmelding?: string | null;
  /** Format: int64 */
  id: number;
  /** @description Key type: kotlin.String */
  metadata: {
    [key: string]: string;
  };
  navn: string;
  /**
   * Format: date-time
   * @example 2024-10-29T12:55:06.233587
   */
  'planlagtKj\u00F8retidspunkt': string;
  /** @enum {string} */
  status: 'KLAR' | 'PLUKKET' | 'FERDIG' | 'FEILET' | 'AVBRUTT';
  type: string;
}

const getBaseUrlAndScopeForApp = (appNavn: AppNavn): BaseUrlAndScope => {
  if (true) {
    return {
      baseUrl: 'http://localhost:8080',
      scope: 'local',
    };
  }
  switch (appNavn) {
    case 'behandlingsflyt':
      return {
        baseUrl: process.env.BEHANDLING_API_BASE_URL ?? '',
        scope: process.env.BEHANDLING_API_SCOPE ?? '',
      };
    case 'brev':
      return {
        baseUrl: process.env.BREV_API_BASE_URL ?? '',
        scope: process.env.BREV_API_SCOPE ?? '',
      };
  }
};

export const hentFeilendeJobber = async (appNavn: AppNavn) => {
  const url = `${getBaseUrlAndScopeForApp(appNavn).baseUrl}/drift/api/jobb/feilende`;
  return await fetchProxy<JobbInfo[]>(url, getBaseUrlAndScopeForApp(appNavn).scope, 'GET');
};

export const hentPlanlagteJobber = async (appNavn: AppNavn) => {
  const url = `${getBaseUrlAndScopeForApp(appNavn).baseUrl}/drift/api/jobb/planlagte-jobber`;
  return await fetchProxy<JobbInfo[]>(url, getBaseUrlAndScopeForApp(appNavn).scope, 'GET');
};

export const rekjørJobb = async (appNavn: AppNavn, jobbId: string) => {
  const url = `${getBaseUrlAndScopeForApp(appNavn).baseUrl}/drift/api/jobb/rekjor/${jobbId}`;
  return await fetchProxy<string>(url, getBaseUrlAndScopeForApp(appNavn).scope, 'GET');
};

export const avbrytJobb = async (appNavn: AppNavn, jobbId: string) => {
  const url = `${getBaseUrlAndScopeForApp(appNavn).baseUrl}/drift/api/jobb/avbryt/${jobbId}`;
  return await fetchProxy<string>(url, getBaseUrlAndScopeForApp(appNavn).scope, 'GET');
};

export const rekjørFeiledeJobber = async (appNavn: AppNavn) => {
  const url = `${getBaseUrlAndScopeForApp(appNavn).baseUrl}/drift/api/jobb/rekjorAlleFeilede`;
  return await fetchProxy<string>(url, getBaseUrlAndScopeForApp(appNavn).scope, 'GET');
};

export const hentSisteKjørteJobber = async (appNavn: AppNavn) => {
  const url = `${getBaseUrlAndScopeForApp(appNavn).baseUrl}/drift/api/jobb/sisteKjørte`;
  return await fetchProxy<JobbInfo[]>(url, getBaseUrlAndScopeForApp(appNavn).scope, 'GET');
};
