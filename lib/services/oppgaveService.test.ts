import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fetchProxy } from './fetchProxy';
import { getBaseUrlAndScopeForApp } from './driftService';
import { hentOppgaverIkkeEndret } from './oppgaveService';

vi.mock('./fetchProxy', () => ({ fetchProxy: vi.fn() }));
vi.mock('./driftService', () => ({ getBaseUrlAndScopeForApp: vi.fn() }));

describe('hentOppgaverIkkeEndret', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getBaseUrlAndScopeForApp).mockResolvedValue({
      baseUrl: 'http://oppgave',
      scope: 'oppgave-scope',
    });
  });

  it('henter listen fra drift-endepunktet med oppgavescope', async () => {
    vi.mocked(fetchProxy).mockResolvedValue([]);
    expect(await hentOppgaverIkkeEndret()).toEqual([]);
    expect(getBaseUrlAndScopeForApp).toHaveBeenCalledWith('oppgave');
    expect(fetchProxy).toHaveBeenCalledWith('http://oppgave/api/drift/oppgaver-ikke-endret', 'oppgave-scope', 'GET');
  });

  it('propagerer hentefeil', async () => {
    vi.mocked(fetchProxy).mockRejectedValue(new Error('Hentefeil'));
    await expect(hentOppgaverIkkeEndret()).rejects.toThrow('Hentefeil');
  });
});
