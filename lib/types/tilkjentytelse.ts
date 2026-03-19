import { Periode } from 'lib/types/felles';

export interface TilkjentYtelseDto {
  perioder: TilkjentYtelsePeriode[];
}

export interface TilkjentYtelsePeriode {
  meldeperiode: Periode;
  levertMeldekortDato: string | null;
  sisteLeverteMeldekort: MeldekortDto | null;
  meldekortStatus: MeldekortStatus | null;
  vurdertePerioder: VurdertPeriode[];
}

export interface MeldekortDto {
  timerArbeidPerPeriode: ArbeidIPeriodeDto;
  mottattTidspunkt: string;
}

export interface ArbeidIPeriodeDto {
  timerArbeid: number;
}

export enum MeldekortStatus {
  IKKE_LEVERT = 'IKKE_LEVERT',
  LEVERT_ETTER_FRIST = 'LEVERT_ETTER_FRIST',
  OVERFØRT_TIL_ØKONOMI = 'OVERFØRT_TIL_ØKONOMI',
}

interface VurdertPeriode {
  periode: Periode;
  felter: Felter;
}

interface Felter {
  dagsats: number;
  barneTilleggsats: number;
  barnetillegg: number;
  barnepensjonDagsats: number;
  arbeidGradering: number | null;
  samordningGradering: number | null;
  institusjonGradering: number | null;
  arbeidsgiverGradering: number | null;
  totalReduksjon: number | null;
  effektivDagsats: number;
}
