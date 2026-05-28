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
  fravær: Fravær | null;
}

export type Fravær =
  | 'SYKDOM_ELLER_SKADE'
  | 'OMSORG_FØRSTE_SKOLEDAG_TILVENNING_ELLER_ANNEN_OPPFØLGING_BARN'
  | 'OMSORG_PLEIE_I_HJEMMET_AV_NÆR_PÅRØRENDE'
  | 'OMSORG_DØDSFALL_I_FAMILIE_ELLER_VENNEKRETS'
  | 'OMSORG_ANNEN_STERK_GRUNN'
  | 'ANNEN';

export interface Varsel {
  varselId: VarselId;
  typeVarsel: TypeVarsel;
  typeVarselOm: TypeVarselOm;
  saksnummer: Fagsaknummer;
  sendingstidspunkt: string;
  status: VarselStatus;
  forPeriode: Periode;
  opprettet: string;
  sistEndret: string;
}

export interface VarselId {
  id: string;
}

export type TypeVarsel = 'BESKJED' | 'OPPGAVE';

export type TypeVarselOm = 'VALGFRITT_OPPLYSNINGSBEHOV' | 'OPPLYSNINGSBEHOV' | 'MELDEPLIKTPERIODE';

export type VarselStatus = 'PLANLAGT' | 'SENDT' | 'INAKTIVERT';
