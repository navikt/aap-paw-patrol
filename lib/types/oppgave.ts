export enum FilterType {
  GENERELL = 'GENERELL',
  ALLE_OPPGAVER = 'ALLE_OPPGAVER',
  KVALITETSSIKRING = 'KVALITETSSIKRING',
}

export enum Filtermodus {
  INKLUDER = 'INKLUDER',
  EKSKLUDER = 'EKSKLUDER',
}

export enum MarkeringForBehandling {
  HASTER = 'HASTER',
  KREVER_SPESIALKOMPETANSE = 'KREVER_SPESIALKOMPETANSE',
  AVSLAG_11_5 = 'AVSLAG_11_5',
}

export interface AvklaringsbehovKodeNavn {
  kode: string;
  navn: string;
}

export interface MarkeringDriftRequest {
  type: MarkeringForBehandling;
  filtermodus: Filtermodus;
}

export interface FilterDriftsinfoDTO {
  id: number;
  navn: string;
  beskrivelse: string;
  type: FilterType;
  avklaringsbehov: AvklaringsbehovKodeNavn[];
  behandlingstyper: string[];
  inkluderteEnheter: string[];
  ekskluderteEnheter: string[];
  inkluderteMarkeringer: MarkeringForBehandling[];
  ekskluderteMarkeringer: MarkeringForBehandling[];
  opprettetAv: string;
  opprettetTidspunkt: string;
  endretAv?: string | null;
  endretTidspunkt?: string | null;
}

export interface FilterOversiktDTO {
  filtre: FilterDriftsinfoDTO[];
  avklaringsbehovUtenFilter: AvklaringsbehovKodeNavn[];
}

export interface OppgaveDriftsinfoDTO {
  oppgaveId: number;
  behandlingRef: string;
  status: OppgaveStatus;
  enhet: string;
  oppfølgingsenhet?: string;
  reservertAv?: string;
  veilederArbeid?: string;
  veilederSykdom?: string;
  opprettetTidspunkt: string;
  endretTidspunkt?: string;
  avklaringsbehovKode: string;
}

export enum OppgaveStatus {
  OPPRETTET = 'OPPRETTET',
  AVSLUTTET = 'AVSLUTTET',
}

export const BEHANDLINGSTYPER = [
  'FØRSTEGANGSBEHANDLING',
  'REVURDERING',
  'TILBAKEKREVING',
  'KLAGE',
  'SVAR_FRA_ANDREINSTANS',
  'OPPFØLGINGSBEHANDLING',
  'AKTIVITETSPLIKT',
  'AKTIVITETSPLIKT_11_9',
  'DOKUMENT_HÅNDTERING',
  'JOURNALFØRING',
] as const;

export interface EnhetDriftRequest {
  enhet: string;
  filtermodus: Filtermodus;
}

export interface FilterDriftRequest {
  id?: number;
  navn: string;
  beskrivelse: string;
  type: FilterType;
  avklaringsbehovKoder: string[];
  behandlingstyper: string[];
  enheter: EnhetDriftRequest[];
  markeringer: MarkeringDriftRequest[];
}
