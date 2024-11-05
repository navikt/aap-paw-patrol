import { fetchProxy, isLocal } from 'lib/services/fetchProxy';

export type AppNavn = 'behandlingsflyt' | 'brev' | 'postmottak' | 'dokumentinnhenting' | 'statistikk';

export interface AppInfo {
  name: AppNavn;
  displayName: string;
}

export const appInfo: AppInfo[] = [
  {
    name: 'behandlingsflyt',
    displayName: 'Behandlingsflyt',
  },
  {
    name: 'brev',
    displayName: 'Brev',
  },
  {
    name: 'postmottak',
    displayName: 'Postmottak',
  },
  {
    name: 'dokumentinnhenting',
    displayName: 'Dokumentinnhenting',
  },
  {
    name: 'statistikk',
    displayName: 'Statistikk',
  },
];

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

const getBaseUrlAndScopeForApp = async (appNavn: AppNavn): Promise<BaseUrlAndScope> => {
  if (await isLocal()) {
    return {
      baseUrl: 'http://localhost:8080',
      scope: 'local',
    };
  }
  if (appNavn === 'behandlingsflyt') {
    return {
      baseUrl: process.env.BEHANDLING_API_BASE_URL ?? '',
      scope: process.env.BEHANDLING_API_SCOPE ?? '',
    };
  }
  if (appNavn === 'brev') {
    return {
      baseUrl: process.env.BREV_API_BASE_URL ?? '',
      scope: process.env.BREV_API_SCOPE ?? '',
    };
  }
  if (appNavn === 'postmottak') {
    return {
      baseUrl: process.env.POSTMOTTAK_API_BASE_URL ?? '',
      scope: process.env.POSTMOTTAK_API_SCOPE ?? '',
    };
  }
  if (appNavn === 'dokumentinnhenting') {
    return {
      baseUrl: process.env.DOKUMENTINNHENTING_API_BASE_URL ?? '',
      scope: process.env.DOKUMENTINNHENTING_API_SCOPE ?? '',
    };
  }
  if (appNavn === 'statistikk') {
    return {
      baseUrl: process.env.STATISTIKK_API_BASE_URL ?? '',
      scope: process.env.STATISTIKK_API_SCOPE ?? '',
    };
  }
  throw new Error(`Ukjent app: ${appNavn}`);
};

export const hentFeilendeJobber = async (appNavn: AppNavn) => {
  const { baseUrl, scope } = await getBaseUrlAndScopeForApp(appNavn);
  const url = `${baseUrl}/drift/api/jobb/feilende`;
  return await fetchProxy<JobbInfo[]>(url, scope, 'GET');
};

export const hentPlanlagteJobber = async (appNavn: AppNavn) => {
  const { baseUrl, scope } = await getBaseUrlAndScopeForApp(appNavn);
  const url = `${baseUrl}/drift/api/jobb/planlagte-jobber`;
  return await fetchProxy<JobbInfo[]>(url, scope, 'GET');
};

export const rekjørJobb = async (appNavn: AppNavn, jobbId: string) => {
  const { baseUrl, scope } = await getBaseUrlAndScopeForApp(appNavn);
  const url = `${baseUrl}/drift/api/jobb/rekjor/${jobbId}`;
  return await fetchProxy<string>(url, scope, 'GET');
};

export const avbrytJobb = async (appNavn: AppNavn, jobbId: string) => {
  const { baseUrl, scope } = await getBaseUrlAndScopeForApp(appNavn);
  const url = `${baseUrl}/drift/api/jobb/avbryt/${jobbId}`;
  return await fetchProxy<string>(url, scope, 'GET');
};

export const rekjørFeiledeJobber = async (appNavn: AppNavn) => {
  const { baseUrl, scope } = await getBaseUrlAndScopeForApp(appNavn);
  const url = `${baseUrl}/drift/api/jobb/rekjorAlleFeilede`;
  return await fetchProxy<string>(url, scope, 'GET');
};

export const hentSisteKjørteJobber = async (appNavn: AppNavn) => {
  const { baseUrl, scope } = await getBaseUrlAndScopeForApp(appNavn);
  const url = `${baseUrl}/drift/api/jobb/sisteKjørte`;
  return await fetchProxy<JobbInfo[]>(url, scope, 'GET');
};
