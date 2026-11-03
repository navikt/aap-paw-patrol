export function hentFeilmelding(feil: unknown): string {
  if (typeof feil === 'string') return feil;
  if (feil instanceof Error) return feil.message;
  if (feil !== null && typeof feil === 'object' && 'message' in feil && typeof feil.message === 'string') {
    return feil.message;
  }
  return 'Ukjent feil';
}
