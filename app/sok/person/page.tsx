import { Page, PageBlock } from '@navikt/ds-react/Page';
import { harLeseTilgang, hentRollerForBruker } from 'lib/azure/azureUserService';
import { PersonSøkeside } from 'components/drift/person/PersonSøkeside';
import { IngenTilgangAlert } from 'components/drift/IngenTilgangAlert';

const SakSøkPage = async () => {
  const roller = await hentRollerForBruker();

  return (
    <Page>
      <PageBlock width="md">
        {harLeseTilgang(roller) ? (
          <PersonSøkeside />
        ) : (
          <IngenTilgangAlert krevesLeseTilgang handling="hente saksinformasjon" />
        )}
      </PageBlock>
    </Page>
  );
};

export default SakSøkPage;
