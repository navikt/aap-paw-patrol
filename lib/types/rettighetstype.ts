import { Periode } from 'lib/types/felles';

export interface DriftRettighetstypeDTO {
  sisteDagMedRett?: string | null;
  rettighetsperioder: RettighetstypePeriodeDto[];
}

export interface RettighetstypePeriodeDto {
  periode: Periode;
  rettighetstypeUnderveis?: string | null;
  rettighetstypeGrunnlag?: string | null;
}
