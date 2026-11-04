import { describe, expect, it } from 'vitest';
import type { components } from 'lib/types/generated/postmottak';
import { filtrerOgSorterResultater } from './JoarkAvstemmingDataGrid';

const resultater: components['schemas']['no.nav.aap.postmottak.api.drift.JournalpostAvstemmingsresultatDto'][] = [
  { journalpostId: 10, utfall: 'UAVSTEMT_KELVIN', kanal: 'NAV_NO', datoOpprettet: '2026-11-02' },
  { journalpostId: 2, utfall: 'ALLEREDE_HAR_OPPGAVE', kanal: 'ALTINN', datoOpprettet: '2025-12-31' },
  { journalpostId: 100, utfall: 'IKKE_NOK_INFORMASJON', kanal: null, datoOpprettet: null },
  { journalpostId: 20, utfall: 'GOSYS_OPPGAVE_OPPRETTET', kanal: 'NAV_NO', datoOpprettet: '2026-01-01' },
];

const ids = (rader: { journalpostId: number }[]) => rader.map((rad) => rad.journalpostId);

describe('filtrerOgSorterResultater', () => {
  it.each([
    ['  UAVSTEMT kelvin  ', [10]],
    ['Har allerede oppgave', [2]],
    ['GOSYS_OPPGAVE_OPPRETTET', [20]],
    ['nav_no', [10, 20]],
    ['100', [100]],
    ['02.11.2026', [10]],
    ['2025-12-31', [2]],
    ['ikke_nok_informasjon', [100]],
    ['ingen treff', []],
  ])('filtrerer på %s', (søketekst, forventet) => {
    expect(ids(filtrerOgSorterResultater(resultater, søketekst, ''))).toEqual(forventet);
  });

  it('kombinerer søk og utfallsfilter', () => {
    expect(ids(filtrerOgSorterResultater(resultater, 'NAV_NO', 'GOSYS_OPPGAVE_OPPRETTET'))).toEqual([20]);
    expect(filtrerOgSorterResultater(resultater, 'ALTINN', 'GOSYS_OPPGAVE_OPPRETTET')).toEqual([]);
  });

  it.each([
    ['journalpostId', 'asc', [2, 10, 20, 100]],
    ['journalpostId', 'desc', [100, 20, 10, 2]],
    ['utfall', 'asc', [20, 2, 100, 10]],
    ['utfall', 'desc', [10, 100, 2, 20]],
    ['kanal', 'asc', [2, 10, 20, 100]],
    ['kanal', 'desc', [10, 20, 2, 100]],
    ['datoOpprettet', 'asc', [2, 20, 10, 100]],
    ['datoOpprettet', 'desc', [10, 20, 2, 100]],
  ] as const)('sorterer %s %s med manglende verdier sist', (columnId, direction, forventet) => {
    expect(ids(filtrerOgSorterResultater(resultater, '', '', { columnId, direction }))).toEqual(forventet);
  });

  it('sorterer filtrerte resultater', () => {
    expect(
      ids(
        filtrerOgSorterResultater(resultater, 'NAV_NO', '', {
          columnId: 'journalpostId',
          direction: 'desc',
        })
      )
    ).toEqual([20, 10]);
  });

  it('beholder opprinnelig rekkefølge uten sortering og endrer ikke kildedata', () => {
    const opprinnelig = structuredClone(resultater);
    filtrerOgSorterResultater(resultater, '', '', { columnId: 'journalpostId', direction: 'asc' });
    expect(resultater).toEqual(opprinnelig);
    expect(ids(filtrerOgSorterResultater(resultater, '', ''))).toEqual([10, 2, 100, 20]);
  });
});
