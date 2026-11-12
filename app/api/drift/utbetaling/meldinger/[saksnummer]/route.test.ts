import { isLocal, logWarning } from '@navikt/aap-felles-utils';
import { getToken } from '@navikt/oasis';
import { hentRollerForBruker, Roller } from 'lib/azure/azureUserService';
import { hentUtbetalingsmeldinger } from 'lib/services/driftService';
import { ProxyError } from 'lib/services/fetchProxy';
import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { GET } from './route';

vi.mock('server-only', () => ({}));
vi.mock('@navikt/aap-felles-utils', () => ({
  isLocal: vi.fn(() => false),
  isDev: () => false,
  logWarning: vi.fn(),
}));
vi.mock('@navikt/oasis', () => ({ getToken: vi.fn() }));
vi.mock('next/headers', () => ({ headers: async () => new Headers() }));
vi.mock('lib/services/driftService', () => ({ hentUtbetalingsmeldinger: vi.fn() }));
vi.mock('lib/azure/azureUserService', async (importOriginal) => ({
  ...(await importOriginal<typeof import('lib/azure/azureUserService')>()),
  hentRollerForBruker: vi.fn(),
}));

const request = new NextRequest('http://localhost/api/drift/utbetaling/meldinger/TEST123');
const hent = (saksnummer = 'TEST123') => GET(request, { params: Promise.resolve({ saksnummer }) });

describe('GET utbetalingsmeldinger', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(isLocal).mockReturnValue(false);
    vi.mocked(getToken).mockReturnValue('test-token');
    vi.mocked(hentRollerForBruker).mockResolvedValue([Roller.DRIFT_LES]);
    vi.mocked(hentUtbetalingsmeldinger).mockResolvedValue([]);
  });

  it('avviser manglende token før roller og tjenesten kalles', async () => {
    vi.mocked(getToken).mockReturnValue(null);
    const response = await hent();
    expect(response.status).toBe(401);
    expect(response.headers.get('Cache-Control')).toBe('no-store');
    expect(hentRollerForBruker).not.toHaveBeenCalled();
    expect(hentUtbetalingsmeldinger).not.toHaveBeenCalled();
  });

  it('returnerer sanitert 401 når tokenvalidering feiler', async () => {
    vi.mocked(hentRollerForBruker).mockRejectedValue(new Error('privat-tokenfeil'));
    const response = await hent();
    expect(response.status).toBe(401);
    expect(await response.text()).not.toContain('privat-tokenfeil');
    expect(logWarning).not.toHaveBeenCalled();
    expect(hentUtbetalingsmeldinger).not.toHaveBeenCalled();
  });

  it.each([{ roller: [] }, { roller: [Roller.LES] }])(
    'avviser roller uten DRIFT eller DRIFT_LES: $roller',
    async ({ roller }) => {
      vi.mocked(hentRollerForBruker).mockResolvedValue(roller);
      const response = await hent();
      expect(response.status).toBe(403);
      expect(hentUtbetalingsmeldinger).not.toHaveBeenCalled();
    }
  );

  it.each([{ roller: [Roller.DRIFT_LES] }, { roller: [Roller.DRIFT] }, { roller: [Roller.DRIFT, Roller.DRIFT_LES] }])(
    'gir tilgang med DRIFT eller DRIFT_LES: $roller',
    async ({ roller }) => {
      vi.mocked(hentRollerForBruker).mockResolvedValue(roller);
      const response = await hent(' test123 ');
      expect(response.status).toBe(200);
      expect(await response.json()).toEqual([]);
      expect(response.headers.get('Cache-Control')).toBe('no-store');
      expect(hentUtbetalingsmeldinger).toHaveBeenCalledWith('TEST123');
    }
  );

  it('bevarer meldingsinnhold, rekkefølge og statusrader med samme referanse', async () => {
    const rad = {
      referanse: '00000000-0000-4000-8000-000000000001',
      opprettet: '2026-01-02T03:04:05',
      status: 'IKKE_SENDT' as const,
      utbetalingsmeldingType: 'UTBETALING' as const,
      melding: '{ "stortTall": 9007199254740993 }',
    };
    const data = [rad, { ...rad, status: 'SENDT' as const, opprettet: '2026-01-02T03:05:06' }];
    vi.mocked(hentUtbetalingsmeldinger).mockResolvedValue(data);
    const response = await hent();
    expect(await response.json()).toEqual(data);
  });

  it.each(['', ' ', 'a/b', 'a\\b', '..', '..%2Fstatus', '%2e%2e', 'a?b', 'a#b', 'a\nb', 'a\0b'])(
    'avviser ugyldig saksnummer uten upstream-kall: %j',
    async (saksnummer) => {
      const response = await hent(saksnummer);
      expect(response.status).toBe(400);
      expect(hentUtbetalingsmeldinger).not.toHaveBeenCalled();
    }
  );

  it.each([
    [400, 400],
    [401, 401],
    [403, 403],
    [404, 404],
    [500, 502],
    [503, 502],
  ])('mapper upstream-status %i til %i uten detaljer', async (upstream, status) => {
    vi.mocked(hentUtbetalingsmeldinger).mockRejectedValue(new ProxyError(upstream));
    const response = await hent();
    expect(response.status).toBe(status);
    expect(response.headers.get('Content-Type')).toContain('application/problem+json');
    expect(response.headers.get('Cache-Control')).toBe('no-store');
    expect(await response.json()).toMatchObject({ status, type: 'about:blank' });
  });

  it('skjuler uventede feil fra respons og logger', async () => {
    vi.mocked(hentUtbetalingsmeldinger).mockRejectedValue(
      new Error('privat-feil', { cause: new Error('privat-årsak') })
    );
    const response = await hent();
    expect(response.status).toBe(500);
    expect(await response.text()).not.toContain('privat');
    expect(logWarning).toHaveBeenCalledWith('Henting av utbetalingsmeldinger feilet');
  });

  it('lar Next.js håndtere redirect i stedet for å returnere 500', async () => {
    vi.mocked(hentRollerForBruker).mockImplementation(async () => redirect('/oauth2/login'));
    await expect(hent()).rejects.toMatchObject({ digest: expect.stringContaining('NEXT_REDIRECT') });
    expect(logWarning).not.toHaveBeenCalled();
  });

  it('støtter eksisterende lokal rolleoverstyring uten token', async () => {
    vi.mocked(isLocal).mockReturnValue(true);
    vi.mocked(getToken).mockReturnValue(null);
    expect((await hent()).status).toBe(200);
  });
});
