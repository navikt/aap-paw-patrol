import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fetchProxy } from 'lib/services/fetchProxy';
import type { UtbetalingsmeldingDto } from 'lib/types/utbetaling';
import { hentUtbetalingsmeldinger } from './driftService';

vi.mock('server-only', () => ({}));
vi.mock('lib/services/fetchProxy', () => ({ fetchProxy: vi.fn() }));

describe('hentUtbetalingsmeldinger', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv('UTBETAL_API_BASE_URL', 'http://utbetal');
    vi.stubEnv('UTBETAL_API_SCOPE', 'utbetal-scope');
  });

  afterEach(() => vi.unstubAllEnvs());

  it('kaller meldings-endpointet med kodet saksnummer og trygg feilkontekst', async () => {
    const meldinger: UtbetalingsmeldingDto[] = [];
    vi.mocked(fetchProxy).mockResolvedValue(meldinger);

    expect(await hentUtbetalingsmeldinger('TEST/123')).toBe(meldinger);
    expect(fetchProxy).toHaveBeenCalledWith(
      'http://utbetal/admin/utbetalingsmelding/TEST%2F123',
      'utbetal-scope',
      'GET',
      undefined,
      undefined,
      'hent-utbetalingsmeldinger'
    );
  });

  it('propagerer den sanitiserte proxyfeilen', async () => {
    vi.mocked(fetchProxy).mockRejectedValue(new Error('Kall til tjenesten feilet'));
    await expect(hentUtbetalingsmeldinger('TEST123')).rejects.toThrow('Kall til tjenesten feilet');
  });
});
