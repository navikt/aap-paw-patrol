import { format } from 'date-fns';
import { nb } from 'date-fns/locale';
import type { Periode } from 'lib/types/felles';

export const DATO_FORMATER = {
  ddMMyyyy: 'dd.MM.yyyy',
  ddMMMyyyy: 'dd. MMM yyyy',
  ddMMyyyy_HHmm: 'dd.MM.yyyy HH:mm',
  ddMMyyyy_HHmmss: 'dd.MM.yyyy HH:mm:ss',
};

export function formaterDatoMedTidspunktSekunderForFrontend(dato: Date | string): string {
  return format(dato, DATO_FORMATER.ddMMyyyy_HHmmss, { locale: nb });
}

export function formaterDatoForFrontend(dato: Date | string): string {
  return format(dato, DATO_FORMATER.ddMMyyyy, { locale: nb });
}

export function perioderErLike(p1: Periode, p2: Periode): boolean {
  return p1.fom === p2.fom && p1.tom === p2.tom;
}

export function formaterPeriode(periode: Periode): string {
  if (periode.fom && !periode.tom) {
    return `${formaterDatoForFrontend(periode.fom)} - `;
  } else if (periode.fom && periode.tom) {
    return `${formaterDatoForFrontend(periode.fom)} - ${formaterDatoForFrontend(periode.tom)}`;
  } else {
    return '';
  }
}
