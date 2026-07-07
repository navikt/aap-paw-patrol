export type BrevStatus = 'UNDER_ARBEID' | 'FERDIGSTILT' | 'AVBRUTT';

export type BrevProsesseringStatus =
  | 'STARTET'
  | 'BREVBESTILLING_LØST'
  | 'BREV_FERDIGSTILT'
  | 'JOURNALFORT'
  | 'JOURNALPOST_VEDLEGG_TILKNYTTET'
  | 'JOURNALPOST_FERDIGSTILT'
  | 'DISTRIBUERT'
  | 'FERDIG'
  | 'AVBRUTT';

export interface BrevbestillingDriftsinfoDto {
  id: number;
  bestillingReferanse: string;
  opprettet: string;
  oppdatert: string;
  behandlingReferanse: string;
  brevtype: string;
  språk: string;
  status: BrevStatus | null;
  prosesseringStatus: BrevProsesseringStatus | null;
}
