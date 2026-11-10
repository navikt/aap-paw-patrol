import { describe, expect, it } from 'vitest';
import { byggUtbetalingStatusRader } from './UtbetalingStatus';

describe('byggUtbetalingStatusRader', () => {
  it('viser alle kjente statuser i fast rekkefølge og fyller ut manglende statuser med null', () => {
    const rader = byggUtbetalingStatusRader({ SENDT: 12, OK: 3 });

    expect(rader).toEqual([
      { kode: 'IKKE_SENDT', navn: 'Ikke sendt', antall: 0 },
      { kode: 'SENDT', navn: 'Sendt', antall: 12 },
      { kode: 'MOTTATT', navn: 'Mottatt', antall: 0 },
      { kode: 'HOS_OPPDRAG', navn: 'Hos Oppdrag', antall: 0 },
      { kode: 'OK', navn: 'Mottatt og godkjent', antall: 3 },
      { kode: 'FEILET', navn: 'Feilet', antall: 0 },
    ]);
  });

  it('gir nullrader for alle kjente statuser når statuskartet er tomt', () => {
    expect(byggUtbetalingStatusRader({})).toEqual([
      { kode: 'IKKE_SENDT', navn: 'Ikke sendt', antall: 0 },
      { kode: 'SENDT', navn: 'Sendt', antall: 0 },
      { kode: 'MOTTATT', navn: 'Mottatt', antall: 0 },
      { kode: 'HOS_OPPDRAG', navn: 'Hos Oppdrag', antall: 0 },
      { kode: 'OK', navn: 'Mottatt og godkjent', antall: 0 },
      { kode: 'FEILET', navn: 'Feilet', antall: 0 },
    ]);
  });

  it('bevarer mottatte antall, også en eksplisitt nullverdi', () => {
    const rader = byggUtbetalingStatusRader({
      IKKE_SENDT: 0,
      SENDT: 1,
      MOTTATT: 25,
      HOS_OPPDRAG: 300,
      OK: 4000,
      FEILET: 5,
    });

    expect(rader.map(({ navn, antall }) => [navn, antall])).toEqual([
      ['Ikke sendt', 0],
      ['Sendt', 1],
      ['Mottatt', 25],
      ['Hos Oppdrag', 300],
      ['Mottatt og godkjent', 4000],
      ['Feilet', 5],
    ]);
  });

  it('legger ukjente statuser etter de kjente og sorterer dem etter kode', () => {
    const rader = byggUtbetalingStatusRader({ ZZZ: 9, SENDT: 2, AA_STATUS: 4, IKKE_SENDT: 1 });

    expect(rader.slice(0, 6).map(({ kode }) => kode)).toEqual([
      'IKKE_SENDT',
      'SENDT',
      'MOTTATT',
      'HOS_OPPDRAG',
      'OK',
      'FEILET',
    ]);
    expect(rader.slice(6)).toEqual([
      { kode: 'AA_STATUS', navn: 'AA_STATUS', antall: 4 },
      { kode: 'ZZZ', navn: 'ZZZ', antall: 9 },
    ]);
  });
});
