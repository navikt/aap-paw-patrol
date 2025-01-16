import '@navikt/ds-css';
import '@navikt/aap-felles-css';
import 'styles/globals.css';

import { hentBrukerInformasjon, verifyUserLoggedIn } from '@navikt/aap-felles-utils';
import { KelvinAppHeader } from '@navikt/aap-felles-react/cjs/KelvinAppHeader/KelvinAppHeader';

export const metadata = {
  title: 'Kelvin - Paw Patrol',
  description: 'Drift dashboard for status og kjøring av jobber i Kelvin appene',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  await verifyUserLoggedIn();
  const brukerInformasjon = await hentBrukerInformasjon();

  return (
    <html lang="nb">
      <link
        rel="icon"
        href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🐶</text></svg>"
      />
      <body>
        <KelvinAppHeader brukerInformasjon={brukerInformasjon} />
        {children}
      </body>
    </html>
  );
}
