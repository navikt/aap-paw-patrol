import '@navikt/ds-css';
import 'styles/globals.css';

import { verifyUserLoggedIn } from '@navikt/aap-felles-utils';
import { InternalHeader, InternalHeaderTitle } from '@navikt/ds-react/InternalHeader';
import { SakSøkefelt } from 'components/drift/sakogbehandling/SakSøkefelt';
import { hentBrukerInformasjon, hentRollerForBruker, Roller } from 'lib/azure/azureUserService';
import { InnloggetBrukerDropdown } from 'components/drift/navbar/InnloggetBrukerDropdown';
import { Spacer } from '@navikt/ds-react';

export const metadata = {
  title: 'Paw Patrol',
  description: 'Drift-dashboard for status og kjøring av jobber i Kelvin-appene.',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  await verifyUserLoggedIn();

  const roller = await hentRollerForBruker();
  const brukerInformasjon = await hentBrukerInformasjon();

  return (
    <html lang="nb">
      <link
        rel="icon"
        href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🐶</text></svg>"
      />
      <body>
        <InternalHeader>
          <InternalHeaderTitle href="/">Paw Patrol 🐶</InternalHeaderTitle>

          {roller.includes(Roller.DRIFT) && <SakSøkefelt />}

          <Spacer />

          <InnloggetBrukerDropdown brukerInformasjon={brukerInformasjon} roller={roller} />
        </InternalHeader>

        {children}
      </body>
    </html>
  );
}
