export type KravType = 'RELEVANT_KRAV' | 'TILLEGGSOPPLYSNING' | 'TRUKKET_SØKNAD' | 'MIGRERT_KRAV' | 'KLAGE';

export interface KravDto {
  referanse: string;
  type: KravType;
  journalpostId?: string | null;
  opprettet: string;
  vurdertAv: string;
  søknadsdato?: string | null;
  søknadsdatoÅrsak?: string | null;
  muligRettFra?: string | null;
  overstyrMuligRettFra?: string | null;
  overstyrMuligRettFraÅrsak?: string | null;
  erNy: boolean;
}

export interface StønadsperiodeDto {
  kravReferanse: string;
  vurdertAv: string;
  opprettet: string;
  erNy: boolean;
  startdato: string;
  harHattOrdinærSiste52Uker: boolean;
  harGjenværendeKvote: boolean;
  type: string;
}

export interface KravOgStønadsperiodeDto {
  krav: KravDto[];
  stønadsperioder: StønadsperiodeDto[];
}
