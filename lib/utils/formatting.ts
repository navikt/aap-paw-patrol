export const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase().replace(/_/g, ' ');

export function formaterBehandlingType(type: string) {
  switch (type) {
    case 'ae0028':
      return 'Revurdering';
    case 'ae0034':
      return 'Førstegangsbehandling';
    case 'ae0203':
      return 'Tilbakekreving';
    case 'ae0058':
      return 'Klage';
    default:
      return type;
  }
}

export function formaterTilNok(sum?: number | null): string {
  if (sum === null || sum === undefined) {
    return '';
  }
  return `${sum.toLocaleString(`nb-NO`, { style: 'currency', currency: 'NOK', trailingZeroDisplay: 'stripIfInteger' })}`;
}

export function formaterTilProsent(sum?: number | null): string {
  if (sum === null || sum === undefined) {
    return '';
  }
  return `${sum} %`;
}
