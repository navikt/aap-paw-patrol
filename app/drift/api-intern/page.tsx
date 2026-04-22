import { hentRollerForBruker, Roller } from '../../../lib/azure/azureUserService';
import { Page, PageBlock } from '@navikt/ds-react/Page';
import { Alert } from '@navikt/ds-react';
import { ApiInternOppslag } from '../../../components/drift/apiinternoppslag/ApiInternOppslag';

const ApiInternOppslagPage = async () => {
  const roller = await hentRollerForBruker();

  return (
    <Page>
      <PageBlock width="lg">
        {roller.includes(Roller.DRIFT) ? (
          <ApiInternOppslag />
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

export default ApiInternOppslagPage;
