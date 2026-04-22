export interface JournalpostInfoDTO {
  innkommendeStatus: string | null;
  brevkode: string | null;
  tema: string;
  fordelingsresultat: Fordelingsresultat | null;
  journalstatus: string;
  mottattDato: string;
  kanal: Kanal;
  saksnummer: string;
  behandlinger: PostmottakBehandling[];
}

export interface Fordelingsresultat {
  regelMap: Record<string, boolean>;
  forJournalpost: number;
  systemNavn: string;
}

export interface PostmottakBehandling {
  referanse: string;
  type: string;
  status: string;
  aktivtSteg: string;
  opprettet: string;
  avklaringsbehov: PostmottakAvklaringsbehov[];
}

export interface PostmottakAvklaringsbehov {
  definisjon: PostmottakDefinisjon;
  status: string;
  tidsstempel: string;
  endretAv: string;
  årsakTilSettPåVent: string | null;
}

export interface PostmottakDefinisjon {
  kode: string;
  type: string;
  løsesISteg: string;
  kreverToTrinn: boolean;
  løsesAv: string[];
}

export type Kanal =
  | 'ALTINN'
  | 'EESSI'
  | 'EIA'
  | 'EKST_OPPS'
  | 'LOKAL_UTSKRIFT'
  | 'NAV_NO'
  | 'SENTRAL_UTSKRIFT'
  | 'SDP'
  | 'SKAN_NETS'
  | 'SKAN_PEN'
  | 'SKAN_IM'
  | 'TRYGDERETTEN'
  | 'HELSENETTET'
  | 'INGEN_DISTRIBUSJON'
  | 'NAV_NO_UINNLOGGET'
  | 'INNSENDT_NAV_ANSATT'
  | 'NAV_NO_CHAT'
  | 'DPVT'
  | 'E_POST'
  | 'ALTINN_INNBOKS'
  | 'UKJENT';

interface KanalDetaljer {
  beskrivelse: string;
  erDigital: boolean;
}

export const kanalInfo: Record<Kanal, KanalDetaljer> = {
  ALTINN: { beskrivelse: 'Sendt inn via et Altinn-skjema', erDigital: true },
  EESSI: { beskrivelse: 'Mottatt eller distribuert via EU-applikasjoner for informasjonsutveksling', erDigital: true },
  EIA: { beskrivelse: 'Arkivert av applikasjonen EIA', erDigital: false },
  EKST_OPPS: { beskrivelse: 'Hentet fra en ekstern kilde (f.eks. UDI)', erDigital: false },
  LOKAL_UTSKRIFT: { beskrivelse: 'Skrevet ut lokalt, kan være sendt i posten på papir', erDigital: false },
  NAV_NO: { beskrivelse: 'Sendt inn eller distribuert digitalt via nav.no', erDigital: true },
  SENTRAL_UTSKRIFT: { beskrivelse: 'Overført til sentral distribusjon og sendt i posten', erDigital: false },
  SDP: { beskrivelse: 'Sendt via digital post til innbyggere', erDigital: false },
  SKAN_NETS: { beskrivelse: 'Sendt inn på papir og skannet hos NETS', erDigital: false },
  SKAN_PEN: {
    beskrivelse: 'Sendt inn på papir og skannet på NAVs skanningsenter for pensjon og bidrag',
    erDigital: false,
  },
  SKAN_IM: { beskrivelse: 'Sendt inn på papir og skannet hos Iron Mountain', erDigital: false },
  TRYGDERETTEN: { beskrivelse: 'Distribuert via eFormidling til Trygderetten', erDigital: false },
  HELSENETTET: { beskrivelse: 'Mottatt eller distribuert via Norsk Helsenett', erDigital: false },
  INGEN_DISTRIBUSJON: { beskrivelse: 'Skal ikke distribueres ut av NAV', erDigital: false },
  NAV_NO_UINNLOGGET: { beskrivelse: 'Sendt inn digitalt via nav.no uten digital autentisering', erDigital: false },
  INNSENDT_NAV_ANSATT: { beskrivelse: 'Fylt ut og sendt inn sammen med en NAV-ansatt', erDigital: false },
  NAV_NO_CHAT: { beskrivelse: 'Komplett chatdialog mellom bruker og veileder i NAV', erDigital: true },
  DPVT: { beskrivelse: 'Sendt til virksomhet som taushetsbelagt post via Altinn', erDigital: false },
  E_POST: { beskrivelse: 'Mottatt på e-post', erDigital: false },
  ALTINN_INNBOKS: { beskrivelse: 'Mottatt i en av NAVs meldingsbokser i Altinn', erDigital: false },
  UKJENT: { beskrivelse: 'Ingen kjent kanal', erDigital: false },
};
