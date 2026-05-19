export enum FilterType {
  GENERELL = 'GENERELL',
  ALLE_OPPGAVER = 'ALLE_OPPGAVER',
  KVALITETSSIKRING = 'KVALITETSSIKRING',
}

export interface AvklaringsbehovKodeNavn {
  kode: string;
  navn: string;
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
