export interface MottattDokumentDriftsinfoDTO {
  referanse: InnsendingReferanse;
  mottattTidspunkt: string;
  type: string;
  kanal: string;
  status: string;
}

export interface InnsendingReferanse {
  type: string;
  verdi: string;
}

export interface DialogmeldingDriftinfoDTO {
  bestillerNavIdent: string;
  dialogmeldingUuid: string;
  behandlerRef: string;
  behandlerHprNr: string;
  dokumentasjonType: string;
  status?: string;
  flytStatus?: string;
  statusTekst?: string;
  behandlingsReferanse: string;
  opprettet: Date;
  tidligereBestillingReferanse?: string;
  journalpostId?: string;
  dokumentId?: string;
}
