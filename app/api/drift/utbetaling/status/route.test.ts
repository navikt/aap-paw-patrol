import { beforeEach, describe, expect, it, vi } from 'vitest';
import { hentUtbetalingStatusAntall } from 'lib/services/driftService';
import { GET } from './route';

vi.mock('lib/services/driftService', () => ({ hentUtbetalingStatusAntall: vi.fn() }));
vi.mock('@navikt/aap-felles-utils', () => ({ logWarning: vi.fn() }));

describe('GET utbetaling/status', () => {
  beforeEach(() => vi.clearAllMocks());

  it('bevarer vellykket JSON-respons', async () => {
    const data = { antallPerStatus: { IKKE_SENDT: 3, UKJENT_STATUS: 1 } };
    vi.mocked(hentUtbetalingStatusAntall).mockResolvedValue(data);

    const response = await GET();

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual(data);
    expect(hentUtbetalingStatusAntall).toHaveBeenCalledOnce();
  });

  it('returnerer feilrespons når proxyen avviser tilgang', async () => {
    vi.mocked(hentUtbetalingStatusAntall).mockRejectedValue(new Error('Ingen tilgang'));

    const response = await GET();

    expect(response.status).toBe(500);
    expect(await response.text()).toBe('Ingen tilgang');
  });
});
