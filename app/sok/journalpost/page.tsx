import { Page, PageBlock } from '@navikt/ds-react/Page';
import { harLeseTilgang, hentRollerForBruker } from 'lib/azure/azureUserService';
import { JournalpostSøkeside } from 'components/drift/postmottak/JournalpostSøkeside';
import { IngenTilgangAlert } from 'components/drift/IngenTilgangAlert';

const SakSøkPage = async () => {
  const roller = await hentRollerForBruker();

  return (
    <Page>
      <PageBlock width="2xl">
        {harLeseTilgang(roller) ? (
          <JournalpostSøkeside />
        ) : (
          <IngenTilgangAlert krevesLeseTilgang handling="hente saksinformasjon" />
        )}
      </PageBlock>
    </Page>
  );
};

export default SakSøkPage;
