import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { harLeseTilgang, hentRollerForBruker, Roller } from 'lib/azure/azureUserService';
import { hentOppgaverIkkeEndret } from 'lib/services/oppgaveService';
import { filtrerOgSorterOppgaver } from 'components/drift/oppgave/OppgaverIkkeEndretDataGrid';
import OppgaverIkkeEndretPage from './page';

vi.mock('lib/azure/azureUserService', () => ({
  hentRollerForBruker: vi.fn(),
  harLeseTilgang: vi.fn(),
  Roller: { DRIFT_LES: 'Drift leserolle' },
}));
vi.mock('lib/services/oppgaveService', () => ({ hentOppgaverIkkeEndret: vi.fn() }));

const oppgaver = [
  {
    oppgaveId: 10,
    behandlingRef: '11111111-1111-4111-8111-111111111111',
    saksnummer: 'ABC1234',
    avklaringsbehovKode: '5003',
    enhetForKø: '0301',
    opprettetTidspunkt: '2025-02-01T10:00:00',
    endretTidspunkt: '2025-03-01T10:00:00',
  },
  {
    oppgaveId: 2,
    behandlingRef: '22222222-2222-4222-8222-222222222222',
    saksnummer: null,
    avklaringsbehovKode: '1337',
    enhetForKø: '0101',
    opprettetTidspunkt: '2025-01-01T10:00:00',
    endretTidspunkt: null,
  },
];
const ids = (rader: { oppgaveId: number }[]) => rader.map((rad) => rad.oppgaveId);

describe('OppgaverIkkeEndretPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(hentRollerForBruker).mockResolvedValue([Roller.DRIFT_LES]);
    vi.mocked(harLeseTilgang).mockReturnValue(true);
    vi.mocked(hentOppgaverIkkeEndret).mockResolvedValue(oppgaver);
  });

  it('viser oppgaver med sortering, filtre og lenker til sak og behandling', async () => {
    const html = renderToStaticMarkup(await OppgaverIkkeEndretPage());
    expect(html).toContain('aksel-data-grid');
    expect(html).toContain('Viser 2 av 2 oppgaver');
    expect(html).toContain('Søk i oppgaver');
    expect(html).toContain('Alle enheter');
    expect(html).toContain('href="/drift/sak/ABC1234"');
    expect(html).toContain(`href="/drift/sak/ABC1234?behandlingref=${oppgaver[0].behandlingRef}"`);
    expect(html).toContain('§ 11-5 Nedsatt arbeidsevne');
    expect(html).toContain('Kategoriser dokument');
    expect(html).toContain('01.02.2025 10:00:00');
    expect(html).toContain('01.03.2025 10:00:00');
    expect(html).toContain('Ikke endret');
    expect(html).not.toContain('type="radio"');
    expect(html).not.toContain('type="checkbox"');
    expect(html.indexOf(oppgaver[1].behandlingRef)).toBeLessThan(html.indexOf(oppgaver[0].behandlingRef));
  });

  it('henter ikke oppgaver uten lesetilgang', async () => {
    vi.mocked(harLeseTilgang).mockReturnValue(false);
    const html = renderToStaticMarkup(await OppgaverIkkeEndretPage());
    expect(html).toContain('Du har ikke tilgang til denne siden.');
    expect(hentOppgaverIkkeEndret).not.toHaveBeenCalled();
  });
});

describe('filtrerOgSorterOppgaver', () => {
  it.each([
    ['ABC1234', [10]],
    ['11111111', [10]],
    ['5003', [10]],
    ['nedsatt arbeidsevne', [10]],
    ['KATEGORISER dokument', [2]],
    ['0101', [2]],
    ['Ikke endret', [2]],
    ['01.03.2025', [10]],
    ['2025-02-01', [10]],
    ['ingen treff', []],
  ])('søker på %s', (søk, forventet) => {
    expect(ids(filtrerOgSorterOppgaver(oppgaver, søk, ''))).toEqual(forventet);
  });

  it('kombinerer enhet og fritekst', () => {
    expect(ids(filtrerOgSorterOppgaver(oppgaver, 'dokument', '0101'))).toEqual([2]);
    expect(filtrerOgSorterOppgaver(oppgaver, 'dokument', '0301')).toEqual([]);
  });

  it.each([
    ['oppgaveId', 'asc', [2, 10]],
    ['oppgaveId', 'desc', [10, 2]],
    ['saksnummer', 'asc', [10, 2]],
    ['saksnummer', 'desc', [10, 2]],
    ['behandlingRef', 'asc', [10, 2]],
    ['behandlingRef', 'desc', [2, 10]],
    ['avklaringsbehovKode', 'asc', [10, 2]],
    ['avklaringsbehovKode', 'desc', [2, 10]],
    ['enhetForKø', 'asc', [2, 10]],
    ['enhetForKø', 'desc', [10, 2]],
    ['opprettetTidspunkt', 'asc', [2, 10]],
    ['opprettetTidspunkt', 'desc', [10, 2]],
    ['endretTidspunkt', 'asc', [10, 2]],
    ['endretTidspunkt', 'desc', [10, 2]],
  ] as const)('sorterer %s %s', (columnId, direction, forventet) => {
    expect(ids(filtrerOgSorterOppgaver(oppgaver, '', '', { columnId, direction }))).toEqual(forventet);
  });

  it('endrer ikke kildedata og bevarer usortert rekkefølge', () => {
    const original = structuredClone(oppgaver);
    filtrerOgSorterOppgaver(oppgaver, '', '', { columnId: 'oppgaveId', direction: 'asc' });
    expect(oppgaver).toEqual(original);
    expect(ids(filtrerOgSorterOppgaver(oppgaver, '', ''))).toEqual([10, 2]);
  });
});
