import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getBaseUrlAndScopeForApp } from 'lib/services/driftService';
import { fetchProxy } from 'lib/services/fetchProxy';
import { GET } from './route';
import type { components } from 'lib/types/generated/postmottak';

vi.mock('lib/services/driftService', () => ({ getBaseUrlAndScopeForApp: vi.fn() }));
vi.mock('lib/services/fetchProxy', () => ({ fetchProxy: vi.fn() }));
vi.mock('@navikt/aap-felles-utils', () => ({ logWarning: vi.fn() }));

describe('GET sak/journalposter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getBaseUrlAndScopeForApp).mockResolvedValue({
      baseUrl: 'http://postmottak',
      scope: 'postmottak-scope',
    });
  });

  const hent = (saksnummer = 'abc123') =>
    GET(new NextRequest('http://localhost/api/drift/sak/abc123/journalposter'), {
      params: Promise.resolve({ saksnummer }),
    });

  const journalposter: components['schemas']['no.nav.aap.postmottak.api.drift.SakJournalposterDto']['journalposter'] = [
    { journalpostId: 123, journalstatus: 'MOTTATT', kanal: 'NAV_NO', mottattDato: '2026-11-12', tema: 'AAP' },
    { journalpostId: 456, journalstatus: null, kanal: null, mottattDato: null, tema: null },
    { journalpostId: 789 },
  ];

  it.each([{ journalposter }, { journalposter: [] }])(
    'henter journalposter fra postmottak: $journalposter',
    async ({ journalposter }) => {
      vi.mocked(fetchProxy).mockResolvedValue({ journalposter });

      const response = await hent();

      expect(response.status).toBe(200);
      expect(await response.json()).toEqual({ journalposter });
      expect(getBaseUrlAndScopeForApp).toHaveBeenCalledWith('postmottak');
      expect(fetchProxy).toHaveBeenCalledWith(
        'http://postmottak/api/drift/sak/ABC123/journalposter',
        'postmottak-scope',
        'GET'
      );
    }
  );

  it('returnerer feil hvis postmottak feiler', async () => {
    vi.mocked(fetchProxy).mockRejectedValue(new Error('Postmottak utilgjengelig'));

    const response = await hent();

    expect(response.status).toBe(500);
    expect(await response.text()).toBe('Postmottak utilgjengelig');
  });

  it.each(['', '../annen-sak', 'sak?parameter=1'])('avviser ugyldig saksnummer: %s', async (saksnummer) => {
    const response = await hent(saksnummer);

    expect(response.status).toBe(400);
    expect(fetchProxy).not.toHaveBeenCalled();
  });
});
