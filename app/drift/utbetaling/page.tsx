import { Page, PageBlock } from '@navikt/ds-react/Page';
import { UtbetalingFeilstatus } from 'components/drift/utbetaling/UtbetalingFeilstatus';
import { harLeseTilgang, hentRollerForBruker } from 'lib/azure/azureUserService';
import { IngenTilgangAlert } from 'components/drift/IngenTilgangAlert';

const UtbetalingPage = async () => {
  const roller = await hentRollerForBruker();
  const harTilgang = harLeseTilgang(roller);

  return (
    <Page>
      <PageBlock width="lg">
        {harTilgang ? <UtbetalingFeilstatus /> : <IngenTilgangAlert krevesLeseTilgang handling="oppslag" />}
      </PageBlock>
    </Page>
  );
};

export default UtbetalingPage;
