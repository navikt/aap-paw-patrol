import createFetchMock from 'vitest-fetch-mock';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { logWarning } from '@navikt/aap-felles-utils';
import { getToken, requestAzureOboToken, validateToken } from '@navikt/oasis';
import { fetchProxy, fetchWithRetry } from 'lib/services/fetchProxy';

vi.mock('server-only', () => ({}));
vi.mock('@navikt/aap-felles-utils', () => ({
  logWarning: vi.fn(),
  getAccessTokenOrRedirectToLogin: vi.fn(),
}));
vi.mock('@navikt/oasis', () => ({
  getToken: vi.fn(),
  requestAzureOboToken: vi.fn(),
  validateToken: vi.fn(),
}));
vi.mock('next/headers', () => ({ headers: async () => new Headers() }));

const fetchMocker = createFetchMock(vi);
fetchMocker.enableMocks();

describe('fetchWithRetry', () => {
  beforeEach(() => {
    fetchMocker.resetMocks();
  });

  describe('fetchProxy med trygg feilkontekst', () => {
    const marker = 'privat-markor';
    const url = `http://dummy.url/${marker}`;
    const hent = () => fetchProxy(url, 'test-scope', 'GET', undefined, undefined, 'hent-utbetalingsmeldinger');

    beforeEach(() => {
      vi.clearAllMocks();
      fetchMocker.resetMocks();
      vi.stubEnv('NEXT_PUBLIC_ENVIRONMENT', 'test');
      vi.mocked(getToken).mockReturnValue('test-token');
      vi.mocked(validateToken).mockResolvedValue({ ok: true, payload: {} });
      vi.mocked(requestAzureOboToken).mockResolvedValue({ ok: true, token: 'obo-test-token' });
    });

    afterEach(() => vi.unstubAllEnvs());

    it('returnerer JSON uten endringer og uten feil-logging', async () => {
      const data = [{ melding: '{ "stortTall": 9007199254740993 }' }];
      fetchMocker.once(JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } });
      expect(await hent()).toEqual(data);
      expect(logWarning).not.toHaveBeenCalled();
    });

    it.each([400, 401, 403, 404, 500, 503])('bevarer HTTP %i uten å lekke URL eller upstream-body', async (status) => {
      fetchMocker.mockResponse(JSON.stringify({ message: marker }), { status });
      const error = await hent().catch((error: unknown) => error);
      expect(error).toMatchObject({ name: 'ProxyError', status, message: 'Kall til tjenesten feilet' });
      expect(error).not.toHaveProperty('cause');
      expect(JSON.stringify(vi.mocked(logWarning).mock.calls)).not.toContain(marker);
      expect(fetchMocker.mock.calls).toHaveLength(status === 503 ? 3 : 1);
    });

    it.each(['nettverk', 'json', 'validering', 'obo'])('saniterer feil fra %s', async (steg) => {
      if (steg === 'nettverk') fetchMocker.mockReject(new Error(marker));
      if (steg === 'json') fetchMocker.once(marker, { headers: { 'Content-Type': 'application/json' } });
      if (steg === 'validering') vi.mocked(validateToken).mockRejectedValue(new Error(marker));
      if (steg === 'obo') vi.mocked(requestAzureOboToken).mockRejectedValue(new Error(marker));
      const error = await hent().catch((error: unknown) => error);
      expect(error).toMatchObject({ status: 502, message: 'Kall til tjenesten feilet' });
      expect(error).not.toHaveProperty('cause');
      expect(logWarning).toHaveBeenCalledExactlyOnceWith('hent-utbetalingsmeldinger feilet (HTTP 502)');
    });

    it('avviser manglende token uten redirect eller OBO-kall', async () => {
      vi.mocked(getToken).mockReturnValue(null);
      await expect(hent()).rejects.toMatchObject({ status: 401 });
      expect(requestAzureOboToken).not.toHaveBeenCalled();
      expect(fetchMocker).not.toHaveBeenCalled();
    });

    it('saniterer også direkte retry-kall og tomt retry-budsjett', async () => {
      fetchMocker.mockReject(new Error(marker));
      for (const retries of [0, 3]) {
        const error = await fetchWithRetry(url, 'GET', 'test-token', retries, undefined, undefined, 'trygg').catch(
          (error: unknown) => error
        );
        expect(error).toMatchObject({ status: 502, message: 'Kall til tjenesten feilet' });
        expect(error).not.toHaveProperty('cause');
      }
      expect(logWarning).not.toHaveBeenCalled();
    });
  });
  it('skal returnere respons ved 200 status kode', async () => {
    const dummyResponse = { meldingFraBackend: 'hei' };
    fetchMocker.once(JSON.stringify(dummyResponse), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
    const response = await fetchWithRetry('http://localhost:8080', 'GET', 'dummytoken', 3);
    expect(response).toEqual(dummyResponse);
  });
  it('skal returnere text respons ved 200 status kode og text content type', async () => {
    const dummyResponse = 'Denne meldingen er en tekst';
    fetchMocker.once(dummyResponse, { status: 200, headers: { 'Content-Type': 'text/text' } });
    const response = await fetchWithRetry('http://dummy.url', 'GET', 'dummytoken', 3);
    expect(response).toEqual(dummyResponse);
  });
  it('skal returnere undefined ved 204 status kode', async () => {
    fetchMocker.once(undefined, { status: 204 });
    const response = await fetchWithRetry('http://dummy.url', 'GET', 'dummytoken', 3);
    expect(response).toBe(undefined);
  });
  it('skal kaste error ved 404 status kode', async () => {
    const nonExistingUrl = 'http://dummy.url';
    fetchMocker.once('', { status: 404 });
    await expect(fetchWithRetry(nonExistingUrl, 'GET', 'dummytoken', 3)).rejects.toThrowError(
      `Ikke funnet: ${nonExistingUrl}`
    );
  });
  it('skal kaste error ved 500 status kode', async () => {
    const errorUrl = 'http://dummy.url';
    fetchMocker.once(JSON.stringify({ message: 'error' }), { status: 500 });
    await expect(fetchWithRetry(errorUrl, 'GET', 'dummytoken', 3)).rejects.toThrowError(
      `Unable to fetch http://dummy.url: error`
    );
  });
});
