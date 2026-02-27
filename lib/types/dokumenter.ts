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
