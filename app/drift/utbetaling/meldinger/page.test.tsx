import { hentRollerForBruker, Roller } from 'lib/azure/azureUserService';
import { redirect } from 'next/navigation';
import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import UtbetalingsmeldingerPage from './page';

vi.mock('components/drift/utbetaling/Utbetalingsmeldinger', () => ({
  Utbetalingsmeldinger: () => <div data-testid="meldingssok" />,
}));
vi.mock('lib/azure/azureUserService', async (importOriginal) => ({
  ...(await importOriginal<typeof import('lib/azure/azureUserService')>()),
  hentRollerForBruker: vi.fn(),
}));

describe('UtbetalingsmeldingerPage', () => {
  beforeEach(() => vi.clearAllMocks());

  it('rendrer søket med DRIFT_LES', async () => {
    vi.mocked(hentRollerForBruker).mockResolvedValue([Roller.DRIFT_LES]);
    expect(renderToStaticMarkup(await UtbetalingsmeldingerPage())).toContain('data-testid="meldingssok"');
  });

  it('rendrer søket med DRIFT alene', async () => {
    vi.mocked(hentRollerForBruker).mockResolvedValue([Roller.DRIFT]);
    const markup = renderToStaticMarkup(await UtbetalingsmeldingerPage());
    expect(markup).toContain('data-testid="meldingssok"');
  });

  it('viser ikke rå valideringsfeil eller søk når roller ikke kan bekreftes', async () => {
    vi.mocked(hentRollerForBruker).mockRejectedValue(new Error('privat-feil'));
    const markup = renderToStaticMarkup(await UtbetalingsmeldingerPage());
    expect(markup).not.toContain('privat-feil');
    expect(markup).not.toContain('data-testid="meldingssok"');
  });

  it('bevarer redirect til innlogging', async () => {
    vi.mocked(hentRollerForBruker).mockImplementation(async () => redirect('/oauth2/login'));
    await expect(UtbetalingsmeldingerPage()).rejects.toMatchObject({
      digest: expect.stringContaining('NEXT_REDIRECT'),
    });
  });
});
