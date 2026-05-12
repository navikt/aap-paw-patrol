import { Periode } from 'lib/types/felles';

export interface DriftRettighetstypeDTO {
  sisteDagMedRett?: string | null;
  rettighetsperioder: RettighetstypePeriodeDto[];
  stansOpphør: StansOpphørDto[];
}

export interface RettighetstypePeriodeDto {
  periode: Periode;
  rettighetstypeUnderveis?: string | null;
  rettighetstypeGrunnlag?: string | null;
}

export interface StansOpphørDto {
  fom: string;
  stansOpphør: string;
  årsaker: string[];
}
