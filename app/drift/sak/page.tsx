import { Page, PageBlock } from '@navikt/ds-react/Page';
import { hentRollerForBruker, Roller } from 'lib/azure/azureUserService';
import { Alert } from '@navikt/ds-react';
import { SakOversikt } from 'components/drift/sakogbehandling/SakOversikt';

const SakPage = async () => {
  const roller = await hentRollerForBruker();

  return (
    <Page>
      <PageBlock width="2xl">
        {roller.includes(Roller.DRIFT) ? (
          <SakOversikt />
        ) : (
          <Alert variant="warning">
            Du har ikke tilgang til denne siden. AD-rollen <strong>0000-GA-AAP_DRIFT</strong> er påkrevd for å gjøre
            hente saksinformasjon.
          </Alert>
        )}
      </PageBlock>
    </Page>
  );
};

export default SakPage;
