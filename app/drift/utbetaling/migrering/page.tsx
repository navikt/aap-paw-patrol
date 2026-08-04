import { Alert } from '@navikt/ds-react';
import { Page, PageBlock } from '@navikt/ds-react/Page';
import { MigreringKontroll } from 'components/drift/utbetaling/MigreringKontroll';
import { MigreringStatus } from 'components/drift/utbetaling/MigreringStatus';
import { hentRollerForBruker, Roller } from 'lib/azure/azureUserService';

const MigreringPage = async () => {
  const roller = await hentRollerForBruker();
  const harTilgang = roller.includes(Roller.DRIFT);

  return (
    <Page>
      <PageBlock width="lg">
        {harTilgang ? (
          <>
            <MigreringStatus />
            <MigreringKontroll />
          </>
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

export default MigreringPage;
