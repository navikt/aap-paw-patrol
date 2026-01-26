import { Page, PageBlock } from '@navikt/ds-react/Page';
import { BehandlingOversikt } from 'components/drift/sakogbehandling/BehandlingOversikt';
import { hentRollerForBruker, Roller } from 'lib/azure/azureUserService';
import { Alert } from '@navikt/ds-react';

const BehandlingPage = async () => {
  const roller = await hentRollerForBruker();

  return (
    <Page>
      <PageBlock width="2xl">
        {roller.includes(Roller.DRIFT) ? (
          <BehandlingOversikt />
        ) : (
          <Alert variant="warning">
            Du har ikke tilgang til denne siden. AD-rollen <strong>0000-GA-AAP_DRIFT</strong> er påkrevd for å gjøre
            hente behandling.
          </Alert>
        )}
      </PageBlock>
    </Page>
  );
};

export default BehandlingPage;
