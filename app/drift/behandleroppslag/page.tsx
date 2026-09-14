import { Page, PageBlock } from '@navikt/ds-react/Page';
import { Behandleroppslag } from 'components/drift/behandleroppslag/Behandleroppslag';
import { harLeseTilgang, hentRollerForBruker } from 'lib/azure/azureUserService';
import { IngenTilgangAlert } from 'components/drift/IngenTilgangAlert';

const OppslagPage = async () => {
  const roller = await hentRollerForBruker();

  return (
    <Page>
      <PageBlock width="lg">
        {harLeseTilgang(roller) ? <Behandleroppslag /> : <IngenTilgangAlert krevesLeseTilgang handling="oppslag" />}
      </PageBlock>
    </Page>
  );
};

export default OppslagPage;
