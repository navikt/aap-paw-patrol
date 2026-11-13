import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { JournalposterForSak } from './JournalposterForSak';

vi.mock('lib/clientApi', () => ({ hentJournalposterForSak: vi.fn() }));

describe('JournalposterForSak', () => {
  it('viser lokal lastestatus uten å vente på journalposter eller skjule annet innhold', () => {
    const html = renderToStaticMarkup(
      <>
        <p>Alle behandlinger</p>
        <JournalposterForSak saksnummer="ABC123" />
        <p>Behandlingsdetaljer</p>
      </>
    );

    expect(html).toContain('Alle behandlinger');
    expect(html).toContain('Behandlingsdetaljer');
    expect(html).toContain('Journalposter tilknyttet sak');
    expect(html).toContain('role="status"');
    expect(html).toContain('Henter journalposter...');
    expect(html).not.toContain('Ingen journalposter knyttet til saken.');
  });
});
