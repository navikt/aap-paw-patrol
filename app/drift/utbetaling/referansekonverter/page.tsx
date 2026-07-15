import { Alert } from '@navikt/ds-react';
import { Page, PageBlock } from '@navikt/ds-react/Page';
import { ReferanseKonverter } from 'components/drift/utbetaling/ReferanseKonverter';
import { hentRollerForBruker, Roller } from 'lib/azure/azureUserService';

const ReferanseKonverterPage = async () => {
  const roller = await hentRollerForBruker();
  const harTilgang = roller.includes(Roller.DRIFT);

  return (
    <Page>
      <PageBlock width="lg">
        {harTilgang ? (
          <ReferanseKonverter />
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

export default ReferanseKonverterPage;
