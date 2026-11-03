type Sortering = { columnId: string; direction: 'asc' | 'desc' };
type Celleverdi = string | number | null | undefined;

export const dataGridCollator = new Intl.Collator('nb', { numeric: true, sensitivity: 'base' });

export function filtrerOgSorterRader<T>(
  rader: T[],
  søketekst: string,
  søkeverdier: (rad: T) => Celleverdi[],
  sortering: Sortering | undefined,
  sorteringsverdi: (rad: T, columnId: string) => Celleverdi
): T[] {
  const søkeord = søketekst.trim().toLocaleLowerCase('nb').split(/\s+/).filter(Boolean);
  const filtrerte = rader.filter((rad) => {
    const tekst = søkeverdier(rad).join(' ').toLocaleLowerCase('nb');
    return søkeord.every((ord) => tekst.includes(ord));
  });
  if (!sortering) return filtrerte;

  return filtrerte.sort((a, b) => {
    const verdiA = sorteringsverdi(a, sortering.columnId);
    const verdiB = sorteringsverdi(b, sortering.columnId);
    if (verdiA == null) return verdiB == null ? 0 : 1;
    if (verdiB == null) return -1;
    const sammenligning =
      typeof verdiA === 'number' && typeof verdiB === 'number'
        ? verdiA - verdiB
        : dataGridCollator.compare(String(verdiA), String(verdiB));
    return sortering.direction === 'asc' ? sammenligning : -sammenligning;
  });
}
