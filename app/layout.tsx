import '@navikt/ds-css';
import 'styles/globals.css';

import { verifyUserLoggedIn } from '@navikt/aap-felles-utils';
import { InternalHeader, InternalHeaderTitle } from '@navikt/ds-react/InternalHeader';
import { Søkefelt } from 'components/drift/Søkefelt';
import { hentBrukerInformasjon, hentRollerForBruker, Roller } from 'lib/azure/azureUserService';
import { InnloggetBrukerDropdown } from 'components/drift/navbar/InnloggetBrukerDropdown';
import { Spacer, Theme } from '@navikt/ds-react';
import { cookies } from 'next/headers';
import { ThemeToggle } from 'components/drift/ThemeToggle';

export const metadata = {
  title: 'Paw Patrol',
  description: 'Drift-dashboard for status og kjøring av jobber i Kelvin-appene.',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  await verifyUserLoggedIn();

  const roller = await hentRollerForBruker();
  const brukerInformasjon = await hentBrukerInformasjon();

  const cookieStore = await cookies();
  const theme = (cookieStore.get('theme')?.value as 'light' | 'dark') || 'light';

  return (
    <html lang="nb">
      <link
        rel="icon"
        href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🐶</text></svg>"
      />
      <body>
        <Theme theme={theme}>
          <InternalHeader>
            <InternalHeaderTitle href="/">Paw Patrol 🐶</InternalHeaderTitle>

            <Spacer />

            {roller.includes(Roller.DRIFT) && <Søkefelt />}

            <ThemeToggle theme={theme} />

            <InnloggetBrukerDropdown brukerInformasjon={brukerInformasjon} roller={roller} />
          </InternalHeader>

          {children}
        </Theme>
      </body>
    </html>
  );
}
