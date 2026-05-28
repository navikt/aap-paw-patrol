export interface MeldekortDriftsinfoDto {
  utfyllinger: UtfyllingDriftsinfo[];
  varsler: Varsel[];
}

export interface UtfyllingDriftsinfo {
  referanse: string;
  fagsak: FagsakReferanse;
  periode: Periode;
  flyt: UtfyllingFlytNavn;
  aktivtSteg: UtfyllingStegNavn;
  svar: Svar;
  opprettet: string;
  sistEndret: string;
  erDigitalisert: boolean | null;
}

export interface FagsakReferanse {
  system: FagsystemNavn;
  nummer: Fagsaknummer;
}

export type FagsystemNavn = 'ARENA' | 'KELVIN';

export interface Fagsaknummer {
  asString: string;
}

export interface Periode {
  fom: string;
  tom: string;
}

export type UtfyllingFlytNavn = 'AAP_FLYT' | 'AAP_FLYT_V2' | 'AAP_KORRIGERING_FLYT' | 'AAP_KORRIGERING_FLYT_V2';

export type UtfyllingStegNavn =
  | 'INTRODUKSJON'
  | 'SPØRSMÅL'
  | 'UTFYLLING'
  | 'FRAVÆR_SPØRSMÅL'
  | 'FRAVÆR_UTFYLLING'
  | 'BEKREFT'
  | 'PERSISTER_OPPLYSNINGER'
  | 'BESTILL_JOURNALFØRING'
  | 'INAKTIVER_VARSEL'
  | 'KVITTERING';

export interface Svar {
  svarerDuSant: boolean | null;
  harDuJobbet: boolean | null;
  aktivitetsInformasjon: AktivitetsInformasjon[];
  stemmerOpplysningene: boolean | null;
  harDuHattAvtalteAktiviteter: boolean | null;
  harDuHattFravær: boolean | null;
}

export interface AktivitetsInformasjon {
  dato: string;
  timer: number | null;
  fravær: string | null;
}

export interface Varsel {
  varselId: string;
  typeVarsel: string;
  typeVarselOm: string;
  saksnummer: Fagsaknummer;
  sendingstidspunkt: string;
  status: string;
  forPeriode: Periode;
  opprettet: string;
  sistEndret: string;
}
