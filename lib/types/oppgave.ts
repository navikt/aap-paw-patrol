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
