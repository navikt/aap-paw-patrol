import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { hentJournalposterForPerson } from 'lib/services/driftService';
import { POST } from './route';

vi.mock('lib/services/driftService', () => ({ hentJournalposterForPerson: vi.fn() }));
vi.mock('@navikt/aap-felles-utils', () => ({ logWarning: vi.fn() }));

describe('POST person/journalposter', () => {
  beforeEach(() => vi.clearAllMocks());

  function request() {
    return new NextRequest('http://localhost/api/drift/person/journalposter', {
      method: 'POST',
      body: JSON.stringify({ ident: '12345678901' }),
      headers: { 'Content-Type': 'application/json' },
    });
  }

  it('bevarer vellykket JSON-respons', async () => {
    vi.mocked(hentJournalposterForPerson).mockResolvedValue({ journalposter: [] });
    const response = await POST(request());
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ journalposter: [] });
    expect(hentJournalposterForPerson).toHaveBeenCalledWith('12345678901');
  });

  it.each([
    [new Error('Backendfeil'), 'Backendfeil'],
    [{ message: 'Objektfeil' }, 'Objektfeil'],
    [null, 'Ukjent feil'],
  ])('returnerer HTTP 500 ved feil %o', async (feil, forventet) => {
    vi.mocked(hentJournalposterForPerson).mockRejectedValue(feil);
    const response = await POST(request());
    expect(response.status).toBe(500);
    expect(await response.text()).toBe(forventet);
  });
});
