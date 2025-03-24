import { format } from 'date-fns';
import { nb } from 'date-fns/locale';

export const DATO_FORMATER = {
  ddMMyyyy: 'dd.MM.yyyy',
  ddMMMyyyy: 'dd. MMM yyyy',
  ddMMyyyy_HHmm: 'dd.MM.yyyy HH:mm',
  ddMMyyyy_HHmmss: 'dd.MM.yyyy HH:mm:ss',
};

export function formaterDatoMedTidspunktSekunderForFrontend(dato: Date | string): string {
  return format(dato, DATO_FORMATER.ddMMyyyy_HHmmss, { locale: nb });
}