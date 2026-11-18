import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { Vedtakslengde } from './Vedtakslengde';

vi.mock('lib/clientApi', () => ({ hentVedtakslengde: vi.fn(() => new Promise(() => {})) }));

describe('Vedtakslengde', () => {
  it('viser lokal lastestatus mens vedtakslengde hentes', () => {
    const html = renderToStaticMarkup(<Vedtakslengde behandlingsreferanse="ref-1" />);

    expect(html).toContain('role="status"');
    expect(html).toContain('Henter vedtakslengde for behandling');
  });
});
