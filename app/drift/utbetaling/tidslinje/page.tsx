import { Alert } from '@navikt/ds-react';
import { Page, PageBlock } from '@navikt/ds-react/Page';
import { Utbetalingstidslinje } from 'components/drift/utbetaling/Utbetalingstidslinje';
import { hentRollerForBruker, Roller } from 'lib/azure/azureUserService';

const UtbetalingstidslinjeePage = async () => {
  const roller = await hentRollerForBruker();
  const harTilgang = roller.includes(Roller.DRIFT);

  return (
    <Page>
      <PageBlock width="lg">
        {harTilgang ? (
          <Utbetalingstidslinje />
        ) : (
          <Alert variant="warning">
            Du har ikke tilgang til denne siden. AD-rollen <strong>0000-GA-AAP_DRIFT</strong> er påkrevd for å gjøre
            oppslag.
          </Alert>
        )}
      </PageBlock>
    </Page>
  );
};

export default UtbetalingstidslinjeePage;
