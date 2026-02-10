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
