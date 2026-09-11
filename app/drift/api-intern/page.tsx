import { harLeseTilgang, hentRollerForBruker } from '../../../lib/azure/azureUserService';
import { Page, PageBlock } from '@navikt/ds-react/Page';
import { ApiInternOppslag } from '../../../components/drift/apiinternoppslag/ApiInternOppslag';
import { IngenTilgangAlert } from 'components/drift/IngenTilgangAlert';

const ApiInternOppslagPage = async () => {
  const roller = await hentRollerForBruker();

  return (
    <Page>
      <PageBlock width="lg">
        {harLeseTilgang(roller) ? <ApiInternOppslag /> : <IngenTilgangAlert krevesLeseTilgang handling="oppslag" />}
      </PageBlock>
    </Page>
  );
};

export default ApiInternOppslagPage;
