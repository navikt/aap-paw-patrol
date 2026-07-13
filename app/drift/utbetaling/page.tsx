import { Alert } from '@navikt/ds-react';
import { Page, PageBlock } from '@navikt/ds-react/Page';
import { UtbetalingFeilstatus } from 'components/drift/utbetaling/UtbetalingFeilstatus';
import { hentRollerForBruker, Roller } from 'lib/azure/azureUserService';

const UtbetalingPage = async () => {
  const roller = await hentRollerForBruker();
  const harTilgang = vurderTilgangTilUtbetaling(roller);

  return (
    <Page>
      <PageBlock width="lg">
        {harTilgang ? (
          <UtbetalingFeilstatus />
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

const vurderTilgangTilUtbetaling = (roller: Roller[]) => {
  return roller.includes(Roller.DRIFT);
};

export default UtbetalingPage;
