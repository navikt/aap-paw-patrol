import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { harLeseTilgang, hentRollerForBruker, Roller } from 'lib/azure/azureUserService';
import { hentJoarkAvstemming } from 'lib/services/driftService';
import JoarkAvstemmingPage from './page';

vi.mock('lib/azure/azureUserService', () => ({
  hentRollerForBruker: vi.fn(),
  harLeseTilgang: vi.fn(),
  Roller: { DRIFT_LES: 'Drift leserolle' },
}));
vi.mock('lib/services/driftService', () => ({
  hentJoarkAvstemming: vi.fn(),
}));

describe('JoarkAvstemmingPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(hentRollerForBruker).mockResolvedValue([Roller.DRIFT_LES]);
    vi.mocked(harLeseTilgang).mockReturnValue(true);
  });

  it('viser rapporten med journalpostlenker og nullable felter', async () => {
    vi.mocked(hentJoarkAvstemming).mockResolvedValue({
      startetTidspunkt: '2026-11-02T10:00:00Z',
      fullfortTidspunkt: '2026-11-02T10:01:00Z',
      resultater: [
        { journalpostId: 123, utfall: 'FUNNET', kanal: 'NAV_NO', datoOpprettet: '2026-11-01' },
        { journalpostId: 456, utfall: 'MANGLER', kanal: null, datoOpprettet: null },
      ],
    });

    const html = renderToStaticMarkup(await JoarkAvstemmingPage());

    expect(html).toContain('Antall journalposter: 2');
    expect(html).toContain('aksel-data-grid');
    expect(html).toContain('aria-label="Journalposter i Joark-avstemmingsrapporten"');
    expect(html).not.toContain('type="radio"');
    expect(html).not.toContain('type="checkbox"');
    expect(html).toContain('Søk i journalposter');
    expect(html).toContain('Alle utfall');
    expect(html).toContain('Viser 2 av 2 journalposter');
    expect(html).toContain('href="/drift/postmottak/123"');
    expect(html).toContain('href="/drift/postmottak/456"');
    expect(html).toContain('FUNNET');
    expect(html).toContain('MANGLER');
    expect(html).toContain('NAV_NO');
    expect(html).toContain('01.11.2026');
    expect(html).not.toContain('Ikke startet');
    expect(html).not.toContain('Ikke fullført');
  });

  it('viser at ingen rapport er tilgjengelig', async () => {
    vi.mocked(hentJoarkAvstemming).mockResolvedValue({
      startetTidspunkt: null,
      fullfortTidspunkt: null,
      resultater: [],
    });

    const html = renderToStaticMarkup(await JoarkAvstemmingPage());

    expect(html).toContain('Ingen avstemmingsrapport tilgjengelig ennå.');
    expect(html).toContain('Ikke startet');
    expect(html).toContain('Ikke fullført');
    expect(html).not.toContain('<table');
  });

  it.each([
    ['UAVSTEMT_UKJENT', 'Uavstemt – ukjent'],
    ['UAVSTEMT_KELVIN', 'Uavstemt – Kelvin'],
    ['GOSYS_OPPGAVE_OPPRETTET', 'Gosys-oppgave opprettet'],
    ['FORDELINGSOPPGAVE_OPPRETTET', 'Fordelingsoppgave opprettet'],
    ['ALLEREDE_HAR_OPPGAVE', 'Har allerede oppgave'],
    ['IKKE_NOK_INFORMASJON', 'Ikke nok informasjon'],
    ['NYTT_UTFALL', 'NYTT_UTFALL'],
  ])('viser %s som %s', async (utfall, tekst) => {
    vi.mocked(hentJoarkAvstemming).mockResolvedValue({
      resultater: [{ journalpostId: 123, utfall, kanal: 'NAV_NO' }],
    });

    const html = renderToStaticMarkup(await JoarkAvstemmingPage());

    expect(html).toContain(tekst);
    expect(html).toContain('NAV_NO');
    expect(html).toContain(`<option value="${utfall}">${tekst}</option>`);
  });

  it('viser en tom rapport uten å si at rapporten mangler', async () => {
    vi.mocked(hentJoarkAvstemming).mockResolvedValue({
      startetTidspunkt: '2026-11-02T10:00:00Z',
      fullfortTidspunkt: '2026-11-02T10:01:00Z',
      resultater: [],
    });

    const html = renderToStaticMarkup(await JoarkAvstemmingPage());

    expect(html).toContain('Ingen journalposter i avstemmingsrapporten.');
  });

  it('henter ikke rapporten uten lesetilgang', async () => {
    vi.mocked(harLeseTilgang).mockReturnValue(false);

    const html = renderToStaticMarkup(await JoarkAvstemmingPage());

    expect(html).toContain('Du har ikke tilgang til denne siden.');
    expect(hentJoarkAvstemming).not.toHaveBeenCalled();
  });

  it('lar hentefeil gå til sidens error boundary', async () => {
    vi.mocked(hentJoarkAvstemming).mockRejectedValue(new Error('Postmottak utilgjengelig'));

    await expect(JoarkAvstemmingPage()).rejects.toThrow('Postmottak utilgjengelig');
  });
});
