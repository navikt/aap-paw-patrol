import { Page, PageBlock } from '@navikt/ds-react/Page';
import { Behandleroppslag } from 'components/drift/behandleroppslag/Behandleroppslag';
import { hentRollerForBruker, Roller } from 'lib/azure/azureUserService';
import { Alert } from '@navikt/ds-react';

const OppslagPage = async () => {
  const roller = await hentRollerForBruker();

  return (
    <Page>
      <PageBlock width="lg">
        {roller.includes(Roller.DRIFT) ? (
          <Behandleroppslag />
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

export default OppslagPage;
