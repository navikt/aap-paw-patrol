import { Page, PageBlock } from '@navikt/ds-react/Page';
import { hentRollerForBruker, Roller } from 'lib/azure/azureUserService';
import { Alert, HGrid } from '@navikt/ds-react';
import { SakSøkeside } from 'components/drift/sakogbehandling/SakSøkeside';
import { JournalpostSøkeside } from 'components/drift/postmottak/JournalpostSøkeside';

const SakPage = async () => {
  const roller = await hentRollerForBruker();

  return (
    <Page>
      <PageBlock width="2xl">
        {roller.includes(Roller.DRIFT) ? (
          <HGrid columns="1fr 1fr" gap="space-32">
            <SakSøkeside />
            <JournalpostSøkeside />
          </HGrid>
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
